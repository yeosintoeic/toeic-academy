import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

const MAX_DAILY = 3;

function oneDayAgo() {
  return new Date(Date.now() - 24 * 60 * 60 * 1000);
}

// GET: 현재 사용자의 저장 문제 목록 + 오늘 저장 횟수
export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "로그인 필요" }, { status: 401 });

  const [saved, todayCount] = await Promise.all([
    prisma.savedQuestion.findMany({
      where: { userId: session.id },
      orderBy: { savedAt: "desc" },
    }),
    prisma.savedQuestion.count({
      where: { userId: session.id, savedAt: { gte: oneDayAgo() } },
    }),
  ]);

  return Response.json({ saved, todayCount, maxDaily: MAX_DAILY });
}

// POST: 문제 저장 (하루 3회 제한)
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "로그인 필요" }, { status: 401 });

  const { questionId, questionText, sessionId } = await req.json();
  if (!questionId) return Response.json({ error: "questionId 필요" }, { status: 400 });

  // 오늘 이미 저장한 횟수 확인 (기존에 이 문제가 이미 저장된 경우는 제외)
  const existing = await prisma.savedQuestion.findUnique({
    where: { userId_questionId: { userId: session.id, questionId } },
  });

  if (!existing) {
    // 새 저장: 오늘 횟수 체크
    const todayCount = await prisma.savedQuestion.count({
      where: { userId: session.id, savedAt: { gte: oneDayAgo() } },
    });
    if (todayCount >= MAX_DAILY) {
      return Response.json(
        { error: "하루 저장 횟수(3회)를 초과했습니다. 24시간 후 다시 시도하세요." },
        { status: 429 }
      );
    }
  }

  const saved = await prisma.savedQuestion.upsert({
    where: { userId_questionId: { userId: session.id, questionId } },
    create: { userId: session.id, questionId, questionText: questionText ?? "", sessionId: sessionId ?? null },
    update: { questionText: questionText ?? "", sessionId: sessionId ?? null, savedAt: new Date() },
  });

  const todayCount = await prisma.savedQuestion.count({
    where: { userId: session.id, savedAt: { gte: oneDayAgo() } },
  });

  return Response.json({ saved, todayCount });
}

// DELETE: 문제 저장 취소 (기록은 DB에 남음 — 관리자에서 확인 가능)
export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "로그인 필요" }, { status: 401 });

  const { questionId } = await req.json();
  if (!questionId) return Response.json({ error: "questionId 필요" }, { status: 400 });

  await prisma.savedQuestion.deleteMany({
    where: { userId: session.id, questionId },
  });
  return Response.json({ ok: true });
}

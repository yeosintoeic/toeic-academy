import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

const MAX_DAILY = 3;

function oneDayAgo() {
  return new Date(Date.now() - 24 * 60 * 60 * 1000);
}

function oneWeekAgo() {
  return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
}

// GET: 현재 사용자의 저장 문제 목록 + 오늘 저장 횟수
export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "로그인 필요" }, { status: 401 });

  // 1주일 지난 저장 문제 자동 삭제
  await prisma.savedQuestion.deleteMany({
    where: { userId: session.id, savedAt: { lt: oneWeekAgo() } },
  });

  const [saved, todayCount] = await Promise.all([
    prisma.savedQuestion.findMany({
      where: { userId: session.id, isActive: true },
      orderBy: { savedAt: "desc" },
    }),
    prisma.savedQuestion.count({
      where: { userId: session.id, isActive: true, savedAt: { gte: oneDayAgo() } },
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

  // 기존 레코드 확인 (isActive 여부 포함)
  const existing = await prisma.savedQuestion.findUnique({
    where: { userId_questionId: { userId: session.id, questionId } },
  });

  // 처음 저장하는 경우(또는 소프트 삭제 후 재저장): 오늘 횟수 체크
  if (!existing || !existing.isActive) {
    const todayCount = await prisma.savedQuestion.count({
      where: { userId: session.id, isActive: true, savedAt: { gte: oneDayAgo() } },
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
    create: { userId: session.id, questionId, questionText: questionText ?? "", sessionId: sessionId ?? null, isActive: true },
    update: { questionText: questionText ?? "", sessionId: sessionId ?? null, savedAt: new Date(), isActive: true },
  });

  const todayCount = await prisma.savedQuestion.count({
    where: { userId: session.id, isActive: true, savedAt: { gte: oneDayAgo() } },
  });

  return Response.json({ saved, todayCount });
}

// DELETE: 저장 취소 — 소프트 삭제 (isActive: false). 관리자 기록은 DB에 영구 보존
export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "로그인 필요" }, { status: 401 });

  const { questionId } = await req.json();
  if (!questionId) return Response.json({ error: "questionId 필요" }, { status: 400 });

  await prisma.savedQuestion.updateMany({
    where: { userId: session.id, questionId },
    data: { isActive: false },
  });
  return Response.json({ ok: true });
}

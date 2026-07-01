import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: 현재 사용자의 저장 문제 목록
export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "로그인 필요" }, { status: 401 });

  const saved = await prisma.savedQuestion.findMany({
    where: { userId: session.id },
    orderBy: { savedAt: "desc" },
  });
  return Response.json({ saved });
}

// POST: 문제 저장
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "로그인 필요" }, { status: 401 });

  const { questionId, questionText, sessionId } = await req.json();
  if (!questionId) return Response.json({ error: "questionId 필요" }, { status: 400 });

  const saved = await prisma.savedQuestion.upsert({
    where: { userId_questionId: { userId: session.id, questionId } },
    create: { userId: session.id, questionId, questionText: questionText ?? "", sessionId: sessionId ?? null },
    update: { questionText: questionText ?? "", sessionId: sessionId ?? null, savedAt: new Date() },
  });
  return Response.json({ saved });
}

// DELETE: 문제 저장 취소
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

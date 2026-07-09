import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return Response.json({ error: "로그인 필요" }, { status: 401 });

  const { sessionId, answers, overtimeSeconds } = await req.json();
  // answers: { questionId: string; selected: string }[]

  const testSession = await prisma.testSession.findUnique({
    where: { id: sessionId },
    include: { answers: { select: { questionId: true } } },
  });
  if (!testSession || testSession.userId !== session.id) {
    return Response.json({ error: "세션 오류" }, { status: 403 });
  }
  // 이미 제출된 세션 재제출 방지
  if (testSession.completedAt) {
    return Response.json({ error: "이미 제출된 세션입니다." }, { status: 409 });
  }

  const questionIds = answers.map((a: { questionId: string }) => a.questionId);
  // 제출 수가 세션 문항 수를 초과하면 거부
  if (questionIds.length > testSession.totalQuestions + 5) {
    return Response.json({ error: "잘못된 제출입니다." }, { status: 400 });
  }
  const questions = await prisma.question.findMany({
    where: { id: { in: questionIds } },
  });

  const qMap = new Map(questions.map((q) => [q.id, q]));

  let part5Score = 0, part6Score = 0, part7Score = 0;
  const answerRecords = answers.map((a: { questionId: string; selected: string }) => {
    const q = qMap.get(a.questionId);
    const isCorrect = q?.answer === a.selected;
    if (isCorrect) {
      if (q?.part === 5) part5Score++;
      else if (q?.part === 6) part6Score++;
      else if (q?.part === 7) part7Score++;
    }
    return { sessionId, questionId: a.questionId, selected: a.selected, isCorrect: !!isCorrect };
  });

  await prisma.testAnswer.createMany({ data: answerRecords });

  const totalScore = part5Score + part6Score + part7Score;
  const safeOvertimeSeconds = Number.isFinite(overtimeSeconds) && overtimeSeconds > 0 ? Math.floor(overtimeSeconds) : 0;
  await prisma.testSession.update({
    where: { id: sessionId },
    data: { completedAt: new Date(), part5Score, part6Score, part7Score, totalScore, overtimeSeconds: safeOvertimeSeconds },
  });

  return Response.json({ part5Score, part6Score, part7Score, totalScore, total: questions.length, sessionId });
}

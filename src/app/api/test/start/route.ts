import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

type Mode = "full" | "part5" | "part6" | "part7";

type GroupWithQuestions = Awaited<ReturnType<typeof prisma.questionGroup.findMany<{
  include: { questions: { orderBy: { id: "asc" } } }
}>>>[number];

type QWithGroup = GroupWithQuestions["questions"][number] & {
  group?: Omit<GroupWithQuestions, "questions"> | null;
};

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "로그인 필요" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { plan: true, planExpiresAt: true, role: true },
  });
  const isAdmin = user?.role === "ADMIN";
  const testPlans = ["TEST", "FULL", "TEST_VOCAB", "ALL"];
  const expired = !user?.planExpiresAt || user.planExpiresAt < new Date();
  if (!user || (!isAdmin && (!testPlans.includes(user.plan) || expired))) {
    return Response.json({ error: "모의고사 이용 권한이 없거나 기간이 만료되었습니다." }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const mode: Mode = ["full", "part5", "part6", "part7"].includes(body.mode) ? body.mode : "full";

  const questions: QWithGroup[] = [];

  // ── Part 5: ai_ 접두어 문제만 고정 순서로 선택 (항상 동일한 30문제)
  if (mode === "full" || mode === "part5") {
    const all5 = await prisma.question.findMany({
      where: { part: 5, id: { startsWith: "ai_p5" } },
      orderBy: { id: "asc" },
    });
    questions.push(...all5.map(q => ({ ...q, group: null })));
  }

  // ── Part 6: ai_ 접두어 그룹만 고정 순서로 선택 (항상 동일한 16문제)
  if (mode === "full" || mode === "part6") {
    const p6Groups = await prisma.questionGroup.findMany({
      where: { part: 6, id: { startsWith: "ai_g6" } },
      include: { questions: { orderBy: { id: "asc" } } },
      orderBy: { id: "asc" },
    });
    for (const { questions: qs, ...meta } of p6Groups) {
      for (const q of qs) questions.push({ ...q, group: meta });
    }
  }

  // ── Part 7: ai_ 접두어 그룹만 고정 순서로 선택 (항상 동일한 54문제)
  if (mode === "full" || mode === "part7") {
    const p7Groups = await prisma.questionGroup.findMany({
      where: { part: 7, id: { startsWith: "ai_g7" } },
      include: { questions: { orderBy: { id: "asc" } } },
      orderBy: { id: "asc" },
    });
    for (const { questions: qs, ...meta } of p7Groups) {
      for (const q of qs) questions.push({ ...q, group: meta });
    }
  }

  if (questions.length === 0) {
    return Response.json({ error: "문제가 없습니다. 관리자에게 문의하세요." }, { status: 404 });
  }

  const testSession = await prisma.testSession.create({
    data: {
      userId: session.id,
      mode,
      totalQuestions: questions.length,
    },
  });

  // 정답·해설 필드를 클라이언트에 노출하지 않음
  const safeQuestions = questions.map(({ answer: _a, explanation: _e, ...rest }) => rest);
  return Response.json({ sessionId: testSession.id, questions: safeQuestions, mode });
}

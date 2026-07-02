import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generatePart5, generatePart6, generatePart7 } from "@/lib/ai-generate";

export const maxDuration = 120;

type Mode = "full" | "part5" | "part6" | "part7";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

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

  let p5Ids: string[] = [];
  let p6Ids: string[] = [];
  let p7Ids: string[] = [];
  let aiUsed = false;

  // AI 생성 시도, 실패 시 DB 풀로 폴백
  try {
    const tasks: Promise<void>[] = [];
    if (mode === "full" || mode === "part5") {
      tasks.push(generatePart5().then(ids => { p5Ids = ids; }));
    }
    if (mode === "full" || mode === "part6") {
      tasks.push(generatePart6().then(ids => { p6Ids = ids; }));
    }
    if (mode === "full" || mode === "part7") {
      tasks.push(generatePart7().then(ids => { p7Ids = ids; }));
    }
    await Promise.all(tasks);
    aiUsed = true;
  } catch (err) {
    console.error("AI generation failed, falling back to DB pool:", err);
  }

  // DB 풀 폴백
  if (!aiUsed) {
    if ((mode === "full" || mode === "part5") && p5Ids.length === 0) {
      const all5 = await prisma.question.findMany({ where: { part: 5 } });
      p5Ids = shuffle(all5).slice(0, 30).map(q => q.id);
    }
    if ((mode === "full" || mode === "part6") && p6Ids.length === 0) {
      const allG6 = await prisma.questionGroup.findMany({
        where: { part: 6 },
        include: { questions: { orderBy: { id: "asc" } } },
      });
      const sel = shuffle(allG6).slice(0, 4);
      for (const g of sel) p6Ids.push(...g.questions.map(q => q.id));
    }
    if ((mode === "full" || mode === "part7") && p7Ids.length === 0) {
      const allG7 = await prisma.questionGroup.findMany({
        where: { part: 7 },
        include: { questions: { orderBy: { id: "asc" } } },
      });
      // passageType 별로 분류: double(8문)×3 + triple(9문)×2 + quad(12문)×1 = 54문
      const doubles = shuffle(allG7.filter(g => g.passageType === "double"));
      const triples = shuffle(allG7.filter(g => g.passageType === "triple"));
      const quads   = shuffle(allG7.filter(g => g.passageType === "quad"));

      const sel = [
        ...doubles.slice(0, 3),
        ...triples.slice(0, 2),
        ...quads.slice(0, 1),
      ];

      // 특정 타입이 부족하면 남은 타입으로 보완
      if (sel.length < 6) {
        const used = new Set(sel.map(g => g.id));
        const remaining = shuffle(allG7.filter(g => !used.has(g.id)));
        for (const g of remaining) {
          if (sel.length >= 6) break;
          sel.push(g);
        }
      }

      for (const g of sel) p7Ids.push(...g.questions.map(q => q.id));
    }
  }

  const allIds = [...p5Ids, ...p6Ids, ...p7Ids];

  if (allIds.length === 0) {
    return Response.json({ error: "문제가 없습니다. 관리자에게 문의하세요." }, { status: 404 });
  }

  // 생성된 문제 조회 (그룹 정보 포함)
  const questions = await prisma.question.findMany({
    where: { id: { in: allIds } },
    include: {
      group: { select: { passageText: true, passageType: true } }
    },
  });

  // Part 순서대로 정렬 후 그룹 내 순서 유지
  const sorted = [...questions].sort((a, b) => {
    if (a.part !== b.part) return a.part - b.part;
    if (a.groupId && b.groupId && a.groupId !== b.groupId) return a.groupId.localeCompare(b.groupId);
    return a.id.localeCompare(b.id);
  });

  const testSession = await prisma.testSession.create({
    data: { userId: session.id, mode, totalQuestions: sorted.length },
  });

  const safeQuestions = sorted.map(({ answer: _a, explanation: _e, ...rest }) => rest);
  return Response.json({ sessionId: testSession.id, questions: safeQuestions, mode });
}

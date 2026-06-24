import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

type Mode = "full" | "part5" | "part6" | "part7";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type GroupWithQuestions = Awaited<ReturnType<typeof prisma.questionGroup.findMany<{
  include: { questions: true }
}>>>[number];

type QWithGroup = GroupWithQuestions["questions"][number] & {
  group?: Omit<GroupWithQuestions, "questions"> | null;
};

/**
 * Part 7 그룹에서 정확히 target개 문제를 선택
 * - 3중 지문(triple passage) 그룹을 항상 최우선 포함
 * - 나머지는 초과하지 않는 그룹을 우선 추가하고, 미달 시 최소 초과 그룹으로 보완
 */
function selectPart7(groups: GroupWithQuestions[], target: number): QWithGroup[] {
  const tripleGroups = shuffle(groups.filter(g => g.passageType === "triple passage"));
  const otherGroups = shuffle(groups.filter(g => g.passageType !== "triple passage"));

  const selected: QWithGroup[] = [];
  const usedGroupIds = new Set<string>();

  // 1. 3중 지문 먼저 전부 포함
  for (const { questions, ...meta } of tripleGroups) {
    for (const q of questions) selected.push({ ...q, group: meta });
    usedGroupIds.add(meta.id);
  }

  // 2. 초과하지 않는 그룹만 추가
  for (const { questions, ...meta } of otherGroups) {
    if (selected.length >= target) break;
    if (selected.length + questions.length <= target) {
      for (const q of questions) selected.push({ ...q, group: meta });
      usedGroupIds.add(meta.id);
    }
  }

  // 3. 미달 시 딱 맞는 그룹 우선, 없으면 최소 초과 그룹으로 보완
  if (selected.length < target) {
    const need = target - selected.length;
    const unused = otherGroups.filter(g => !usedGroupIds.has(g.id));
    const exact = unused.find(g => g.questions.length === need);
    const fallback = [...unused].sort((a, b) => a.questions.length - b.questions.length);
    const toAdd = exact ?? fallback[0];
    if (toAdd) {
      const { questions, ...meta } = toAdd;
      for (const q of questions) selected.push({ ...q, group: meta });
    }
  }

  return selected;
}

/**
 * Part 6: 그룹 단위로 target개에 도달할 때까지 무작위 선택
 */
function selectPart6(groups: GroupWithQuestions[], target: number): QWithGroup[] {
  const shuffled = shuffle(groups);
  const selected: QWithGroup[] = [];
  for (const { questions, ...meta } of shuffled) {
    if (selected.length >= target) break;
    for (const q of questions) selected.push({ ...q, group: meta });
  }
  return selected;
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

  const questions: QWithGroup[] = [];

  // ── Part 5: 풀에서 30문제 무작위 선택 ─────────────────────────
  if (mode === "full" || mode === "part5") {
    const all5 = await prisma.question.findMany({ where: { part: 5 } });
    const selected5 = shuffle(all5).slice(0, Math.min(30, all5.length));
    questions.push(...selected5.map(q => ({ ...q, group: null })));
  }

  // ── Part 6: 그룹 단위로 16문제 (4그룹) 선택 ──────────────────
  if (mode === "full" || mode === "part6") {
    const p6Groups = await prisma.questionGroup.findMany({
      where: { part: 6 },
      include: { questions: true },
    });
    const target6 = mode === "full" ? 16 : 9999;
    questions.push(...selectPart6(p6Groups, target6));
  }

  // ── Part 7: 3중 지문 필수 포함 + 총 54문제 ────────────────────
  if (mode === "full" || mode === "part7") {
    const p7Groups = await prisma.questionGroup.findMany({
      where: { part: 7 },
      include: { questions: true },
    });
    const target7 = mode === "full" ? 54 : 9999;
    questions.push(...selectPart7(p7Groups, target7));
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

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

const PART5_PER_SET = 30;
const PART6_PER_SET = 16; // 4문제 × 4지문
const PART7_PER_SET = 54; // 실전 모의고사와 동일 구성 목표 문제 수

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 그룹들(문제 수가 제각각인 지문) 중 문제 수 합이 정확히 target이 되는 조합을 무작위 탐색으로 찾는다.
function pickGroupsForTarget<T extends { size: number }>(
  groups: T[],
  target: number,
  maxAttempts = 1000
): T[] | null {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const shuffled = shuffle(groups);
    const picked: T[] = [];
    let sum = 0;
    for (const g of shuffled) {
      if (sum + g.size <= target) {
        picked.push(g);
        sum += g.size;
        if (sum === target) return picked;
      }
    }
  }
  return null;
}

// GET: 숙제 세트 현황 조회 (파트별 문제 수)
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return Response.json({ error: "권한 없음" }, { status: 403 });
  }

  const [s1p5, s1p6, s1p7, s2p5, s2p6, s2p7] = await Promise.all([
    prisma.question.count({ where: { homeworkSet: 1, part: 5 } }),
    prisma.question.count({ where: { homeworkSet: 1, part: 6 } }),
    prisma.question.count({ where: { homeworkSet: 1, part: 7 } }),
    prisma.question.count({ where: { homeworkSet: 2, part: 5 } }),
    prisma.question.count({ where: { homeworkSet: 2, part: 6 } }),
    prisma.question.count({ where: { homeworkSet: 2, part: 7 } }),
  ]);

  return Response.json({
    set1: { part5: s1p5, part6: s1p6, part7: s1p7, total: s1p5 + s1p6 + s1p7 },
    set2: { part5: s2p5, part6: s2p6, part7: s2p7, total: s2p5 + s2p6 + s2p7 },
  });
}

// POST: 숙제 세트 재구성 — DB에 저장된 문제 풀에서 Part5 30 + Part6 16 + Part7 54 = 100문제씩
// 두 세트(homeworkSet 1, 2)로 재배정한다. AI 생성(gen_) 문제는 제외하고 기존 저장 문제만 사용.
export async function POST() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return Response.json({ error: "권한 없음" }, { status: 403 });
  }

  // 기존 숙제 할당 전체 초기화 (파트 무관)
  await prisma.question.updateMany({
    where: { homeworkSet: { not: null } },
    data: { homeworkSet: null, homeworkOrder: null },
  });

  // ── Part 5: 60문제를 30 / 30으로 분배 ──
  const part5Pool = await prisma.question.findMany({
    where: { part: 5, NOT: { id: { startsWith: "gen_" } } },
    orderBy: { id: "asc" },
    select: { id: true },
  });
  if (part5Pool.length < PART5_PER_SET * 2) {
    return Response.json(
      { error: `Part 5 문제가 부족합니다 (${part5Pool.length}/${PART5_PER_SET * 2})` },
      { status: 400 }
    );
  }
  const part5Set1Ids = part5Pool.slice(0, PART5_PER_SET).map((q) => q.id);
  const part5Set2Ids = part5Pool.slice(PART5_PER_SET, PART5_PER_SET * 2).map((q) => q.id);

  // ── Part 6: 4문제짜리 지문 4개씩(=16문제) 두 세트에 배분 ──
  const part6Groups = await prisma.questionGroup.findMany({
    where: { part: 6, NOT: { id: { startsWith: "gen_" } } },
    include: { questions: { orderBy: { id: "asc" }, select: { id: true } } },
  });
  const fullPart6Groups = part6Groups.filter((g) => g.questions.length === 4);
  const neededPart6Groups = (PART6_PER_SET / 4) * 2;
  if (fullPart6Groups.length < neededPart6Groups) {
    return Response.json(
      { error: `Part 6 지문이 부족합니다 (${fullPart6Groups.length}/${neededPart6Groups})` },
      { status: 400 }
    );
  }
  const shuffledPart6Groups = shuffle(fullPart6Groups);
  const part6Set1Groups = shuffledPart6Groups.slice(0, PART6_PER_SET / 4);
  const part6Set2Groups = shuffledPart6Groups.slice(PART6_PER_SET / 4, (PART6_PER_SET / 4) * 2);

  // ── Part 7: 지문 문제 수 합이 정확히 54가 되는 조합 선택 (두 세트는 서로 겹치지 않게) ──
  const part7Groups = await prisma.questionGroup.findMany({
    where: { part: 7, NOT: { id: { startsWith: "gen_" } } },
    include: { questions: { orderBy: { id: "asc" }, select: { id: true } } },
  });
  const part7Pool = part7Groups.map((g) => ({ id: g.id, size: g.questions.length, questions: g.questions }));

  const part7Set1Groups = pickGroupsForTarget(part7Pool, PART7_PER_SET);
  if (!part7Set1Groups) {
    return Response.json({ error: "Part 7 문제 조합(54문제, 1세트)을 찾지 못했습니다." }, { status: 400 });
  }
  const usedGroupIds = new Set(part7Set1Groups.map((g) => g.id));
  const remainingPart7Pool = part7Pool.filter((g) => !usedGroupIds.has(g.id));
  const part7Set2Groups = pickGroupsForTarget(remainingPart7Pool, PART7_PER_SET);
  if (!part7Set2Groups) {
    return Response.json({ error: "Part 7 문제 조합(54문제, 2세트)을 찾지 못했습니다." }, { status: 400 });
  }

  // ── DB 반영: Part5 → Part6 → Part7 순서로 homeworkOrder 부여 ──
  type GroupWithQuestions = { questions: { id: string }[] };
  async function assignSet(
    setNum: 1 | 2,
    part5Ids: string[],
    groups6: GroupWithQuestions[],
    groups7: GroupWithQuestions[]
  ) {
    let order = 1;
    for (const id of part5Ids) {
      await prisma.question.update({ where: { id }, data: { homeworkSet: setNum, homeworkOrder: order++ } });
    }
    for (const g of groups6) {
      for (const q of g.questions) {
        await prisma.question.update({ where: { id: q.id }, data: { homeworkSet: setNum, homeworkOrder: order++ } });
      }
    }
    for (const g of groups7) {
      for (const q of g.questions) {
        await prisma.question.update({ where: { id: q.id }, data: { homeworkSet: setNum, homeworkOrder: order++ } });
      }
    }
    return order - 1;
  }

  const set1Total = await assignSet(1, part5Set1Ids, part6Set1Groups, part7Set1Groups);
  const set2Total = await assignSet(2, part5Set2Ids, part6Set2Groups, part7Set2Groups);

  return Response.json({
    ok: true,
    set1: { part5: PART5_PER_SET, part6: PART6_PER_SET, part7: PART7_PER_SET, total: set1Total },
    set2: { part5: PART5_PER_SET, part6: PART6_PER_SET, part7: PART7_PER_SET, total: set2Total },
  });
}

// PUT: 특정 문제의 숙제 세트 수동 지정 { questionId, homeworkSet: 1|2|null }
export async function PUT(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return Response.json({ error: "권한 없음" }, { status: 403 });
  }

  const { questionId, homeworkSet } = await req.json();
  if (!questionId) return Response.json({ error: "questionId 필요" }, { status: 400 });
  if (homeworkSet !== null && homeworkSet !== 1 && homeworkSet !== 2) {
    return Response.json({ error: "homeworkSet은 1, 2, 또는 null이어야 합니다." }, { status: 400 });
  }

  const updated = await prisma.question.update({
    where: { id: questionId },
    data: { homeworkSet },
  });

  return Response.json(updated);
}

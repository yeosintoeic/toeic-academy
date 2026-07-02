import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: 숙제 세트 현황 조회
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return Response.json({ error: "권한 없음" }, { status: 403 });
  }

  const [set1, set2] = await Promise.all([
    prisma.question.count({ where: { part: 5, homeworkSet: 1 } }),
    prisma.question.count({ where: { part: 5, homeworkSet: 2 } }),
  ]);

  return Response.json({ set1Count: set1, set2Count: set2 });
}

// POST: 숙제 세트 초기화 — Part 5 문제를 id 순으로 정렬해 1~30번 → set1, 31~60번 → set2
export async function POST() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return Response.json({ error: "권한 없음" }, { status: 403 });
  }

  // 기존 할당 초기화
  await prisma.question.updateMany({
    where: { part: 5 },
    data: { homeworkSet: null },
  });

  const part5 = await prisma.question.findMany({
    where: { part: 5, NOT: { id: { startsWith: "gen_" } } },
    orderBy: { id: "asc" },
    select: { id: true },
  });

  const set1Ids = part5.slice(0, 30).map((q) => q.id);
  const set2Ids = part5.slice(30, 60).map((q) => q.id);

  await Promise.all([
    prisma.question.updateMany({ where: { id: { in: set1Ids } }, data: { homeworkSet: 1 } }),
    prisma.question.updateMany({ where: { id: { in: set2Ids } }, data: { homeworkSet: 2 } }),
  ]);

  return Response.json({ ok: true, set1: set1Ids.length, set2: set2Ids.length });
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

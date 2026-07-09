import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { reformatExplanationBatch } from "@/lib/reformat-explanations";

export const maxDuration = 120;

// 재작성 대상: 숙제용이 아니고, 아직 "✅"로 시작하는 상세 형식이 아닌 문제
const PENDING_WHERE = {
  homeworkSet: null,
  NOT: { explanation: { startsWith: "✅" } },
} as const;

// GET: 파트별 남은(미변환) 문제 수 조회
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return Response.json({ error: "권한 없음" }, { status: 403 });
  }

  const [part5, part6, part7] = await Promise.all([
    prisma.question.count({ where: { ...PENDING_WHERE, part: 5 } }),
    prisma.question.count({ where: { ...PENDING_WHERE, part: 6 } }),
    prisma.question.count({ where: { ...PENDING_WHERE, part: 7 } }),
  ]);

  return Response.json({ part5, part6, part7, total: part5 + part6 + part7 });
}

// POST: 한 배치(batchSize개)를 AI로 재작성하여 저장
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return Response.json({ error: "권한 없음" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const batchSize = Math.min(Math.max(Number(body.batchSize) || 8, 1), 20);
  const part = [5, 6, 7].includes(body.part) ? body.part : undefined;

  const rows = await prisma.question.findMany({
    where: { ...PENDING_WHERE, ...(part ? { part } : {}) },
    include: { group: { select: { passageText: true } } },
    take: batchSize,
  });

  if (rows.length === 0) {
    return Response.json({ updated: 0, failed: [], remaining: 0 });
  }

  let updatedIds = new Map<string, string>();
  try {
    updatedIds = await reformatExplanationBatch(
      rows.map((r) => ({
        id: r.id,
        questionText: r.questionText,
        optionA: r.optionA,
        optionB: r.optionB,
        optionC: r.optionC,
        optionD: r.optionD,
        answer: r.answer,
        explanation: r.explanation,
        passageText: r.group?.passageText ?? null,
      }))
    );
  } catch (err) {
    console.error("해설 재작성 배치 실패:", err);
    return Response.json({ error: "AI 재작성에 실패했습니다. 잠시 후 다시 시도해주세요." }, { status: 502 });
  }

  const failed: string[] = [];
  for (const r of rows) {
    const newExplanation = updatedIds.get(r.id);
    if (newExplanation) {
      await prisma.question.update({ where: { id: r.id }, data: { explanation: newExplanation } });
    } else {
      failed.push(r.id);
    }
  }

  const remaining = await prisma.question.count({ where: PENDING_WHERE });

  return Response.json({ updated: updatedIds.size, failed, remaining });
}

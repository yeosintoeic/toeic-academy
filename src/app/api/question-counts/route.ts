import prisma from "@/lib/prisma";

export async function GET() {
  const [p5, p6, p7] = await Promise.all([
    prisma.question.count({ where: { part: 5, id: { startsWith: "ai_p5" } } }),
    prisma.question.count({ where: { part: 6, id: { startsWith: "ai_q6" } } }),
    prisma.question.count({ where: { part: 7, id: { startsWith: "ai_q7" } } }),
  ]);
  return Response.json({ p5, p6, p7 });
}

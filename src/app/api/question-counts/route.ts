import prisma from "@/lib/prisma";

export async function GET() {
  const [p5, p6, p7] = await Promise.all([
    prisma.question.count({ where: { part: 5 } }),
    prisma.question.count({ where: { part: 6 } }),
    prisma.question.count({ where: { part: 7 } }),
  ]);
  return Response.json({ p5, p6, p7 });
}

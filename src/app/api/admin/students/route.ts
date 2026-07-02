import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return Response.json({ error: "권한 없음" }, { status: 403 });
  }

  const students = await prisma.user.findMany({
    where: { role: { in: ["STUDENT", "MANAGER"] } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      planExpiresAt: true,
      role: true,
      createdAt: true,
      lastLoginAt: true,
      sessions: {
        where: { completedAt: { not: null } },
        select: { totalScore: true, totalQuestions: true, completedAt: true },
        orderBy: { completedAt: "desc" },
        take: 1,
      },
    },
  });

  return Response.json(students);
}

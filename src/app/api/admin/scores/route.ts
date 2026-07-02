import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "VIEWER")) {
    return Response.json({ error: "권한 없음" }, { status: 403 });
  }

  const sessions = await prisma.testSession.findMany({
    where: {
      completedAt: { not: null },
      user: { role: "STUDENT" },
    },
    orderBy: { completedAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  return Response.json(sessions);
}

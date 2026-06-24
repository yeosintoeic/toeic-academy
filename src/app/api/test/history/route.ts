import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "로그인 필요" }, { status: 401 });

  const sessions = await prisma.testSession.findMany({
    where: { userId: session.id, completedAt: { not: null } },
    orderBy: { startedAt: "desc" },
  });

  return Response.json(sessions);
}

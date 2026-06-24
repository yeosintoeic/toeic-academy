import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "로그인 필요" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { plan: true, planExpiresAt: true, role: true },
  });
  const isAdmin = user?.role === "ADMIN";
  const lecturePlans = ["LECTURE", "FULL", "ALL"];
  const expired = !user?.planExpiresAt || user.planExpiresAt < new Date();
  if (!user || (!isAdmin && (!lecturePlans.includes(user.plan) || expired))) {
    return Response.json({ error: "강의 이용 권한이 없거나 기간이 만료되었습니다." }, { status: 403 });
  }

  const lectures = await prisma.lecture.findMany({ orderBy: { order: "asc" } });
  return Response.json(lectures);
}

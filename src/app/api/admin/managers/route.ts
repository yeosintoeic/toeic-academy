import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return Response.json({ error: "권한 없음" }, { status: 403 });
  }

  const managers = await prisma.user.findMany({
    where: { role: "MANAGER" },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      planExpiresAt: true,
      role: true,
      createdAt: true,
      lastLoginAt: true,
    },
  });

  return Response.json(managers);
}

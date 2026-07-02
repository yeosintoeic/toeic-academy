import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

const FOREVER = new Date("9999-12-31T00:00:00.000Z");

export async function POST() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return Response.json({ error: "권한 없음" }, { status: 403 });
  }

  const updates = [
    { email: "dlsdn0420@naver.com", role: "ADMIN" },
    { email: "gugua35@naver.com",   role: "MANAGER" },
    { email: "sohee@yeosintoeic.com", role: "MANAGER" },
  ];

  const results = [];
  for (const u of updates) {
    const updated = await prisma.user.updateMany({
      where: { email: u.email },
      data: { role: u.role, plan: "ALL", planExpiresAt: FOREVER },
    });
    results.push({ email: u.email, role: u.role, updated: updated.count });
  }

  return Response.json({ ok: true, results });
}

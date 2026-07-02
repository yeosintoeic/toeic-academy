import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

const FOREVER = new Date("9999-12-31T00:00:00.000Z");

const TARGET_USERS = [
  { email: "dlsdn0420@naver.com", role: "ADMIN" },
  { email: "gugua35@naver.com",   role: "MANAGER" },
  { email: "sohee@yeosintoeic.com", role: "MANAGER" },
];

// GET: 현재 세 계정의 역할/만료일 상태 확인
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return Response.json({ error: "권한 없음" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    where: { email: { in: TARGET_USERS.map(u => u.email) } },
    select: { email: true, name: true, role: true, plan: true, planExpiresAt: true },
  });

  const status = TARGET_USERS.map(target => {
    const found = users.find(u => u.email === target.email);
    return {
      email: target.email,
      name: found?.name ?? "계정 없음",
      expectedRole: target.role,
      currentRole: found?.role ?? "없음",
      roleOk: found?.role === target.role,
      plan: found?.plan ?? "없음",
      planExpiresAt: found?.planExpiresAt,
      expiryOk: found?.planExpiresAt ? new Date(found.planExpiresAt).getFullYear() >= 9999 : false,
    };
  });

  const allOk = status.every(s => s.roleOk && s.expiryOk);
  return Response.json({ allOk, status });
}

// POST: 세 계정 역할 + 만료일 설정 (이미 설정되어 있어도 재적용 가능)
export async function POST() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return Response.json({ error: "권한 없음" }, { status: 403 });
  }

  const results = [];
  for (const u of TARGET_USERS) {
    const updated = await prisma.user.updateMany({
      where: { email: u.email },
      data: { role: u.role, plan: "ALL", planExpiresAt: FOREVER },
    });
    results.push({ email: u.email, role: u.role, updated: updated.count });
  }

  return Response.json({ ok: true, results });
}

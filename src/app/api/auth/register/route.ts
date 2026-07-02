import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { email, password, name, code, phone, privacyConsent, marketingConsent } = body;

  if (!email || !password || !name || !code) {
    return Response.json({ error: "모든 항목을 입력해주세요." }, { status: 400 });
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "올바른 이메일 형식이 아닙니다." }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 8) {
    return Response.json({ error: "비밀번호는 8자 이상이어야 합니다." }, { status: 400 });
  }
  if (typeof name !== "string" || name.trim().length === 0 || name.length > 50) {
    return Response.json({ error: "이름을 올바르게 입력해주세요." }, { status: 400 });
  }

  const regCode = await prisma.registerCode.findUnique({ where: { code } });
  if (!regCode) {
    return Response.json({ error: "등록 코드가 올바르지 않습니다." }, { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (exists) {
    return Response.json({ error: "이미 사용 중인 이메일입니다." }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const planExpiresAt = new Date();
  planExpiresAt.setDate(planExpiresAt.getDate() + regCode.durationDays);

  // 특정 이메일은 자동으로 역할/플랜 부여
  const ROLE_OVERRIDES: Record<string, { role: string; plan: string; planExpiresAt: Date }> = {
    "gugua35@naver.com": { role: "VIEWER", plan: "ALL", planExpiresAt: new Date("9999-12-31") },
    "dlsdn0420@naver.com": { role: "ADMIN", plan: "ALL", planExpiresAt: new Date("9999-12-31") },
    "sohee@yeosintoeic.com": { role: "MANAGER", plan: "ALL", planExpiresAt: new Date("9999-12-31") },
  };
  const normalizedEmail = email.toLowerCase().trim();
  const override = ROLE_OVERRIDES[normalizedEmail];

  await prisma.$transaction([
    prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashed,
        name: name.trim(),
        phone: phone?.trim() || null,
        role: override?.role ?? "STUDENT",
        plan: override?.plan ?? regCode.plan,
        planExpiresAt: override?.planExpiresAt ?? planExpiresAt,
        privacyConsent: !!privacyConsent,
        marketingConsent: !!marketingConsent,
      },
    }),
    prisma.registerCode.delete({ where: { code } }),
  ]);

  return Response.json({ success: true, plan: regCode.plan, durationDays: regCode.durationDays });
}

import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { getSession, signToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return Response.json({ error: "로그인 필요" }, { status: 401 });

  const { newPassword } = await req.json();
  if (!newPassword || newPassword.length < 8) {
    return Response.json({ error: "비밀번호는 8자 이상이어야 합니다." }, { status: 400 });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  const sessionNonce = crypto.randomUUID();
  await prisma.user.update({
    where: { id: session.id },
    data: { password: hashed, mustChangePw: false, loginAttempts: 0, sessionNonce },
  });

  // 새 nonce로 토큰 재발급 (현재 기기 세션 유지)
  const newToken = await signToken({ id: session.id, role: session.role, name: session.name, sessionNonce });
  const cookieStore = await cookies();
  cookieStore.set("token", newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return Response.json({ success: true });
}

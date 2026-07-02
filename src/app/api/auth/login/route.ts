import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/auth";

const MAX_ATTEMPTS = 5;
const DEFAULT_PW = "12345678";

export async function POST(req: NextRequest) {
  const { email, password, rememberMe } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return Response.json({ error: "이메일 또는 비밀번호가 틀렸습니다." }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    const attempts = user.loginAttempts + 1;

    if (attempts >= MAX_ATTEMPTS) {
      // 5회 오류 → 비밀번호 12345678로 초기화
      const hashed = await bcrypt.hash(DEFAULT_PW, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { loginAttempts: 0, mustChangePw: true, password: hashed },
      });
      return Response.json({
        error: `비밀번호를 ${MAX_ATTEMPTS}회 틀렸습니다.\n비밀번호가 초기화되었습니다.\n임시 비밀번호: ${DEFAULT_PW}\n로그인 후 반드시 변경해주세요.`,
      }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { loginAttempts: attempts },
    });

    const remaining = MAX_ATTEMPTS - attempts;
    return Response.json({
      error: `비밀번호가 틀렸습니다. (${attempts}/${MAX_ATTEMPTS}회)\n${remaining}회 더 틀리면 비밀번호가 초기화됩니다.`,
    }, { status: 401 });
  }

  // 로그인 성공 → 시도 횟수 초기화 + 새 세션 nonce 생성 (동시 접속 방지)
  const sessionNonce = crypto.randomUUID();
  await prisma.user.update({
    where: { id: user.id },
    data: { loginAttempts: 0, sessionNonce, lastLoginAt: new Date() },
  });

  const token = await signToken({ id: user.id, role: user.role, name: user.name, sessionNonce }, rememberMe ? "30d" : "7d");
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7,
    path: "/",
  });

  return Response.json({
    role: user.role,
    name: user.name,
    mustChangePw: user.mustChangePw,
  });
}

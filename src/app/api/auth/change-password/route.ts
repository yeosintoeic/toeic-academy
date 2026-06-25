import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return Response.json({ error: "로그인 필요" }, { status: 401 });

  const { newPassword } = await req.json();
  if (!newPassword || newPassword.length < 8) {
    return Response.json({ error: "비밀번호는 8자 이상이어야 합니다." }, { status: 400 });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: session.id },
    data: { password: hashed, mustChangePw: false, loginAttempts: 0 },
  });

  return Response.json({ success: true });
}

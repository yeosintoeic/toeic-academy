import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error("JWT_SECRET 환경 변수가 설정되지 않았습니다.");
const secret = new TextEncoder().encode(jwtSecret);

export async function signToken(
  payload: { id: string; role: string; name: string; sessionNonce: string },
  expiresIn: "7d" | "30d" = "7d"
) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { id: string; role: string; name: string; sessionNonce?: string };
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  // nonce 없는 구형 JWT는 즉시 거부 (동시 접속 방지가 작동하지 않는 문제 해결)
  if (!payload.sessionNonce) return null;

  // DB의 nonce와 JWT의 nonce 비교
  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { sessionNonce: true },
  });

  if (!user || user.sessionNonce !== payload.sessionNonce) return null;

  return payload;
}

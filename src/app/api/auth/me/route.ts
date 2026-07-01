import { cookies } from "next/headers";
import { verifyToken, getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // 토큰 자체가 없으면 미로그인
  if (!token) return Response.json({ user: null });

  // 토큰은 있는데 세션이 null → 다른 기기에서 로그인해서 세션이 끊긴 경우
  const rawPayload = await verifyToken(token);
  if (!rawPayload) return Response.json({ user: null, kicked: false });

  const session = await getSession();
  if (!session) {
    // 토큰은 유효하지만 nonce가 다름 → 다른 기기에서 로그인됨
    return Response.json({ user: null, kicked: true }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { id: true, name: true, email: true, role: true, plan: true, planExpiresAt: true },
  });
  return Response.json({ user });
}

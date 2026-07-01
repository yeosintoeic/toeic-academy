import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return Response.json({ error: "미인증" }, { status: 401 });

  const { type, page } = await req.json().catch(() => ({}));
  if (!type || !page) return Response.json({ error: "잘못된 요청" }, { status: 400 });

  await prisma.captureLog.create({
    data: { userId: session.id, type: String(type), page: String(page) },
  });

  return Response.json({ ok: true });
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return Response.json({ error: "권한 없음" }, { status: 403 });
  }

  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  const logs = await prisma.captureLog.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { name: true, email: true } } },
  });

  return Response.json(logs);
}

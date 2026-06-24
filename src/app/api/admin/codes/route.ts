import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return Response.json({ error: "권한 없음" }, { status: 403 });
  const codes = await prisma.registerCode.findMany({ orderBy: { createdAt: "desc" } });
  return Response.json(codes);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return Response.json({ error: "권한 없음" }, { status: 403 });

  const { code, plan, durationDays, label } = await req.json();
  if (!code || !plan || !durationDays) return Response.json({ error: "필수 항목 누락" }, { status: 400 });

  const exists = await prisma.registerCode.findUnique({ where: { code } });
  if (exists) return Response.json({ error: "이미 존재하는 코드입니다." }, { status: 409 });

  const created = await prisma.registerCode.create({
    data: { code, plan, durationDays: Number(durationDays), label: label || "" },
  });
  return Response.json(created);
}

import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return Response.json({ error: "권한 없음" }, { status: 403 });
  }

  const setting = await prisma.setting.findUnique({ where: { key: "registerCode" } });
  return Response.json({ registerCode: setting?.value ?? "" });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return Response.json({ error: "권한 없음" }, { status: 403 });
  }

  const { registerCode } = await req.json();
  if (!registerCode || registerCode.trim().length < 4) {
    return Response.json({ error: "코드는 4자 이상이어야 합니다." }, { status: 400 });
  }

  await prisma.setting.upsert({
    where: { key: "registerCode" },
    update: { value: registerCode.trim() },
    create: { key: "registerCode", value: registerCode.trim() },
  });

  return Response.json({ success: true });
}

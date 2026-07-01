import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

function randomCode() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return Response.json({ error: "권한 없음" }, { status: 403 });
  const codes = await prisma.registerCode.findMany({ orderBy: { createdAt: "desc" } });
  return Response.json(codes);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return Response.json({ error: "권한 없음" }, { status: 403 });

  const body = await req.json();

  // 벌크 생성: { bulk: true, count, plan, durationDays, label, prefix }
  if (body.bulk) {
    const { count, plan, durationDays, label, prefix } = body;
    const n = Math.min(Math.max(1, Number(count)), 100);

    const toCreate = [];
    const tried = new Set<string>();
    let attempts = 0;

    while (toCreate.length < n && attempts < n * 5) {
      attempts++;
      const code = prefix ? `${prefix}-${randomCode()}` : randomCode();
      if (tried.has(code)) continue;
      tried.add(code);
      const exists = await prisma.registerCode.findUnique({ where: { code } });
      if (!exists) {
        toCreate.push({ code, plan, durationDays: Number(durationDays), label: label || "" });
      }
    }

    await prisma.registerCode.createMany({ data: toCreate });
    return Response.json({ created: toCreate.length });
  }

  // 단건 생성
  const { code, plan, durationDays, label } = body;
  if (!code || !plan || !durationDays) return Response.json({ error: "필수 항목 누락" }, { status: 400 });

  const exists = await prisma.registerCode.findUnique({ where: { code } });
  if (exists) return Response.json({ error: "이미 존재하는 코드입니다." }, { status: 409 });

  const created = await prisma.registerCode.create({
    data: { code, plan, durationDays: Number(durationDays), label: label || "" },
  });
  return Response.json(created);
}

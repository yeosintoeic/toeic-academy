import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return Response.json({ error: "권한 없음" }, { status: 403 });
  }

  const part = Number(req.nextUrl.searchParams.get("part"));
  const groups = await prisma.questionGroup.findMany({
    where: part ? { part } : undefined,
    include: {
      questions: { select: { id: true } },
    },
    orderBy: { id: "desc" },
  });

  return Response.json(groups);
}

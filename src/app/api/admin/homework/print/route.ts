import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: 인쇄용 숙제 문제 전체(문제/보기/정답/지문) 조회 { set: 1 | 2 }
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return Response.json({ error: "권한 없음" }, { status: 403 });
  }

  const setNum = Number(req.nextUrl.searchParams.get("set"));
  if (setNum !== 1 && setNum !== 2) {
    return Response.json({ error: "set은 1 또는 2여야 합니다." }, { status: 400 });
  }

  const questions = await prisma.question.findMany({
    where: { homeworkSet: setNum },
    orderBy: { homeworkOrder: "asc" },
    include: { group: { select: { id: true, passageText: true, passageType: true } } },
  });

  return Response.json({ set: setNum, questions });
}

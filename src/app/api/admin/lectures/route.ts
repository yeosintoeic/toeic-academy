import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return Response.json({ error: "권한 없음" }, { status: 403 });
  const lectures = await prisma.lecture.findMany({ orderBy: { order: "asc" } });
  return Response.json(lectures);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return Response.json({ error: "권한 없음" }, { status: 403 });

  const { title, description, videoUrl, order } = await req.json();
  if (!title) return Response.json({ error: "제목을 입력해주세요." }, { status: 400 });

  const lecture = await prisma.lecture.create({
    data: { title, description: description || "", videoUrl: videoUrl || "", order: Number(order) || 0 },
  });
  return Response.json(lecture);
}

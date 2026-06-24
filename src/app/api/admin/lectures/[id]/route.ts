import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return Response.json({ error: "권한 없음" }, { status: 403 });
  const { id } = await params;
  const { title, description, videoUrl, order } = await req.json();
  const lecture = await prisma.lecture.update({
    where: { id },
    data: { title, description, videoUrl, order: Number(order) || 0 },
  });
  return Response.json(lecture);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return Response.json({ error: "권한 없음" }, { status: 403 });
  const { id } = await params;
  await prisma.lecture.delete({ where: { id } });
  return Response.json({ success: true });
}

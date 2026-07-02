import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return Response.json({ error: "권한 없음" }, { status: 403 });
  }

  const { id } = await params;
  const { questionText, optionA, optionB, optionC, optionD, answer, explanation, category, homeworkSet } = await req.json();

  const question = await prisma.question.update({
    where: { id },
    data: {
      questionText, optionA, optionB, optionC, optionD, answer, explanation, category,
      ...(homeworkSet !== undefined && { homeworkSet: homeworkSet ?? null }),
    },
  });

  return Response.json(question);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return Response.json({ error: "권한 없음" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.testAnswer.deleteMany({ where: { questionId: id } });
  await prisma.question.delete({ where: { id } });
  return Response.json({ success: true });
}

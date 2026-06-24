import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return Response.json({ error: "권한 없음" }, { status: 403 });
  }

  const { id } = await params;

  const questions = await prisma.question.findMany({ where: { groupId: id }, select: { id: true } });
  const questionIds = questions.map((q) => q.id);

  if (questionIds.length > 0) {
    await prisma.testAnswer.deleteMany({ where: { questionId: { in: questionIds } } });
    await prisma.question.deleteMany({ where: { groupId: id } });
  }

  await prisma.questionGroup.delete({ where: { id } });
  return Response.json({ success: true });
}

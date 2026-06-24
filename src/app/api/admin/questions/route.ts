import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return Response.json({ error: "권한 없음" }, { status: 403 });
  }

  const questions = await prisma.question.findMany({
    orderBy: [{ part: "asc" }, { id: "asc" }],
    include: { group: true },
  });

  return Response.json(questions);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return Response.json({ error: "권한 없음" }, { status: 403 });
  }

  const body = await req.json();
  const { part, questionText, optionA, optionB, optionC, optionD, answer, explanation, category, passageText, passageType, groupId: existingGroupId } = body;

  let groupId: string | undefined = existingGroupId || undefined;

  if ((part === 6 || part === 7) && !groupId && passageText) {
    const group = await prisma.questionGroup.create({
      data: { part, passageText, passageType: passageType || "" },
    });
    groupId = group.id;
  }

  const question = await prisma.question.create({
    data: {
      part,
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      answer,
      explanation: explanation || "",
      category: category || "",
      groupId,
    },
  });

  return Response.json(question);
}

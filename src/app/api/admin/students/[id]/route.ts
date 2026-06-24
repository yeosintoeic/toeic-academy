import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return Response.json({ error: "권한 없음" }, { status: 403 });
  }

  const { id } = await params;

  const student = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      planExpiresAt: true,
      createdAt: true,
      sessions: {
        where: { completedAt: { not: null } },
        orderBy: { completedAt: "desc" },
        select: {
          id: true,
          completedAt: true,
          part5Score: true,
          part6Score: true,
          part7Score: true,
          totalScore: true,
          totalQuestions: true,
        },
      },
    },
  });

  if (!student) return Response.json({ error: "수강생을 찾을 수 없습니다." }, { status: 404 });
  return Response.json(student);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return Response.json({ error: "권한 없음" }, { status: 403 });
  }

  const { id } = await params;
  const { plan, planExpiresAt } = await req.json();

  const VALID_PLANS = ["NONE", "TEST", "LECTURE", "VOCAB", "FULL", "TEST_VOCAB", "ALL"];
  if (plan && !VALID_PLANS.includes(plan)) {
    return Response.json({ error: "유효하지 않은 플랜입니다." }, { status: 400 });
  }

  const expiryDate = planExpiresAt ? new Date(planExpiresAt) : null;
  if (expiryDate && isNaN(expiryDate.getTime())) {
    return Response.json({ error: "유효하지 않은 날짜입니다." }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { plan, planExpiresAt: expiryDate },
  });

  return Response.json({ success: true, plan: updated.plan, planExpiresAt: updated.planExpiresAt });
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

  const sessions = await prisma.testSession.findMany({
    where: { userId: id },
    select: { id: true },
  });
  const sessionIds = sessions.map((s) => s.id);

  if (sessionIds.length > 0) {
    await prisma.testAnswer.deleteMany({ where: { sessionId: { in: sessionIds } } });
    await prisma.testSession.deleteMany({ where: { userId: id } });
  }

  await prisma.user.delete({ where: { id } });

  return Response.json({ success: true });
}

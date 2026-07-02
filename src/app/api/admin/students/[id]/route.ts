import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

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
      phone: true,
      plan: true,
      planExpiresAt: true,
      role: true,
      privacyConsent: true,
      marketingConsent: true,
      createdAt: true,
      sessions: {
        where: { completedAt: { not: null } },
        orderBy: { completedAt: "desc" },
        select: {
          id: true,
          mode: true,
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
  const { plan, planExpiresAt, newPassword, resetPassword, role } = await req.json();

  // 비밀번호 초기화 (임시 비밀번호 12345678 + 다음 로그인 시 변경 강제)
  if (resetPassword) {
    const hashed = await bcrypt.hash("12345678", 10);
    await prisma.user.update({ where: { id }, data: { password: hashed, mustChangePw: true } });
    return Response.json({ success: true, changed: "reset" });
  }

  // 비밀번호 직접 변경
  if (newPassword) {
    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return Response.json({ error: "비밀번호는 8자 이상이어야 합니다." }, { status: 400 });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id }, data: { password: hashed, mustChangePw: true } });
    return Response.json({ success: true, changed: "password" });
  }

  // 역할 변경
  if (role) {
    const VALID_ROLES = ["STUDENT", "MANAGER", "VIEWER", "ADMIN"];
    if (!VALID_ROLES.includes(role)) {
      return Response.json({ error: "유효하지 않은 역할입니다." }, { status: 400 });
    }
    await prisma.user.update({ where: { id }, data: { role } });
    return Response.json({ success: true, role });
  }

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

  const target = await prisma.user.findUnique({ where: { id }, select: { role: true } });
  if (target?.role === "MANAGER" || target?.role === "ADMIN") {
    return Response.json({ error: "매니저/관리자 계정은 삭제할 수 없습니다." }, { status: 403 });
  }

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

import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const session = await getSession();
  if (!session) return Response.json({ error: "로그인 필요" }, { status: 401 });

  const { sessionId } = await params;

  const testSession = await prisma.testSession.findUnique({
    where: { id: sessionId },
    include: {
      answers: {
        include: {
          question: {
            include: { group: true },
          },
        },
        orderBy: { id: "asc" },
      },
    },
  });

  if (!testSession) {
    return Response.json({ error: "결과를 찾을 수 없습니다." }, { status: 404 });
  }

  if (testSession.userId !== session.id && session.role !== "ADMIN") {
    return Response.json({ error: "권한 없음" }, { status: 403 });
  }

  return Response.json(testSession);
}

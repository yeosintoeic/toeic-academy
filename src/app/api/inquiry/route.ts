import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "로그인 필요" }, { status: 401 });

  const { content } = await req.json();
  if (!content?.trim()) return Response.json({ error: "내용을 입력해주세요." }, { status: 400 });
  if (content.trim().length > 1000) return Response.json({ error: "1000자 이내로 작성해주세요." }, { status: 400 });

  await prisma.inquiry.create({
    data: { userId: session.id, content: content.trim() },
  });

  return Response.json({ ok: true });
}

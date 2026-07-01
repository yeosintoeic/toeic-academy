import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST() {
  const session = await getSession();
  if (session) {
    await prisma.user.update({
      where: { id: session.id },
      data: { sessionNonce: null },
    }).catch(() => {});
  }

  const cookieStore = await cookies();
  cookieStore.delete("token");
  return Response.json({ success: true });
}

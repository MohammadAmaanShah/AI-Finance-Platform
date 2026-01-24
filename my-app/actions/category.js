import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCategory(data) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthroized");

  const user = db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) throw new Error("User not found");
}

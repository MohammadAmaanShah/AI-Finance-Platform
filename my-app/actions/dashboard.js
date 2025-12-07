"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { includes } from "zod";
import { Select } from "react-day-picker";

const serializeTransction = (obj) => {
  const serialized = { ...obj };

  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }
  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }

  return serialized
};
export async function createAccount(data) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }

    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) {
      throw new Error("Invalid balance amount");
    }

    const existingAccounts = await db.account.findMany({
      where: { userId: user.id },
    });

    const shouldBeDefault =
      existingAccounts.length === 0 ? true : data.isDefault;
    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const account = await db.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        userId: user.id,
        isDefault: shouldBeDefault,
      },
    });

    const serializeAccount = account.map(serializeTransction);

    return { success: true, data: serializeAccount };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getUserAccounts() {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorised");

  const user = await db.user.findMany({
    where: { clerkUserId: userId },
  });
  if (!user) {
    throw new Error("User Not Fount");
  }
  const accounts = db.account.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          transactions: true,
        },
      },
    },
  });

  const serializeAccount = serializeTransction(accounts);

  return serializeAccount;
}

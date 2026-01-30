"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { success } from "zod";
import { Decimal } from "@prisma/client/runtime/library";

let prisma = db;

export async function getCurrentBudget(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorised");
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const budget = await db.budget.findFirst({
      where: { userId: user.id },
    });

    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );

    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );

    const expense = await db.transaction.aggregate({
      where: {
        userId: user.id,
        type: "EXPENSE",
        date: { gte: startOfMonth, lte: endOfMonth },
        accountId,
      },
      _sum: {
        amount: true,
      },
    });
    return {
      budget: budget ? { ...budget, amount: budget.amount.toNumber() } : null,
      currentExpenses: expense._sum.amount ? expense._sum.amount.toNumber() : 0,
    };
  } catch (error) {
    throw new Error("Error Futching budget", error);
  }
}

export async function updateBudget(amount) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorised");
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const budget = await db.budget.upsert({
      where: {
        userId: user.id,
      },
      update: { amount },
      create: {
        userId: user.id,
        amount,
      },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      data: { ...budget, amount: budget.amount.toNumber() },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// <<<<<<<<<<<<------------------------------------ THIS IS NEW BUDGET ----------------------------------------->>>>>>>>>>>>

export async function getBudgetsByAccount(accountId) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorised");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  const budgets = await db.budget.findMany({
    where: {
      userId: user.id,
      accountId,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // ✅ SERIALIZE DECIMALS
  return budgets.map((b) => ({
    ...b,
    amount: Number(b.amount),
  }));
}

export async function upsertAccountBudget(accountId, amount) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorised");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  // 🔑 find existing account-level budget (categoryId = null)
  const existingBudget = await db.budget.findFirst({
    where: {
      userId: user.id,
      accountId,
      categoryId: null,
    },
  });

  if (existingBudget) {
    // UPDATE
    return await db.budget.update({
      where: { id: existingBudget.id },
      data: {
        amount,
      },
    });
  }

  // CREATE
  return await db.budget.create({
    data: {
      userId: user.id,
      accountId,
      categoryId: null,
      amount,
    },
  });
}

export async function upsertCategoryBudget(accountId, categoryId, amount) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorised");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  return await db.budget.upsert({
    where: {
      accountId_categoryId: {
        accountId,
        categoryId,
      },
    },
    update: {
      amount,
    },
    create: {
      userId: user.id,
      accountId,
      categoryId,
      amount,
    },
  });
}

export async function deleteBudget(accountId, categoryId) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorised");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  return await db.budget.delete({
    where: {
      accountId_categoryId: {
        accountId,
        categoryId: categoryId ?? null,
      },
    },
  });
}

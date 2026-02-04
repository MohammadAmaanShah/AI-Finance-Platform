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

export async function upsertAccountBudget({
  accountId,
  amount,
  startDate,
  period,
}) {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    throw new Error("Unauthorized");
  }

  // 🔑 GET DB USER
  const user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) {
    throw new Error("User not found in database");
  }

  // 🔍 Find existing account-level budget
  const existingBudget = await prisma.budget.findFirst({
    where: {
      accountId,
      userId: user.id, // ✅ DB user id
      categoryId: null,
    },
  });

  // 🟢 UPDATE
  if (existingBudget) {
    return prisma.budget.update({
      where: { id: existingBudget.id },
      data: {
        amount,
        startDate: new Date(startDate),
        period,
      },
    });
  }

  // 🔵 CREATE
  return prisma.budget.create({
    data: {
      amount,
      startDate: new Date(startDate),
      period,

      userId: user.id, // ✅ FIX HERE
      accountId,
      categoryId: null,
    },
  });
}

export async function deleteBudget(accountId, categoryId = null) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorised");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  // 🔑 Step 1: find the budget first
  const budget = await db.budget.findFirst({
    where: {
      userId: user.id,
      accountId,
      categoryId: categoryId ?? null,
    },
  });

  if (!budget) {
    throw new Error("Budget not found");
  }

  // 🔑 Step 2: delete by PRIMARY KEY (id)
  return await db.budget.delete({
    where: { id: budget.id },
  });
}

//  <------------------------------------------------------category budget ------------------------------------------>

export async function getCategoryBudgets(accountId) {
  const budgets = await prisma.budget.findMany({
    where: {
      accountId,
      categoryId: { not: null },
    },
    include: {
      category: true,
    },
  });

  // 🔥 SERIALIZE (Decimal → number)
  return budgets.map((b) => ({
    id: b.id,
    categoryId: b.categoryId,
    categoryName: b.category.name,
    amount: Number(b.amount),
    startDate: b.startDate.toISOString(),
    period: b.period,
  }));
}

export async function upsertCategoryBudget({
  accountId,
  categoryId,
  amount,
  startDate,
  period,
}) {
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

  // 🔍 check existing category budget
  const existing = await db.budget.findFirst({
    where: {
      userId: user.id,
      accountId,
      categoryId, // 👈 category-specific
    },
  });

  if (existing) {
    return db.budget.update({
      where: { id: existing.id },
      data: {
        amount,
        startDate: new Date(startDate),
        period,
      },
    });
  }

  return db.budget.create({
    data: {
      userId: user.id,
      accountId,
      categoryId,
      amount,
      startDate: new Date(startDate),
      period,
    },
  });
}

export async function deleteCategoryBudget(budgetId) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  // 🔐 Verify ownership using ONLY budgetId
  const budget = await db.budget.findFirst({
    where: {
      id: budgetId,
      userId: user.id,
    },
    select: { id: true },
  });

  if (!budget) {
    throw new Error("Budget not found or access denied");
  }

  await db.budget.delete({
    where: { id: budgetId },
  });

  return { success: true };
}

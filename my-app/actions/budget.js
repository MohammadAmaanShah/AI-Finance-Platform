"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { success } from "zod";

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

export async function createBudget(formData) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const accountId = formData.accountId;
  const categoryId = formData.categoryId || null;
  const amount = Number(formData.amount);

  if (!accountId || !amount) {
    throw new Error("Missing required fields");
  }

  // 1️⃣ Verify account ownership
  const account = await prisma.account.findFirst({
    where: { id: accountId, userId },
  });
  if (!account) throw new Error("Account not found");

  // 2️⃣ Verify category (if category budget)
  if (categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: categoryId },
    });
    if (!category) throw new Error("Category not found");
  }

  // 3️⃣ Prevent duplicate budgets
  const existing = await prisma.budget.findFirst({
    where: { accountId, categoryId },
  });
  if (existing) {
    throw new Error("Budget already exists for this account/category");
  }

  // 4️⃣ Create budget
  await prisma.budget.create({
    data: {
      amount,
      userId,
      accountId,
      categoryId,
    },
  });

  revalidatePath("/budgets");
}

export async function getBudgets() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // 1️⃣ Fetch all budgets of user
  const budgets = await prisma.budget.findMany({
    where: { userId },
    include: {
      account: true,
      category: true, // null = whole account budget
    },
    orderBy: { createdAt: "desc" },
  });

  // 2️⃣ Calculate spent for each budget
  const finalBudgets = [];

  for (const budget of budgets) {
    const whereClause = {
      accountId: budget.accountId,
      type: "EXPENSE",
    };

    // category budget vs account budget
    if (budget.categoryId) {
      whereClause.categoryId = budget.categoryId;
    }

    const spentAgg = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: whereClause,
    });

    const spent = Number(spentAgg._sum.amount || 0);
    const limit = Number(budget.amount);

    finalBudgets.push({
      id: budget.id,
      amount: limit,
      spent,
      remaining: limit - spent,
      percentage: limit > 0 ? Math.min((spent / limit) * 100, 100) : 0,

      account: {
        id: budget.account.id,
        name: budget.account.name,
      },

      category: budget.category
        ? {
            id: budget.category.id,
            name: budget.category.name,
          }
        : null, // 👈 whole account budget
    });
  }

  return finalBudgets;
}

export async function updatedBudget(budgetId, newAmount) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  if (!budgetId || !newAmount) {
    throw new Error("Invalid data");
  }

  // Ensure budget belongs to user
  const budget = await prisma.budget.findFirst({
    where: {
      id: budgetId,
      userId,
    },
  });

  if (!budget) {
    throw new Error("Budget not found");
  }

  await prisma.budget.update({
    where: { id: budgetId },
    data: {
      amount: Number(newAmount),
    },
  });

  revalidatePath("/budgets");
}

export async function deleteBudget(budgetId) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  if (!budgetId) {
    throw new Error("Budget ID required");
  }

  const budget = await prisma.budget.findFirst({
    where: {
      id: budgetId,
      userId,
    },
  });

  if (!budget) {
    throw new Error("Budget not found");
  }

  await prisma.budget.delete({
    where: { id: budgetId },
  });

  revalidatePath("/budgets");
}

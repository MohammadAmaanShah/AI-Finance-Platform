import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { categories } from "@arcjet/next";
import { NextResponse } from "next/server";

export async function createCategory(name) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthroized");

  const user = db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) throw new Error("User not found");

  const systemCategory = await db.category.findFrist({
    where: {
      name: categoryName,
      userId: null,
    },
  });

  if (systemCategory) {
    throw new Error("You already have this category");
  }

  const newCategory = db.category.create({
    where: {
      userId: user.id,
    },
    data: {
      name: categoryName,
      userId,
    },
  });

  return newCategory;
}
export async function getCategories() {
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
  const categories = await db.category.findMany({
    where: {
      OR: [{ userId: null }, { userId: user.id }],
    },

    orderBy: { name: "asc" },
  });

  return categories;
}

export async function deleteCategory(categoryId) {
  const { userId } = await auth();

  if (!clerkUserId) {
    throw new Error("Unauthorized");
  }

  // Get app user
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get category
  const category = await db.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  //  Block system categories
  if (category.userId === null) {
    throw new Error("System categories cannot be deleted");
  }

  //  Block deleting other users' categories
  if (category.userId !== user.id) {
    throw new Error("Unauthorized");
  }

  // Check if category is used
  const transactionCount = await db.transaction.count({
    where: { categoryId },
  });

  if (transactionCount > 0) {
    return { success: false, message: "Category is used in transactions" };
  }

  // Delete category
  await db.category.delete({
    where: { id: categoryId },
  });

  return { success: true };
}

export async function updateCatagory(categoryId, newName) {
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
    throw new Error("User not found ");
  }

  const name = newName.trim();

  if (!name) {
    throw new Error("Category name is required");
  }

  const category = await db.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (category.userId !== user.id) {
    throw new Error("Unauthorized");
  }

  const systemConflict = await db.category.findFirst({
    where: {
      name,
      userId: null,
    },
  });

  if (systemConflict) {
    throw new Error("This name is reserved");
  }

  // 5. Check user category conflict
  const userConflict = await db.category.findFirst({
    where: {
      name,
      userId: user.id,
      NOT: { id: categoryId },
    },
  });

  if (userConflict) {
    throw new Error("You already have this category");
  }

  await db.category.update({
    where: { id: categoryId },
    data: { name },
  });
}

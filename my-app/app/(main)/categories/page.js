"use server";

import { getCategories } from "@/actions/category";
import CategoryPage from "./_components/CategoryPage";
import { createCategory } from "@/actions/category";

export default async function name(params) {
  const categories = await getCategories();

  return (
    <>
      <CategoryPage categories={categories} />
    </>
  );
}

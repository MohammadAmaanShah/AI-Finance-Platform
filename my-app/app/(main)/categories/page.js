"use server";

import { getCategories } from "@/actions/category";
import CategoryPage from "./_components/CategoryPage";

export default async function name(params) {
  const categories = await getCategories();

  console.log(categories);

  return (
    <>
      <CategoryPage categories={categories} />
    </>
  );
}

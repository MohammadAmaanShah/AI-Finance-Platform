"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CategoryBudgetCard from "./category-budget-card";
import { upsertCategoryBudget } from "@/actions/budget";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CategoryBudgetPage({
  accountId,
  categories, // [{ id, name }]
  categoryBudgets, // [{ id, categoryId, categoryName, amount, startDate, period }]
  account, // { transactions: [...] }
  deleteCategoryBudget, // function for delete
}) {
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [period, setPeriod] = useState("MONTHLY");

  // ================= SAVE =================

  const handleSave = async () => {
    if (!selectedCategoryId) {
      toast.error("Select a category");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast.error("Enter valid amount");
      return;
    }

    if (!startDate) {
      toast.error("Select start date");
      return;
    }

    try {
      await upsertCategoryBudget({
        accountId,
        categoryId: selectedCategoryId,
        amount: Number(amount),
        startDate,
        period,
      });

      toast.success("Category budget saved");

      setEditing(false);
      setSelectedCategoryId("");
      setAmount("");
      setStartDate("");
      setPeriod("MONTHLY");

      router.refresh();
    } catch (e) {
      toast.error("Failed to save budget");
    }
  };

  // ================= UI =================

  return (
    <div className="space-y-6">
      {/* SET BUTTON */}
      <Button onClick={() => setEditing(true)}>Set Category Budget</Button>

      {/* FORM */}
      {editing && (
        <div className="max-w-md rounded-xl border p-4 space-y-3">
          <select
            className="w-full border rounded-md px-3 py-2 text-sm"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {selectedCategoryId && (
            <>
              <Input
                type="number"
                placeholder="Budget amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />

              <select
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="QUARTERLY">Quarterly</option>
                <option value="HALF_YEARLY">Half Yearly</option>
                <option value="YEARLY">Yearly</option>
              </select>
              {/* <Select
  value={selectedCategoryId}
  onValueChange={(value) => setSelectedCategoryId(value)}
>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select Category" />
  </SelectTrigger>

  <SelectContent>
    {categories.map((cat) => (
      <SelectItem key={cat.id} value={cat.id}>
        {cat.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select> */}

              <div className="flex gap-2">
                <Button onClick={handleSave}>Save</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditing(false);
                    setSelectedCategoryId("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ALL CATEGORY BUDGET CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categoryBudgets.map((budget) => (
          <CategoryBudgetCard
            key={budget.id}
            budget={budget}
            transactions={account.transactions}
            deleteCategoryBudget={deleteCategoryBudget}
          />
        ))}
      </div>
    </div>
  );
}

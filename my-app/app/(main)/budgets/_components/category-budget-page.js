"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CategoryBudgetCard from "./category-budget-card";
import { upsertCategoryBudget } from "@/actions/budget";

export default function CategoryBudgetPage({
  accountId,
  categories, // [{ id, name }]
  categoryBudgets,
  account, // [{ id, categoryId, categoryName, amount, startDate, period, spent }]
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

  function isWithinBudgetPeriod(txDate, startDate, period) {
    const tx = new Date(txDate);
    const start = new Date(startDate);
    let end = new Date(start);

    switch (period) {
      case "DAILY":
        end.setDate(start.getDate() + 1);
        break;

      case "WEEKLY":
        end.setDate(start.getDate() + 7);
        break;

      case "MONTHLY":
        end = new Date(
          start.getFullYear(),
          start.getMonth() + 1,
          0,
          23,
          59,
          59,
        );
        break;

      case "QUARTERLY":
        end.setMonth(start.getMonth() + 3);
        break;

      case "HALF_YEARLY":
        end.setMonth(start.getMonth() + 6);
        break;

      case "YEARLY":
        end.setFullYear(start.getFullYear() + 1);
        break;
    }

    return tx >= start && tx <= end;
  }

  const selectedBudget = categoryBudgets.find(
    (b) => String(b.categoryId) === String(selectedCategoryId),
  );

  let spent = 0;

  if (selectedBudget) {
    spent = account.transactions
      // 1️⃣ only expenses
      .filter((tx) => tx.type === "EXPENSE")

      // 2️⃣ only selected category
      .filter((tx) => tx.categoryId === selectedCategoryId)

      // 3️⃣ only within budget period
      .filter((tx) =>
        isWithinBudgetPeriod(
          tx.date,
          selectedBudget.startDate,
          selectedBudget.period,
        ),
      )

      // 4️⃣ sum amounts
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
  }
  // ================= UI =================
  const budgetsToRender = selectedCategoryId
    ? categoryBudgets.filter(
        (b) => String(b.categoryId) === String(selectedCategoryId),
      )
    : categoryBudgets;

  return (
    <div className="space-y-6">
      {/* SET BUTTON */}
      <Button onClick={() => setEditing(true)}>Set Category Budget</Button>

      {/* FORM */}
      {editing && (
        <div className="max-w-md rounded-xl border p-4 space-y-3">
          {/* CATEGORY DROPDOWN */}
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

          {/* FORM FIELDS (only after category selected) */}
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

      {/* SHOW ONLY SELECTED CATEGORY BUDGET */}
      {selectedCategoryId && selectedBudget && (
        <CategoryBudgetCard
          accountId={accountId}
          category={{
            id: selectedCategoryId,
            name: categories.find((c) => c.id === selectedCategoryId)?.name,
          }}
          budget={selectedBudget}
          spent={spent}
        />
      )}
      {/* CATEGORY BUDGET CARDS */}
      {/* {budgetsToRender.map((budget) => (
        <CategoryBudgetCard
          accountId={accountId}
          category={{
            id: selectedCategoryId,
            name: categories.find((c) => c.id === selectedCategoryId)?.name,
          }}
          budget={selectedBudget}
          spent={spent}
          key={budget.id}
        />
      ))} */}
    </div>
  );
}

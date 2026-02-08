"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CategoryBudgetCard from "./category-budget-card";
import { upsertCategoryBudget } from "@/actions/budget";
import { Pencil } from "lucide-react";

export default function CategoryBudgetPage({
  accountId,
  categories,
  categoryBudgets,
  account,
  deleteCategoryBudget,
}) {
  const router = useRouter();

  const [openForm, setOpenForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [period, setPeriod] = useState("MONTHLY");

  // ================= OPEN CREATE =================
  const openCreate = () => {
    setEditingBudget(null);
    setCategoryId("");
    setAmount("");
    setStartDate("");
    setPeriod("MONTHLY");
    setOpenForm(true);
  };

  // ================= OPEN EDIT =================
  const openEdit = (budget) => {
    setEditingBudget(budget);
    setCategoryId(budget.categoryId);
    setAmount(String(budget.amount));
    setStartDate(budget.startDate.slice(0, 10));
    setPeriod(budget.period);
    setOpenForm(true);
  };

  // ================= SAVE =================
  const handleSave = async () => {
    if (!categoryId) return toast.error("Select category");
    if (!amount || Number(amount) <= 0) return toast.error("Invalid amount");
    if (!startDate) return toast.error("Select start date");

    try {
      if (editingBudget) {
        console.log((editingBudget.id = "--------------------"));
        console.log(amount);
        console.log(startDate);
        console.log(period);

        await upsertCategoryBudget({
          accountId,
          categoryId,
          id: editingBudget.id,
          amount: Number(amount),
          startDate,
          period,
        });
        toast.success("Category budget updated");
      } else {
        await upsertCategoryBudget({
          accountId,
          categoryId,
          amount: Number(amount),
          startDate,
          period,
        });
        toast.success("Category budget created");
      }

      setOpenForm(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  // ================= UI =================
  return (
    <div className="space-y-6">
      <Button onClick={openCreate}>Set Category Budget</Button>

      {/* FORM */}
      {openForm && (
        <div className="max-w-md rounded-xl border p-4 space-y-4 bg-background">
          <select
            className="w-full border rounded-md px-3 py-2 text-sm"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={!!editingBudget}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

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
            <Button onClick={handleSave}>
              {editingBudget ? "Update" : "Save"}
            </Button>
            <Button variant="outline" onClick={() => setOpenForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* BUDGET CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categoryBudgets.map((budget) => (
          <CategoryBudgetCard
            key={budget.id}
            budget={budget}
            transactions={account.transactions}
            deleteCategoryBudget={deleteCategoryBudget}
            onEdit={() => openEdit(budget)}
          />
        ))}
      </div>
    </div>
  );
}

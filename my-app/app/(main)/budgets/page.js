"use client";

import { useEffect, useState } from "react";
import { getBudgets } from "@/actions/budget";
import BudgetCard from "./_components/BudgetCard";
import BudgetSkeleton from "./_components/BudgetSkeleton";
import EditBudgetDrawer from "./_components/EditBudgetDrawer";
import { deleteBudget } from "@/actions/budget";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBudget, setEditingBudget] = useState(null);

  async function loadBudgets() {
    setLoading(true);
    const data = await getBudgets();
    setBudgets(data);
    setLoading(false);
  }

  useEffect(() => {
    loadBudgets();
  }, []);

  async function handleDelete(budget) {
    const confirmed = confirm(
      `Delete budget for ${budget.account.name}${
        budget.category ? ` – ${budget.category.name}` : ""
      }?`,
    );

    if (!confirmed) return;

    await deleteBudget(budget.id);
    loadBudgets();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Budgets</h1>
        <button className="btn-primary">+ Add Budget</button>
      </div>

      {loading && <BudgetSkeleton />}

      {!loading && budgets.length === 0 && (
        <p className="text-muted-foreground">No budgets yet</p>
      )}

      {!loading && budgets.length > 0 && (
        <div className="grid gap-4">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={setEditingBudget}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {editingBudget && (
        <EditBudgetDrawer
          budget={editingBudget}
          onClose={() => setEditingBudget(null)}
          onUpdated={loadBudgets}
        />
      )}
    </div>
  );
}

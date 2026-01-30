"use client";

import { useState } from "react";
import { upsertCategoryBudget, deleteBudget } from "@/actions/budget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export default function CategoryBudgetList({ accountId, budgets }) {
  const [editingId, setEditingId] = useState(null);
  const [amount, setAmount] = useState("");

  const handleSave = async (categoryId) => {
    await upsertCategoryBudget(accountId, categoryId, Number(amount));
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Category Budgets</h3>

      {budgets.length === 0 && (
        <p className="text-muted-foreground">No category budgets set.</p>
      )}

      {budgets.map((budget) => (
        <div key={budget.id} className="rounded-lg border p-4 space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{budget.category.name}</p>
              <p className="text-sm text-muted-foreground">₹{budget.amount}</p>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingId(budget.id);
                  setAmount(budget.amount);
                }}
              >
                Edit
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteBudget(accountId, budget.categoryId)}
              >
                Delete
              </Button>
            </div>
          </div>

          {editingId === budget.id && (
            <div className="flex gap-2">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <Button onClick={() => handleSave(budget.categoryId)}>
                Save
              </Button>
            </div>
          )}

          <Progress value={40} />
        </div>
      ))}
    </div>
  );
}

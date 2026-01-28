"use client";

import { useState } from "react";
import { updatedBudget } from "@/actions/budget";

export default function EditBudgetDrawer({ budget, onClose, onUpdated }) {
  const [amount, setAmount] = useState(budget.amount);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    await updatedBudget({
      budgetId: budget.id,
      amount,
    });
    setLoading(false);
    onUpdated();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end">
      <div className="w-96 bg-background p-6 space-y-4">
        <h2 className="text-lg font-semibold">Edit Budget</h2>

        <p className="text-sm text-muted-foreground">
          {budget.account.name}
          {budget.category ? ` – ${budget.category.name}` : " – Overall"}
        </p>

        <input
          type="number"
          className="w-full border rounded-md p-2"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

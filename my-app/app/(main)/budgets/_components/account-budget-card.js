"use client";

import { useState } from "react";
import { upsertAccountBudget, deleteBudget } from "@/actions/budget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export default function AccountBudgetCard({ account, budget }) {
  const [editing, setEditing] = useState(false);
  const [amount, setAmount] = useState(budget?.amount || "");

  const handleSave = async () => {
    await upsertAccountBudget(account.id, Number(amount));
    setEditing(false);
  };

  const handleDelete = async () => {
    await deleteBudget(account.id);
  };

  return (
    <div className="rounded-xl border p-5 space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="font-medium">Total Budget — {account.name}</h2>

        {budget && (
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        )}
      </div>

      {editing ? (
        <div className="flex gap-2">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button onClick={handleSave}>Save</Button>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold">
            ₹{budget?.amount ?? "Not set"}
          </p>
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            Edit
          </Button>
        </div>
      )}

      {budget && <Progress value={60} />}
    </div>
  );
}

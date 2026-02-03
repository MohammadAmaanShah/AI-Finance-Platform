"use client";

import { useEffect, useState } from "react";
import { upsertAccountBudget, deleteBudget } from "@/actions/budget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AccountBudgetCard({
  account,
  accountTransaction,
  budgets,
}) {
  const router = useRouter();
  const accountBudget = budgets?.find((b) => b.categoryId === null) || null;

  const [editing, setEditing] = useState(false);
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [period, setPeriod] = useState("MONTHLY");

  // ================== SPENT & PROGRESS ==================

  const spent = accountTransaction.transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const budgetAmount = accountBudget?.amount || 0;

  const progress =
    budgetAmount > 0 ? Math.min((spent / budgetAmount) * 100, 100) : 0;

  // 🔹 Progress color logic
  const progressColor =
    progress < 50
      ? "bg-green-500"
      : progress < 90
        ? "bg-orange-500"
        : "bg-red-500";

  // ================== SYNC STATE (FIXED) ==================

  useEffect(() => {
    if (!accountBudget) return;

    setAmount(accountBudget.amount ?? "");

    setStartDate(
      accountBudget.startDate
        ? new Date(accountBudget.startDate).toISOString().slice(0, 10)
        : "",
    );

    setPeriod(accountBudget.period ?? "MONTHLY");
  }, [accountBudget]);

  // ================== ACTIONS ==================

  const handleSave = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Enter a valid budget amount");
      return;
    }

    if (!startDate) {
      toast.error("Start date is required");
      return;
    }

    if (!period) {
      toast.error("Select a budget period");
      return;
    }

    try {
      await upsertAccountBudget({
        accountId: account.id,
        amount: Number(amount),
        startDate,
        period,
      });

      toast.success("Account budget saved");
      setEditing(false);
    } catch (err) {
      toast.error("Failed to save budget");
    } finally {
      router.refresh();
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBudget(account.id, null);
      toast.success("Budget deleted");
    } catch (err) {
      toast.error("Failed to delete budget");
    } finally {
      router.refresh();
    }
  };

  // ================== UI ==================

  return (
    <div className="rounded-xl border p-5 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-base">
            Total Budget — {account.name}
          </h2>

          {accountBudget && (
            <p className="text-xs text-muted-foreground">
              {accountBudget.period} • Starting{" "}
              {new Date(accountBudget.startDate).toLocaleDateString()}
            </p>
          )}
        </div>

        {accountBudget && !editing && (
          <Button size="icon" variant="ghost" onClick={() => setEditing(true)}>
            <Pencil size={16} />
          </Button>
        )}
      </div>

      {/* ================= EDIT MODE ================= */}
      {editing ? (
        <div className="space-y-3">
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
            <Button variant="outline" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* ================= VIEW MODE ================= */}
          <div className="flex justify-between items-center">
            <p className="text-xl font-bold">
              {accountBudget ? `₹${budgetAmount}` : "No budget set"}
            </p>

            {!accountBudget && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditing(true)}
              >
                Set Budget
              </Button>
            )}
          </div>

          {accountBudget && (
            <>
              <div className="relative h-2 w-full rounded bg-muted overflow-hidden">
                <div
                  className={`h-full transition-all ${progressColor}`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between text-sm text-muted-foreground">
                <span>₹{spent} spent</span>
                <span className="font-medium">{progress.toFixed(1)}%</span>
              </div>

              <Button
                size="sm"
                variant="destructive"
                className="mt-2"
                onClick={handleDelete}
              >
                <Trash2 size={14} className="mr-1" />
                Delete Budget
              </Button>
            </>
          )}
        </>
      )}
    </div>
  );
}

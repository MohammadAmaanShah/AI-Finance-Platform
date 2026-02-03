"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteBudget } from "@/actions/budget";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CategoryBudgetCard({
  accountId,
  category,
  budget,
  spent,
}) {
  const router = useRouter();

  const progress =
    budget.amount > 0 ? Math.min((spent / budget.amount) * 100, 100) : 0;

  const progressColor =
    progress < 50
      ? "bg-green-500"
      : progress < 90
        ? "bg-orange-500"
        : "bg-red-500";

  const handleDelete = async () => {
    await deleteBudget(accountId, category.id);
    toast.success("Budget deleted");
    router.refresh();
  };

  return (
    <div className="max-w-md border rounded-xl p-4 space-y-3">
      <h3 className="font-semibold">{category.name}</h3>

      <p className="text-sm">
        ₹{spent} spent of ₹{budget.amount}
      </p>

      <div className="h-2 bg-muted rounded overflow-hidden">
        <div
          className={`h-full ${progressColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        {budget.period} • Starting{" "}
        {new Date(budget.startDate).toLocaleDateString()}
      </p>

      <Button size="sm" variant="destructive" onClick={handleDelete}>
        <Trash2 size={14} className="mr-1" />
        Delete Budget
      </Button>
    </div>
  );
}

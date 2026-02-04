"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CategoryBudgetCard({
  budget,
  transactions,
  deleteCategoryBudget,
}) {
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

  const router = useRouter();

  console.log(budget.id);

  let budgetId = budget.id;

  const spent = transactions

    .filter((tx) => tx.type === "EXPENSE")
    .filter((tx) => tx.categoryId === budget.categoryId)
    .filter((tx) =>
      isWithinBudgetPeriod(tx.date, budget.startDate, budget.period),
    )
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const remaining = budget.amount - spent;
  const progress = Math.min((spent / budget.amount) * 100, 100);

  const handleDelete = async () => {
    try {
      await deleteCategoryBudget(budgetId);

      toast.success("Category Budget Deleted Sucessfully");
    } catch (error) {
      toast.error("Failed to delete ");
    } finally {
      router.refresh();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{budget.categoryName}</span>
          <span className="text-sm text-muted-foreground">{budget.period}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 ">
        <div className="text-sm">
          <p>Budget: ₹{budget.amount}</p>
          <p>Spent: ₹{spent}</p>
          <p
            className={
              remaining < 0 ? "text-red-500 font-semibold" : "text-green-600"
            }
          >
            Remaining: ₹{remaining}
          </p>
        </div>

        <Progress value={progress} />

        {remaining < 0 && (
          <p className="text-xs text-red-500">
            You’ve exceeded this category budget
          </p>
        )}
        <div className="w-full flex justify-end" onClick={() => handleDelete()}>
          <Trash size={18} className="text-red-600 cursor-pointer " />
        </div>
      </CardContent>
    </Card>
  );
}

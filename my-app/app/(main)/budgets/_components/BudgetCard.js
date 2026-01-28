import { Pencil, Trash2 } from "lucide-react";

export default function BudgetCard({ budget, onEdit, onDelete }) {
  return (
    <div className="relative rounded-xl border p-4 bg-background">
      {/* Top-right actions */}
      <div className="absolute top-3 right-3 flex gap-2">
        <button
          onClick={() => onEdit(budget)}
          className="text-muted-foreground hover:text-foreground"
          title="Edit budget"
        >
          <Pencil size={16} />
        </button>

        <button
          onClick={() => onDelete(budget)}
          className="text-red-500 hover:text-red-600"
          title="Delete budget"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <h3 className="font-semibold">
        {budget.account.name}
        {budget.category ? ` – ${budget.category.name}` : " – Overall"}
      </h3>

      <div className="mt-3 h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${budget.percentage}%` }}
        />
      </div>

      <div className="mt-2 flex justify-between text-sm text-muted-foreground">
        <span>₹{budget.spent}</span>
        <span>₹{budget.amount}</span>
      </div>
    </div>
  );
}

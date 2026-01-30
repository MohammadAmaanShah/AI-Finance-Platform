"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BudgetHeader({ accounts, selectedAccountId }) {
  const router = useRouter();

  const handleChange = (value) => {
    router.push(`/budgets?account=${value}`);
    router.refresh(); // 🔥 THIS IS THE FIX
  };

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">Budgets</h1>

      <Select value={selectedAccountId} onValueChange={handleChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select account" />
        </SelectTrigger>
        <SelectContent>
          {accounts.map((acc) => (
            <SelectItem key={acc.id} value={acc.id}>
              {acc.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

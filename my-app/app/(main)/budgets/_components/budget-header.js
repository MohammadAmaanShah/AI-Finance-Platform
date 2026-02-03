"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useParams, useRouter } from "next/navigation";

export default function AccountSelect({ accounts, defaultAcc }) {
  const [selectedAccount, setSelectedAccount] = useState(defaultAcc);

  const router = useRouter();

  const handleChange = (accountId) => {
    const acc = accounts.find((a) => a.id === accountId);
    setSelectedAccount(acc);
    router.push(`/budgets/${acc.id}`);
  };

  return (
    <Select value={selectedAccount?.id} onValueChange={handleChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select account" />
      </SelectTrigger>

      <SelectContent>
        {accounts?.map((acc) => (
          <SelectItem key={acc.id} value={acc.id}>
            {acc.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

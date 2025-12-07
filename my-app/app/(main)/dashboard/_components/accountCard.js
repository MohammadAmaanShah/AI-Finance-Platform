import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const AccountCard = ({ account }) => {
  const { name, id, balance, isDefault, type } = account;

  return (
    <Card className='hover:shadow-md transition-shadow group relative'>
      <Link href={`/account/${id}`}>
        <CardHeader className='flex flex-row justify-between  items-center space-y-0 pb-2'>
          <CardTitle  className='text-sm capitalize font-medium'>{name}</CardTitle>
          <Switch />
          {/* <CardAction>Card Action</CardAction> */}
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{parseFloat(balance).toFixed(2)}</p>
          <p className="text-muted-foreground text-xs">
            {type.charAt(0) + type.slice(1).toLowerCase()}
          </p>
        </CardContent>
        <CardFooter>
          <div className="flex items-center">
            {" "}
            <ArrowUpRight className="h-4 w-3 mr-1 text-green-500" />
            Income
          </div>
          <div className="flex items-center">
            {" "}
            <ArrowDownRight className="h-4 w-3 mr-1 text-red-500" />
            Expense
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default AccountCard;

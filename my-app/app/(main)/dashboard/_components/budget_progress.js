"use client";
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
import { Pencil, Check, X } from "lucide-react";
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { updateBudget } from "@/actions/budget";
import useFetch from "@/hooks/useFetch";
import { toast } from "sonner";

const BudgetProgress = ({ initialBudget, currentExpenses }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || 0
  );

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);
  const precentageUsed = initialBudget
    ? (currentExpenses / initialBudget.amount) * 100
    : 0;

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    await updateBudgetFn(amount);
  };
console.log(updateBudget)

useEffect(() => {
  if (updatedBudget) {
    setIsEditing(false);
    toast.success("Budget updated successfully");
  }
}, [updatedBudget]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget");
    }
  }, [error]);

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount.toString() || "");
    setIsEditing(false);
  };

  return (
    <div className="mb-6">
      <Card>
        <div className="flex-1">
          <CardHeader>
            <CardTitle>Monthly Budget(default Account)</CardTitle>

            <div className="flex items-center  gap-2 mt-1 ">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-32"
                    placeholder="Enter amount"
                    autoFocus
                    disabled={isLoading}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleUpdateBudget}
                    className={"cursor-pointer"}
                  >
                    <Check className=" h-4 w-4 text-green-500 " />
                  </Button>

                  <Button
                    className={"cursor-pointer"}
                    variant="ghost "
                    size="icon"
                    onClick={handleCancel}
                  >
                    <X className="h-4 w-4  text-red-500 " />
                  </Button>
                </div>
              ) : (
                <></>
              )}
            </div>
            <CardDescription>
              {" "}
              {initialBudget
                ? `$${currentExpenses?.toFixed(
                    2
                  )} of $${initialBudget.amount.toFixed(2)} spent`
                : "No budget set"}
            </CardDescription>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="h-6 w-6 cursor-pointer"
            >
              <Pencil className="h-3 w-3" />
            </Button>
            {/* <CardAction>Card Action</CardAction> */}
          </CardHeader>
        </div>
        <CardContent>
          {initialBudget &&<div className="space-y-2">
            <Progress
              value={precentageUsed}
              extraStyles={`${
                // add to Progress component
                precentageUsed >= 90
                  ? "bg-red-500"
                  : precentageUsed >= 75
                    ? "bg-yellow-500"
                    : "bg-green-500"
              }`}
            />
            <p className="text-xs text-muted-foreground text-right">
              {precentageUsed.toFixed(1)}% used
            </p>
          </div>
}
        </CardContent>
       
      </Card>
    </div>
  );
};

export default BudgetProgress;

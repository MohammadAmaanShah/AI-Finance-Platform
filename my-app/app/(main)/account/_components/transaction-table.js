"use client";
import { useState } from "react";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { categoryColors } from "@/data/categories";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Chevron } from "react-day-picker";
const TransactionTable = ({ transactions }) => {
  const filteredAndSortedTransactions = transactions;

  const router = useRouter();

  const [selectedId, setSelectedId] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "desc",
    direction: "desc",
  });

  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field == field && current.direction === "asc" ? "desc" : "asc",
    }));
  };
  return (
    <div className="space-y-4">
      <div className="border rounded-md ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => {
                  handleSort("data");
                }}
              >
                <div className="flex items-center">
                  Date
                  {sortConfig.field === "date" &&
                  sortConfig.direction == "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => {
                  handleSort("category");
                }}
              >
                <div className="flex items-center">Category</div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => {
                  handleSort("amount");
                }}
              >
                <div className="flex items-center justify-end">Amount</div>
              </TableHead>

              <TableHead>Recurring</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  Not Transactions Yet
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedTransactions.map((transaction) => {
                return (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      {format(new Date(transaction.date), "PP")}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="capitalize">
                      <span
                        style={{
                          background: categoryColors[transaction.category],
                        }}
                        className="px-2 py-1 rounded text-white text-sm "
                      >
                        {transaction.category}
                      </span>
                    </TableCell>
                    <TableCell
                      className="text-right font-medium"
                      style={{
                        color: transaction.type == "EXPENSE" ? "red" : "green",
                      }}
                    >
                      {transaction.type == "EXPENSE" ? "-" : "+"}

                      {transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {transaction.isRecurring ? (
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant="outline"
                              className="gap-1 bg-purple-100 hover:bg-purple-200 text-purple-700"
                            >
                              <RefreshCw className="h-3 w-3 " />
                              {transaction.recurringInterval}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div>
                              <div className="text-sm">Next Date:</div>
                              <div className="font-medium">
                                {format(
                                  new Date(transaction.nextRecurringDate),
                                  "PP"
                                )}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Badge variant="outline" className="gap-1">
                          <Clock className="h-3 w-3 " />
                          One-Time
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu asChild>
                        <DropdownMenuTrigger>
                          {" "}
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel
                            className="cursor-pointer"
                            onClick={() => {
                              router.push(
                                `transaction/create?edit=${transaction.id}`
                              );
                            }}
                          >
                            Edit
                          </DropdownMenuLabel>
                          <DropdownMenuItem
                            className="text-destructive"
                            // onClick={() => deleteFn([transaction.id])}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionTable;

"use client";
import { useEffect, useMemo, useState } from "react";
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
import { compareAsc, format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { categoryColors } from "@/data/categories";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Search,
  SearchCheck,
  Trash,
} from "lucide-react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Chevron } from "react-day-picker";
import { Input } from "@/components/ui/input";
import { resume } from "react-dom/server";
import { BarLoader } from "react-spinners";
import { bulkDeleteTransactions } from "@/actions/account";
import useFetch from "@/hooks/useFetch";
import { toast } from "sonner";
const TransactionTable = ({ transactions }) => {
  // let filteredAndSortedTransactions = transactions;

  const router = useRouter();

  const [selectedId, setSelectedId] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });

  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field == field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelectAll = () => {
    setSelectedId((current) =>
      current.length == filteredAndSortedTransactions.length
        ? []
        : filteredAndSortedTransactions.map((i) => i.id)
    );
  };
  const handleSelect = (id) => {
    setSelectedId((current) =>
      current.includes(id)
        ? current.filter((item) => item != id)
        : [...current, id]
    );
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");

  console.log(recurringFilter);

  useEffect(() => {
    console.log(recurringFilter);
  }, [recurringFilter]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    // setSelectedId([]);
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((transaction) => {
        return transaction.category?.toLowerCase().includes(searchLower);
      });
    }

    if (recurringFilter) {
      result = result.filter((trans) => {
        if (recurringFilter === "recurring") return trans.isRecurring;
        return !trans.isRecurring;
      });
    }
    if (typeFilter) {
      result = result.filter((trans) => {
        return trans.type == typeFilter;
      });
    }

    // apply sorting/

    result.sort((a, b) => {
      let comparison = 0;

      switch (sortConfig.field) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;

        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transactions, typeFilter, searchTerm, recurringFilter, sortConfig]);

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
  } = useFetch(bulkDeleteTransactions);

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedId.length} transactions?`
      )
    )
      return;

    deleteFn(selectedId);
    setSelectedId([]);
  };
  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.success("Transactions deleted successfully");
    }
  }, [deleted, deleteLoading]);

  return (
    <div className="space-y-4 px-7">
      {deleteLoading && (
        <BarLoader className="mt-4" color="#9333ea" width={"100%"} />
      )}
      {/* Filter */}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="search transaction"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
        </div>
        <div className="flex gap-2 ">
          <Select
            value={typeFilter}
            onValueChange={(value) => setTypeFilter(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={recurringFilter}
            onValueChange={(value) => setRecurringFilter(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Trasctions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recurring"> Recurring Only</SelectItem>
              <SelectItem value="non-recurring"> Non-Recurring Only</SelectItem>
            </SelectContent>
          </Select>

          {selectedId.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Selected {selectedId.length}
              </Button>
            </div>
          )}

          {(searchTerm || typeFilter || recurringFilter) && (
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={handleClearFilters}
              title="Clear Filters"
            >
              <X className="h-4 w-4 " />
            </Button>
          )}
        </div>
      </div>

      {/* Transactions */}
      <div className="border rounded-md ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  onCheckedChange={handleSelectAll}
                  checked={
                    selectedId.length ===
                      filteredAndSortedTransactions.length &&
                    filteredAndSortedTransactions.length > 0
                  }
                />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => {
                  handleSort("date");
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
                <div className="flex items-center">
                  Category
                  {sortConfig.field === "category" &&
                  sortConfig.direction == "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => {
                  handleSort("amount");
                }}
              >
                <div className="flex items-center justify-end">
                  Amount
                  {sortConfig.field === "amount" &&
                  sortConfig.direction == "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
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
                      <Checkbox
                        onCheckedChange={() => handleSelect(transaction.id)}
                        checked={selectedId.includes(transaction.id)}
                      />
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
                            onClick={() => deleteFn([transaction.id])}
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

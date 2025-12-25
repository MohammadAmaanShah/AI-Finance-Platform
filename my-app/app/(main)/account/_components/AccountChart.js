"use client";

import { useState, useEffect, useMemo } from "react";

import { endOfDay, format, startOfDay, subDays } from "date-fns";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { date, includes } from "zod";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};
const AccountChart = ({ transactions }) => {
  const [dataRange, setDataRange] = useState("1M");

  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dataRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    const filtered = transactions.filter(
      (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    const grouped = filtered.reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), "MMM dd");

      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 };
      }

      if (transaction.type === "INCOME") {
        acc[date].income += transaction.amount;
      } else {
        acc[date].expense += transaction.amount;
      }

      return acc;
    }, {});
    return Object.values(grouped).sort((a, b) => {
      new Date(a.date) - new Date(b.date);
    });
  }, [transactions, dataRange]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      { income: 0, expense: 0 }
    );
  }, [filteredData]);

  return (
    <div className="px-6 mb-4">
      <Card>
        <CardHeader className="flex  flex-row items-center justify-between pb-7 space-y-0">
          <CardTitle>Transactions Overwiew</CardTitle>
          <Select defaultValue={dataRange} onValueChange={setDataRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DATE_RANGES).map(([key, { label }]) => {
                return (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                responsive
                data={filteredData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis
                  width="auto"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="income"
                  // fill="#82ca9d"
                  fill="#22c55e"
                  // activeBar={{ fill: "pink", stroke: "blue" }}
                  radius={[10, 10, 0, 0]}
                />
                <Bar
                  dataKey="expense"
                  // fill="#8999e9"
                  fill="#dd2d4a"
                  // activeBar={{ fill: "gold", stroke: "purple" }}
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <div className="flex justify-around mb-6 text-sm">
          <div className="text-center">
            <p className="text-muted-foreground">Total Income</p>
            <p className="text-lg font-bold text-green-500">
              {`${totals.income.toFixed(2)}`}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Total Expnese</p>
            <p className="text-lg font-bold text-red-500">
              {`${totals.expense.toFixed(2)}`}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Net</p>
            <p
              className={`text-lg font-bold ${
                totals.income - totals.expense >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {`${(totals.income - totals.expense).toFixed(2)}`}
            </p>
          </div>
        </div>
      </Card>{" "}
    </div>
  );
};

export default AccountChart;

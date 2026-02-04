// "use client";

// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { CalendarIcon, Loader2 } from "lucide-react";
// import { format } from "date-fns";
// import { useRouter, useSearchParams } from "next/navigation";
// import { toast } from "sonner";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Switch } from "@/components/ui/switch";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import { cn } from "@/lib/utils";

// import useFetch from "@/hooks/useFetch";
// import { createTransaction, updateTransaction } from "@/actions/transaction";
// import { transactionSchema } from "@/app/lib/schema";

// export function AddTransactionForm({
//   accounts,
//   categories, // ✅ BACKEND CATEGORIES
//   editMode = false,
//   initialData = null,
// }) {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const editId = searchParams.get("edit");

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     reset,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(transactionSchema),
//     defaultValues:
//       editMode && initialData
//         ? {
//             type: initialData.type,
//             amount: initialData.amount.toString(),
//             description: initialData.description || "",
//             accountId: initialData.accountId.toString(),
//             categoryId: initialData.categoryId.toString(), // ✅
//             date: new Date(initialData.date),
//             isRecurring: initialData.isRecurring,
//             recurringInterval: initialData.recurringInterval || undefined,
//           }
//         : {
//             type: "EXPENSE",
//             amount: "",
//             description: "",
//             accountId: accounts.find((a) => a.isDefault)?.id?.toString() || "",
//             categoryId: "",
//             date: new Date(),
//             isRecurring: false,
//           },
//   });

//   const {
//     fn: transactionFn,
//     loading,
//     data: result,
//   } = useFetch(editMode ? updateTransaction : createTransaction);

//   // 👀 watch values
//   const type = watch("type");
//   const accountId = watch("accountId");
//   const categoryId = watch("categoryId");
//   const isRecurring = watch("isRecurring");
//   const recurringInterval = watch("recurringInterval");
//   const date = watch("date");

//   const onSubmit = (data) => {
//     const payload = {
//       ...data,
//       amount: Number(data.amount), // ✅ backend-friendly
//     };

//     editMode ? transactionFn(editId, payload) : transactionFn(payload);
//   };

//   useEffect(() => {
//     if (result?.success && !loading) {
//       toast.success(
//         editMode
//           ? "Transaction updated successfully"
//           : "Transaction created successfully",
//       );
//       reset();
//       router.push(`/account/${result.data.accountId}`);
//     }
//   }, [result, loading, editMode, reset, router]);

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//       {/* Type (INDEPENDENT) */}
//       <div>
//         <label className="text-sm font-medium">Type</label>
//         <Select value={type} onValueChange={(v) => setValue("type", v)}>
//           <SelectTrigger>
//             <SelectValue placeholder="Select type" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="EXPENSE">Expense</SelectItem>
//             <SelectItem value="INCOME">Income</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Amount */}
//       <div>
//         <label className="text-sm font-medium">Amount</label>
//         <Input type="number" {...register("amount")} />
//         {errors.amount && (
//           <p className="text-sm text-red-500">{errors.amount.message}</p>
//         )}
//       </div>

//       {/* Account */}
//       <div>
//         <label className="text-sm font-medium">Account</label>
//         <Select
//           value={accountId}
//           onValueChange={(v) => setValue("accountId", v)}
//         >
//           <SelectTrigger>
//             <SelectValue placeholder="Select account" />
//           </SelectTrigger>
//           <SelectContent>
//             {accounts.map((acc) => (
//               <SelectItem key={acc.id} value={acc.id.toString()}>
//                 {acc.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       {/* ✅ CATEGORY (ALL BACKEND CATEGORIES) */}
//       <div>
//         <label className="text-sm font-medium">Category</label>
//         <Select
//           value={categoryId}
//           onValueChange={(v) => setValue("categoryId", v)}
//         >
//           <SelectTrigger>
//             <SelectValue placeholder="Select category" />
//           </SelectTrigger>
//           <SelectContent>
//             {categories.map((cat) => (
//               <SelectItem key={cat.id} value={cat.id}>
//                 {cat.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         {errors.categoryId && (
//           <p className="text-sm text-red-500">{errors.categoryId.message}</p>
//         )}
//       </div>

//       {/* Date */}
//       <div>
//         <label className="text-sm font-medium">Date</label>
//         <Popover>
//           <PopoverTrigger asChild>
//             <Button
//               variant="outline"
//               className={cn(
//                 "w-full text-left",
//                 !date && "text-muted-foreground",
//               )}
//             >
//               {date ? format(date, "PPP") : "Pick a date"}
//               <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="p-0">
//             <Calendar
//               mode="single"
//               selected={date}
//               onSelect={(d) => setValue("date", d)}
//             />
//           </PopoverContent>
//         </Popover>
//       </div>

//       {/* Description */}
//       <Input placeholder="Description" {...register("description")} />

//       {/* Recurring */}
//       <div className="flex items-center justify-between border p-4 rounded-lg">
//         <div>
//           <p className="font-medium">Recurring</p>
//           <p className="text-sm text-muted-foreground">
//             Repeat this transaction
//           </p>
//         </div>
//         <Switch
//           checked={isRecurring}
//           onCheckedChange={(v) => setValue("isRecurring", v)}
//         />
//       </div>

//       {isRecurring && (
//         <Select
//           value={recurringInterval}
//           onValueChange={(v) => setValue("recurringInterval", v)}
//         >
//           <SelectTrigger>
//             <SelectValue placeholder="Select interval" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="DAILY">Daily</SelectItem>
//             <SelectItem value="WEEKLY">Weekly</SelectItem>
//             <SelectItem value="MONTHLY">Monthly</SelectItem>
//             <SelectItem value="YEARLY">Yearly</SelectItem>
//           </SelectContent>
//         </Select>
//       )}

//       <Button type="submit" disabled={loading}>
//         {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//         {editMode ? "Update Transaction" : "Create Transaction"}
//       </Button>
//     </form>
//   );
// }
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2, Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import { cn } from "@/lib/utils";
import useFetch from "@/hooks/useFetch";
import { createTransaction, updateTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";

export function AddTransactionForm({
  accounts,
  categories,
  editMode = false,
  initialData = null,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues:
      editMode && initialData
        ? {
            type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description || "",
            accountId: initialData.accountId.toString(),
            categoryId: initialData.categoryId.toString(),
            date: new Date(initialData.date),
            isRecurring: initialData.isRecurring,
            recurringInterval: initialData.recurringInterval || undefined,
          }
        : {
            type: "EXPENSE",
            amount: "",
            description: "",
            accountId: accounts.find((a) => a.isDefault)?.id?.toString() || "",
            categoryId: "",
            date: new Date(),
            isRecurring: false,
          },
  });

  const {
    fn: transactionFn,
    loading,
    data: result,
  } = useFetch(editMode ? updateTransaction : createTransaction);

  const type = watch("type");
  const accountId = watch("accountId");
  const categoryId = watch("categoryId");
  const isRecurring = watch("isRecurring");
  const recurringInterval = watch("recurringInterval");
  const date = watch("date");

  const onSubmit = (data) => {
    const payload = { ...data, amount: Number(data.amount) };
    editMode ? transactionFn(editId, payload) : transactionFn(payload);
  };

  useEffect(() => {
    if (result?.success && !loading) {
      toast.success(
        editMode
          ? "Transaction updated successfully"
          : "Transaction created successfully",
      );
      reset();
      router.push(`/account/${result.data.accountId}`);
    }
  }, [result, loading, editMode, reset, router]);

  return (
    <div className="flex justify-center py-10">
      <div className="w-full max-w-xl">
        {/* CARD */}
        <div className="rounded-2xl border bg-background p-6 shadow-sm">
          {/* HEADER */}
          <div className="mb-6 space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Add Transaction
            </h1>
            <p className="text-sm text-muted-foreground">
              Record your income or expense for accurate tracking
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* TYPE + ACCOUNT */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Type</label>
                <Select value={type} onValueChange={(v) => setValue("type", v)}>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                    <SelectItem value="INCOME">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 w-full">
                <label className="text-sm font-medium">Account</label>
                <Select
                  value={accountId}
                  onValueChange={(v) => setValue("accountId", v)}
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id.toString()}>
                        {acc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* AMOUNT */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                className="h-11"
                {...register("amount")}
                placeholder="1000"
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount.message}</p>
              )}
            </div>

            {/* CATEGORY */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Category</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "h-11 w-full justify-between",
                      !categoryId && "text-muted-foreground",
                    )}
                  >
                    {categoryId
                      ? categories.find((c) => c.id === categoryId)?.name
                      : "Select category"}
                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                      {categories.map((cat) => (
                        <CommandItem
                          key={cat.id}
                          value={cat.name}
                          onSelect={() => setValue("categoryId", cat.id)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              categoryId === cat.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {cat.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* DATE */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-11 w-full justify-start font-normal"
                  >
                    {date ? format(date, "PPP") : "Pick a date"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => setValue("date", d)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* DESCRIPTION */}
            <Input
              className="h-11"
              placeholder="Description"
              {...register("description")}
            />

            {/* RECURRING */}
            <div className="flex items-center justify-between rounded-xl border bg-muted/40 p-4">
              <div>
                <p className="font-medium">Recurring</p>
                <p className="text-sm text-muted-foreground">
                  Repeat this transaction
                </p>
              </div>
              <Switch
                checked={isRecurring}
                onCheckedChange={(v) => setValue("isRecurring", v)}
              />
            </div>

            {isRecurring && (
              <Select
                value={recurringInterval}
                onValueChange={(v) => setValue("recurringInterval", v)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAILY">Daily</SelectItem>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* SUBMIT */}
            <Button
              type="submit"
              className="h-11 w-full rounded-xl text-base font-medium"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editMode ? "Update Transaction" : "Create Transaction"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

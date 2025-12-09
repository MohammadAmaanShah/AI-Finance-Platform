"use client";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
export function InputDemo() {
  return <Input type="email" placeholder="Email" />;
}
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema } from "@/app/lib/schema";

import { Switch } from "@/components/ui/switch";
import { createAccount } from "@/actions/dashboard";
import useFetch from "@/hooks/useFetch";
import { toast } from "sonner";

const CreateAccountDrawer = ({ children }) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefalult: false,
    },
  });

  const {
    data: newAccount,
    error,
    fn: createAccountFn,
    loading: createAccountLoading,
  } = useFetch(createAccount);

  const onSubmit = async (data) => {
    console.log(data);
    await createAccountFn(data);
  };

  useEffect(() => {
    if (newAccount && !createAccountLoading) {
      toast.success("Account Added successfully");
      setOpen(false), reset();
      router.refresh();
    }
  }, [createAccountLoading, newAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to ceate Account");
      setOpen(false);
    }
  }, [error]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label htmlFor="name" className="font-medium text-sm">
                {" "}
                Account Name
              </label>
              <Input
                id="name"
                placeholder="e.g., Main Checking"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="type"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Account Type
              </label>

              <Select
                onValueChange={(value) => setValue("type", value)}
                defaultValue={watch("type")}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CURRENT">Current</SelectItem>
                  <SelectItem value="SAVINGS">Savings</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-t00">{errors.type.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="balance" className="font-medium text-sm">
                {" "}
                Initial balance
              </label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("balance")}
              />
              {errors.balance && (
                <p className="text-sm text-red-500">{errors.balance.message}</p>
              )}
            </div>
            <div className="space-y-2 flex items-center border p-3 justify-between  rounded-lg ">
              <div>
                {" "}
                <label
                  htmlFor="idDefault"
                  className="font-medium text-sm cursor-pointer"
                >
                  {" "}
                  Set as default
                </label>
                <p className="text-muted-foregrounded    text-sm">
                  This account will be selected as dfault for transactions
                </p>
              </div>
              <Switch
                id="idDefault"
                onCheckedChange={(checked) => {
                  setValue("type", checked);
                }}
                checked={watch("isDefault")}
              />
            </div>
            <div className="flex gap-4 pt-4 ">
              <DrawerClose asChild>
                <Button variant="outline" type="button" className="flex-1">
                  Cancel
                </Button>
              </DrawerClose>
              <Button type="submit" className=" flex-1">
                {createAccountLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateAccountDrawer;

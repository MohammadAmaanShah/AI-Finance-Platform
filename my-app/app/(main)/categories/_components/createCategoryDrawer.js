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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import React from "react";
import { Input } from "@/components/ui/input";

const CreateCategoryDrawer = ({
  isOpen,
  onClose,
  createCategoryFn,
  isLoading,
}) => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createCategoryFn(name);
  };

  return (
    <div>
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="my-4 px-3">
          <DrawerHeader>
            <DrawerTitle>Create New Category</DrawerTitle>
          </DrawerHeader>
          <DrawerFooter>
            <form className="space-y-3" onSubmit={(e) => handleSubmit(e)}>
              <Input
                placeholder="Enter new category"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <Button className="w-full" type="submit">
                Submit
              </Button>
            </form>
          </DrawerFooter>
          <DrawerClose asChild>
            <Button disabled={isLoading} variant="outline">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default CreateCategoryDrawer;

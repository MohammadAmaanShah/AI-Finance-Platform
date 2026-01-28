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
import { useEffect, useEffectEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import React from "react";
import { Input } from "@/components/ui/input";
import { updateCatagory } from "@/actions/category";
import useFetch from "@/hooks/useFetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
const EditCategoryDrawer = ({
  isOpenEdit,
  onCloseEdit,
  selectedId,
  editName,
}) => {
  const [newName, setNewName] = useState("");

  const {
    data: editData,
    error: error,
    loading: isEditLoading,
    fn: editFn,
  } = useFetch(updateCatagory);

  const router = useRouter();
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    console.log("great");
    await editFn(selectedId, newName);
  };

  useEffect(() => {
    if (editData && !isEditLoading) {
      toast.success("Category Updated Successfuly");
      onCloseEdit();
      setNewName("");
      router.refresh();
    }
  }, [editData]);

  useEffect(() => {
    if (error && !isEditLoading) {
      toast.success("Falied To Update Category ");
      onCloseEdit();
      setNewName("");
    }
  }, [error]);

  useEffect(() => {
    setNewName(editName);
  }, [isOpenEdit]);

  return (
    <div>
      <div>
        <Drawer open={isOpenEdit} onOpenChange={onCloseEdit}>
          <DrawerContent className="my-4 px-3">
            <DrawerHeader>
              <DrawerTitle>Edit Category</DrawerTitle>
            </DrawerHeader>
            <DrawerFooter>
              <form className="space-y-3" onSubmit={(e) => handleEditSubmit(e)}>
                <Input
                  placeholder="Rename Category"
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                  }}
                />
                <Button className="w-full" type="submit">
                  Submit
                </Button>
              </form>
            </DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default EditCategoryDrawer;

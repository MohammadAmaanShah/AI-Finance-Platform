"use client";

import React, { useEffect } from "react";
import { useState } from "react";
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
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import CreateCategoryDrawer from "./createCategoryDrawer";
import useFetch from "@/hooks/useFetch";
import { createCategory } from "@/actions/category";
import { useRouter } from "next/navigation";
import { deleteCategory } from "@/actions/category";
import EditCategoryDrawer from "./editCategoryDrawer";
import { Plus } from "lucide-react";
const CategoryPage = ({ categories }) => {
  // const [category, setCategory] = useState(categories);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editName, setEditName] = useState("");

  const router = useRouter();

  const {
    loading: isLoading,
    fn: createCategoryFn,
    data: newCategory,
    error: error,
  } = useFetch(createCategory);

  useEffect(() => {
    if (newCategory?.success && !isLoading) {
      // setCategory(...categories, newCategory);

      setIsDrawerOpen(false);

      toast.success("Catagory Created Successfully");
    }
  }, [newCategory]);

  useEffect(() => {
    setIsDrawerOpen(false);
    if (error) {
      toast.error(error.message || "Failed to Create Category ");
    }
  }, [error]);

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
    error: deleteError,
  } = useFetch(deleteCategory);

  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.success("Category deleted successfully");
      router.refresh();
    }
  }, [deleted]);

  useEffect(() => {
    return () => {
      if (deleteError && !deleteLoading) {
        toast.error(error.message || "Failed to Delete Category ");
      }
    };
  }, [deleteError]);

  const handleEditClick = (id, name) => {
    setIsEditDrawerOpen(true);
    setSelectedCategory(id);
    setEditName(name);
  };

  return (
    <div className=" h-screen  ">
      <div className="flex justify-between  itew-full items-center px-2">
        <h1 className="text-4xl md:text-7xl  gradient gradient-title md:ml-6 ">
          Categories
        </h1>
        <Button
          className="cursor-pointer"
          onClick={() => setIsDrawerOpen(true)}
        >
          <Plus size={18} />
          Add Category
        </Button>
      </div>

      <div className="px-6 py-3 mt-5 border-2 border-gray-300 rounded-2xl">
        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="text-xl font-semibold">Name</TableHead>

              <TableHead className="text-right text-xl font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories &&
              categories.map((item, key) => {
                return (
                  <TableRow key={key}>
                    <TableCell className="font-medium">{item.name}</TableCell>

                    <TableCell className="text-right">
                      {item.userId ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuGroup>
                              <DropdownMenuItem
                                onClick={() => {
                                  handleEditClick(item.id, item.name);
                                }}
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => deleteFn(item.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <div className="text-muted-foreground text-sm">
                          Default
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
      <CreateCategoryDrawer
        isOpen={isDrawerOpen}
        createCategoryFn={createCategoryFn}
        isLoading={isLoading}
        onClose={() => setIsDrawerOpen(false)}
      />
      <EditCategoryDrawer
        isOpenEdit={isEditDrawerOpen}
        onCloseEdit={() => setIsEditDrawerOpen(false)}
        selectedId={selectedCategory}
        editName={editName}
      />
    </div>
  );
};

export default CategoryPage;

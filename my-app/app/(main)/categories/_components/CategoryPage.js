"use client";

import React from "react";
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
const CategoryPage = ({ categories }) => {
  const [category, setCategory] = useState(categories);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className=" h-screen  ">
      <div className="flex justify-between  itew-full items-center">
        <h1 className="text-4xl md:text-7xl  gradient gradient-title ml-6">
          Categories
        </h1>
        <Button>Add Category</Button>
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
            {category.map((item, key) => {
              return (
                <TableRow key={key}>
                  <TableCell className="font-medium">{item.name}</TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuGroup>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <CreateCategoryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};

export default CategoryPage;

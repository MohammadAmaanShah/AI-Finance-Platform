import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserAvatar,
  UserButton,
} from "@clerk/nextjs";
import { LayoutDashboard, PenBox, Wallet } from "lucide-react";
import { getUserAccounts } from "@/actions/dashboard";
import { Layers } from "lucide-react";
import { checkUser } from "@/lib/checkUser";

const Header = async () => {
  let user = await checkUser();
  if (user) {
    var { id } = user;
  }

  if (id) {
    let accounts = await getUserAccounts();
    var defaultAccount = accounts.find((acc) => acc.isDefault);
  }

  // console.log(user);

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <Image
            src={"/logo.png"}
            alt="Welth Logo"
            width={200}
            height={60}
            className="h-12 w-auto object-contain"
          />
        </Link>
        <div className="flex gap-2  ">
          {id && (
            <div className="hidden md:flex gap-2">
              <SignedIn>
                <Link
                  href={"/dashboard"}
                  className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
                >
                  <Button variant="outline" className="hover:text-blue-600">
                    <LayoutDashboard size={18} />
                    <span className="hidden md:inline">Dashboard</span>
                  </Button>
                </Link>
                <Link href={"/categories"}>
                  <Button
                    variant={"outline"}
                    className="flex items-center gap-2 "
                  >
                    <Layers size={18} />
                    <span className="hidden md:inline">Categories</span>
                  </Button>
                </Link>
                <Link
                  href={`/budgets/${defaultAccount?.id}`}
                  className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
                >
                  <Button variant="outline" className="hover:text-blue-600">
                    <Wallet size={18} />
                    <span className="hidden md:inline">Budgets</span>
                  </Button>
                </Link>

                <Link href={"/transaction/create"}>
                  <Button className="flex items-center gap-2 ">
                    <PenBox size={18} />
                    <span className="hidden md:inline"> Add Transaction</span>
                  </Button>
                </Link>
              </SignedIn>
            </div>
          )}
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline"> Login</Button>
            </SignInButton>

            {/* <SignUpButton></SignUpButton> */}
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "!w-10 !h-10",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;

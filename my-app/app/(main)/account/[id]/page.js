import { getAccountWithTransactions } from "@/actions/account";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import TransactionTable from "../_components/transaction-table";
import { BarLoader } from "react-spinners";
import AccountChart from "../_components/AccountChart";
const Accountpage = async ({ params }) => {
  const { id } = await params;

  const accountData = await getAccountWithTransactions(id);

  const { transactions, ...account } = accountData;
  console.log(account.name);

  if (!accountData) {
    notFound();
  }
  return (
    <div>
      <div className="space-y-8 px-7">
        <div className="flex gap-4 items-end justify-between">
          <div>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient gradient-title capitalize">
              {account.name}
            </h1>
            <p className="text-muted-foreground">
              {account.type.charAt(0) + account.type.slice(1).toLowerCase()}{" "}
              Account
            </p>
          </div>

          <div className="text-right pb-2">
            <div className="text-xl sm:text-2xl font-bold">
              ${parseFloat(account.balance).toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">
              {account._count.transactions} Transactions
            </p>
          </div>
        </div>
      </div>

      {/* {chart section } */}
      <Suspense
        fallback={<BarLoader className="mt-4" color="#9333ea" width={"100%"} />}
      >
        <AccountChart transactions={transactions} />
      </Suspense>
      {/* tansactionstable */}

      <Suspense
        fallback={<BarLoader className="mt-4" color="#9333ea" width={"100%"} />}
      >
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>
  );
};

export default Accountpage;

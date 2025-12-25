import React from "react";
import CreateAccountDrawer from "@/components/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Currency, Plus } from "lucide-react";
import { getUserAccounts } from "@/actions/dashboard";
import AccountCard from "./_components/accountCard";
import { getCurrentBudget } from "@/actions/budget";
import BudgetProgress from "./_components/budget_progress";
const DashboardPage = async () => {
  const accounts = await getUserAccounts();

  const defaultAccount = accounts?.find((account) => account.isDefault);

  let budgetData = null;

  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  
  return (
    <div className="px-5 ">
      {/* {budget Progress} */}

      {defaultAccount && (
        <BudgetProgress
          initialBudget={budgetData?.budget}
          currentExpenses={budgetData?.currentExpenses || 0}
        />
      )}

      {/* {overview} */}
      {/* {Account grid} */}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
        <div>
          <CreateAccountDrawer>
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
              <CardContent className=" flex flex-col items-center justify-center text-muted-foreground  h-full pt-5">
                <Plus className="h-10 w-10 mb-2" />
                <p className="text-sm font-medium">Add new Account</p>
              </CardContent>
            </Card>
          </CreateAccountDrawer>
        </div>

        {accounts.length > 0 &&
          accounts.map((account) => {
            return <AccountCard key={account.id} account={account} />;
          })}
      </div>
    </div>
  );
};

export default DashboardPage;

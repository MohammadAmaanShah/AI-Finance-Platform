import { getBudgetsByAccount } from "@/actions/budget";
import { getUserAccounts } from "@/actions/dashboard";
import BudgetHeader from "../_components/budget-header";

import AccountBudgetCard from "../_components/account-budget-card";

import { getTransaction } from "@/actions/transaction";
import { getAccountWithTransactions } from "@/actions/account";

import { getCategoryBudgets } from "@/actions/budget";
import { getCategories } from "@/actions/category";
import CategoryBudgetPage from "../_components/category-budget-page";

export default async function BudgetPage({ params }) {
  const { id } = await params;

  const accounts = await getUserAccounts();

  const selectedAccount = accounts.find((a) => id == a.id);

  const categories = await getCategories();

  const accountTransaction = await getAccountWithTransactions(id);

  console.log(accountTransaction);
  const budgets = await getBudgetsByAccount(id);
  const categoryBudgets = await getCategoryBudgets(id);

  return (
    <div className="space-y-6">
      <BudgetHeader accounts={accounts} defaultAcc={selectedAccount} />

      <AccountBudgetCard
        account={selectedAccount}
        accountTransaction={accountTransaction}
        budgets={budgets}
      />
      <CategoryBudgetPage
        accountId={selectedAccount.id}
        categories={categories}
        categoryBudgets={categoryBudgets}
        account={accountTransaction}
      />
    </div>
  );
}

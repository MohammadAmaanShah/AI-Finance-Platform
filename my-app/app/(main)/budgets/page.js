import { getBudgetsByAccount } from "@/actions/budget";
import { getUserAccounts } from "@/actions/dashboard";
import BudgetHeader from "./_components/budget-header";
import AccountBudgetCard from "./_components/account-budget-card";
import CategoryBudgetList from "./_components/category-budget-list";

export default async function BudgetPage({ searchParams }) {
  const accountId = searchParams?.account;

  const accounts = await getUserAccounts();
  const selectedAccount =
    accounts.find((a) => a.id === accountId) || accounts[0];

  const budgets = selectedAccount
    ? await getBudgetsByAccount(selectedAccount.id)
    : [];

  const accountBudget = budgets.find((b) => b.categoryId === null);

  const categoryBudgets = budgets.filter((b) => b.categoryId !== null);

  return (
    <div className="space-y-6">
      <BudgetHeader
        accounts={accounts}
        selectedAccountId={selectedAccount?.id}
      />

      <AccountBudgetCard account={selectedAccount} budget={accountBudget} />

      <CategoryBudgetList
        accountId={selectedAccount?.id}
        budgets={categoryBudgets}
      />
    </div>
  );
}

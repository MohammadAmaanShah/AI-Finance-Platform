import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import {
  checkBudgetAlerts,
  processRecurringTransaction,
  triggerRecurringTransactions,
} from "@/lib/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    checkBudgetAlerts,
    processRecurringTransaction,
    triggerRecurringTransactions,
    generateMonthlyReports,
    // <-- This is where you'll always add all your functions
  ],
});

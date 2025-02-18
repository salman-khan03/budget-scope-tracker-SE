
import { ThemeToggle } from "./ThemeToggle";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";
import { StatsCards } from "./dashboard/StatsCards";
import { TransactionCharts } from "./dashboard/TransactionCharts";
import { useTransactions } from "@/hooks/use-transactions";
import { useState } from "react";

export function Dashboard() {
  const { transactions, isLoading, fetchTransactions } = useTransactions();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(
    null
  );

  const totalBalance = transactions.reduce(
    (acc, curr) =>
      acc + (curr.type === "income" ? curr.amount : -curr.amount),
    0
  );

  const monthlyIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const monthlyExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const chartData = transactions.reduce((acc: any[], transaction) => {
    const date = new Date(transaction.created_at).toLocaleDateString();
    const existingDay = acc.find((d) => d.date === date);

    if (existingDay) {
      if (transaction.type === "income") {
        existingDay.income += transaction.amount;
      } else {
        existingDay.expenses += transaction.amount;
      }
    } else {
      acc.push({
        date,
        income: transaction.type === "income" ? transaction.amount : 0,
        expenses: transaction.type === "expense" ? transaction.amount : 0,
      });
    }

    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Financial Dashboard</h1>
          <ThemeToggle />
        </div>

        <StatsCards
          totalBalance={totalBalance}
          monthlyIncome={monthlyIncome}
          monthlyExpenses={monthlyExpenses}
        />

        <TransactionCharts chartData={chartData} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              {editingTransaction ? "Edit" : "Add"} Transaction
            </h2>
            <TransactionForm
              onSuccess={() => {
                fetchTransactions();
                setEditingTransaction(null);
              }}
              initialData={editingTransaction || undefined}
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
            {isLoading ? (
              <p>Loading transactions...</p>
            ) : (
              <TransactionList
                transactions={transactions}
                onEdit={setEditingTransaction}
                onDelete={fetchTransactions}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Card } from "@/components/ui/card";
import { ThemeToggle } from "./ThemeToggle";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Transaction = {
  id: number;
  created_at: string;
  amount: number;
  type: string;
  category: string;
  description: string;
};

export function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please log in to view your transactions");
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to fetch transactions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();

    // Subscribe to changes in the transactions table
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions'
        },
        () => {
          fetchTransactions();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass card-shadow p-6 animate-fadeIn">
            <h3 className="text-sm uppercase tracking-wider text-muted-foreground">
              Total Balance
            </h3>
            <p
              className={`text-3xl font-bold mt-2 ${
                totalBalance >= 0 ? "text-neon-green" : "text-neon-pink"
              }`}
            >
              ${totalBalance.toFixed(2)}
            </p>
          </Card>
          <Card className="glass card-shadow p-6 animate-fadeIn">
            <h3 className="text-sm uppercase tracking-wider text-muted-foreground">
              Monthly Income
            </h3>
            <p className="text-3xl font-bold mt-2 text-neon-blue">
              ${monthlyIncome.toFixed(2)}
            </p>
          </Card>
          <Card className="glass card-shadow p-6 animate-fadeIn">
            <h3 className="text-sm uppercase tracking-wider text-muted-foreground">
              Monthly Expenses
            </h3>
            <p className="text-3xl font-bold mt-2 text-neon-pink">
              ${monthlyExpenses.toFixed(2)}
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass card-shadow p-6 h-[400px]">
            <h3 className="text-xl font-semibold mb-4">Income vs Expenses</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#00f3ff"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ff00ff"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="glass card-shadow p-6 h-[400px]">
            <h3 className="text-xl font-semibold mb-4">Monthly Overview</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#00f3ff" />
                <Bar dataKey="expenses" fill="#ff00ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

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

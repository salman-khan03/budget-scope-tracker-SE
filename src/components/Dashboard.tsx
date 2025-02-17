
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

const data = [
  { month: "Jan", income: 4000, expenses: 2400 },
  { month: "Feb", income: 3000, expenses: 1398 },
  { month: "Mar", income: 2000, expenses: 9800 },
  { month: "Apr", income: 2780, expenses: 3908 },
  { month: "May", income: 1890, expenses: 4800 },
  { month: "Jun", income: 2390, expenses: 3800 },
];

export function Dashboard() {
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
            <p className="text-3xl font-bold mt-2 text-neon-green">$12,750</p>
          </Card>
          <Card className="glass card-shadow p-6 animate-fadeIn">
            <h3 className="text-sm uppercase tracking-wider text-muted-foreground">
              Monthly Income
            </h3>
            <p className="text-3xl font-bold mt-2 text-neon-blue">$4,250</p>
          </Card>
          <Card className="glass card-shadow p-6 animate-fadeIn">
            <h3 className="text-sm uppercase tracking-wider text-muted-foreground">
              Monthly Expenses
            </h3>
            <p className="text-3xl font-bold mt-2 text-neon-pink">$2,850</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass card-shadow p-6 h-[400px]">
            <h3 className="text-xl font-semibold mb-4">Income vs Expenses</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
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
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#00f3ff" />
                <Bar dataKey="expenses" fill="#ff00ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}

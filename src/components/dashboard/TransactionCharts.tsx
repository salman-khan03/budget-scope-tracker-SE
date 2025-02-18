
import { Card } from "@/components/ui/card";
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

type ChartData = {
  date: string;
  income: number;
  expenses: number;
}[];

type TransactionChartsProps = {
  chartData: ChartData;
};

export function TransactionCharts({ chartData }: TransactionChartsProps) {
  return (
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
  );
}

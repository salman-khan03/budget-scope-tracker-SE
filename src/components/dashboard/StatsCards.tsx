
import { Card } from "@/components/ui/card";

type StatsCardsProps = {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
};

export function StatsCards({
  totalBalance,
  monthlyIncome,
  monthlyExpenses,
}: StatsCardsProps) {
  return (
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
  );
}


import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Transaction = {
  id: number;
  created_at: string;
  amount: number;
  type: string;
  category: string;
  description: string;
};

type TransactionListProps = {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: () => void;
};

export function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: TransactionListProps) {
  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Transaction deleted successfully");
      onDelete();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete transaction");
    }
  };

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <Card key={transaction.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-lg font-semibold ${
                    transaction.type === "income"
                      ? "text-neon-green"
                      : "text-neon-pink"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}$
                  {Math.abs(transaction.amount).toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {transaction.category}
                </span>
              </div>
              <p className="text-sm">{transaction.description}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(transaction.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(transaction)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(transaction.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

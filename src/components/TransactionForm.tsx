
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type TransactionFormProps = {
  onSuccess: () => void;
  initialData?: {
    id: number;
    amount: number;
    type: string;
    category: string;
    description: string;
  };
};

export function TransactionForm({ onSuccess, initialData }: TransactionFormProps) {
  const [amount, setAmount] = useState(initialData?.amount?.toString() || "");
  const [type, setType] = useState(initialData?.type || "expense");
  const [category, setCategory] = useState(initialData?.category || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (initialData) {
        const { error } = await supabase
          .from("transactions")
          .update({
            amount: Number(amount),
            type,
            category,
            description,
          })
          .eq("id", initialData.id);

        if (error) throw error;
        toast.success("Transaction updated successfully");
      } else {
        const { error } = await supabase.from("transactions").insert({
          amount: Number(amount),
          type,
          category,
          description,
        });

        if (error) throw error;
        toast.success("Transaction added successfully");
      }

      setAmount("");
      setType("expense");
      setCategory("");
      setDescription("");
      onSuccess();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to save transaction");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            step="0.01"
          />
        </div>
        <div>
          <Select value={type} onValueChange={setType} required>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {initialData ? "Update" : "Add"} Transaction
        </Button>
      </form>
    </Card>
  );
}

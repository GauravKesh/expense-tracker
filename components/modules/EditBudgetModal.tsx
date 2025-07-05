"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryName: string;
  currentAmount: number;
  onSave: (amount: number) => void;
}

export default function EditBudgetModal({
  open,
  onOpenChange,
  categoryName,
  currentAmount,
  onSave,
}: Props) {
  const [amount, setAmount] = useState(currentAmount);

  const handleSubmit = () => {
    if (!isNaN(amount) && amount >= 0) {
      onSave(amount);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Budget</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Category</p>
            <p className="font-medium">{categoryName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Amount</p>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              min={0}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

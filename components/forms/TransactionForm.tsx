"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Category {
  _id: string;
  name: string;
}

interface TransactionFormProps {
  categories: Category[];
  onSubmit: (transaction: {
    amount: number;
    description: string;
    date: string;
    type: "income" | "expense";
    category: string | "";
  }) => void;
  onCancel: () => void;
}

export default function TransactionForm({
  categories,
  onSubmit,
  onCancel,
}: TransactionFormProps) {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    type: "expense" as "income" | "expense",
    category: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      amount: parseFloat(formData.amount),
      description: formData.description,
      date: formData.date,
      type: formData.type,
      category: formData.category,
    });
  };

  return (
    <>
      <Card>
        <CardHeader>{/* <CardTitle>Add Transaction</CardTitle> */}</CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <div className="flex space-x-2 mt-1">
                  {(["income", "expense"] as const).map((typeOption) => (
                    <Button
                      key={typeOption}
                      type="button"
                      variant={
                        formData.type === typeOption ? "default" : "outline"
                      }
                      onClick={() =>
                        setFormData({ ...formData, type: typeOption })
                      }
                    >
                      {typeOption.charAt(0).toUpperCase() + typeOption.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter transaction description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>
              {formData.type === "expense" && (
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">Add Transaction</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      
    </>
  );
}

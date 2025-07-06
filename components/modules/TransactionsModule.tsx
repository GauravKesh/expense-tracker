"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Pencil } from "lucide-react";
import TransactionForm from "@/components/forms/TransactionForm";
import * as Dialogs from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loaderui } from "@/components/ui/loaderui";
import axios from "axios";
import baseUrl from "@/lib/piendpoint";

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
  type: "income" | "expense";
  category: {
    _id: string;
    name: string;
  };
}

interface Category {
  _id: string;
  name: string;
}

interface Props {
  categories: Category[];
}

export default function TransactionsModule({ categories }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  // const BASE_URL = "https://personal-expense-backend.onrender.com/api";
  const BASE_URL = baseUrl;

  const [editData, setEditData] = useState({
    amount: "",
    description: "",
    category: "",
    date: "",
    type: "",
  });

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/transactions`);
      setTransactions(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error fetching transactions:", e);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: any) => {
    try {
      await axios.post(`${BASE_URL}/transactions`, transaction);
      setShowTransactionForm(false);
      fetchTransactions();
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const updateTransaction = async () => {
    if (!editingTransaction) return;
    try {
      await axios.put(`${BASE_URL}/transactions/${editingTransaction._id}`, {
        ...editData,
        amount: parseFloat(editData.amount),
      });
      fetchTransactions();
      setShowDialog(false);
      setEditingTransaction(null);
    } catch (e) {
      console.error("Error updating transaction:", e);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/transactions/${id}`);
      fetchTransactions();
    } catch (e) {
      console.error("Error deleting transaction:", e);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (editingTransaction) {
      setEditData({
        amount: editingTransaction.amount.toString(),
        description: editingTransaction.description,
        category: editingTransaction.category?._id || "",
        date: editingTransaction.date.split("T")[0],
        type: editingTransaction.type,
      });
    }
  }, [editingTransaction]);

  if (loading) return <Loaderui text="Loading transactions..." />;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowTransactionForm(true)}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Transaction
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {transactions.map((t) => (
                  <div
                    key={t._id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          t.type === "income" ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <div>
                        <p className="font-medium">{t.description}</p>
                        <p className="text-sm text-gray-500">
                          {t.category?.name ||
                            (t.type === "income"
                              ? "Income"
                              : "Uncategorized")}{" "}
                          • {new Date(t.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          t.type === "income" ? "default" : "destructive"
                        }
                        className={
                          t.type === "income" ? "bg-blue-500 text-white" : ""
                        }
                      >
                        {t.type === "income" ? "+" : "-"}₹{t.amount.toFixed(2)}
                      </Badge>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTransaction(t._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingTransaction(t);
                          setShowDialog(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Dialog
            open={showDialog}
            onOpenChange={(v) => {
              setShowDialog(v);
              if (!v) setEditingTransaction(null);
            }}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Transaction</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    value={editData.amount}
                    onChange={(e) =>
                      setEditData({ ...editData, amount: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={editData.description}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={editData.date}
                    onChange={(e) =>
                      setEditData({ ...editData, date: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Type</Label>
                  <div className="flex space-x-2 mt-1">
                    {(["income", "expense"] as const).map((typeOption) => (
                      <Button
                        key={typeOption}
                        type="button"
                        variant={
                          editData.type === typeOption ? "default" : "outline"
                        }
                        onClick={() =>
                          setEditData({ ...editData, type: typeOption })
                        }
                      >
                        {typeOption.charAt(0).toUpperCase() +
                          typeOption.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Category</Label>
                  <Select
                    value={editData.category}
                    onValueChange={(value) =>
                      setEditData({ ...editData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={updateTransaction}>Save</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialogs.Root
            open={showTransactionForm}
            onOpenChange={setShowTransactionForm}
          >
            <Dialogs.Portal>
              <Dialogs.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
              <Dialogs.Content className="fixed z-50 top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <Dialogs.Title className="text-lg font-semibold text-gray-900">
                    Add Transaction
                  </Dialogs.Title>
                  <Dialogs.Close asChild>
                    <button className="text-gray-500 hover:text-gray-700">
                      <X className="h-5 w-5" />
                    </button>
                  </Dialogs.Close>
                </div>
                <TransactionForm
                  onSubmit={addTransaction}
                  onCancel={() => setShowTransactionForm(false)}
                  categories={categories}
                />
              </Dialogs.Content>
            </Dialogs.Portal>
          </Dialogs.Root>
        </div>
      </div>
    </>
  );
}

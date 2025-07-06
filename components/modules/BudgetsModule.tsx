"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Pencil } from "lucide-react";
import BudgetForm from "@/components/forms/BudgetForm";
import EditBudgetModal from "./EditBudgetModal";
import { Loaderui } from "../ui/loaderui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";

interface Category {
  _id: string;
  name: string;
}

interface Budget {
  _id: string;
  category: Category;
  amount: number;
  month: number;
  year: number;
}

interface Transaction {
  _id: string;
  amount: number;
  type: "income" | "expense";
  category: {
    _id: string;
  };
}

interface Props {
  categories: Category[];
  transactions: Transaction[];
}

export default function BudgetsModule({ categories, transactions }: Props) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editBudget, setEditBudget] = useState<Budget | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const BASE_URL = "https://personal-expense-backend.onrender.com/api";

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/budgets`);
      setBudgets(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Error fetching budgets:", e);
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (budget: any) => {
    try {
      const url = editBudget
        ? `${BASE_URL}/budgets/${editBudget._id}`
        : `${BASE_URL}/budgets`;

      const method = editBudget ? "put" : "post";

      await axios[method](url, budget);

      fetchBudgets();
      setShowForm(false);
      setEditBudget(null);
    } catch (e) {
      console.error("Error submitting budget:", e);
    }
  };

  const updateBudgetAmount = async (id: string, newAmount: number) => {
    try {
      await axios.put(`${BASE_URL}/budgets/${id}`, { amount: newAmount });
      fetchBudgets();
      setShowEditModal(false);
      setSelectedBudget(null);
    } catch (e) {
      console.error("Error updating amount:", e);
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/budgets/${id}`);
      fetchBudgets();
    } catch (e) {
      console.error("Error deleting budget:", e);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  if (loading) return <Loaderui text="Loading budgets..." />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Budgets</CardTitle>
            <Button
              onClick={() => {
                setEditBudget(null);
                setShowForm(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Budget
            </Button>
          </CardHeader>
          <CardContent>
            <Dialog
              open={showForm}
              onOpenChange={(v) => {
                setShowForm(v);
                if (!v) setEditBudget(null);
              }}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editBudget ? "Edit Budget" : "Add Budget"}
                  </DialogTitle>
                </DialogHeader>
                <BudgetForm
                  categories={categories}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setEditBudget(null);
                  }}
                  initialData={editBudget}
                />
              </DialogContent>
            </Dialog>

            {selectedBudget && (
              <EditBudgetModal
                open={showEditModal}
                onOpenChange={setShowEditModal}
                categoryName={selectedBudget.category.name}
                currentAmount={selectedBudget.amount}
                onSave={(newAmount) =>
                  updateBudgetAmount(selectedBudget._id, newAmount)
                }
              />
            )}

            <div className="space-y-2">
              {budgets.map((budget) => {
                const spent = transactions
                  .filter(
                    (t) =>
                      t.type === "expense" &&
                      t.category?._id === budget.category?._id
                  )
                  .reduce((sum, t) => sum + t.amount, 0);

                const isOverSpent = spent > budget.amount;

                return (
                  <div
                    key={budget._id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between p-3 rounded-lg border hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">{budget.category?.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(
                          budget.year,
                          budget.month - 1
                        ).toLocaleDateString("default", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      {isOverSpent && (
                        <p className="text-sm text-red-600 mt-1">
                          <ul>
                            <li>
                              Budget exceeded by ₹
                              {(spent - budget.amount).toFixed(2)}.
                            </li>
                            <li>
                              <span>
                                {" "}
                                Consider reducing spending in this{" "}
                                {budget.category?.name}.
                              </span>
                            </li>
                          </ul>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-3 md:mt-0">
                      <Badge variant="outline">
                        ₹{budget.amount.toFixed(2)}
                      </Badge>
                      <Badge
                        variant={isOverSpent ? "destructive" : "secondary"}
                      >
                        Spent: ₹{spent.toFixed(2)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteBudget(budget._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedBudget(budget);
                          setShowEditModal(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

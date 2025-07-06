"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loaderui } from "@/components/ui/loaderui";
import SummaryCard from "@/components/cards/SummaryCard";
import MonthlyChart from "@/components/charts/MonthlyChart";
import CategoryChart from "@/components/charts/CategoryChart";
import BudgetChart from "@/components/charts/BudgetChart";
import { TrendingUp, TrendingDown, Target, Plus, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import TransactionForm from "@/components/forms/TransactionForm";

const BASE_URL = "https://personal-expense-backend.onrender.com/api";

interface CategoryType {
  _id: string;
  name: string;
}

interface BudgetType {
  _id: string;
  category: { _id: string; name: string };
  amount: number;
  month: number;
  year: number;
  date: string | null;
}

interface TransactionType {
  _id: string;
  amount: number;
  type: "income" | "expense";
  category: { _id: string; name: string };
  date: string;
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [budgets, setBudgets] = useState<BudgetType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [transRes, catRes, budRes] = await Promise.all([
          axios.get(`${BASE_URL}/transactions`),
          axios.get(`${BASE_URL}/categories`),
          axios.get(`${BASE_URL}/budgets`)
        ]);

        setTransactions(transRes.data || []);
        setCategories(catRes.data || []);
        setBudgets(budRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addTransaction = async (transaction: any) => {
    try {
      await axios.post(`${BASE_URL}/transactions`, transaction);
      setShowTransactionForm(false);
      const res = await axios.get(`${BASE_URL}/transactions`);
      setTransactions(res.data || []);
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);

  const monthlyData = (() => {
    const data: Record<string, { income: number; expense: number }> = {};
    transactions.forEach((t) => {
      const month = new Date(t.date).toLocaleString("default", { month: "short" });
      if (!data[month]) data[month] = { income: 0, expense: 0 };
      data[month][t.type] += t.amount;
    });
    return Object.entries(data).map(([month, values]) => ({ month, ...values }));
  })();

  const categoryData = (() => {
    const data: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const category = categories.find((c) => c._id === t.category._id);
        const name = category?.name || "Uncategorized";
        data[name] = (data[name] || 0) + t.amount;
      });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  })();

  const budgetData = budgets.map((budget) => {
    const spent = transactions
      .filter((t) => t.type === "expense" && t.category?._id === budget.category?._id)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      category: budget.category.name,
      budgeted: budget.amount,
      spent
    };
  });

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Loaderui text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => setShowTransactionForm(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Add Transaction
          </Button>
        </div>

        <Dialog.Root open={showTransactionForm} onOpenChange={setShowTransactionForm}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
            <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  Add Transaction
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button className="text-gray-500 hover:text-gray-700">
                    <X className="h-5 w-5" />
                  </button>
                </Dialog.Close>
              </div>
              <TransactionForm
                onSubmit={addTransaction}
                onCancel={() => setShowTransactionForm(false)}
                categories={categories}
              />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            title="Total Income"
            amount={totalIncome}
            icon={TrendingUp}
            trend={{
              value:
                totalIncome > 0
                  ? +(((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)
                  : 0,
              isPositive: true
            }}
          />
          <SummaryCard
            title="Total Expenses"
            amount={totalExpenses}
            icon={TrendingDown}
            trend={{
              value:
                totalIncome > 0
                  ? -((totalExpenses / totalIncome) * 100).toFixed(1)
                  : 0,
              isPositive: false
            }}
          />
          <SummaryCard
            title="Remaining Budget"
            amount={totalBudget - totalExpenses}
            icon={Target}
            trend={{
              value:
                totalBudget > 0
                  ? +(((totalBudget - totalExpenses) / totalBudget) * 100).toFixed(1)
                  : 0,
              isPositive: totalBudget - totalExpenses >= 0
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <MonthlyChart data={monthlyData} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryChart data={categoryData} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Budget vs Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetChart data={budgetData} />
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentTransactions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No transactions yet.
                </p>
              ) : (
                recentTransactions.map((txn) => (
                  <div
                    key={txn._id}
                    className="flex items-center justify-between border p-3 rounded-lg bg-white shadow-sm"
                  >
                    <div>
                      <p className="font-medium">
                        {txn.type === "income"
                          ? "Income"
                          : txn.category?.name || "Uncategorized"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(txn.date).toLocaleString()}
                      </p>
                    </div>
                    <p
                      className={`font-semibold text-sm ${
                        txn.type === "income" ? "text-blue-600" : "text-red-600"
                      }`}
                    >
                      {txn.type === "income" ? "+" : "-"}₹
                      {txn.amount.toFixed(2)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

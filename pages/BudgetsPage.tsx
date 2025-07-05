"use client"
import BudgetsModule from '@/components/modules/BudgetsModule';
import { Loaderui } from '@/components/ui/loaderui';
import React, { useEffect, useState } from 'react';

interface Category {
  _id: string;
  name: string;
}

interface Transaction {
  _id: string;
  amount: number;
  type: 'income' | 'expense';
  category: {
    _id: string;
  };
}

export default function BudgetsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, transRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/transactions'),
        ]);

        const catData = await catRes.json();
        const transData = await transRes.json();

        setCategories(Array.isArray(catData) ? catData : []);
        setTransactions(Array.isArray(transData) ? transData : []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p><Loaderui text={""}/></p>;

  return (
    <div className="p-4">
      <BudgetsModule categories={categories} transactions={transactions} />
    </div>
  );
}

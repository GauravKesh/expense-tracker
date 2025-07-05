"use client"
import TransactionsModule from '@/components/modules/TransactionsModule';
import { Loaderui } from '@/components/ui/loaderui';
import React, { useEffect, useState } from 'react';

interface Category {
  _id: string;
  name: string;
}

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
  category: Category;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [transRes, catRes] = await Promise.all([
          fetch('/api/transactions'),
          fetch('/api/categories'),
        ]);

        const transData = await transRes.json();
        const catData = await catRes.json();

        setTransactions(Array.isArray(transData) ? transData : []);
        setCategories(Array.isArray(catData) ? catData : []);
      } catch (error) {
        console.error('Error loading transactions:', error);
        setTransactions([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p><Loaderui text={""}/></p>;

  return (
    <div className="p-4">
      <TransactionsModule  categories={categories} />
    </div>
  );
}

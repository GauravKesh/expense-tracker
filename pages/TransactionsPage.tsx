"use client";

import TransactionsModule from '@/components/modules/TransactionsModule';
import { Loaderui } from '@/components/ui/loaderui';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

const BASE_URL = 'https://personal-expense-backend.onrender.com/api';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [transRes, catRes] = await Promise.all([
          axios.get(`${BASE_URL}/transactions`),
          axios.get(`${BASE_URL}/categories`),
        ]);

        setTransactions(Array.isArray(transRes.data) ? transRes.data : []);
        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
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

  if (loading) return <p><Loaderui text="Loading transactions..." /></p>;

  return (
    <div className="p-4">
      <TransactionsModule categories={categories} />
    </div>
  );
}

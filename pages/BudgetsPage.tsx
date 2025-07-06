"use client";

import BudgetsModule from '@/components/modules/BudgetsModule';
import { Loaderui } from '@/components/ui/loaderui';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import baseUrl from "@/lib/piendpoint";

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

const BASE_URL = baseUrl


export default function BudgetsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, transRes] = await Promise.all([
          axios.get(`${BASE_URL}/categories`),
          axios.get(`${BASE_URL}/transactions`),
        ]);

        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
        setTransactions(Array.isArray(transRes.data) ? transRes.data : []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p><Loaderui text="" /></p>;

  return (
    <div className="p-4">
      <BudgetsModule categories={categories} transactions={transactions} />
    </div>
  );
}

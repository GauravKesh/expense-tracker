"use client";

import CategoriesModule from '@/components/modules/CategoriesModule';
import { Loaderui } from '@/components/ui/loaderui';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Category {
  _id: string;
  name: string;
}

const BASE_URL = 'https://personal-expense-backend.onrender.com/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/categories`);
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <p><Loaderui text="Loading categories data, hang on..." /></p>;
  }

  return (
    <div className="p-4">
      <CategoriesModule categories={categories} />
    </div>
  );
}

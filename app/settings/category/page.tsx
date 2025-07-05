"use client"
import CategoriesModule from '@/components/modules/CategoriesModule';
import { Loaderui } from '@/components/ui/loaderui';
import React, { useEffect, useState } from 'react';

interface Category {
  _id: string;
  name: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <p>
    <Loaderui text={"Loading categories data hang on..."}/>
  </p>;

  return (
    <div className="p-4">
      <CategoriesModule />
    </div>
  );
}

import CategoriesPage from "@/pages/CategoriesPage";
import React from "react";

export const metadata = {
  title: 'Category Transactions & Budget',
  description: 'Manage your transactions and budgets by category with insightful analytics.',
  keywords: [
    'budget',
    'transactions',
    'category budget',
    'expense tracking',
    'personal finance',
    'spending analysis',
    'money management',
  ],
};


function page() {
  return (
    <div>
      <CategoriesPage />
    </div>
  );
}

export default page;

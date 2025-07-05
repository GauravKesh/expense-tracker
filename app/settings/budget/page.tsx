import BudgetsPage from '@/pages/BudgetsPage'
import React from 'react'

export const metadata = {
  title: 'Budgets Overview | Personal Finance Tracker',
  description: 'Set, view, and manage your monthly and category-specific budgets.',
  keywords: [
    'budgets',
    'budget planner',
    'monthly budget',
    'category budgets',
    'financial goals',
    'expense limits',
    'budget tracking',
  ],
};


function page() {
  return (
    <div>
      <BudgetsPage/>
    </div>
  )
}

export default page
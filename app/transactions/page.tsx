import TransactionsPage from "@/pages/TransactionsPage";
import React from "react";

export const metadata = {
  title: "All Transactions | Personal Finance Tracker",
  description:
    "Browse and analyze all your financial transactions in one place.",
  keywords: [
    "transactions",
    "finance tracker",
    "expense tracking",
    "income tracking",
    "money management",
    "transaction history",
    "budgeting app",
  ],
};

function page() {
  return (
    <div>
      <TransactionsPage />
    </div>
  );
}

export default page;

# 💰 Personal Finance Tracker

A modern, full-stack finance dashboard built with Next.js, Tailwind CSS, and TypeScript. Manage your income, expenses, budgets, and gain insights with charts and analytics.

## 📦 Features

- 💸 Add, edit, and delete income/expense transactions
- 📊 Visualize spending trends by month and category
- 🎯 Set and monitor budgets
- 📈 Dynamic charts (monthly overview, category-wise, budget vs actual)
- 🔄 Real-time updates with Radix Dialogs
- 🌙 Responsive UI built with Tailwind CSS and shadcn/ui components

## 🛠️ Tech Stack

- **Frontend**: React.js (Next.js App Router)
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: useState, useEffect
- **Icons**: Lucide
- **Charts**: Recharts
- **API**: RESTful API (Next.js API routes)
- **Database**: MongoDB

## 📁 Folder Structure
```bash
app/
.
├── app
│   ├── api
│   │   ├── budgets
│   │   │   ├── [id]
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── categories
│   │   │   ├── [id]
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   └── transactions
│   │       ├── [id]
│   │       │   └── route.ts
│   │       └── route.ts
│   ├── dashboard
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── settings
│   │   ├── budget
│   │   │   └── page.tsx
│   │   └── category
│   │       └── page.tsx
│   └── transactions
│       └── page.tsx
├── components
│   ├── cards
│   │   └── SummaryCard.tsx
│   ├── charts
│   │   ├── BudgetChart.tsx
│   │   ├── CategoryChart.tsx
│   │   └── MonthlyChart.tsx
│   ├── forms
│   │   ├── BudgetForm.tsx
│   │   ├── CategoryForm.tsx
│   │   └── TransactionForm.tsx
│   ├── layout
│   │   └── Navbar.tsx
│   ├── modules
│   │   ├── BudgetsModule.tsx
│   │   ├── CategoriesModule.tsx
│   │   ├── EditBudgetModal.tsx
│   │   └── TransactionsModule.tsx
│   └── ui
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── loaderui.tsx
│       ├── select.tsx
│       └── textarea.tsx
├── components.json
├── lib
│   ├── mongodb.ts
│   └── utils.ts
├── models
│   ├── Budget.ts
│   ├── Category.ts
│   └── Transaction.ts
├── next-env.d.ts
├── next.config.js
├── package-lock.json
├── package.json
├── pages
│   ├── BudgetsPage.tsx
│   ├── CategoriesPage.tsx
│   ├── Dashboard.tsx
│   └── TransactionsPage.tsx
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json

24 directories, 53 files
```


##  Getting Started


# 1. Clone the repository
```bash
git clone https://github.com/your-username/finance-tracker.git
cd finance-tracker
```

# 2. Install dependencies
```bash
npm install
```
# 3. Start development server
🌐 Environment Variables
Create a .env.local file:
add:- 
``` bash 
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/finance
```

```bash

npm run dev
```
## 🧪 API Endpoints

### 📌 Transactions
| Method | Endpoint                 | Description           |
|--------|--------------------------|-----------------------|
| GET    | `/api/transactions`      | List all transactions |
| POST   | `/api/transactions`      | Add a new transaction |
| PUT    | `/api/transactions/:id`  | Update a transaction  |
| DELETE | `/api/transactions/:id`  | Delete a transaction  |

### 📊 Budgets
| Method | Endpoint            | Description         |
|--------|---------------------|---------------------|
| GET    | `/api/budgets`      | List all budgets    |
| POST   | `/api/budgets`      | Add a new budget    |
| PUT    | `/api/budgets/:id`  | Update a budget     |
| DELETE | `/api/budgets/:id`  | Delete a budget     |

### 🗂️ Categories
| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| GET    | `/api/categories`     | List all categories  |
| POST   | `/api/categories`     | Add a new category   |
| PUT    | `/api/categories/:id` | Update a category    |
| DELETE | `/api/categories/:id` | Delete a category    |

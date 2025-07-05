import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Budget from '@/models/Budget';

export async function GET() {
  try {
    await connectDB();
    const budgets = await Budget.find({})
      .populate('category')
      .sort({ year: -1, month: -1 });
    return NextResponse.json(budgets);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { category, amount, month, year } = await request.json();

    if (!category || !amount || !month || !year) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const budget = new Budget({
      category,
      amount,
      month,
      year,
    });

    await budget.save();
    await budget.populate('category');

    return NextResponse.json(budget, { status: 201 });
    
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 });
  }
}
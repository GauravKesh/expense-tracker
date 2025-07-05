export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

export async function GET() {
  try {
    await connectDB();
    const transactions = await Transaction.find({})
      .populate('category')
       .sort({ createdAt: -1 });
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { amount, description, date, type, category } = await request.json();
    console.log({ amount, description, date, type, category });

    if (!amount || !description || !type || (type === 'expense' && !category)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transaction = new Transaction({
      amount,
      description,
      date: date || new Date(),
      type,
      category: type === 'expense' ? category : null,
    });

    await transaction.save();
    if (type === 'expense') {
      await transaction.populate('category');
    }

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

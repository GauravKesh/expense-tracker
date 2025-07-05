import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ name: 1 });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { name } = await request.json();
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const category = new Category({ name });
    await category.save();

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
  category?: mongoose.Types.ObjectId | null;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: function () { return this.type === 'expense'; } },
  },
  { timestamps: true }
);

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

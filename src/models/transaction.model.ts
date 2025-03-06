import mongoose, { Schema, Document } from "mongoose";

// Define Transaction Interface
export interface ITransaction extends Document {
  userId: string; // Clerk User ID to link transactions to users
  name: string;
  type: "Credit" | "Debit";
  amount: number;
  date: Date;
  remarks?: string;
}

// Define Transaction Schema
const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: String, required: true }, // Clerk user ID
    name: { type: String, required: true },
    type: { type: String, enum: ["Credit", "Debit"], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    remarks: { type: String },
  },
  { timestamps: true } // Automatically adds `createdAt` & `updatedAt`
);

// Export the model
export const Transaction =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);

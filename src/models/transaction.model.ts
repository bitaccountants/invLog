import mongoose, { Schema, Document } from "mongoose";

// Define Transaction Interface
export interface ITransaction extends Document {
  userId: string;
  name: string;
  type: "credit" | "debit";
  amount: number;
  date: Date;
  remarks?: string;
}

// Define Transaction Schema
const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
      lowercase: true, // Automatically convert to lowercase
    },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    remarks: { type: String },
  },
  { timestamps: true }
);

// Export the model
export const Transaction =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);

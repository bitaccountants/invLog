import { NextResponse, NextRequest } from "next/server";
import { connectToDB } from "@/lib/db";
import { Transaction } from "@/models/transaction.model";
import { getAuth } from "@clerk/nextjs/server";

// ✅ **Fetch All Transactions (GET)**
export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transactions = await Transaction.find({ userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

// ✅ **Create a New Transaction (POST)**
export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (!body.name || !body.amount || !body.type) {
      return NextResponse.json(
        { error: "Missing required fields (name, amount, type)" },
        { status: 400 }
      );
    }

    const newTransaction = await Transaction.create({ ...body, userId });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

// ✅ **Edit Transaction (PATCH)**
export async function PATCH(req: NextRequest) {
  try {
    await connectToDB();
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, name, type, amount, date, remarks } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: "Missing transaction ID" },
        { status: 400 }
      );
    }

    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: id, userId },
      { name, type, amount, date, remarks },
      { new: true }
    );

    if (!updatedTransaction) {
      return NextResponse.json(
        { error: "Transaction not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedTransaction, { status: 200 });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

// ✅ **Delete Single OR Bulk Transactions (DELETE)**
export async function DELETE(req: NextRequest) {
  try {
    await connectToDB();
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, ids } = await req.json();

    if (id) {
      const deletedTransaction = await Transaction.findOneAndDelete({
        _id: id,
        userId,
      });

      if (!deletedTransaction) {
        return NextResponse.json(
          { error: "Transaction not found or unauthorized" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "Transaction deleted successfully" },
        { status: 200 }
      );
    } else if (ids && Array.isArray(ids) && ids.length > 0) {
      const result = await Transaction.deleteMany({
        _id: { $in: ids },
        userId,
      });

      if (result.deletedCount === 0) {
        return NextResponse.json(
          { error: "No transactions deleted" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: `${result.deletedCount} transactions deleted successfully` },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Invalid request. Provide an 'id' or 'ids' array." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { error: "Failed to delete transactions" },
      { status: 500 }
    );
  }
}

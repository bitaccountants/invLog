import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { Transaction } from "@/models/transaction.model";

export async function GET(
  _: any,
  { params }: { params: { sharedId: string } }
) {
  try {
    await connectToDB();
    const transaction = await Transaction.findOne({
      sharedId: params.sharedId,
    });
    if (!transaction)
      return NextResponse.json({ error: "Not Found" }, { status: 404 });

    return NextResponse.json(transaction, { status: 200 });
  } catch (err) {
    console.error("Error fetching shared transaction", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

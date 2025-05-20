import { NextResponse } from "next/server";
import { connectToDB, prisma } from "@/lib/db";

export async function GET(
  _: any,
  { params }: { params: { sharedId: string } }
) {
  try {
    await connectToDB();
    const transaction = await prisma.transaction.findFirst({
      where: { sharedId: params.sharedId },
    });
    if (!transaction)
      return NextResponse.json({ error: "Not Found" }, { status: 404 });

    return NextResponse.json({ ...transaction, _id: transaction.id }, { status: 200 });
  } catch (err) {
    console.error("Error fetching shared transaction", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

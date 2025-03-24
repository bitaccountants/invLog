"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { formatDateTime } from "@/lib/utils";

export default function SharedTransactionPage() {
  const { sharedId } = useParams();
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sharedId) fetchTransaction();
  }, [sharedId]);

  const fetchTransaction = async () => {
    try {
      const res = await fetch(`/api/transactions/shared/${sharedId}`);
      const data = await res.json();
      setTransaction(data);
    } catch {
      setTransaction(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );

  if (!transaction)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">Transaction not found.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 max-w-xl w-full shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
          📄 Shared Transaction
        </h1>
        <div className="space-y-4 text-base md:text-lg">
          <p>
            <span className="font-semibold">Name:</span> {transaction.name}
          </p>
          <p>
            <span className="font-semibold">Type:</span> {transaction.type}
          </p>
          <p>
            <span className="font-semibold">Amount:</span> ${transaction.amount}
          </p>
          <p>
            <span className="font-semibold">Date:</span>{" "}
            {formatDateTime(transaction.date)}
          </p>
          <p>
            <span className="font-semibold">Remarks:</span>{" "}
            {transaction.remarks || "N/A"}
          </p>
        </div>

        <div className="border-t border-zinc-700 mt-6 pt-4 text-center text-sm text-muted-foreground">
          Powered by{" "}
          <a
            href="https://paylogapp.vercel.app/"
            target="_blank"
            className="text-indigo-500 hover:underline"
          >
            PayLog
          </a>{" "}
          <br />
          Simplify your finances today!
        </div>
      </div>
    </div>
  );
}

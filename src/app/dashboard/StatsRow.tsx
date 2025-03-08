"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, FileText } from "lucide-react";

export const StatsRow = () => {
  const [transactions, setTransactions] = useState([]); // ✅ Store transactions
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch all transactions again
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions"); // Assuming API returns user's transactions
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        setError("Error fetching transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // ✅ Calculate total balance (Credits - Debits)
  const totalBalance = transactions.reduce((acc, transaction) => {
    return transaction.type === "credit"
      ? acc + transaction.amount
      : acc - transaction.amount;
  }, 0);

  // ✅ Calculate "What Others Owe Me" (Total of Credit Transactions)
  const whatOthersOweMe = transactions
    .filter((transaction) => transaction.type === "credit")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  // ✅ Calculate "What I Owe" (Total of Debit Transactions)
  const whatIOwe = transactions
    .filter((transaction) => transaction.type === "debit")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const stats = [
    {
      title: "Total Balance",
      value: loading
        ? "Loading..."
        : `PKR ${new Intl.NumberFormat("en-PK").format(totalBalance)}`,
      icon: <FileText className="text-primary size-6" />,
    },
    {
      title: "What Others Owe Me",
      value: loading
        ? "Loading..."
        : `PKR ${new Intl.NumberFormat("en-PK").format(whatOthersOweMe)}`,
      icon: <ArrowUp className="text-green-500 size-6" />,
    },
    {
      title: "What I Owe",
      value: loading
        ? "Loading..."
        : `PKR ${new Intl.NumberFormat("en-PK").format(whatIOwe)}`,
      icon: <ArrowDown className="text-red-500 size-6" />,
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {error && <p className="text-red-500">{error}</p>}

      {stats.map((stat, index) => (
        <Card
          key={index}
          className="shadow-md border border-secondary transition-all hover:scale-[1.02] p-4"
        >
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-md">{stat.title}</CardTitle>
            <div className="p-2 rounded-full bg-primary/10">{stat.icon}</div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

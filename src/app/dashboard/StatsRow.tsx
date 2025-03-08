"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, FileText } from "lucide-react";

export const StatsRow = () => {
  interface Transaction {
    type: "credit" | "debit";
    amount: number;
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions");
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        setTransactions(data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError("Error fetching transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const totalBalance = transactions.reduce((acc, transaction) => {
    return transaction.type === "credit"
      ? acc + transaction.amount
      : acc - transaction.amount;
  }, 0);

  const whatOthersOweMe = transactions
    .filter((transaction) => transaction.type === "credit")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

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
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 px-4 md:px-8">
      {error && (
        <p className="text-red-500 text-center col-span-full">{error}</p>
      )}

      {stats.map((stat, index) => (
        <Card
          key={index}
          className="shadow-lg border border-border rounded-2xl transition-all hover:scale-[1.02] p-6 bg-card text-foreground"
        >
          <CardHeader className="flex justify-between items-center pb-3">
            <CardTitle className="text-lg font-medium">{stat.title}</CardTitle>
            <div className="p-3 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

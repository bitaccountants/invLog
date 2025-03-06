"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  FileText,
  Pencil,
  Trash2,
  PlusCircle,
  MoreHorizontal,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Dummy Transactions Data
const transactions = [
  {
    id: "1",
    name: "John Doe",
    date: "2025-03-02",
    type: "Credit",
    amount: 2000,
  },
  {
    id: "2",
    name: "Jane Smith",
    date: "2025-03-05",
    type: "Debit",
    amount: 500,
  },
  {
    id: "3",
    name: "Michael Brown",
    date: "2025-03-10",
    type: "Credit",
    amount: 1500,
  },
  {
    id: "4",
    name: "Sarah Johnson",
    date: "2025-03-15",
    type: "Debit",
    amount: 800,
  },
  {
    id: "5",
    name: "David Lee",
    date: "2025-03-20",
    type: "Credit",
    amount: 1200,
  },
];

// Dummy Stats Data
const stats = [
  {
    title: "Total Balance",
    value: "PKR 12,500",
    icon: <FileText className="text-primary size-6" />,
  },
  {
    title: "What Others Owe Me",
    value: "PKR 8,200",
    icon: <ArrowUp className="text-green-500 size-6" />,
  },
  {
    title: "What I Owe",
    value: "PKR 4,300",
    icon: <ArrowDown className="text-red-500 size-6" />,
  },
  {
    title: "Invoices Generated",
    value: "15",
    icon: <FileText className="text-primary size-6" />,
  },
];

export default function Dashboard() {
  const [data, setData] = useState(transactions);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Toggle Selection for Bulk Delete
  const toggleSelect = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((row) => row !== id) : [...prev, id]
    );
  };

  // Delete Selected Rows
  const handleBulkDelete = () => {
    setData(data.filter((item) => !selectedRows.includes(item.id)));
    setSelectedRows([]);
  };

  return (
    <div className="container py-12">
      {/* Dashboard Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Your Financial Overview</h1>
        <p className="text-muted-foreground">
          Track your transactions and manage your finances effectively.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      {/* Transaction Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <Button className="flex items-center gap-2 w-40">
          <PlusCircle className="size-5 text-green-500" />
          Credit
        </Button>
        <Button
          className="flex items-center gap-2 w-40"
          variant="secondary"
        >
          <PlusCircle className="size-5 text-red-500" />
          Debit
        </Button>
      </div>

      {/* Transactions Table */}
      <div className="bg-card p-6 border border-secondary rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <Button
            variant="destructive"
            className="hidden sm:flex"
            onClick={handleBulkDelete}
            disabled={selectedRows.length === 0}
          >
            <Trash2 className="size-4 mr-2" />
            Delete Selected
          </Button>
        </div>
        <p className="text-muted-foreground mb-4">
          Below are your latest transactions.
        </p>

        {/* Search & Filters */}
        <div className="flex items-center gap-4 py-4">
          <Input
            placeholder="Search transactions..."
            className="max-w-sm"
          />
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox
                  checked={
                    selectedRows.length === data.length && data.length > 0
                  }
                  onCheckedChange={() => {
                    setSelectedRows(
                      selectedRows.length === data.length
                        ? []
                        : data.map((t) => t.id)
                    );
                  }}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount (PKR)</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(transaction.id)}
                    onCheckedChange={() => toggleSelect(transaction.id)}
                  />
                </TableCell>
                <TableCell>{transaction.name}</TableCell>
                <TableCell
                  className={`${
                    transaction.type === "Credit"
                      ? "text-green-500"
                      : "text-red-500"
                  } font-semibold`}
                >
                  {transaction.type}
                </TableCell>
                <TableCell className="text-right font-medium">
                  PKR{" "}
                  {new Intl.NumberFormat("en-PK").format(transaction.amount)}
                </TableCell>
                <TableCell>
                  {new Date(transaction.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                      >
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Pencil className="size-4 mr-2" />
                        Edit Transaction
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleBulkDelete()}>
                        <Trash2 className="size-4 mr-2" />
                        Delete Transaction
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

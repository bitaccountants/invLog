'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, FileText, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteConfirmation } from "@/components/ui/DeleteConfirmation"; // Importing our new component

const transactions = [
  {
    id: "1",
    name: "John Doe",
    date: "2025-03-02",
    type: "Credit",
    amount: 2000,
    remarks: "Freelance Payment",
  },
  {
    id: "2",
    name: "Jane Smith",
    date: "2025-03-05",
    type: "Debit",
    amount: 500,
    remarks: "Dinner with friends",
  },
  {
    id: "3",
    name: "Michael Brown",
    date: "2025-03-10",
    type: "Credit",
    amount: 1500,
    remarks: "Sold old laptop",
  },
];

export const TransactionTable = () => {
  const [data, setData] = useState(transactions);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Delete Transaction
  const handleDelete = (id: string) => {
    setData(data.filter((transaction) => transaction.id !== id));
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    setData(
      data.filter((transaction) => !selectedRows.includes(transaction.id))
    );
    setSelectedRows([]);
  };

  return (
    <div className="bg-card p-6 border border-secondary rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>

        {/* Bulk Delete Button with Confirmation */}
        <DeleteConfirmation
          triggerText="Delete Selected"
          title="Delete Selected Transactions"
          description="This action cannot be undone. Are you sure you want to delete these transactions?"
          onConfirm={handleBulkDelete}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                checked={selectedRows.length === data.length && data.length > 0}
                onCheckedChange={() =>
                  setSelectedRows(
                    selectedRows.length === data.length
                      ? []
                      : data.map((t) => t.id)
                  )
                }
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Amount (PKR)</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                <Checkbox
                  checked={selectedRows.includes(transaction.id)}
                  onCheckedChange={() =>
                    setSelectedRows([...selectedRows, transaction.id])
                  }
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
                PKR {new Intl.NumberFormat("en-PK").format(transaction.amount)}
              </TableCell>
              <TableCell>
                {new Date(transaction.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {transaction.remarks}
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
                    <DropdownMenuItem>
                      <FileText className="size-4 mr-2 text-primary" />
                      Generate Invoice
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    {/* Delete Transaction with Confirmation */}
                    <DeleteConfirmation
                      triggerText="Delete Transaction"
                      title="Delete Transaction"
                      description="Are you sure you want to delete this transaction? This action cannot be undone."
                      onConfirm={() => handleDelete(transaction.id)}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

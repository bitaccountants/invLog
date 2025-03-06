"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pencil,
  Trash2,
  FileText,
  MoreHorizontal,
  Loader2,
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
import { DeleteConfirmation } from "@/components/ui/DeleteConfirmation";
import { AlertMessage } from "@/components/ui/AlertMessage";

export const TransactionTable = () => {
  const [data, setData] = useState([]); // Store transactions
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [alert, setAlert] = useState<{
    type: "success" | "warning" | "error" | null;
    message: string;
  } | null>(null);

  // ✅ **Fetch Transactions**
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions");

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const transactions = await response.json();
        setData(transactions);
      } catch (error) {
        setError("Error fetching transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // ✅ **Handle Delete Transaction**
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch("/api/transactions", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }

      setData(data.filter((transaction) => transaction._id !== id));
      setAlert({
        type: "success",
        message: "Transaction deleted successfully!",
      });
    } catch (error) {
      setAlert({ type: "error", message: "Failed to delete transaction." });
    }
  };

  // ✅ **Handle Bulk Delete**
  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      setAlert({
        type: "warning",
        message: "No transactions selected for deletion.",
      });
      return;
    }

    try {
      const response = await fetch("/api/transactions", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedRows }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete transactions");
      }

      setData(
        data.filter((transaction) => !selectedRows.includes(transaction._id))
      );
      setSelectedRows([]);
      setAlert({
        type: "success",
        message: "Selected transactions deleted successfully!",
      });
    } catch (error) {
      setAlert({ type: "error", message: "Failed to delete transactions." });
    }
  };

  return (
    <div className="bg-card p-6 border border-secondary rounded-lg shadow-md">
      {/* Show Alerts */}
      {alert && (
        <AlertMessage
          type={alert.type!}
          title={
            alert.type === "error"
              ? "Error"
              : alert.type === "warning"
              ? "Warning"
              : "Success"
          }
          description={alert.message}
        />
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>

        <DeleteConfirmation
          triggerText="Delete Selected"
          title="Delete Selected Transactions"
          description="You are about to delete multiple records. This action is irreversible. Are you sure?"
          onConfirm={handleBulkDelete}
        >
          <Button
            variant="destructive"
            disabled={selectedRows.length === 0}
          >
            <Trash2 className="size-4 mr-2" />
            Delete Selected
          </Button>
        </DeleteConfirmation>
      </div>

      {/* ✅ **Loading State** */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="size-6 animate-spin" />
        </div>
      )}

      {/* ✅ **Error State** */}
      {error && (
        <p className="text-red-500 text-center font-medium py-4">{error}</p>
      )}

      {/* ✅ **Table Data** */}
      {!loading && !error && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox
                  checked={
                    selectedRows.length === data.length && data.length > 0
                  }
                  onCheckedChange={() =>
                    setSelectedRows(
                      selectedRows.length === data.length
                        ? []
                        : data.map((t) => t._id)
                    )
                  }
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount (PKR)</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(transaction._id)}
                    onCheckedChange={() =>
                      setSelectedRows((prev) =>
                        prev.includes(transaction._id)
                          ? prev.filter((id) => id !== transaction._id)
                          : [...prev, transaction._id]
                      )
                    }
                  />
                </TableCell>
                <TableCell>{transaction.name}</TableCell>
                <TableCell
                  className={`${
                    transaction.type === "credit"
                      ? "text-green-500"
                      : "text-red-500"
                  } font-semibold`}
                >
                  {transaction.type}
                </TableCell>
                <TableCell>
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
                <TableCell>{transaction.remarks}</TableCell>
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
                      <DeleteConfirmation
                        triggerText="Delete Transaction"
                        title="Delete Transaction"
                        description="Are you sure?"
                        onConfirm={() => handleDelete(transaction._id)}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

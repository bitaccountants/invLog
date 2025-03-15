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
import { Pencil, Trash2, FileText, MoreHorizontal } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type Transaction = {
  _id: string;
  name: string;
  type: "credit" | "debit";
  amount: number;
  date: string;
  remarks?: string;
};

export const TransactionTable = () => {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [alert, setAlert] = useState<{
    type: "success" | "warning" | "error" | null;
    message: string;
  } | null>(null);

  // State for editing
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<any>(null);

  // Fetch Transactions
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

  // Handle Delete Transaction
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

      setData((prevData) =>
        prevData.filter((transaction) => transaction._id !== id)
      );
      setAlert({
        type: "success",
        message: "Transaction deleted successfully!",
      });
    } catch (error) {
      setAlert({ type: "error", message: "Failed to delete transaction." });
    }
  };

  // Handle Edit Transaction
  const handleEditClick = (transaction: any) => {
    setCurrentTransaction(transaction);
    setEditDialogOpen(true);
  };

  // Handle Update Transaction
  const handleUpdate = async () => {
    if (!currentTransaction?._id) {
      toast.error("❌ Transaction ID is missing!");
      return;
    }

    const updatedTransactionData = {
      id: currentTransaction._id,
      name: currentTransaction.name,
      type: currentTransaction.type.toLowerCase(),
      amount: Number(currentTransaction.amount),
      date: new Date(currentTransaction.date),
      remarks: currentTransaction.remarks || "",
    };

    try {
      const response = await fetch("/api/transactions", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTransactionData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to update transaction");
      }

      setData((prevData) =>
        prevData.map((t) => (t._id === responseData._id ? responseData : t))
      );

      toast.success("✅ Transaction updated successfully!");
      setEditDialogOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`❌ Error: ${error.message}`);
      } else {
        toast.error("❌ An unknown error occurred.");
      }
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
      </div>

      {/* Table Data */}
      <Table>
        <TableHeader>
          <TableRow>
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
              <TableCell>{transaction.name}</TableCell>
              <TableCell
                className={
                  transaction.type === "credit"
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {transaction.type}
              </TableCell>
              <TableCell>
                PKR {new Intl.NumberFormat("en-PK").format(transaction.amount)}
              </TableCell>
              <TableCell>
                {new Date(transaction.date).toLocaleDateString("en-GB")}
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
                    <DropdownMenuItem
                      onClick={() => handleEditClick(transaction)}
                    >
                      <Pencil className="size-4 mr-2" /> Edit Transaction
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="size-4 mr-2 text-primary" /> Generate
                      Invoice
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

      {/* Edit Transaction Dialog */}
      <Dialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>

          <Label>Name</Label>
          <Input
            name="name"
            value={currentTransaction?.name}
            onChange={(e) =>
              setCurrentTransaction({
                ...currentTransaction,
                name: e.target.value,
              })
            }
          />

          <Label>Amount</Label>
          <Input
            name="amount"
            type="number"
            value={currentTransaction?.amount}
            onChange={(e) =>
              setCurrentTransaction({
                ...currentTransaction,
                amount: e.target.value,
              })
            }
          />

          <Label>Transaction Type</Label>
          <Select
            value={currentTransaction?.type}
            onValueChange={(value) =>
              setCurrentTransaction({ ...currentTransaction, type: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Transaction Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Label>Remarks</Label>
          <Textarea
            name="remarks"
            value={currentTransaction?.remarks}
            onChange={(e) =>
              setCurrentTransaction({
                ...currentTransaction,
                remarks: e.target.value,
              })
            }
          />

          <DialogFooter>
            <Button onClick={handleUpdate}>Apply Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

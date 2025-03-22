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
import { Pencil, Trash2, FileText, Loader } from "lucide-react";
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
  const [alert, setAlert] = useState<{
    type: "success" | "warning" | "error" | null;
    message: string;
  } | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] =
    useState<Transaction | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const totalPages = Math.ceil(data.length / rowsPerPage);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions");
        if (!response.ok) throw new Error("Failed to fetch transactions");
        const transactions = await response.json();
        setData(transactions);
      } catch (error) {
        setAlert({ type: "error", message: "Error fetching transactions." });
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch("/api/transactions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("Failed to delete transaction");
      setData((prev) => prev.filter((t) => t._id !== id));
      toast.success("✅ Transaction deleted successfully!");
    } catch (error) {
      toast.error("❌ Failed to delete transaction.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!currentTransaction?._id) {
      toast.error("❌ Transaction ID is missing!");
      return;
    }

    setSaving(true);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTransactionData),
      });

      const responseData = await response.json();
      if (!response.ok)
        throw new Error(responseData.error || "Failed to update transaction");

      setData((prev) =>
        prev.map((t) => (t._id === responseData._id ? responseData : t))
      );
      toast.success("✅ Transaction updated successfully!");
      setEditDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `❌ ${error.message}`
          : "❌ An unknown error occurred."
      );
    } finally {
      setSaving(false);
    }
  };

  // Calculate the visible rows for pagination
  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="bg-card p-6 border border-secondary rounded-lg shadow-md">
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

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground">
          <Loader className="size-5 animate-spin" /> Loading recent
          transactions...
        </div>
      ) : (
        <>
          <Table className="text-base">
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
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No transactions to show. Please add some transactions to see
                    them here.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((transaction) => (
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
                      PKR{" "}
                      {new Intl.NumberFormat("en-PK").format(
                        transaction.amount
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.date).toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell>{transaction.remarks}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      {/* Edit Icon */}
                      <Pencil
                        className="size-4 text-primary cursor-pointer hover:text-blue-500"
                        onClick={() => handleEditClick(transaction)}
                      />

                      {/* Invoice Icon */}
                      <FileText
                        className="size-4 text-primary cursor-pointer hover:text-blue-500"
                        onClick={() =>
                          toast.info(
                            "📄 Invoice generation is not implemented yet."
                          )
                        }
                      />
                      {/* Delete Icon */}
                      {deletingId === transaction._id ? (
                        <Loader className="size-4 animate-spin text-red-500" />
                      ) : (
                        <Trash2
                          className="size-4 text-red-500 cursor-pointer hover:text-red-600"
                          onClick={() => handleDelete(transaction._id)}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-muted-foreground">
              {paginatedData.length} of {data.length} row(s) showing.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

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
              setCurrentTransaction((prev) =>
                prev ? { ...prev, name: e.target.value } : prev
              )
            }
          />

          <Label>Amount</Label>
          <Input
            name="amount"
            type="number"
            value={currentTransaction?.amount}
            onChange={(e) =>
              setCurrentTransaction((prev) =>
                prev ? { ...prev, amount: Number(e.target.value) } : prev
              )
            }
          />

          <Label>Transaction Type</Label>
          <Select
            value={currentTransaction?.type}
            onValueChange={(value) =>
              setCurrentTransaction((prev) =>
                prev ? { ...prev, type: value as "credit" | "debit" } : prev
              )
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
              setCurrentTransaction((prev) =>
                prev ? { ...prev, remarks: e.target.value } : prev
              )
            }
          />

          <DialogFooter>
            <Button
              onClick={handleUpdate}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader className="size-4 mr-2 animate-spin" /> Saving...
                </>
              ) : (
                "Apply Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

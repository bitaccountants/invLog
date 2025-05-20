"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUp,
  ArrowDown,
  FileText,
  Loader,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { formatDateTime } from "@/lib/utils";
import { jsPDF } from "jspdf";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Share, Download, Paperclip } from "lucide-react";
import autoTable from "jspdf-autotable";

type Transaction = {
  _id?: string;
  name: string;
  type: "credit" | "debit";
  amount: number;
  date?: string;
  remarks?: string;
  sharedId?: string;
};

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: { finalY: number };
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const isSignedIn = status === "authenticated";
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Transaction>({
    name: "",
    amount: 0,
    type: "credit",
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] =
    useState<Transaction | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addButtonLoading, setAddButtonLoading] = useState(false);

  const rowsPerPage = 5;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data);
    } catch {
      toast.error("Failed to fetch transactions.");
    } finally {
      setLoading(false);
    }
  };

  const totalBalance = transactions.reduce(
    (acc, t) => (t.type === "credit" ? acc + t.amount : acc - t.amount),
    0
  );
  const receivables = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);
  const payables = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  const handleSaveTransaction = async () => {
    if (!newTransaction.name || !newTransaction.amount) {
      toast.error("Please fill all required fields!");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction),
      });
      const data = await res.json();
      if (res.ok) {
        setTransactions([data, ...transactions]);
        setTimeout(() => setOpen(false), 500); // Small delay for UX
        toast.success("Transaction added successfully.");
        setNewTransaction({ name: "", amount: 0, type: "credit" });
      } else {
        toast.error(data.error || "Failed to add transaction.");
      }
    } catch {
      toast.error("Error adding transaction.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/transactions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setTransactions(transactions.filter((t) => t._id !== id));
        toast.success("Transaction deleted.");
      } else {
        toast.error("Failed to delete.");
      }
    } catch {
      toast.error("Error deleting.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdate = async () => {
    if (!currentTransaction?._id) return;
    setSaving(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentTransaction._id,
          name: currentTransaction.name,
          amount: currentTransaction.amount,
          type: currentTransaction.type,
          remarks: currentTransaction.remarks,
          date: currentTransaction.date,
        }),
      });
      const updated = await res.json();
      if (res.ok) {
        setTransactions(
          transactions.map((t) => (t._id === updated._id ? updated : t))
        );
        toast.success("Updated successfully!");
        setEditDialogOpen(false);
      } else {
        toast.error(updated.error || "Update failed.");
      }
    } catch {
      toast.error("Error updating.");
    } finally {
      setSaving(false);
    }
  };

  const generateInvoice = (transaction: Transaction) => {
    const doc: jsPDFWithAutoTable = new jsPDF();

    doc.setFillColor("#4f46e5");
    doc.rect(0, 0, 210, 30, "F");
    doc.setFontSize(18);
    doc.setTextColor("#ffffff");
    doc.text("PayLog - Transaction Invoice", 105, 18, { align: "center" });

    autoTable(doc, {
      startY: 40,
      head: [["Field", "Details"]],
      body: [
        ["Name", transaction.name],
        ["Type", transaction.type],
        ["Amount", `$${transaction.amount}`],
        ["Date", formatDateTime(transaction.date)],
        ["Remarks", transaction.remarks || "N/A"],
      ],
      theme: "striped",
      headStyles: { fillColor: [79, 70, 229] },
    });

    addPdfFooter(doc);

    const blobUrl = URL.createObjectURL(doc.output("blob"));
    window.open(blobUrl, "_blank");
    toast.success("Invoice preview generated!");
  };

  const exportAllTransactions = () => {
    if (!transactions.length) return toast.error("No transactions");

    const doc: jsPDFWithAutoTable = new jsPDF();
    doc.setFillColor("#4f46e5");
    doc.rect(0, 0, 210, 30, "F");
    doc.setFontSize(18);
    doc.setTextColor("#ffffff");
    doc.text("PayLog - Transaction Report", 105, 18, { align: "center" });

    autoTable(doc, {
      startY: 40,
      head: [["Name", "Type", "Amount", "Date", "Remarks"]],
      body: transactions.map((t) => [
        t.name,
        t.type,
        `$${t.amount}`,
        formatDateTime(t.date),
        t.remarks || "-",
      ]),
      theme: "striped",
      headStyles: { fillColor: [79, 70, 229] },
    });

    addPdfFooter(doc);

    const blobUrl = URL.createObjectURL(doc.output("blob"));
    window.open(blobUrl, "_blank");
    toast.success("Transactions exported successfully!");
  };

  const addNote = (transaction: Transaction) => {
    alert("Adding note to transaction...");
  };

  const addPdfFooter = (doc: jsPDFWithAutoTable) => {
    const finalY = doc.lastAutoTable?.finalY || 120;
    doc.setTextColor("#4f46e5");
    doc.setFontSize(12);
    doc.textWithLink(
      "Visit PayLog: https://paylogapp.vercel.app/",
      20,
      finalY + 20,
      { url: "https://paylogapp.vercel.app/" }
    );
    doc.setTextColor("#999999");
    doc.text("Generated by PayLog - Smart Finance Manager.", 20, finalY + 35);
  };

  const shareTransaction = async (transaction: Transaction) => {
    let sharedId =
      transaction.sharedId || Math.random().toString(36).substr(2, 8);

    // Save sharedId to DB if not present
    if (!transaction.sharedId) {
      const res = await fetch("/api/transactions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: transaction._id, sharedId }),
      });
      if (!res.ok) return toast.error("Failed to generate link");
    }

    const link = `${window.location.origin}/shared/${sharedId}`;
    await navigator.clipboard.writeText(link);
    toast.success("Shareable link copied!");
  };

  const paginatedData = transactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  if (status !== "authenticated")
    return <div className="text-center mt-10">Redirecting...</div>;

  return (
    <div className="container py-12 space-y-10">
      {/* Stats */}
      <div className="px-4 md:px-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Financial Overview</h1>
          <p className="text-muted-foreground">
            Get insights into your balance, receivables, and payables.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              label: "Net Balance",
              value: totalBalance,
              icon: <FileText className="text-primary size-6" />,
            },
            {
              label: "Receivables",
              value: receivables,
              icon: <ArrowUp className="text-green-500 size-6" />,
            },
            {
              label: "Payables",
              value: payables,
              icon: <ArrowDown className="text-red-500 size-6" />,
            },
          ].map((stat, idx) => (
            <Card
              key={idx}
              className="shadow-lg border rounded-2xl p-6 bg-card text-foreground"
            >
              <CardHeader className="flex justify-between items-center pb-2">
                <CardTitle className="text-lg">{stat.label}</CardTitle>
                <div className="p-3 rounded-full bg-primary/10">
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader className="size-5 animate-spin" /> Loading...
                  </div>
                ) : (
                  <p className="text-muted-foreground text-3xl font-bold">
                    {stat.value.toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-card p-6 border border-secondary rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground">
            <Loader className="size-5 animate-spin" /> Loading transactions...
          </div>
        ) : (
          <>
            <Table className="text-base">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
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
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((t) => (
                    <TableRow key={t._id}>
                      {/* Truncated Cells */}
                      <TableCell
                        className="max-w-[200px] truncate"
                        title={t.name}
                      >
                        {t.name}
                      </TableCell>
                      <TableCell
                        className={`max-w-[100px] truncate ${
                          t.type === "credit"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                        title={t.type}
                      >
                        {t.type}
                      </TableCell>
                      <TableCell
                        className="max-w-[150px] truncate"
                        title={`${t.amount.toLocaleString()}`}
                      >
                        {t.amount.toLocaleString()}
                      </TableCell>
                      <TableCell
                        className="max-w-[180px] truncate"
                        title={formatDateTime(t.date)}
                      >
                        {formatDateTime(t.date)}
                      </TableCell>
                      <TableCell
                        className="max-w-[250px] truncate"
                        title={t.remarks}
                      >
                        {t.remarks}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="focus:outline-none">
                            <MoreHorizontal className="cursor-pointer" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {/* Edit */}
                            <DropdownMenuItem
                              onClick={() => {
                                setCurrentTransaction(t);
                                setEditDialogOpen(true);
                              }}
                              className="flex items-center gap-2"
                            >
                              <Pencil className="w-4 h-4 text-yellow-500" />{" "}
                              Edit
                            </DropdownMenuItem>

                            {/* Delete */}
                            <DropdownMenuItem
                              onClick={() => handleDelete(t._id)}
                              className="flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" /> Delete
                            </DropdownMenuItem>

                            {/* Invoice */}
                            <DropdownMenuItem
                              onClick={() => generateInvoice(t)}
                              className="flex items-center gap-2"
                            >
                              <FileText className="w-4 h-4 text-blue-500" />{" "}
                              Generate Invoice
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => shareTransaction(t)}
                              className="flex items-center gap-2"
                            >
                              <Share className="w-4 h-4 text-purple-500" />{" "}
                              Share Transection
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={exportAllTransactions}
                              className="flex items-center gap-2"
                            >
                              <Download className="w-4 h-4 text-green-600" />{" "}
                              Export All Transactions
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => addNote(t)}
                              className="flex items-center gap-2"
                            >
                              <Paperclip className="w-4 h-4 text-gray-500" />{" "}
                              Add an Attachment
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between py-4">
              <div className="text-sm text-muted-foreground">
                {paginatedData.length} of {transactions.length} row(s) showing.
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1 || paginatedData.length === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={
                    currentPage === totalPages || paginatedData.length === 0
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Floating Add Button */}
      <Button
        onClick={() => {
          setOpen(true);
        }}
        disabled={addButtonLoading}
        className="fixed bottom-6 right-6 size-14 rounded-full shadow-md flex items-center justify-center"
      >
        {addButtonLoading ? (
          <Loader className="animate-spin size-5" />
        ) : (
          <Plus className="size-6" />
        )}
      </Button>

      {/* Add Transaction Dialog */}
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <Label>Transaction Name</Label>
            <Input
              value={newTransaction.name}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, name: e.target.value })
              }
              disabled={saving}
            />
            <Label>Amount</Label>
            <Input
              type="number"
              value={newTransaction.amount}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  amount: +e.target.value,
                })
              }
              disabled={saving}
            />
            <Label>Type</Label>
            <Select
              value={newTransaction.type}
              onValueChange={(val) =>
                setNewTransaction({
                  ...newTransaction,
                  type: val as "credit" | "debit",
                })
              }
              disabled={saving}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
              </SelectContent>
            </Select>
            <Label>Remarks</Label>
            <Textarea
              value={newTransaction.remarks}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  remarks: e.target.value,
                })
              }
              disabled={saving}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={handleSaveTransaction}
              disabled={saving}
            >
              {saving ? (
                <Loader className="size-4 animate-spin mr-2" />
              ) : (
                "Save Transaction"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            value={currentTransaction?.name}
            onChange={(e) =>
              setCurrentTransaction((prev) =>
                prev ? { ...prev, name: e.target.value } : prev
              )
            }
          />
          <Label>Amount</Label>
          <Input
            type="number"
            value={currentTransaction?.amount}
            onChange={(e) =>
              setCurrentTransaction((prev) =>
                prev ? { ...prev, amount: +e.target.value } : prev
              )
            }
          />
          <Label>Type</Label>
          <Select
            value={currentTransaction?.type}
            onValueChange={(val) =>
              setCurrentTransaction((prev) =>
                prev ? { ...prev, type: val as "credit" | "debit" } : prev
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="credit">Credit</SelectItem>
              <SelectItem value="debit">Debit</SelectItem>
            </SelectContent>
          </Select>
          <Label>Remarks</Label>
          <Textarea
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
                <Loader className="size-4 animate-spin mr-2" />
              ) : (
                "Apply Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

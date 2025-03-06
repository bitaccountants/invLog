"use client";

import { useState } from "react";
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
  Pencil,
  Trash2,
  FileText,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
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
  {
    id: "4",
    name: "Sarah Johnson",
    date: "2025-03-15",
    type: "Debit",
    amount: 800,
    remarks: "Electricity Bill",
  },
  {
    id: "5",
    name: "David Lee",
    date: "2025-03-20",
    type: "Credit",
    amount: 1200,
    remarks: "Project Advance",
  },
  {
    id: "6",
    name: "Emily White",
    date: "2025-03-25",
    type: "Debit",
    amount: 900,
    remarks: "Gym Membership",
  },
];

export const TransactionTable = () => {
  const [data, setData] = useState(transactions);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3;

  // Search Filter Logic
  const filteredData = data.filter(
    (transaction) =>
      transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.remarks.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

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
    <div className="bg-card p-6 border border-secondary rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <Button
          variant="destructive"
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

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 py-4">
        <Input
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <span className="text-sm text-muted-foreground">
          {filteredData.length} results found
        </span>
      </div>

      {/* Table */}
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
          {currentRows.length > 0 ? (
            currentRows.map((transaction) => (
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
                      <DropdownMenuItem onClick={() => handleBulkDelete()}>
                        <Trash2 className="size-4 mr-2" />
                        Delete Transaction
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-4 text-muted-foreground"
              >
                No transactions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          {selectedRows.length} of {filteredData.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="size-4 mr-1" />
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
            <ChevronRight className="size-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

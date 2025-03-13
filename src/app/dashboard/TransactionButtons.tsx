"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

export const TransactionButtons = () => {
  const [open, setOpen] = useState(false);
  const [transaction, setTransaction] = useState({
    name: "",
    amount: "",
    type: "credit",
    remarks: "",
  });

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };

  // Handle type selection
  const handleTypeChange = (value: string) => {
    setTransaction({ ...transaction, type: value });
  };

  // Handle saving transaction
  const handleSave = async () => {
    if (!transaction.name || !transaction.amount) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Transaction added successfully!");
        setTransaction({ name: "", amount: "", type: "credit", remarks: "" });
        setOpen(false);
      } else {
        toast.error(data.error || "Failed to add transaction.");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Something went wrong. Try again!");
    }
  };

  return (
    <>
      {/* Floating Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setOpen(true)}
              className="fixed bottom-6 right-6 bg-background border border-border text-foreground size-14 rounded-full shadow-md transition-all hover:scale-105 hover:bg-background hover:border-border focus:ring-2 focus:ring-muted z-50 flex items-center justify-center"
            >
              <Plus className="size-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="left"
            className="bg-background border border-border text-foreground px-3 py-2 rounded-md text-sm shadow-md"
          >
            Add Transaction
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Transaction Modal */}
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <Label
                className="text-muted-foreground"
                htmlFor="name"
              >
                Transaction Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter transaction name"
                value={transaction.name}
                onChange={handleChange}
              />
            </div>

            {/* Amount */}
            <div className="flex flex-col gap-2">
              <Label
                className="text-muted-foreground"
                htmlFor="amount"
              >
                Amount
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="Enter amount"
                value={transaction.amount}
                onChange={handleChange}
              />
            </div>

            {/* Type Selection */}
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground">Transaction Type</Label>
              <Select
                value={transaction.type}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="credit">Credit</SelectItem>
                    <SelectItem value="debit">Debit</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Remarks */}
            <div className="flex flex-col gap-2">
              <Label
                className="text-muted-foreground"
                htmlFor="remarks"
              >
                Remarks (Optional)
              </Label>
              <Textarea
                id="remarks"
                name="remarks"
                placeholder="Type your remarks here..."
                value={transaction.remarks}
                onChange={handleChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSave}>Save Transaction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

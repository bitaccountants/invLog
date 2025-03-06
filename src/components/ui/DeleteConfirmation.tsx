"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { OctagonAlert, X } from "lucide-react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

interface DeleteConfirmationProps {
  triggerText: string;
  title: string;
  description: string;
  onConfirm: () => void;
}

export const DeleteConfirmation = ({
  triggerText,
  title,
  description,
  onConfirm,
}: DeleteConfirmationProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">{triggerText}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <div className="-mt-3 -mx-6 border-b pb-3 px-6 flex justify-between items-center">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogPrimitive.Cancel className="rounded-full p-2 hover:bg-secondary transition">
            <X />
          </AlertDialogPrimitive.Cancel>
        </div>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <OctagonAlert className="h-6 w-6 text-destructive" />
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          </div>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

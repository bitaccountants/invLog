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
import { Button, buttonVariants } from "@/components/ui/button";
import { OctagonAlert, X } from "lucide-react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

// Props Interface
interface DeleteConfirmationProps {
  triggerText: string;
  title: string;
  description: string;
  onConfirm: () => void;
  variant?: "destructive" | "default";
}

export const DeleteConfirmation = ({
  triggerText,
  title,
  description,
  onConfirm,
  variant = "destructive",
}: DeleteConfirmationProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={variant}>{triggerText}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        {/* Header with Close Button */}
        <div className="-mt-3 -mx-6 border-b pb-3 px-6 flex justify-between items-center">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogPrimitive.Cancel
            className={buttonVariants({
              variant: "ghost",
              size: "icon",
              className: "!h-7 !w-7",
            })}
          >
            <X />
          </AlertDialogPrimitive.Cancel>
        </div>

        <AlertDialogHeader className="pt-2">
          <AlertDialogTitle>
            <div className="mx-auto sm:mx-0 mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10">
              <OctagonAlert className="h-5 w-5 text-destructive" />
            </div>
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[15px]">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

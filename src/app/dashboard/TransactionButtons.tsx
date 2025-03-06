import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export const TransactionButtons = () => {
  return (
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
  );
};

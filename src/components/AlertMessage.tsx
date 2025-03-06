"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  X,
  CircleCheckBig,
  Info,
  OctagonAlert,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type AlertType = "success" | "info" | "warning" | "error";

interface AlertMessageProps {
  type: AlertType;
  title: string;
  description: string;
  duration?: number;
  onClose?: () => void;
}

export const AlertMessage = ({
  type,
  title,
  description,
  duration = 5000,
  onClose,
}: AlertMessageProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const iconMap = {
    success: <CircleCheckBig className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
    warning: <TriangleAlert className="h-5 w-5" />,
    error: <OctagonAlert className="h-5 w-5" />,
  };

  const alertStyles = {
    success:
      "border-emerald-600/50 text-emerald-600 dark:border-emerald-600 [&>svg]:text-emerald-600",
    info: "border-cyan-600/50 text-cyan-600 dark:border-cyan-600 [&>svg]:text-cyan-600",
    warning:
      "border-amber-500/50 text-amber-500 dark:border-amber-500 [&>svg]:text-amber-500",
    error:
      "border-red-600/50 text-red-600 dark:border-red-600 [&>svg]:text-red-600",
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      <Alert
        className={`relative shadow-lg p-4 rounded-lg ${alertStyles[type]}`}
      >
        {iconMap[type]}
        <div className="flex-1">
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={() => setVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </Alert>
    </div>
  );
};

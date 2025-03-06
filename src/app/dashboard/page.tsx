"use client";

import { useUser } from "@clerk/nextjs"; // Clerk Authentication
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { StatsRow } from "./StatsRow";
import { TransactionButtons } from "./TransactionButtons";
import { TransactionTable } from "./TransactionTable";

export default function Dashboard() {
  const { isSignedIn } = useUser(); // Check if user is logged in
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isSignedIn) {
      router.push("/login");
    }
  }, [isSignedIn, router]);

  if (!isSignedIn) {
    return <div className="text-center mt-10">Redirecting...</div>;
  }

  return (
    <div className="container py-12">
      <StatsRow />
      <TransactionButtons />
      <TransactionTable />
    </div>
  );
}

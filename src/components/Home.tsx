"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <section className="container w-full">
      <div className="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto py-20 md:py-20">
        {/* Header Section */}
        <div className="text-center space-y-8">
          <Badge
            variant="outline"
            className="text-sm py-2"
          >
            <span className="mr-2 text-primary">
              <Badge>New</Badge>
            </span>
            <span> Simplify your finance tracking today! </span>
          </Badge>

          <div className="max-w-screen-md mx-auto text-center text-4xl md:text-6xl font-bold">
            <h1>
              Manage Your
              <span className="text-transparent px-2 bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text">
                Finances
              </span>
              Effortlessly
            </h1>
          </div>

          <p className="max-w-screen-sm mx-auto text-xl text-muted-foreground">
            Track your debts, manage balances, and generate invoices
            effortlessly with PayLog.
          </p>

          {/* Buttons */}
          <div className="space-y-4 md:space-y-0 md:space-x-4 pointer">
            <Link href="/dashboard">
              <Button className="w-5/6 md:w-1/4 font-bold group/arrow ">
                Get Started
                <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Button
              asChild
              variant="secondary"
              className="w-5/6 md:w-1/4 font-bold"
            >
              <Link
                href="https://github.com/ZeeshanMukhtar1/PayLog"
                target="_blank"
              >
                GitHub Repository
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { Menu, ChevronsDown, Sun, Moon, Github } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <header className="shadow-md bg-opacity-15 w-[90%] md:w-[80%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border border-secondary z-40 rounded-2xl flex justify-between items-center p-4 bg-card">
      {/* Logo */}
      <Link
        href="/"
        className="font-bold text-lg flex items-center"
      >
        <ChevronsDown className="bg-gradient-to-tr from-primary to-primary/70 border-secondary rounded-lg w-9 h-9 mr-2 border text-white" />
        PayLog
      </Link>

      {/* Mobile Menu */}
      <div className="flex items-center lg:hidden">
        <Sheet
          open={isOpen}
          onOpenChange={setIsOpen}
        >
          <SheetTrigger asChild>
            <Menu
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer lg:hidden"
            />
          </SheetTrigger>

          <SheetContent
            side="left"
            className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card border-secondary"
          >
            <div className="flex flex-col gap-4 p-4">
              <Link
                href="/"
                className="text-lg font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="text-lg font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            </div>

            {/* Footer - Theme Toggle & GitHub */}
            <div className="p-4 border-t border-secondary flex items-center gap-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>

              {/* GitHub Link */}
              <Button
                variant="ghost"
                size="icon"
                asChild
              >
                <Link
                  href="https://github.com/your-repo"
                  target="_blank"
                >
                  <Github className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-6">
        <Link
          href="/"
          className="text-lg font-medium hover:text-primary transition"
        >
          Home
        </Link>
        <Link
          href="/dashboard"
          className="text-lg font-medium hover:text-primary transition"
        >
          Dashboard
        </Link>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>

        {/* GitHub Link */}
        <Button
          variant="ghost"
          size="icon"
          asChild
        >
          <Link
            href="https://github.com/your-repo"
            target="_blank"
          >
            <Github className="w-5 h-5" />
          </Link>
        </Button>
      </nav>
    </header>
  );
};

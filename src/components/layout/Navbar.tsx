"use client";

import { useEffect, useState } from "react";
import { Menu, Sun, Moon, Github } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  // Scroll detection for auto-hide/show navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false); // Hide on scroll down
      } else {
        setIsVisible(true); // Show on scroll up
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`shadow-md bg-opacity-15 w-[90%] md:w-[80%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border border-secondary z-40 rounded-2xl flex justify-between items-center p-4 bg-card transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{ scrollBehavior: "smooth" }} // ✅ Smooth scroll enabled
    >
      {/* Logo */}
      <Link
        href="/"
        className="font-bold text-lg flex items-center"
      >
        PayLog
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-4">
        <SignedIn>
          <Link
            href="/dashboard"
            className={`text-lg font-medium hover:text-primary transition ${
              pathname === "/dashboard" ? "text-primary font-semibold" : ""
            }`}
          >
            Dashboard
          </Link>
        </SignedIn>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-5" />
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
            href="https://github.com/ZeeshanMukhtar1/PayLog"
            target="_blank"
          >
            <Github className="w-5 h-5" />
          </Link>
        </Button>

        {/* Auth */}
        <SignedOut>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button
            asChild
            variant="outline"
          >
            <Link href="/register">Register</Link>
          </Button>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </nav>

      {/* Mobile Navigation */}
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
              <SignedIn>
                <Link
                  href="/dashboard"
                  className={`text-lg font-semibold ${
                    pathname === "/dashboard" ? "text-primary" : ""
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              </SignedIn>

              {/* Mobile CTA */}
              <Link
                href="/register"
                className="text-lg font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="p-4 border-t border-secondary flex items-center gap-4">
              <SignedOut>
                <Button asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                >
                  <Link href="/register">Register</Link>
                </Button>
              </SignedOut>

              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

import { Separator } from "@/components/ui/separator";
import { Github, Instagram, Linkedin } from "lucide-react";
import { Link } from "next-view-transitions";

export const Footer = () => {
  return (
    <footer
      id="footer"
      className="container py-24 sm:py-10"
    >
      <div className="p-10 bg-card border border-secondary rounded-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
          {/* Logo Section */}
          <div className="col-span-full xl:col-span-2">
            <Link
              href="/"
              className="flex font-bold items-center"
            >
              <h3 className="text-2xl">PayLog</h3>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Navigation</h3>
            <div>
              <Link
                href="/"
                className="opacity-60 hover:opacity-100"
              >
                Home
              </Link>
            </div>
            <div>
              <Link
                href="/dashboard"
                className="opacity-60 hover:opacity-100"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Contact</h3>
            <div className="flex items-center gap-2">
              <Github className="w-5 h-5 opacity-60" />
              <Link
                href="https://github.com/zeeshanmukhtar1"
                target="_blank"
                className="opacity-60 hover:opacity-100"
              >
                GitHub
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Linkedin className="w-5 h-5 opacity-60" />
              <Link
                href="https://www.linkedin.com/in/zeeshanmukhtar1/"
                className="opacity-60 hover:opacity-100"
              >
                LinkedIn
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Instagram className="w-5 h-5 opacity-60" />
              <Link
                href="https://www.instagram.com/zeshanmukhtar01/"
                className="opacity-60 hover:opacity-100"
              >
                Instagram
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Help</h3>
            <div>
              <Link
                href="https://codewithzeeshan.me/"
                className="opacity-60 hover:opacity-100"
              >
                Contact Us
              </Link>
            </div>
            <div>
              <Link
                href="mailto:zeeshanwebdev7@gmail.com?subject=Feedback%20for%20PayLog&body=Hello,%0D%0A%0D%0AI have some feedback regarding PayLog:%0D%0A%0D%0A"
                className="opacity-60 hover:opacity-100"
              >
                Feedback
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Copyright Section */}
        <section className="text-center">
          <h3 className="">
            &copy; 2024 Designed and developed by
            <Link
              target="_blank"
              href="https://github.com/zeeshanmukhtar1"
              className="text-primary transition-all border-primary hover:border-b-2 ml-1"
            >
              Zeeshan Mukhtar
            </Link>
          </h3>
        </section>
      </div>
    </footer>
  );
};

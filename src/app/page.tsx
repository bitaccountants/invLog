import { FAQSection } from "@/components/FAQ";
import { FeaturesSection } from "@/components/Features";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import Home from "@/components/Home";
import "./globals.css";

export default function page() {
  return (
    <>
      <Navbar />
      <Home />
      <FeaturesSection />
      <FAQSection />
      <Footer />
    </>
  );
}

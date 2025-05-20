import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface FeaturesProps {
  icon: string;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: "TrendingUp",
    title: "Track Incoming & Outgoing",
    description:
      "Easily monitor how much money you owe and how much others owe you.",
  },
  {
    icon: "DollarSign",
    title: "Total Balance Overview",
    description:
      "Keep track of your total balance in real-time, always staying informed.",
  },
  {
    icon: "FileText",
    title: "PDF Invoice Generation",
    description:
      "Generate and download invoices as PDFs for record-keeping and sharing.",
  },
  {
    icon: "BarChart",
    title: "Visual Financial Insights",
    description: "Understand your finances with interactive charts and graphs.",
  },
  {
    icon: "ShieldCheck",
    title: "Secure & Private",
    description:
      "PayLog uses NextAuth for authentication and encryption to protect your data.",
  },
  {
    icon: "Smartphone",
    title: "Mobile Friendly",
    description: "Access PayLog from any device with a seamless experience.",
  },
];

export const FeaturesSection = () => {
  return (
    <section
      id="features"
      className="container py-24 sm:py-0"
    >
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Features
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Why Choose PayLog?
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        Manage your debts, balances, and invoices effortlessly with smart
        insights and secure tracking.
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featureList.map(({ icon, title, description }) => (
          <div key={title}>
            <Card className="h-full bg-background border-0 shadow-none">
              <CardHeader className="flex justify-center items-center">
                <div className="bg-primary/20 p-2 rounded-full ring-8 ring-primary/10 mb-4">
                  <Icon
                    name={icon as keyof typeof icons}
                    size={24}
                    color="hsl(var(--primary))"
                    className="text-primary"
                  />
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground text-center">
                {description}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};

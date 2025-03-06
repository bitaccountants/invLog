import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, FileText } from "lucide-react";

const stats = [
  {
    title: "Total Balance",
    value: "PKR 12,500",
    icon: <FileText className="text-primary size-6" />,
  },
  {
    title: "What Others Owe Me",
    value: "PKR 8,200",
    icon: <ArrowUp className="text-green-500 size-6" />,
  },
  {
    title: "What I Owe",
    value: "PKR 4,300",
    icon: <ArrowDown className="text-red-500 size-6" />,
  },
  {
    title: "Invoices Generated",
    value: "15",
    icon: <FileText className="text-primary size-6" />,
  },
];

export const StatsRow = () => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="shadow-md border border-secondary transition-all hover:scale-[1.02] p-4"
        >
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-md">{stat.title}</CardTitle>
            <div className="p-2 rounded-full bg-primary/10">{stat.icon}</div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

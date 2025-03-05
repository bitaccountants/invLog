"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, FileText } from "lucide-react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  // Dummy Data for Cards
  const stats = [
    {
      title: "Total Balance",
      value: "$12,500",
      icon: <DollarSign className="text-primary" />,
    },
    {
      title: "Incoming",
      value: "$8,200",
      icon: <TrendingUp className="text-green-500" />,
    },
    {
      title: "Outgoing",
      value: "$4,300",
      icon: <TrendingDown className="text-red-500" />,
    },
    {
      title: "Invoices Generated",
      value: "15",
      icon: <FileText className="text-primary" />,
    },
  ];

  // Circular Chart Data
  const chartData = {
    labels: ["Incoming", "Outgoing"],
    datasets: [
      {
        label: "Amount ($)",
        data: [8200, 4300], // Example data
        backgroundColor: ["#22c55e", "#ef4444"], // Green for Incoming, Red for Outgoing
        borderColor: ["#16a34a", "#dc2626"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="shadow-md border border-secondary transition-all hover:scale-[1.02]"
          >
            <CardHeader className="flex justify-between items-center">
              <CardTitle>{stat.title}</CardTitle>
              <div className="p-2 rounded-full bg-primary/20">{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Circular Chart */}
      <div className="mt-12 flex justify-center">
        <div className="bg-card p-6 border border-secondary rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Financial Overview
          </h2>
          <Doughnut data={chartData} />
        </div>
      </div>
    </div>
  );
}

"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
// Remove the shadcn Tooltip import
// import { Tooltip } from "../ui/tooltip";
import { PaymentLog } from "@prisma/client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Tooltip } from "../ui/tooltip";

interface AreaChartStackedProps {
  currentMonthData: PaymentLog[];
  previousMonthData: PaymentLog[];
}

export function AreaChartStacked({ currentMonthData, previousMonthData }: AreaChartStackedProps) {
  // Process data for monthly trend (last 6 months)
  const processedData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    
    const monthStart = new Date(year, date.getMonth(), 1);
    const monthEnd = new Date(year, date.getMonth() + 1, 0);

    const currentMonthTotal = currentMonthData
      .filter(payment => {
        const paymentDate = new Date(payment.createdAt);
        return paymentDate >= monthStart && paymentDate <= monthEnd;
      })
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

    const previousMonthTotal = previousMonthData
      .filter(payment => {
        const paymentDate = new Date(payment.createdAt);
        return paymentDate >= monthStart && paymentDate <= monthEnd;
      })
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

    return {
      name: month,
      Current: currentMonthTotal,
      Previous: previousMonthTotal,
    };
  }).reverse();

  const currentTotal = currentMonthData.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const previousTotal = previousMonthData.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const growthPercentage = previousTotal > 0 
    ? ((currentTotal - previousTotal) / previousTotal) * 100 
    : currentTotal > 0 ? 100 : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="font-medium">{label}</div>
          {payload.map((entry: any, index: number) => (
            <div
              key={`item-${index}`}
              className="flex items-center gap-2 text-sm"
            >
              <div
                className="size-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.name}:</span>
              <span className="font-medium">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={processedData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tickMargin={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                tickFormatter={(value) => `৳${(value / 1000).toFixed(0)}K`}
              />
              // In the AreaChart component, update the Tooltip line:
              <RechartsTooltip 
                content={<CustomTooltip />}
                cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="Previous"
                stackId="1"
                stroke="#6366f1"
                fill="url(#colorPrevious)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="Current"
                stackId="2"
                stroke="#0ea5e9"
                fill="url(#colorCurrent)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-center">
        <div className="flex items-center justify-center gap-2 font-medium">
          <span>
            {growthPercentage >= 0 ? "Trending up" : "Trending down"} by{" "}
            {Math.abs(growthPercentage).toFixed(1)}%
          </span>
          <TrendingUp 
            className={`size-4 ${growthPercentage < 0 ? 'rotate-180 text-red-500' : 'text-green-500'}`} 
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Compared to previous month
        </p>
      </CardFooter>
    </Card>
  );
}

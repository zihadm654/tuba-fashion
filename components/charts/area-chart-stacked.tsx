"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { PaymentLog } from "@prisma/client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface AreaChartStackedProps {
  currentMonthData: PaymentLog[];
  previousMonthData: PaymentLog[];
}

const chartConfig = {
  current: {
    label: "Current Month",
    color: "hsl(var(--chart-1))",
  },
  previous: {
    label: "Previous Month",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function AreaChartStacked({ currentMonthData, previousMonthData }: AreaChartStackedProps) {
  // Process data for monthly trend (last 6 months)
  const processedData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    
    const monthStart = new Date(year, date.getMonth(), 1);
    const monthEnd = new Date(year, date.getMonth() + 1, 0);

    const monthTotal = currentMonthData
      .filter(payment => {
        const paymentDate = new Date(payment.createdAt);
        return paymentDate >= monthStart && paymentDate <= monthEnd;
      })
      .reduce((sum, payment) => sum + (payment.amount || 0), 0);

    const prevYearTotal = previousMonthData
      .filter(payment => {
        const paymentDate = new Date(payment.createdAt);
        return paymentDate >= monthStart && paymentDate <= monthEnd;
      })
      .reduce((sum, payment) => sum + (payment.amount || 0), 0);

    return {
      month: month,
      current: monthTotal,
      previous: prevYearTotal,
    };
  }).reverse(); // Reverse to show oldest to newest

  const currentTotal = currentMonthData.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const previousTotal = previousMonthData.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const growthPercentage = previousTotal > 0 
    ? ((currentTotal - previousTotal) / previousTotal) * 100 
    : 0;

  return (
    <Card className="flex flex-col">
      <CardHeader />
      <CardContent className="flex-1 h-[400px]">
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={processedData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `৳${(value / 1000).toFixed(0)}K`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="previous"
              type="monotone"
              fill="var(--color-previous)"
              fillOpacity={0.4}
              stroke="var(--color-previous)"
              stackId="a"
              name="Previous Year"
            />
            <Area
              dataKey="current"
              type="monotone"
              fill="var(--color-current)"
              fillOpacity={0.4}
              stroke="var(--color-current)"
              stackId="a"
              name="Current Year"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-pretty text-center text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {growthPercentage >= 0 ? "Trending up" : "Trending down"} by {Math.abs(growthPercentage).toFixed(1)}% this month 
          <TrendingUp className={`size-4 ${growthPercentage < 0 ? 'rotate-180' : ''}`} />
        </div>
        <div className="leading-none text-muted-foreground">
          6-Month Sales Comparison
        </div>
      </CardFooter>
    </Card>
  );
}

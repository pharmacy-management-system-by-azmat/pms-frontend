"use client";

import { useMemo, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const chartData = {
  today: {
    labels: ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM"],
    sales: [18, 31, 47, 38, 58, 65],
    revenue: [22, 38, 52, 44, 63, 72],
  },
  week: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    sales: [42, 55, 38, 63, 58, 74, 61],
    revenue: [51, 62, 49, 70, 68, 82, 72],
  },
  month: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    sales: [48, 68, 59, 76],
    revenue: [57, 78, 70, 88],
  },
};

function pointsFor(values) {
  const maxValue = Math.max(...values, 1);
  const horizontalGap = 100 / Math.max(values.length - 1, 1);

  return values
    .map(
      (value, index) =>
        `${index * horizontalGap},${92 - (value / maxValue) * 76}`,
    )
    .join(" ");
}

export default function RevenueChart() {
  const [period, setPeriod] = useState("today");
  const data = chartData[period];
  const salesPoints = useMemo(() => pointsFor(data.sales), [data.sales]);
  const revenuePoints = useMemo(() => pointsFor(data.revenue), [data.revenue]);

  return (
    <Card className="h-full">
      <CardHeader className="gap-4 sm:flex sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>Sales &amp; revenue trend</CardTitle>
          <CardDescription>
            Track transaction volume and revenue performance.
          </CardDescription>
        </div>
        <Tabs value={period} onValueChange={setPeriod}>
          <TabsList aria-label="Select revenue reporting period">
            <TabsTrigger value="today" className="cursor-pointer">
              Today
            </TabsTrigger>
            <TabsTrigger value="week" className="cursor-pointer">
              This Week
            </TabsTrigger>
            <TabsTrigger value="month" className="cursor-pointer">
              This Month
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary" />
            Revenue
          </span>
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-muted-foreground" />
            Sales
          </span>
        </div>
        <div
          className="h-72 w-full"
          role="img"
          aria-label={`Sales and revenue trend for ${period}`}
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="size-full overflow-visible"
          >
            {[18, 37, 56, 75, 94].map((position) => (
              <line
                key={position}
                x1="0"
                x2="100"
                y1={position}
                y2={position}
                className="stroke-border"
                strokeWidth="0.4"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <polyline
              points={salesPoints}
              fill="none"
              className="stroke-muted-foreground"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points={revenuePoints}
              fill="none"
              className="stroke-primary"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="grid grid-flow-col auto-cols-fr text-center text-xs text-muted-foreground">
          {data.labels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

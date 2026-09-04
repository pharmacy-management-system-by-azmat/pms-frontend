import { AlertTriangle, BadgeDollarSign, Package, Pill } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const statistics = [
  {
    title: "Total revenue today",
    value: "PKR 4,286.50",
    description: "Compared with yesterday",
    trend: "+12.5%",
    icon: BadgeDollarSign,
    accentClassName: "bg-chart-1 text-primary-foreground",
    trendClassName: "bg-chart-1/10 text-chart-1",
  },
  {
    title: "Medicines in stock",
    value: "2,846",
    description: "Across 124 categories",
    trend: "Well stocked",
    icon: Package,
    accentClassName: "bg-chart-2 text-primary-foreground",
    trendClassName: "bg-chart-2/10 text-chart-2",
  },
  {
    title: "Low stock warning",
    value: "18 items",
    description: "Below reorder threshold",
    trend: "Needs attention",
    icon: AlertTriangle,
    accentClassName: "bg-chart-3 text-primary-foreground",
    trendClassName: "bg-chart-3/10 text-chart-3",
  },
  {
    title: "Expiring stock alert",
    value: "9 items",
    description: "Expiring within 30 days",
    trend: "Review soon",
    icon: Pill,
    accentClassName: "bg-destructive text-destructive-foreground",
    trendClassName: "bg-destructive/10 text-destructive",
  },
];

export default function StatsOverview() {
  return (
    <section
      aria-label="Today’s pharmacy overview"
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
    >
      {statistics.map((statistic) => {
        const Icon = statistic.icon;

        return (
          <Card
            key={statistic.title}
            className="relative overflow-hidden border-border bg-card py-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <CardContent className="gap-4 py-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-10 items-center justify-center rounded-xl ${statistic.accentClassName}`}
                  >
                    <Icon aria-hidden="true" className="size-5" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {statistic.title}
                  </p>
                </div>
                <Badge className={statistic.trendClassName}>
                  {statistic.trend}
                </Badge>
              </div>
              <div className="flex items-end justify-between gap-3">
                <p className="text-3xl font-semibold tracking-tight text-foreground">
                  {statistic.value}
                </p>
                <p className="max-w-28 text-right text-xs leading-5 text-muted-foreground">
                  {statistic.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}

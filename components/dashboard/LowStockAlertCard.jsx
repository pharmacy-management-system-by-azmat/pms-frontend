import { ArrowRight, PackagePlus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const lowStockMedicines = [
  {
    name: "Amoxicillin 500mg",
    generic: "Amoxicillin",
    stock: 8,
    threshold: 20,
  },
  {
    name: "Paracetamol 500mg",
    generic: "Acetaminophen",
    stock: 12,
    threshold: 50,
  },
  { name: "Cetirizine 10mg", generic: "Cetirizine", stock: 6, threshold: 15 },
];

export default function LowStockAlertCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PackagePlus className="size-4 text-primary" />
          Urgent reorder list
        </CardTitle>
        <CardDescription>
          Medicines at or below their reorder point.
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-0">
        {lowStockMedicines.map((medicine) => (
          <div
            key={medicine.name}
            className="flex items-center justify-between gap-3 border-b border-border py-4 last:border-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {medicine.name}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {medicine.generic}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <Badge variant="destructive">{medicine.stock} left</Badge>
              <p className="mt-1 text-xs text-muted-foreground">
                Reorder at {medicine.threshold}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="mt-auto pt-6">
        <Button variant="outline" className="w-full cursor-pointer">
          Create purchase order <ArrowRight data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  );
}

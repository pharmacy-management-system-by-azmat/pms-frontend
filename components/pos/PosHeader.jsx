import { ScanBarcode, UserRoundPlus } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function PosHeader() {
  return (
    <header className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Point of sale · Terminal 01
        </p>
        <h1 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-foreground">
          New sale
        </h1>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" className="cursor-pointer">
          <UserRoundPlus data-icon="inline-start" />
          Add customer
        </Button>
        <Button variant="outline" className="cursor-pointer">
          <ScanBarcode data-icon="inline-start" />
          Scan medicine
        </Button>
      </div>
    </header>
  );
}

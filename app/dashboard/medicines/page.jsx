import InventoryWorkspace from "@/components/inventory/InventoryWorkspace";

export const metadata = { title: "Medicines & Inventory | MediFlow" };

export default function MedicinesPage() {
  return (
    <main className="min-h-full bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full">
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Inventory control
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground">
          Medicines & stock
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage the catalog, receive batches, monitor expiry dates, and record
          stock adjustments.
        </p>
        <div className="mt-6">
          <InventoryWorkspace />
        </div>
      </div>
    </main>
  );
}

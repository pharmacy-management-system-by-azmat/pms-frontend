import StockWorkspace from "@/components/inventory/StockWorkspace";

export const metadata = { title: "Inventory | MediFlow" };

export default function InventoryPage() {
  return (
    <main className="min-h-full bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full">
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Stock operations
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground">
          Inventory
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Monitor every received stock batch, its quantity, price, and expiry
          status.
        </p>
        <div className="mt-6">
          <StockWorkspace />
        </div>
      </div>
    </main>
  );
}

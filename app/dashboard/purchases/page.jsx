import PurchaseHistoryWorkspace from "@/components/purchases/PurchaseHistoryWorkspace";

export const metadata = { title: "Purchase History | MediFlow" };

export default function PurchaseHistoryPage() {
  return (
    <main className="min-h-full bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full">
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Procurement
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground">
          Purchase history
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Track purchase orders, supplier deliveries, and incoming stock
          records.
        </p>
        <div className="mt-6">
          <PurchaseHistoryWorkspace />
        </div>
      </div>
    </main>
  );
}

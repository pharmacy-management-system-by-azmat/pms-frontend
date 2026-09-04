import SalesHistoryWorkspace from "@/components/sales/SalesHistoryWorkspace";

export const metadata = { title: "Sales History | MediFlow" };

export default function SalesHistoryPage() {
  return (
    <main className="min-h-full bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full">
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Point of sale
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground">
          Sales history
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Search transactions, review sale details, and reprint receipts for
          completed orders.
        </p>
        <div className="mt-6">
          <SalesHistoryWorkspace />
        </div>
      </div>
    </main>
  );
}

import SupplierWorkspace from "@/components/suppliers/SupplierWorkspace";

export const metadata = { title: "Suppliers | MediFlow" };

export default function SuppliersPage() {
  return (
    <main className="min-h-full bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full">
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Procurement
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground">
          Suppliers
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Maintain the vendor directory used to receive stock and create
          purchase orders.
        </p>
        <div className="mt-6">
          <SupplierWorkspace />
        </div>
      </div>
    </main>
  );
}

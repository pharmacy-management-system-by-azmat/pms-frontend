import CustomerWorkspace from "@/components/customers/CustomerWorkspace";

export const metadata = { title: "Customers | MediFlow" };

export default function CustomersPage() {
  return (
    <main className="min-h-full bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full">
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Patient records
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground">
          Customers
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Maintain customer contact details and select returning customers
          during checkout.
        </p>
        <div className="mt-6">
          <CustomerWorkspace />
        </div>
      </div>
    </main>
  );
}

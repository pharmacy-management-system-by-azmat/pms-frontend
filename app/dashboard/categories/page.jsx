import CategoryWorkspace from "@/components/categories/CategoryWorkspace";

export const metadata = { title: "Medicine Categories | MediFlow" };

export default function CategoriesPage() {
  return (
    <main className="min-h-full bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full">
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Catalog setup
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground">
          Medicine categories
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Create and manage groups used to organize medicines throughout the
          pharmacy system.
        </p>
        <div className="mt-6">
          <CategoryWorkspace />
        </div>
      </div>
    </main>
  );
}

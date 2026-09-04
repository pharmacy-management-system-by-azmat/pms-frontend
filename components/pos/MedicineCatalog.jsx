"use client";

import { Barcode, PackageX, Plus, Search, Tags } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useBarcodeLookup,
  useBatches,
  useCategories,
  useMedicines,
} from "@/hook/useInventory";

const currency = (value) =>
  new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR" }).format(
    Number(value),
  );

export default function MedicineCatalog({ onAdd }) {
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const { data: categories = [] } = useCategories();
  const {
    data: medicineResponse,
    isPending,
    error,
  } = useMedicines({
    search: search || undefined,
    category: category || undefined,
  });
  const { data: batches = [] } = useBatches();
  const barcodeLookup = useBarcodeLookup();
  const sellableMedicines = useMemo(() => {
    const medicines = medicineResponse?.items ?? [];
    return medicines
      .map((medicine) => {
        const batch = batches
          .filter(
            (item) =>
              item.medicine === medicine.id &&
              item.is_active &&
              Number(item.quantity) > 0 &&
              new Date(item.expiry_date) >= new Date(),
          )
          .sort(
            (first, second) =>
              new Date(first.expiry_date) - new Date(second.expiry_date),
          )[0];
        return { ...medicine, batch };
      })
      .filter((medicine) => medicine.batch);
  }, [batches, medicineResponse]);

  async function handleSearchKeyDown(event) {
    if (event.key !== "Enter" || !search.trim()) return;
    event.preventDefault();
    try {
      const medicine = await barcodeLookup.mutateAsync(search.trim());
      onAdd({
        ...medicine,
        batchId: medicine.batch_id,
        price: Number(medicine.selling_price),
        maxQuantity: Number(medicine.available_quantity),
      });
      toast.success(`${medicine.name} added to cart.`);
      setSearch("");
    } catch (barcodeError) {
      toast.error(barcodeError.message);
    }
  }

  return (
    <section className="min-w-0" aria-label="Medicine catalog">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_14rem]">
        <div className="relative">
          {barcodeLookup.isPending ? (
            <Barcode className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 animate-pulse text-primary" />
          ) : (
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          )}
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search medicine, generic name, or barcode"
            className="h-12 rounded-xl pl-9"
            aria-label="Search medicines"
          />
        </div>
        <div className="relative">
          <Tags className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-input bg-background pr-8 pl-9 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-label="Filter medicines by category"
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Scan a barcode and press Enter to add the medicine directly to the cart.
      </p>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {isPending
          ? Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-40" />
            ))
          : sellableMedicines.map((medicine) => (
              <article
                key={medicine.id}
                className="group flex min-h-40 flex-col justify-between rounded-xl border border-border bg-card p-4 text-card-foreground transition-colors duration-200 hover:border-primary/40 hover:bg-accent/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {medicine.name}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {medicine.generic_name} · {medicine.unit_type}
                    </p>
                  </div>
                  <Badge
                    variant={
                      Number(medicine.total_stock) <=
                      Number(medicine.reorder_level)
                        ? "destructive"
                        : "outline"
                    }
                    className="shrink-0"
                  >
                    {medicine.total_stock ?? 0} left
                  </Badge>
                </div>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {medicine.barcode}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {currency(medicine.batch.selling_price)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="icon-sm"
                    className="cursor-pointer"
                    onClick={() =>
                      onAdd({
                        ...medicine,
                        batchId: medicine.batch.id,
                        price: Number(medicine.batch.selling_price),
                        maxQuantity: Number(medicine.batch.quantity),
                      })
                    }
                    aria-label={`Add ${medicine.name} to cart`}
                  >
                    <Plus />
                  </Button>
                </div>
              </article>
            ))}
      </div>
      {!isPending && (sellableMedicines.length === 0 || error) && (
        <div className="mt-5 flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 px-6 text-center">
          <PackageX className="size-6 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium text-foreground">
            {error ? "Unable to load medicines" : "No sellable medicines found"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {error?.message ??
              "Try another search or receive an active stock batch."}
          </p>
        </div>
      )}
    </section>
  );
}

"use client";

import {
  CalendarClock,
  CircleAlert,
  LoaderCircle,
  PackagePlus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useAdjustBatchStock,
  useBatches,
  useMedicines,
} from "@/hook/useInventory";

const todayTimestamp = new Date().setHours(0, 0, 0, 0);
const currency = (value) =>
  new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR" }).format(
    Number(value),
  );

function expiryStatus(expiryDate) {
  const days = Math.ceil((new Date(expiryDate) - todayTimestamp) / 86400000);
  if (days < 0) return { label: "Expired", variant: "destructive" };
  if (days <= 30) return { label: `${days}d left`, variant: "destructive" };
  if (days <= 90) return { label: `${days}d left`, variant: "outline" };
  return { label: "Valid", variant: "secondary" };
}

export default function StockWorkspace() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("active");
  const [adjustBatch, setAdjustBatch] = useState(null);
  const { data: batches = [], isPending, error } = useBatches();
  const { data: medicineResponse } = useMedicines({});
  const adjustStock = useAdjustBatchStock();
  const medicines = medicineResponse?.items ?? [];
  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return batches.filter((batch) => {
      const status = expiryStatus(batch.expiry_date);
      const matchesSearch =
        !query ||
        `${batch.batch_number} ${batch.medicine_name} ${batch.supplier_name ?? ""}`
          .toLowerCase()
          .includes(query);
      const matchesFilter =
        filter === "all" ||
        (filter === "expired" && status.label === "Expired") ||
        (filter === "expiring" &&
          status.label !== "Expired" &&
          status.label !== "Valid") ||
        (filter === "active" && batch.is_active && status.label !== "Expired");
      return matchesSearch && matchesFilter;
    });
  }, [batches, filter, search]);
  const totalUnits = batches
    .filter((batch) => batch.is_active)
    .reduce((sum, batch) => sum + Number(batch.quantity), 0);
  const expiring = batches.filter((batch) => {
    const status = expiryStatus(batch.expiry_date);
    return status.label !== "Expired" && status.label !== "Valid";
  }).length;
  const expired = batches.filter(
    (batch) => expiryStatus(batch.expiry_date).label === "Expired",
  ).length;

  async function submitAdjustment(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      await adjustStock.mutateAsync({
        id: adjustBatch.id,
        quantity_changed: Number(data.quantity_changed),
        reason: data.reason,
        action_type: data.action_type,
      });
      toast.success("Stock adjusted and logged successfully.");
      setAdjustBatch(null);
    } catch (adjustmentError) {
      toast.error(adjustmentError.message);
    }
  }

  return (
    <>
      <section className="grid grid-cols-1 overflow-hidden rounded-xl border border-border bg-card md:grid-cols-3">
        <div className="flex min-h-24 items-center justify-between gap-4 border-b border-border px-5 py-4 md:border-r md:border-b-0">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Active stock units
            </p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {totalUnits}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Across active batches
            </p>
          </div>
          <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <PackagePlus className="size-5" />
          </span>
        </div>
        <div className="flex min-h-24 items-center justify-between gap-4 border-b border-border px-5 py-4 md:border-r md:border-b-0">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Expiring soon
            </p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {expiring}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Within 90 days</p>
          </div>
          <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <CalendarClock className="size-5" />
          </span>
        </div>
        <div className="flex min-h-24 items-center justify-between gap-4 bg-destructive/10 px-5 py-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Expired batches
            </p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {expired}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Requires action
            </p>
          </div>
          <span className="flex size-10 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <CircleAlert className="size-5" />
          </span>
        </div>
      </section>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Stock batches</CardTitle>
          <CardDescription>
            Track quantities, prices, suppliers, and medicine expiry dates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_12rem]">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search medicine, batch number, or supplier"
                className="h-11 pl-9"
              />
            </div>
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="h-11 rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              <option value="active">Active batches</option>
              <option value="expiring">Expiring soon</option>
              <option value="expired">Expired batches</option>
              <option value="all">All batches</option>
            </select>
          </div>
          <div className="mt-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch</TableHead>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>
                    <span className="sr-only">Action</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending
                  ? Array.from({ length: 6 }, (_, index) => (
                      <TableRow key={index}>
                        <TableCell colSpan={7}>
                          <Skeleton className="h-8 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  : rows.map((batch) => {
                      const status = expiryStatus(batch.expiry_date);
                      return (
                        <TableRow key={batch.id}>
                          <TableCell>
                            <p className="font-mono text-xs text-foreground">
                              {batch.batch_number}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Mfd.{" "}
                              {new Intl.DateTimeFormat("en-US", {
                                dateStyle: "medium",
                              }).format(new Date(batch.manufacture_date))}
                            </p>
                          </TableCell>
                          <TableCell className="font-medium">
                            {batch.medicine_name}
                          </TableCell>
                          <TableCell>{batch.supplier_name || "—"}</TableCell>
                          <TableCell>
                            <p className="text-sm text-foreground">
                              {new Intl.DateTimeFormat("en-US", {
                                dateStyle: "medium",
                              }).format(new Date(batch.expiry_date))}
                            </p>
                            <Badge variant={status.variant} className="mt-1">
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-foreground">
                              {currency(batch.selling_price)}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Cost {currency(batch.purchase_price)}
                            </p>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                batch.quantity === 0
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {batch.quantity}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="cursor-pointer"
                              onClick={() => setAdjustBatch(batch)}
                            >
                              <SlidersHorizontal data-icon="inline-start" />
                              Adjust
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
              </TableBody>
            </Table>
            {!isPending && !error && rows.length === 0 && (
              <div className="flex min-h-48 flex-col items-center justify-center text-center">
                <CircleAlert className="size-6 text-muted-foreground" />
                <p className="mt-3 font-medium text-foreground">
                  No batches found
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try changing the current search or stock filter.
                </p>
              </div>
            )}
            {error && (
              <div className="flex min-h-48 flex-col items-center justify-center text-center">
                <CircleAlert className="size-6 text-destructive" />
                <p className="mt-3 font-medium text-foreground">
                  Unable to load stock batches
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {error.message}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardContent className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-foreground">
              Need to receive a new stock batch?
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Open the medicine page to receive stock against a medicine record.
            </p>
          </div>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => router.push("/dashboard/medicines")}
          >
            Open medicines
          </Button>
        </CardContent>
      </Card>
      <Dialog
        open={Boolean(adjustBatch)}
        onOpenChange={(open) => !open && setAdjustBatch(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust stock</DialogTitle>
            <DialogDescription>
              Current quantity for {adjustBatch?.medicine_name}:{" "}
              {adjustBatch?.quantity ?? 0}. Every change is saved to the audit
              log.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={submitAdjustment}>
            <div className="space-y-2">
              <Label htmlFor="quantity_changed">Quantity change</Label>
              <Input
                id="quantity_changed"
                name="quantity_changed"
                type="number"
                placeholder="Use a negative value to remove stock"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="action_type">Action type</Label>
              <select
                id="action_type"
                name="action_type"
                className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm text-foreground"
              >
                <option value="STOCK_ADD">Stock add</option>
                <option value="DAMAGE_EXPIRE_REMOVAL">
                  Damage or expiry removal
                </option>
                <option value="PRICE_UPDATE">Price update</option>
                <option value="MANUAL_CORRECTION">Manual correction</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                name="reason"
                required
                placeholder="Explain this stock adjustment"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => setAdjustBatch(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={adjustStock.isPending}
              >
                {adjustStock.isPending && (
                  <LoaderCircle
                    className="animate-spin"
                    data-icon="inline-start"
                  />
                )}
                Apply adjustment
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

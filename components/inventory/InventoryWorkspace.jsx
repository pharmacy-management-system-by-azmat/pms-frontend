"use client";

import {
  AlertTriangle,
  Boxes,
  CalendarClock,
  CircleAlert,
  LoaderCircle,
  Pencil,
  Pill,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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
  useCategories,
  useCreateBatch,
  useCreateMedicine,
  useDeleteMedicine,
  useMedicines,
  useSuppliers,
  useUpdateMedicine,
} from "@/hook/useInventory";
import { usePakistanMedicineReferences } from "@/hook/useInventory";

const emptyMedicine = {
  name: "",
  generic_name: "",
  barcode: "",
  unit_type: "TABLET",
  shelf_location: "",
  reorder_level: "0",
  is_prescription_required: false,
};
const unitTypes = ["TABLET", "STRIP", "SYRUP", "INJECTION", "BOTTLE", "BOX"];
const todayTimestamp = new Date().setHours(0, 0, 0, 0);

const number = (value) => Number(value || 0);

function Modal({ open, onOpenChange, title, description, children }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function MedicineReferenceInput({ defaultValue, onSelect }) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const { data: references = [], isFetching } =
    usePakistanMedicineReferences(value);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  function selectReference(reference) {
    setValue(reference.name);
    setOpen(false);
    onSelect(reference);
  }

  return (
    <div ref={containerRef} className="relative">
      <Input
        name="name"
        value={value}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setValue(event.target.value);
          setOpen(true);
        }}
        placeholder="Start typing a Pakistani medicine brand"
        required
        autoComplete="off"
      />
      {open && value.trim().length >= 2 && (
        <div className="absolute top-10 right-0 left-0 z-30 max-h-56 overflow-y-auto rounded-md border border-border bg-popover p-1 shadow-lg">
          {isFetching ? (
            <p className="px-2 py-2 text-xs text-muted-foreground">
              Searching Pakistan medicine reference…
            </p>
          ) : references.length === 0 ? (
            <p className="px-2 py-2 text-xs text-muted-foreground">
              No reference match found. You can still add a custom medicine.
            </p>
          ) : (
            references.map((reference) => (
              <button
                key={reference.id}
                type="button"
                className="flex w-full cursor-pointer flex-col rounded-sm px-2 py-2 text-left hover:bg-accent"
                onClick={() => selectReference(reference)}
              >
                <span className="text-sm font-medium text-foreground">
                  {reference.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {[
                    reference.company,
                    reference.pack_size,
                    reference.mrp ? `MRP ${reference.mrp}` : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function InventoryWorkspace() {
  const [search, setSearch] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [medicineDialog, setMedicineDialog] = useState(null);
  const genericNameRef = useRef(null);
  const [adjustBatch, setAdjustBatch] = useState(null);
  const filters = useMemo(
    () => ({
      search: search || undefined,
      stock_status: stockStatus || undefined,
    }),
    [search, stockStatus],
  );
  const medicinesQuery = useMedicines(filters);
  const { data: categories = [] } = useCategories();
  const { data: batches = [] } = useBatches();
  const { data: suppliers = [] } = useSuppliers();
  const createMedicine = useCreateMedicine();
  const updateMedicine = useUpdateMedicine();
  const deleteMedicine = useDeleteMedicine();
  const adjustStock = useAdjustBatchStock();
  const medicines = medicinesQuery.data?.items ?? [];
  const totalUnits = medicines.reduce(
    (total, medicine) => total + number(medicine.total_stock),
    0,
  );
  const lowStock = medicines.filter(
    (medicine) => number(medicine.total_stock) < number(medicine.reorder_level),
  ).length;
  const expiring = batches.filter((batch) => {
    const days = (new Date(batch.expiry_date) - todayTimestamp) / 86400000;
    return days >= 0 && days <= 30;
  }).length;

  async function submitMedicine(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const payload = {
      ...data,
      category: Number(data.category),
      reorder_level: Number(data.reorder_level),
      is_prescription_required: data.is_prescription_required === "on",
    };
    try {
      if (medicineDialog?.id)
        await updateMedicine.mutateAsync({ id: medicineDialog.id, ...payload });
      else await createMedicine.mutateAsync(payload);
      toast.success(
        medicineDialog?.id
          ? "Medicine updated successfully."
          : "Medicine added successfully.",
      );
      setMedicineDialog(null);
    } catch (error) {
      toast.error(error.message);
    }
  }
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
    } catch (error) {
      toast.error(error.message);
    }
  }
  async function removeMedicine(id) {
    if (
      !window.confirm(
        "Delete this medicine? Existing batches or sales can prevent deletion.",
      )
    )
      return;
    try {
      await deleteMedicine.mutateAsync(id);
      toast.success("Medicine deleted successfully.");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <>
      <section className="grid grid-cols-1 overflow-hidden rounded-xl border border-border bg-card text-card-foreground md:grid-cols-2 xl:grid-cols-4">
        {[
          [
            Pill,
            "Medicines",
            medicinesQuery.data?.count ?? 0,
            "Catalogued products",
          ],
          [Boxes, "Stock on hand", totalUnits, "Across active batches"],
          [AlertTriangle, "Low stock", lowStock, "Below reorder level"],
          [CalendarClock, "Expiring soon", expiring, "Within 30 days"],
        ].map(([Icon, label, value, detail], index) => (
          <div
            key={label}
            className={`flex min-h-24 items-center justify-between gap-4 px-5 py-4 ${index === 2 ? "bg-destructive/10" : ""} border-b border-border last:border-b-0 md:nth-[2n]:border-l xl:border-b-0 xl:border-l xl:first:border-l-0`}
          >
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {label}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-2xl font-semibold tracking-tight text-foreground">
                  {value}
                </p>
                {index === 2 && <Badge variant="destructive">Low</Badge>}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
            </div>
            <span
              className={`flex size-10 shrink-0 items-center justify-center rounded-full ${index === 2 ? "bg-destructive/15 text-destructive" : "bg-muted text-muted-foreground"}`}
            >
              <Icon className="size-5" />
            </span>
          </div>
        ))}
      </section>
      <Card className="mt-6">
        <CardHeader className="gap-4 sm:flex sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Medicine catalog</CardTitle>
            <CardDescription>
              Manage medicines, stock levels, batches, and reorder alerts.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              className="cursor-pointer"
              onClick={() => setMedicineDialog({ ...emptyMedicine })}
            >
              <Plus data-icon="inline-start" />
              Add medicine
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_10rem]">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search brand, generic name, or barcode"
                className="h-11 pl-9"
              />
            </div>
            <select
              value={stockStatus}
              onChange={(event) => setStockStatus(event.target.value)}
              className="h-11 rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              <option value="">All stock levels</option>
              <option value="low">Low stock only</option>
            </select>
          </div>
          <div className="mt-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicinesQuery.isPending
                  ? Array.from({ length: 5 }, (_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={6}>
                          <Skeleton className="h-8 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  : medicines.map((medicine) => {
                      const isLow =
                        number(medicine.total_stock) <
                        number(medicine.reorder_level);
                      return (
                        <TableRow key={medicine.id}>
                          <TableCell>
                            <p className="font-medium text-foreground">
                              {medicine.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {medicine.generic_name} · {medicine.unit_type}
                            </p>
                          </TableCell>
                          <TableCell>{medicine.category_name}</TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {medicine.barcode}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={isLow ? "destructive" : "secondary"}
                            >
                              {number(medicine.total_stock)} /{" "}
                              {medicine.reorder_level}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {medicine.shelf_location || "—"}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                className="cursor-pointer"
                                aria-label={`Edit ${medicine.name}`}
                                onClick={() => setMedicineDialog(medicine)}
                              >
                                <Pencil />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                className="cursor-pointer text-destructive"
                                aria-label={`Delete ${medicine.name}`}
                                onClick={() => removeMedicine(medicine.id)}
                              >
                                <Trash2 />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
              </TableBody>
            </Table>
            {!medicinesQuery.isPending && medicines.length === 0 && (
              <div className="flex min-h-44 flex-col items-center justify-center text-center">
                <CircleAlert className="size-6 text-muted-foreground" />
                <p className="mt-3 font-medium text-foreground">
                  No medicines found
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try changing filters or add a new medicine.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent stock batches</CardTitle>
          <CardDescription>
            Receive stock, track expiry dates, and apply audited adjustments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch</TableHead>
                <TableHead>Medicine</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.slice(0, 8).map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-mono text-xs">
                    {batch.batch_number}
                  </TableCell>
                  <TableCell className="font-medium">
                    {batch.medicine_name}
                  </TableCell>
                  <TableCell>{batch.supplier_name || "—"}</TableCell>
                  <TableCell>
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                    }).format(new Date(batch.expiry_date))}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{batch.quantity}</Badge>
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Modal
        open={Boolean(medicineDialog)}
        onOpenChange={(open) => !open && setMedicineDialog(null)}
        title={medicineDialog?.id ? "Edit medicine" : "Add medicine"}
        description="Maintain the core medicine record used by inventory and POS."
      >
        <form
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          onSubmit={submitMedicine}
        >
          <Field label="Brand name">
            <MedicineReferenceInput
              defaultValue={medicineDialog?.name}
              onSelect={(reference) => {
                if (genericNameRef.current) {
                  genericNameRef.current.value = reference.name;
                }
              }}
            />
          </Field>
          <Field label="Generic name">
            <Input
              ref={genericNameRef}
              name="generic_name"
              defaultValue={medicineDialog?.generic_name}
              required
            />
          </Field>
          <Field label="Barcode">
            <Input
              name="barcode"
              defaultValue={medicineDialog?.barcode}
              required
            />
          </Field>
          <Field label="Category">
            <select
              name="category"
              defaultValue={medicineDialog?.category ?? ""}
              required
              className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm"
            >
              <option value="">Select category</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Unit type">
            <select
              name="unit_type"
              defaultValue={medicineDialog?.unit_type ?? "TABLET"}
              className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm"
            >
              {unitTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>
          <Field label="Shelf location">
            <Input
              name="shelf_location"
              defaultValue={medicineDialog?.shelf_location}
              placeholder="Rack A-3"
            />
          </Field>
          <Field label="Reorder level">
            <Input
              name="reorder_level"
              type="number"
              min="0"
              defaultValue={medicineDialog?.reorder_level ?? 0}
              required
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              name="is_prescription_required"
              type="checkbox"
              defaultChecked={medicineDialog?.is_prescription_required}
            />
            Prescription required
          </label>
          <div className="sm:col-span-2 flex justify-end gap-2 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => setMedicineDialog(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={createMedicine.isPending || updateMedicine.isPending}
            >
              {(createMedicine.isPending || updateMedicine.isPending) && (
                <LoaderCircle
                  className="animate-spin"
                  data-icon="inline-start"
                />
              )}
              {medicineDialog?.id ? "Save changes" : "Create medicine"}
            </Button>
          </div>
        </form>
      </Modal>
      <Modal
        open={Boolean(adjustBatch)}
        onOpenChange={(open) => !open && setAdjustBatch(null)}
        title="Adjust stock"
        description={`Current quantity: ${adjustBatch?.quantity ?? 0}. Every adjustment is recorded in the audit log.`}
      >
        <form className="space-y-4" onSubmit={submitAdjustment}>
          <Field label="Quantity change">
            <Input
              name="quantity_changed"
              type="number"
              placeholder="Use a negative value to remove stock"
              required
            />
          </Field>
          <Field label="Action type">
            <select
              name="action_type"
              className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm"
            >
              <option value="STOCK_ADD">Stock add</option>
              <option value="DAMAGE_EXPIRE_REMOVAL">
                Damage or expiry removal
              </option>
              <option value="PRICE_UPDATE">Price update</option>
              <option value="MANUAL_CORRECTION">Manual correction</option>
            </select>
          </Field>
          <Field label="Reason">
            <Textarea
              name="reason"
              required
              placeholder="Explain this stock adjustment"
            />
          </Field>
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
              Apply adjustment
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

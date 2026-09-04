"use client";

import {
  CircleAlert,
  LoaderCircle,
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
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
  useCreateSupplier,
  useDeleteSupplier,
  useSuppliers,
  useUpdateSupplier,
} from "@/hook/useSuppliers";

const emptySupplier = {
  company_name: "",
  contact_person: "",
  email: "",
  phone: "",
  address: "",
  tax_id: "",
  is_active: true,
};

function SupplierDialog({ supplier, onClose }) {
  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();
  const saving = createSupplier.isPending || updateSupplier.isPending;

  async function handleSubmit(event) {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    const payload = {
      ...form,
      tax_id: form.tax_id || null,
      is_active: form.is_active === "on",
    };
    try {
      if (supplier.id)
        await updateSupplier.mutateAsync({ id: supplier.id, ...payload });
      else await createSupplier.mutateAsync(payload);
      toast.success(
        supplier.id
          ? "Supplier updated successfully."
          : "Supplier added successfully.",
      );
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <Dialog
      open={Boolean(supplier)}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {supplier?.id ? "Edit supplier" : "Add supplier"}
          </DialogTitle>
          <DialogDescription>
            Maintain vendor contacts for stock receiving and purchase orders.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          onSubmit={handleSubmit}
        >
          <div className="space-y-2">
            <Label htmlFor="company_name">Company name *</Label>
            <Input
              id="company_name"
              name="company_name"
              defaultValue={supplier?.company_name}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_person">Contact person *</Label>
            <Input
              id="contact_person"
              name="contact_person"
              defaultValue={supplier?.contact_person}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={supplier?.email}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={supplier?.phone}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tax_id">Tax ID</Label>
            <Input id="tax_id" name="tax_id" defaultValue={supplier?.tax_id} />
          </div>
          <label className="flex h-9 items-center gap-2 self-end text-sm text-foreground">
            <input
              name="is_active"
              type="checkbox"
              defaultChecked={supplier?.is_active ?? true}
            />
            Active supplier
          </label>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              name="address"
              defaultValue={supplier?.address}
              required
            />
          </div>
          <div className="flex justify-end gap-2 border-t border-border pt-4 sm:col-span-2">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="cursor-pointer" disabled={saving}>
              {saving && (
                <LoaderCircle
                  className="animate-spin"
                  data-icon="inline-start"
                />
              )}
              {supplier?.id ? "Save changes" : "Create supplier"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function SupplierWorkspace() {
  const [search, setSearch] = useState("");
  const [dialogSupplier, setDialogSupplier] = useState(null);
  const { data: suppliers = [], isPending, error } = useSuppliers();
  const deleteSupplier = useDeleteSupplier();
  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return suppliers.filter(
      (supplier) =>
        !query ||
        `${supplier.company_name} ${supplier.contact_person} ${supplier.email} ${supplier.phone}`
          .toLowerCase()
          .includes(query),
    );
  }, [suppliers, search]);
  async function removeSupplier(supplier) {
    if (
      !window.confirm(
        `Delete ${supplier.company_name}? Existing batches or purchase orders may prevent deletion.`,
      )
    )
      return;
    try {
      await deleteSupplier.mutateAsync(supplier.id);
      toast.success("Supplier deleted successfully.");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="gap-4 sm:flex sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Supplier directory</CardTitle>
            <CardDescription>
              Manage vendor contacts for medicines, consumables, and stock
              replenishment.
            </CardDescription>
          </div>
          <Button
            className="cursor-pointer"
            onClick={() => setDialogSupplier(emptySupplier)}
          >
            <Plus data-icon="inline-start" />
            Add supplier
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search company, contact, email, or phone"
              className="h-11 pl-9"
            />
          </div>
          <div className="mt-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Contact details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending
                  ? Array.from({ length: 5 }, (_, index) => (
                      <TableRow key={index}>
                        <TableCell colSpan={5}>
                          <Skeleton className="h-8 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  : visible.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell>
                          <p className="font-medium text-foreground">
                            {supplier.company_name}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {supplier.tax_id
                              ? `Tax ID: ${supplier.tax_id}`
                              : "No tax ID"}
                          </p>
                        </TableCell>
                        <TableCell>{supplier.contact_person}</TableCell>
                        <TableCell>
                          <a
                            href={`mailto:${supplier.email}`}
                            className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                          >
                            <Mail className="size-3.5" />
                            {supplier.email}
                          </a>
                          <a
                            href={`tel:${supplier.phone}`}
                            className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                          >
                            <Phone className="size-3.5" />
                            {supplier.phone}
                          </a>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              supplier.is_active ? "secondary" : "outline"
                            }
                            className={supplier.is_active ? "text-primary" : ""}
                          >
                            {supplier.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="cursor-pointer"
                              onClick={() => setDialogSupplier(supplier)}
                              aria-label={`Edit ${supplier.company_name}`}
                            >
                              <Pencil />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="cursor-pointer text-destructive"
                              onClick={() => removeSupplier(supplier)}
                              aria-label={`Delete ${supplier.company_name}`}
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
            {!isPending && !error && visible.length === 0 && (
              <div className="flex min-h-48 flex-col items-center justify-center text-center">
                <CircleAlert className="size-6 text-muted-foreground" />
                <p className="mt-3 font-medium text-foreground">
                  No suppliers found
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add a supplier or try another search term.
                </p>
              </div>
            )}
            {error && (
              <div className="flex min-h-48 flex-col items-center justify-center text-center">
                <CircleAlert className="size-6 text-destructive" />
                <p className="mt-3 font-medium text-foreground">
                  Unable to load suppliers
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {error.message}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <SupplierDialog
        supplier={dialogSupplier}
        onClose={() => setDialogSupplier(null)}
      />
    </>
  );
}

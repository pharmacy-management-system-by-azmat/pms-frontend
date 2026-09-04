"use client";

import {
  CircleAlert,
  LoaderCircle,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";
import { useState } from "react";
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
  useCreateCustomer,
  useCustomers,
  useDeleteCustomer,
  useUpdateCustomer,
} from "@/hook/useCustomers";

const emptyCustomer = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  address: "",
  notes: "",
  is_active: true,
};

function CustomerDialog({ customer, onClose }) {
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const saving = createCustomer.isPending || updateCustomer.isPending;
  async function submit(event) {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const payload = { ...form, is_active: form.is_active === "on" };
      if (customer.id)
        await updateCustomer.mutateAsync({ id: customer.id, ...payload });
      else await createCustomer.mutateAsync(payload);
      toast.success(
        customer.id
          ? "Customer updated successfully."
          : "Customer added successfully.",
      );
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <Dialog
      open={Boolean(customer)}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {customer?.id ? "Edit customer" : "Add customer"}
          </DialogTitle>
          <DialogDescription>
            Store customer contact information for faster checkout and receipts.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          onSubmit={submit}
        >
          <div className="space-y-2">
            <Label>First name *</Label>
            <Input
              name="first_name"
              defaultValue={customer?.first_name}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Last name</Label>
            <Input name="last_name" defaultValue={customer?.last_name} />
          </div>
          <div className="space-y-2">
            <Label>Phone *</Label>
            <Input
              name="phone"
              type="tel"
              defaultValue={customer?.phone}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input name="email" type="email" defaultValue={customer?.email} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Address</Label>
            <Textarea name="address" defaultValue={customer?.address} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Notes</Label>
            <Textarea
              name="notes"
              defaultValue={customer?.notes}
              placeholder="Optional notes"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              name="is_active"
              type="checkbox"
              defaultChecked={customer?.is_active ?? true}
            />
            Active customer
          </label>
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
              {customer?.id ? "Save changes" : "Create customer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function CustomerWorkspace() {
  const [search, setSearch] = useState("");
  const [dialogCustomer, setDialogCustomer] = useState(null);
  const {
    data: customers = [],
    isPending,
    error,
  } = useCustomers({ search: search || undefined });
  const deleteCustomer = useDeleteCustomer();
  async function remove(customer) {
    if (!window.confirm(`Delete ${customer.full_name}?`)) return;
    try {
      await deleteCustomer.mutateAsync(customer.id);
      toast.success("Customer deleted successfully.");
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <>
      <Card>
        <CardHeader className="gap-4 sm:flex sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Customer directory</CardTitle>
            <CardDescription>
              Manage customer profiles used for personalised point-of-sale
              transactions.
            </CardDescription>
          </div>
          <Button
            className="cursor-pointer"
            onClick={() => setDialogCustomer(emptyCustomer)}
          >
            <Plus data-icon="inline-start" />
            Add customer
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, phone, or email"
              className="h-11 pl-9"
            />
          </div>
          <div className="mt-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
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
                  : customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <p className="font-medium text-foreground">
                            {customer.full_name}
                          </p>
                          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="size-3" />
                            {customer.address || "No address"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <a
                            href={`tel:${customer.phone}`}
                            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                          >
                            <Phone className="size-3.5" />
                            {customer.phone}
                          </a>
                        </TableCell>
                        <TableCell>
                          {customer.email ? (
                            <a
                              href={`mailto:${customer.email}`}
                              className="flex items-center gap-1.5 text-primary hover:underline"
                            >
                              <Mail className="size-3.5" />
                              {customer.email}
                            </a>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              customer.is_active ? "secondary" : "outline"
                            }
                            className={customer.is_active ? "text-primary" : ""}
                          >
                            {customer.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="cursor-pointer"
                              onClick={() => setDialogCustomer(customer)}
                              aria-label={`Edit ${customer.full_name}`}
                            >
                              <Pencil />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="cursor-pointer text-destructive"
                              onClick={() => remove(customer)}
                              aria-label={`Delete ${customer.full_name}`}
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
            {!isPending && !error && customers.length === 0 && (
              <div className="flex min-h-48 flex-col items-center justify-center text-center">
                <UserRound className="size-6 text-muted-foreground" />
                <p className="mt-3 font-medium text-foreground">
                  No customers found
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add a customer or use another search term.
                </p>
              </div>
            )}
            {error && (
              <div className="flex min-h-48 flex-col items-center justify-center text-center">
                <CircleAlert className="size-6 text-destructive" />
                <p className="mt-3 font-medium text-foreground">
                  Unable to load customers
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {error.message}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <CustomerDialog
        customer={dialogCustomer}
        onClose={() => setDialogCustomer(null)}
      />
    </>
  );
}

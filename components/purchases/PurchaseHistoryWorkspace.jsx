"use client";

import {
  CircleAlert,
  Eye,
  PackageCheck,
  Printer,
  Plus,
  Search,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";

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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePurchaseOrders } from "@/hook/usePurchases";
import { printPurchaseBill } from "@/lib/purchases/printPurchaseBill";
import ReceivePurchaseDialog from "@/components/purchases/ReceivePurchaseDialog";
import { toast } from "sonner";

const currency = (value) =>
  new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR" }).format(
    Number(value),
  );

const statusVariant = (status) =>
  status === "RECEIVED"
    ? "secondary"
    : status === "CANCELLED"
      ? "destructive"
      : status === "ORDERED"
        ? "default"
        : "outline";

export default function PurchaseHistoryWorkspace() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [period, setPeriod] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [receivePurchaseOpen, setReceivePurchaseOpen] = useState(false);
  const { data, isPending, error } = usePurchaseOrders({
    search: search || undefined,
    status: status || undefined,
    period: period || undefined,
  });
  const orders = data?.items ?? [];

  function handlePrint(order) {
    try {
      printPurchaseBill(order);
    } catch (printError) {
      toast.error(printError.message);
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="gap-4 sm:flex sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Purchase history</CardTitle>
            <CardDescription>
              Receive one supplier bill with multiple medicine batches.
            </CardDescription>
          </div>
          <Button
            className="cursor-pointer"
            onClick={() => setReceivePurchaseOpen(true)}
          >
            <Plus data-icon="inline-start" />
            Receive purchase
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_11rem]">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search purchase order or supplier"
                className="h-11 pl-9"
              />
            </div>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-11 rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              <option value="">All statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="ORDERED">Ordered</option>
              <option value="RECEIVED">Received</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div
            className="mt-3 flex flex-wrap gap-2"
            aria-label="Filter purchase orders by date"
          >
            {[
              ["", "All time"],
              ["today", "Today"],
              ["7days", "Last 7 days"],
              ["month", "This month"],
            ].map(([value, label]) => (
              <Button
                key={value || "all"}
                type="button"
                variant={period === value ? "default" : "outline"}
                size="sm"
                className="cursor-pointer"
                onClick={() => setPeriod(value)}
              >
                {label}
              </Button>
            ))}
          </div>
          <div className="mt-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Purchase order</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Order date</TableHead>
                  <TableHead>Expected delivery</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
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
                  : orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <p className="font-mono text-xs font-medium text-foreground">
                            {order.po_number}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Created by {order.created_by_name}
                          </p>
                        </TableCell>
                        <TableCell className="font-medium">
                          {order.supplier_name}
                        </TableCell>
                        <TableCell>
                          {new Intl.DateTimeFormat("en-US", {
                            dateStyle: "medium",
                          }).format(new Date(order.order_date))}
                        </TableCell>
                        <TableCell>
                          {order.expected_delivery_date
                            ? new Intl.DateTimeFormat("en-US", {
                                dateStyle: "medium",
                              }).format(new Date(order.expected_delivery_date))
                            : "—"}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {currency(order.total_amount)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={statusVariant(order.status)}
                            className={
                              order.status === "RECEIVED" ? "text-primary" : ""
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="cursor-pointer"
                              onClick={() => setSelectedOrder(order)}
                              aria-label={`View ${order.po_number}`}
                            >
                              <Eye />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="cursor-pointer"
                              onClick={() => handlePrint(order)}
                              aria-label={`Print ${order.po_number}`}
                            >
                              <Printer />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
            {!isPending && !error && orders.length === 0 && (
              <div className="flex min-h-48 flex-col items-center justify-center text-center">
                <ShoppingBag className="size-6 text-muted-foreground" />
                <p className="mt-3 font-medium text-foreground">
                  No purchase orders found
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try changing the current filters or create a purchase order.
                </p>
              </div>
            )}
            {error && (
              <div className="flex min-h-48 flex-col items-center justify-center text-center">
                <CircleAlert className="size-6 text-destructive" />
                <p className="mt-3 font-medium text-foreground">
                  Unable to load purchase orders
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {error.message}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Dialog
        open={Boolean(selectedOrder)}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedOrder?.po_number}</DialogTitle>
            <DialogDescription>
              {selectedOrder?.supplier_name} · {selectedOrder?.status}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {selectedOrder?.items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between border-b border-border pb-3"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {item.medicine_name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Ordered {item.quantity_ordered} · Received{" "}
                    {item.quantity_received}
                  </p>
                </div>
                <p className="font-medium text-foreground">
                  {currency(item.unit_cost)}
                </p>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="text-sm text-muted-foreground">Order total</span>
              <span className="text-base font-semibold text-foreground">
                {currency(selectedOrder?.total_amount)}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              <PackageCheck className="size-4 text-primary" />
              Stock is received through the batch receiving workflow.
            </div>
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              onClick={() => handlePrint(selectedOrder)}
            >
              <Printer data-icon="inline-start" />
              Print A4 bill
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <ReceivePurchaseDialog
        open={receivePurchaseOpen}
        onClose={() => setReceivePurchaseOpen(false)}
      />
    </>
  );
}

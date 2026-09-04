"use client";

import {
  CircleAlert,
  Eye,
  LoaderCircle,
  Printer,
  ReceiptText,
  RotateCcw,
  Search,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useReturnSale, useSales } from "@/hook/usePos";
import { printReceipt } from "@/lib/pos/printReceipt";

const currency = (value) =>
  new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR" }).format(
    Number(value),
  );

function ReturnSaleDialog({ sale, onClose }) {
  const [quantities, setQuantities] = useState({});
  const [reason, setReason] = useState("");
  const returnSale = useReturnSale();

  async function handleSubmit(event) {
    event.preventDefault();
    const items = sale.items
      .map((item) => ({
        sale_order_item_id: item.id,
        quantity: Number(quantities[item.id] || 0),
      }))
      .filter((item) => item.quantity > 0);
    if (!reason.trim() || items.length === 0) {
      toast.error("Select at least one item and provide a return reason.");
      return;
    }
    try {
      const result = await returnSale.mutateAsync({
        saleId: sale.id,
        reason,
        items,
      });
      toast.success(`Return ${result.return_number} processed successfully.`);
      onClose();
    } catch (returnError) {
      toast.error(returnError.message);
    }
  }

  return (
    <Dialog open={Boolean(sale)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Return items from {sale?.invoice_number}</DialogTitle>
          <DialogDescription>
            Select returned quantities. Returned items are placed back into
            their original stock batch.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-3">
            {sale?.items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[minmax(0,1fr)_5rem] gap-3 rounded-lg border border-border p-3"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {item.medicine_name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Sold {item.quantity} · {currency(item.unit_price)} each
                  </p>
                </div>
                <Input
                  type="number"
                  min="0"
                  max={item.quantity}
                  value={quantities[item.id] ?? ""}
                  onChange={(event) =>
                    setQuantities((current) => ({
                      ...current,
                      [item.id]: event.target.value,
                    }))
                  }
                  placeholder="Qty"
                  aria-label={`Return quantity for ${item.medicine_name}`}
                />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Return reason
            </label>
            <Textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              required
              placeholder="Explain why the customer returned these items"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={returnSale.isPending}
            >
              {returnSale.isPending && (
                <LoaderCircle
                  className="animate-spin"
                  data-icon="inline-start"
                />
              )}
              Process return
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function SalesHistoryWorkspace() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [period, setPeriod] = useState("");
  const [selectedSale, setSelectedSale] = useState(null);
  const [returnSaleDialog, setReturnSaleDialog] = useState(null);
  const { data, isPending, error } = useSales({
    search: search || undefined,
    status: status || undefined,
    period: period || undefined,
  });
  const sales = data?.items ?? [];

  function handlePrint(sale) {
    try {
      printReceipt({
        sale,
        customerName: sale.customer_name,
        customerPhone: sale.customer_phone,
        items: sale.items.map((item) => ({
          name: item.medicine_name,
          quantity: item.quantity,
          price: item.unit_price,
        })),
      });
    } catch (printError) {
      toast.error(printError.message);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Transaction history</CardTitle>
          <CardDescription>
            Review completed, refunded, and cancelled point-of-sale
            transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_11rem]">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search invoice, customer, or phone"
                className="h-11 pl-9"
              />
            </div>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-11 rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              <option value="">All statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="REFUNDED">Refunded</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div
            className="mt-3 flex flex-wrap gap-2"
            aria-label="Filter sales by date"
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
                  <TableHead>Invoice</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
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
                  : sales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-mono text-xs font-medium text-foreground">
                          {sale.invoice_number}
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-foreground">
                            {sale.customer_name}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {sale.customer_phone || "Walk-in"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{sale.payment_method}</Badge>
                        </TableCell>
                        <TableCell>
                          {new Intl.DateTimeFormat("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(new Date(sale.created_at))}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {currency(sale.grand_total)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              sale.payment_status === "COMPLETED"
                                ? "secondary"
                                : sale.payment_status === "CANCELLED"
                                  ? "destructive"
                                  : "outline"
                            }
                            className={
                              sale.payment_status === "COMPLETED"
                                ? "text-primary"
                                : ""
                            }
                          >
                            {sale.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="cursor-pointer"
                              onClick={() => setSelectedSale(sale)}
                              aria-label={`View ${sale.invoice_number}`}
                            >
                              <Eye />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="cursor-pointer"
                              onClick={() => handlePrint(sale)}
                              aria-label={`Print ${sale.invoice_number}`}
                            >
                              <Printer />
                            </Button>
                            {sale.payment_status === "COMPLETED" && (
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                className="cursor-pointer text-destructive"
                                onClick={() => setReturnSaleDialog(sale)}
                                aria-label={`Return items from ${sale.invoice_number}`}
                              >
                                <RotateCcw />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
            {!isPending && !error && sales.length === 0 && (
              <div className="flex min-h-48 flex-col items-center justify-center text-center">
                <ReceiptText className="size-6 text-muted-foreground" />
                <p className="mt-3 font-medium text-foreground">
                  No sales found
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try changing the current search or status filter.
                </p>
              </div>
            )}
            {error && (
              <div className="flex min-h-48 flex-col items-center justify-center text-center">
                <CircleAlert className="size-6 text-destructive" />
                <p className="mt-3 font-medium text-foreground">
                  Unable to load sales
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
        open={Boolean(selectedSale)}
        onOpenChange={(open) => !open && setSelectedSale(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedSale?.invoice_number}</DialogTitle>
            <DialogDescription>
              {selectedSale?.customer_name} · {selectedSale?.payment_method}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {selectedSale?.items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between border-b border-border pb-3"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {item.medicine_name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.quantity} × {currency(item.unit_price)}
                  </p>
                </div>
                <p className="font-medium text-foreground">
                  {currency(item.subtotal)}
                </p>
              </div>
            ))}
            <div className="space-y-1 border-t border-border pt-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{currency(selectedSale?.subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax</span>
                <span>{currency(selectedSale?.tax_amount)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-foreground">
                <span>Total</span>
                <span>{currency(selectedSale?.grand_total)}</span>
              </div>
            </div>
            <Button
              className="w-full cursor-pointer"
              variant="outline"
              onClick={() => handlePrint(selectedSale)}
            >
              <Printer data-icon="inline-start" />
              Print receipt
            </Button>
            {selectedSale?.payment_status === "COMPLETED" && (
              <Button
                className="w-full cursor-pointer"
                variant="destructive"
                onClick={() => {
                  setSelectedSale(null);
                  setReturnSaleDialog(selectedSale);
                }}
              >
                <RotateCcw data-icon="inline-start" />
                Return items
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <ReturnSaleDialog
        sale={returnSaleDialog}
        onClose={() => setReturnSaleDialog(null)}
      />
    </>
  );
}

"use client";

import {
  Check,
  ChevronsUpDown,
  CreditCard,
  LoaderCircle,
  Minus,
  Pause,
  Plus,
  ReceiptText,
  Play,
  Trash2,
  UserRound,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCustomers } from "@/hook/useCustomers";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PKR",
  }).format(value);
}

export default function SaleCart({
  cart,
  onQuantityChange,
  onRemove,
  onClear,
  onCheckout,
  isCheckingOut,
  pausedCarts,
  onPause,
  onResume,
  onDiscardPaused,
  taxRate,
}) {
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [discountAmount, setDiscountAmount] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerMenuOpen, setCustomerMenuOpen] = useState(false);
  const { data: customers = [] } = useCustomers({
    search: customerSearch || undefined,
  });
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const discount = Math.min(Math.max(Number(discountAmount) || 0, 0), subtotal);
  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * taxRate;
  const total = taxableAmount + tax;

  return (
    <aside className="flex min-h-136 flex-col rounded-xl border border-border bg-card text-card-foreground xl:sticky xl:top-20 xl:max-h-[calc(100vh-6rem)]">
      <div className="flex items-start justify-between border-b border-border p-5">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
            Current sale
          </p>
          <h2 className="mt-1 text-lg font-semibold text-foreground">
            Order #POS-0842
          </h2>
        </div>
        <div className="flex gap-1">
          {cart.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="cursor-pointer"
              onClick={() =>
                onPause({
                  id: selectedCustomer?.id ?? null,
                  full_name: selectedCustomer?.full_name ?? "Walk-in Customer",
                  phone: selectedCustomer?.phone ?? "",
                })
              }
            >
              <Pause data-icon="inline-start" />
              Pause
            </Button>
          )}
          {cart.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="cursor-pointer text-muted-foreground hover:text-destructive"
              onClick={onClear}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {pausedCarts.length > 0 && (
        <div className="border-b border-border bg-muted/40 px-5 py-3">
          <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Paused carts ({pausedCarts.length})
          </p>
          <div className="mt-2 max-h-28 space-y-1 overflow-y-auto">
            {pausedCarts.map((pausedCart) => (
              <div
                key={pausedCart.id}
                className="flex items-center justify-between gap-2 rounded-md bg-background px-2 py-1.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-foreground">
                    {pausedCart.customer.full_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {pausedCart.cart.length} item
                    {pausedCart.cart.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    className="cursor-pointer"
                    onClick={() => onResume(pausedCart.id)}
                    aria-label="Resume paused cart"
                  >
                    <Play />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    className="cursor-pointer text-destructive"
                    onClick={() => onDiscardPaused(pausedCart.id)}
                    aria-label="Discard paused cart"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-b border-border px-5 py-3">
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            className="w-full cursor-pointer justify-between px-0 text-left"
            onClick={() => setCustomerMenuOpen((open) => !open)}
          >
            <span className="flex min-w-0 items-center gap-2">
              <UserRound className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate text-sm text-foreground">
                {selectedCustomer
                  ? selectedCustomer.full_name
                  : "Walk-in Customer"}
              </span>
              {selectedCustomer?.phone && (
                <span className="truncate text-xs text-muted-foreground">
                  {selectedCustomer.phone}
                </span>
              )}
            </span>
            <ChevronsUpDown className="size-4 text-muted-foreground" />
          </Button>
          {customerMenuOpen && (
            <div className="absolute top-10 right-0 left-0 z-20 rounded-lg border border-border bg-popover p-2 shadow-lg">
              <input
                autoFocus
                value={customerSearch}
                onChange={(event) => setCustomerSearch(event.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                placeholder="Search customer name or phone"
              />
              <div className="mt-2 max-h-48 overflow-y-auto">
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
                  onClick={() => {
                    setSelectedCustomer(null);
                    setCustomerSearch("");
                    setCustomerMenuOpen(false);
                  }}
                >
                  <Check
                    className={`size-4 ${!selectedCustomer ? "text-primary" : "opacity-0"}`}
                  />
                  Walk-in Customer
                </button>
                {customers.map((customer) => (
                  <button
                    key={customer.id}
                    type="button"
                    className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setCustomerSearch("");
                      setCustomerMenuOpen(false);
                    }}
                  >
                    <Check
                      className={`size-4 ${selectedCustomer?.id === customer.id ? "text-primary" : "opacity-0"}`}
                    />
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-foreground">
                        {customer.full_name}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {customer.phone}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {cart.length === 0 ? (
          <div className="flex h-full min-h-48 flex-col items-center justify-center px-5 text-center">
            <ReceiptText className="size-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium text-foreground">
              Your cart is ready
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Select medicines from the catalog to start this sale.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {cart.map((item) => (
              <li
                key={item.id}
                className="border-b border-border pb-4 last:border-0"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatCurrency(item.price)} each
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-foreground">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-border">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="cursor-pointer"
                      onClick={() => onQuantityChange(item.id, -1)}
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      <Minus />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium text-foreground">
                      {item.quantity}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="cursor-pointer"
                      onClick={() => onQuantityChange(item.id, 1)}
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      <Plus />
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    className="cursor-pointer text-muted-foreground hover:text-destructive"
                    onClick={() => onRemove(item.id)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-border p-5">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between gap-3 text-muted-foreground">
            <label htmlFor="cart-discount">Discount</label>
            <div className="relative w-32">
              <span className="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-xs text-muted-foreground">
                PKR
              </span>
              <input
                id="cart-discount"
                type="number"
                min="0"
                max={subtotal}
                step="0.01"
                value={discountAmount}
                onChange={(event) => setDiscountAmount(event.target.value)}
                placeholder="0.00"
                className="h-8 w-full rounded-md border border-input bg-background pr-2 pl-9 text-right text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>
              Tax ({(taxRate * 100).toFixed(2).replace(/\.00$/, "")}%)
            </span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-base font-semibold text-foreground">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <Button
            type="button"
            variant={paymentMethod === "CASH" ? "default" : "outline"}
            size="sm"
            className="cursor-pointer"
            onClick={() => setPaymentMethod("CASH")}
          >
            Cash
          </Button>
          <Button
            type="button"
            variant={paymentMethod === "CARD" ? "default" : "outline"}
            size="sm"
            className="cursor-pointer"
            onClick={() => setPaymentMethod("CARD")}
          >
            Card
          </Button>
          <Button
            type="button"
            variant={paymentMethod === "ONLINE" ? "default" : "outline"}
            size="sm"
            className="cursor-pointer"
            onClick={() => setPaymentMethod("ONLINE")}
          >
            Online
          </Button>
        </div>
        <Button
          type="button"
          size="lg"
          className="mt-3 h-12 w-full cursor-pointer"
          disabled={cart.length === 0 || isCheckingOut}
          onClick={() =>
            onCheckout({
              paymentMethod,
              customerId: selectedCustomer?.id ?? null,
              customerName: selectedCustomer?.full_name ?? "Walk-in Customer",
              customerPhone: selectedCustomer?.phone ?? "",
              discountAmount: discount,
            })
          }
        >
          {isCheckingOut ? (
            <LoaderCircle className="animate-spin" data-icon="inline-start" />
          ) : (
            <CreditCard data-icon="inline-start" />
          )}
          {isCheckingOut ? "Processing…" : `Charge ${formatCurrency(total)}`}
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          <Badge variant="outline" className="mr-1">
            F2
          </Badge>{" "}
          Quick checkout
        </p>
      </div>
    </aside>
  );
}

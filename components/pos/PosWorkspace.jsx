"use client";

import { useState } from "react";
import { toast } from "sonner";

import MedicineCatalog from "@/components/pos/MedicineCatalog";
import PosHeader from "@/components/pos/PosHeader";
import SaleCart from "@/components/pos/SaleCart";
import { useCheckoutSale } from "@/hook/usePos";
import { useSettings } from "@/hook/useSettings";
import { printReceipt } from "@/lib/pos/printReceipt";

export default function PosWorkspace() {
  const [cart, setCart] = useState([]);
  const [pausedCarts, setPausedCarts] = useState([]);
  const checkoutSale = useCheckoutSale();
  const { data: settings } = useSettings();
  const taxRate = Number(settings?.tax_rate ?? 5) / 100;

  function addToCart(medicine) {
    setCart((items) => {
      const current = items.find((item) => item.id === medicine.id);
      return current
        ? items.map((item) =>
            item.id === medicine.id
              ? item.quantity < item.maxQuantity
                ? { ...item, quantity: item.quantity + 1 }
                : item
              : item,
          )
        : [...items, { ...medicine, quantity: 1 }];
    });
  }

  function changeQuantity(id, adjustment) {
    setCart((items) =>
      items.flatMap((item) => {
        if (item.id !== id) return [item];
        const quantity = item.quantity + adjustment;
        return quantity > 0 && quantity <= item.maxQuantity
          ? [{ ...item, quantity }]
          : quantity <= 0
            ? []
            : [item];
      }),
    );
  }

  function pauseCart(customer) {
    if (cart.length === 0) {
      toast.error("Add at least one medicine before pausing the cart.");
      return;
    }
    const pausedCart = {
      id: crypto.randomUUID(),
      cart,
      customer,
      pausedAt: new Date().toISOString(),
    };
    setPausedCarts((carts) => [...carts, pausedCart]);
    setCart([]);
    toast.success("Cart paused successfully.");
  }

  function resumeCart(id) {
    const pausedCart = pausedCarts.find((item) => item.id === id);
    if (!pausedCart) return;
    if (cart.length > 0) {
      toast.error(
        "Clear or pause the current cart before resuming another one.",
      );
      return;
    }
    setCart(pausedCart.cart);
    setPausedCarts((carts) => carts.filter((item) => item.id !== id));
    toast.success("Paused cart resumed.");
  }

  async function handleCheckout({
    paymentMethod,
    customerId,
    customerName,
    customerPhone,
    discountAmount,
  }) {
    try {
      const sale = await checkoutSale.mutateAsync({
        customer_id: customerId,
        customer_name: customerName || "Walk-in Customer",
        customer_phone: customerPhone || null,
        payment_method: paymentMethod,
        discount_amount: discountAmount,
        tax_rate: taxRate,
        items: cart.map((item) => ({
          batch_id: item.batchId,
          quantity: item.quantity,
        })),
      });
      toast.success(`Sale ${sale.invoice_number} completed successfully.`);
      if (settings?.auto_print_receipt !== false) {
        try {
          printReceipt({
            sale,
            items: cart,
            customerName,
            customerPhone,
            settings,
          });
        } catch (printError) {
          toast.error(printError.message);
        }
      }
      setCart([]);
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <section className="flex min-h-0 flex-col gap-6">
      <PosHeader />
      <div className="grid min-h-0 gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <MedicineCatalog onAdd={addToCart} />
        <SaleCart
          cart={cart}
          onQuantityChange={changeQuantity}
          onRemove={(id) =>
            setCart((items) => items.filter((item) => item.id !== id))
          }
          onClear={() => setCart([])}
          pausedCarts={pausedCarts}
          onPause={pauseCart}
          onResume={resumeCart}
          onDiscardPaused={(id) => {
            setPausedCarts((carts) => carts.filter((item) => item.id !== id));
            toast.success("Paused cart discarded.");
          }}
          taxRate={taxRate}
          onCheckout={handleCheckout}
          isCheckingOut={checkoutSale.isPending}
        />
      </div>
    </section>
  );
}

"use client";

import { LoaderCircle, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMedicines } from "@/hook/useInventory";
import { useReceivePurchase } from "@/hook/usePurchases";
import { useSuppliers } from "@/hook/useSuppliers";

const emptyLine = () => ({
  medicine_id: "",
  batch_number: "",
  manufacture_date: "",
  expiry_date: "",
  quantity: "1",
  purchase_price: "",
  selling_price: "",
});
const currency = (value) =>
  new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR" }).format(
    Number(value),
  );

export default function ReceivePurchaseDialog({ open, onClose }) {
  const [supplierId, setSupplierId] = useState("");
  const [invoiceReference, setInvoiceReference] = useState("");
  const [items, setItems] = useState([emptyLine()]);
  const { data: suppliers = [] } = useSuppliers();
  const { data: medicineResponse } = useMedicines({});
  const receivePurchase = useReceivePurchase();
  const medicines = medicineResponse?.items ?? [];
  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + Number(item.quantity || 0) * Number(item.purchase_price || 0),
        0,
      ),
    [items],
  );
  function updateLine(index, field, value) {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  }
  function reset() {
    setSupplierId("");
    setInvoiceReference("");
    setItems([emptyLine()]);
  }
  async function handleSubmit(event) {
    event.preventDefault();
    if (
      !supplierId ||
      items.some(
        (item) =>
          !item.medicine_id ||
          !item.batch_number ||
          !item.manufacture_date ||
          !item.expiry_date ||
          Number(item.quantity) < 1 ||
          Number(item.purchase_price) < 0 ||
          Number(item.selling_price) < 0,
      )
    ) {
      toast.error(
        "Complete the supplier and all batch details before receiving stock.",
      );
      return;
    }
    try {
      const order = await receivePurchase.mutateAsync({
        supplier_id: supplierId,
        invoice_reference: invoiceReference,
        items: items.map((item) => ({
          medicine_id: item.medicine_id,
          batch_number: item.batch_number,
          manufacture_date: item.manufacture_date,
          expiry_date: item.expiry_date,
          quantity: Number(item.quantity),
          purchase_price: Number(item.purchase_price),
          selling_price: Number(item.selling_price),
        })),
      });
      toast.success(`Stock received under purchase bill ${order.po_number}.`);
      reset();
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Receive purchase</DialogTitle>
          <DialogDescription>
            Record one supplier bill with multiple medicine batches. This
            creates one purchase history record and updates inventory.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Supplier
              </label>
              <select
                value={supplierId}
                onChange={(event) => setSupplierId(event.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm text-foreground"
              >
                <option value="">Select supplier</option>
                {suppliers
                  .filter((supplier) => supplier.is_active)
                  .map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.company_name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Supplier invoice reference
              </label>
              <Input
                value={invoiceReference}
                onChange={(event) => setInvoiceReference(event.target.value)}
                placeholder="Optional invoice number"
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                Received medicine batches
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="cursor-pointer"
                onClick={() => setItems((current) => [...current, emptyLine()])}
              >
                <Plus data-icon="inline-start" />
                Add medicine
              </Button>
            </div>
            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-3 rounded-lg border border-border p-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_7rem_7rem_6rem_7rem_7rem_auto]"
              >
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Medicine
                  </label>
                  <select
                    value={item.medicine_id}
                    onChange={(event) =>
                      updateLine(index, "medicine_id", event.target.value)
                    }
                    className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm text-foreground"
                  >
                    <option value="">Select medicine</option>
                    {medicines.map((medicine) => (
                      <option key={medicine.id} value={medicine.id}>
                        {medicine.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Batch number
                  </label>
                  <Input
                    value={item.batch_number}
                    onChange={(event) =>
                      updateLine(index, "batch_number", event.target.value)
                    }
                    placeholder="Batch no."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Manufactured
                  </label>
                  <Input
                    type="date"
                    value={item.manufacture_date}
                    onChange={(event) =>
                      updateLine(index, "manufacture_date", event.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Expires
                  </label>
                  <Input
                    type="date"
                    value={item.expiry_date}
                    onChange={(event) =>
                      updateLine(index, "expiry_date", event.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Quantity
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) =>
                      updateLine(index, "quantity", event.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Unit cost
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.purchase_price}
                    onChange={(event) =>
                      updateLine(index, "purchase_price", event.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Selling price
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.selling_price}
                    onChange={(event) =>
                      updateLine(index, "selling_price", event.target.value)
                    }
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="cursor-pointer text-destructive"
                    disabled={items.length === 1}
                    onClick={() =>
                      setItems((current) =>
                        current.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                    aria-label="Remove medicine batch"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm text-muted-foreground">
              Purchase bill total
            </span>
            <span className="text-lg font-semibold text-foreground">
              {currency(total)}
            </span>
          </div>
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={receivePurchase.isPending}
            >
              {receivePurchase.isPending && (
                <LoaderCircle
                  className="animate-spin"
                  data-icon="inline-start"
                />
              )}
              Receive stock
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

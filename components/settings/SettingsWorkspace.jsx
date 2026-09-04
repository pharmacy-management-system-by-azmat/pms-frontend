"use client";

import {
  BellRing,
  Building2,
  LoaderCircle,
  MonitorCog,
  ReceiptText,
  Save,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/hook/useProfile";
import { useSettings, useUpdateSettings } from "@/hook/useSettings";

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}

function SettingsForm({ settings, canEdit }) {
  const [form, setForm] = useState(() => ({ ...settings }));
  const updateSettings = useUpdateSettings();
  function updateField(event) {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }
  async function submit(event) {
    event.preventDefault();
    try {
      await updateSettings.mutateAsync({
        ...form,
        tax_rate: Number(form.tax_rate),
        expiry_alert_days: Number(form.expiry_alert_days),
      });
      toast.success("Pharmacy settings updated successfully.");
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <form className="space-y-6" onSubmit={submit}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="size-5 text-primary" />
            Pharmacy details
          </CardTitle>
          <CardDescription>
            Information displayed throughout the system and on printed
            documents.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Pharmacy name">
            <Input
              name="pharmacy_name"
              value={form.pharmacy_name}
              onChange={updateField}
              disabled={!canEdit}
              required
            />
          </Field>
          <Field label="Phone">
            <Input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={updateField}
              disabled={!canEdit}
            />
          </Field>
          <Field label="Email">
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              disabled={!canEdit}
            />
          </Field>
          <Field label="Address">
            <Textarea
              name="address"
              value={form.address}
              onChange={updateField}
              disabled={!canEdit}
            />
          </Field>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ReceiptText className="size-5 text-primary" />
              Sales & receipts
            </CardTitle>
            <CardDescription>
              Configure tax, receipt text, and print behavior.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Currency">
                <Input
                  name="currency"
                  value={form.currency}
                  disabled
                  readOnly
                />
              </Field>
              <Field label="Tax rate (%)">
                <Input
                  name="tax_rate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={form.tax_rate}
                  onChange={updateField}
                  disabled={!canEdit}
                />
              </Field>
            </div>
            <Field label="Receipt footer">
              <Input
                name="receipt_footer"
                value={form.receipt_footer}
                onChange={updateField}
                disabled={!canEdit}
              />
            </Field>
            <label className="flex items-center justify-between rounded-lg border border-border p-3">
              <span>
                <span className="block text-sm font-medium text-foreground">
                  Automatic receipt printing
                </span>
                <span className="block text-xs text-muted-foreground">
                  Open the print dialog after a successful POS sale.
                </span>
              </span>
              <input
                name="auto_print_receipt"
                type="checkbox"
                checked={form.auto_print_receipt}
                onChange={updateField}
                disabled={!canEdit}
              />
            </label>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="size-5 text-primary" />
              Inventory alerts
            </CardTitle>
            <CardDescription>
              Control stock and expiry warnings used by pharmacy operations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Field label="Expiry alert period (days)">
              <Input
                name="expiry_alert_days"
                type="number"
                min="1"
                max="365"
                value={form.expiry_alert_days}
                onChange={updateField}
                disabled={!canEdit}
              />
            </Field>
            <label className="flex items-center justify-between rounded-lg border border-border p-3">
              <span>
                <span className="block text-sm font-medium text-foreground">
                  Low-stock notifications
                </span>
                <span className="block text-xs text-muted-foreground">
                  Show alerts when stock falls below medicine reorder levels.
                </span>
              </span>
              <input
                name="low_stock_notifications"
                type="checkbox"
                checked={form.low_stock_notifications}
                onChange={updateField}
                disabled={!canEdit}
              />
            </label>
            <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              <MonitorCog className="mr-1 inline size-4 text-primary" />
              Individual medicine reorder levels are managed from the Medicines
              page.
            </div>
          </CardContent>
        </Card>
      </div>
      {canEdit ? (
        <div className="flex justify-end">
          <Button
            type="submit"
            className="cursor-pointer"
            disabled={updateSettings.isPending}
          >
            {updateSettings.isPending ? (
              <LoaderCircle className="animate-spin" data-icon="inline-start" />
            ) : (
              <Save data-icon="inline-start" />
            )}
            Save settings
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/60 p-4 text-sm text-muted-foreground">
          <ShieldCheck className="size-4 text-primary" />
          Settings are read-only. Administrator access is required to make
          changes.
        </div>
      )}
    </form>
  );
}

export default function SettingsWorkspace() {
  const { data: settings, isPending, error } = useSettings();
  const { data: profile } = useProfile();
  if (isPending)
    return (
      <div className="space-y-6">
        <Skeleton className="h-64" />
        <div className="grid gap-6 xl:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  if (error)
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="font-medium text-foreground">Unable to load settings</p>
          <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
        </CardContent>
      </Card>
    );
  return (
    <SettingsForm
      key={settings.updated_at}
      settings={settings}
      canEdit={profile?.role === "ADMIN"}
    />
  );
}

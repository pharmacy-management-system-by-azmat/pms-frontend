import SettingsWorkspace from "@/components/settings/SettingsWorkspace";

export const metadata = { title: "Settings | MediFlow" };

export default function SettingsPage() {
  return (
    <main className="min-h-full bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Administration
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Configure pharmacy identity, receipts, taxation, and inventory alert
          preferences.
        </p>
        <div className="mt-6">
          <SettingsWorkspace />
        </div>
      </div>
    </main>
  );
}

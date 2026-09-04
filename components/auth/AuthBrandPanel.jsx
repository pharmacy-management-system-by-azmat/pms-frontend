import {
  Activity,
  ArrowUpRight,
  Clock3,
  PackageSearch,
  ScanLine,
  ShieldCheck,
} from "lucide-react";

export default function AuthBrandPanel() {
  return (
    <aside className="relative hidden min-h-screen overflow-hidden bg-foreground p-10 text-background lg:flex lg:flex-col xl:p-14">
      <div className="absolute top-0 right-0 h-56 w-56 translate-x-16 -translate-y-16 rounded-full border border-background/20" />
      <div className="absolute right-16 bottom-24 h-24 w-24 rounded-full border border-background/15" />

      <div className="relative flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <PackageSearch className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="font-heading text-lg font-semibold">MediFlow</p>
          <p className="text-sm text-background/65">Pharmacy operations</p>
        </div>
      </div>

      <div className="relative my-auto max-w-lg">
        <p className="text-sm font-medium tracking-[0.22em] text-background/60 uppercase">
          Morning handover · 08:30
        </p>
        <h1 className="mt-5 font-heading text-5xl leading-[1.03] font-semibold tracking-tight xl:text-6xl">
          Start the shift with a clear view.
        </h1>
        <p className="mt-6 max-w-md text-base leading-7 text-background/70">
          Sign in to review the live pharmacy floor, outstanding orders, and the
          day&apos;s dispensing activity.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-background/15 bg-background/10 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-background/65">
              <span className="text-xs font-medium uppercase">
                Today&apos;s sales
              </span>
              <ArrowUpRight className="size-4" />
            </div>
            <p className="mt-5 text-3xl font-semibold">PKR 4,286</p>
            <p className="mt-1 text-sm text-background/65">
              12.5% from yesterday
            </p>
          </div>
          <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
            <div className="flex items-center justify-between text-primary-foreground/75">
              <span className="text-xs font-medium uppercase">Live queue</span>
              <Activity className="size-4" />
            </div>
            <p className="mt-5 text-3xl font-semibold">14</p>
            <p className="mt-1 text-sm text-primary-foreground/75">
              prescriptions in progress
            </p>
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-between border-t border-background/15 pt-6 text-sm text-background/70">
        <span className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-primary" />
          Secure staff workspace
        </span>
        <span className="flex items-center gap-2">
          <Clock3 className="size-4" />
          Updated live
        </span>
      </div>
    </aside>
  );
}

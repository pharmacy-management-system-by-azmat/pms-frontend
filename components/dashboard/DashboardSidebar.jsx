"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  ChevronRight,
  ClipboardList,
  FolderTree,
  LayoutDashboard,
  Menu,
  PackageSearch,
  Pill,
  Settings,
  ShoppingCart,
  ReceiptText,
  Truck,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Point of sale", href: "/dashboard/pos", icon: ShoppingCart },
  { label: "Sales history", href: "/dashboard/sales", icon: ReceiptText },
  { label: "Inventory", href: "/dashboard/inventory", icon: Boxes },
  { label: "Medicines", href: "/dashboard/medicines", icon: Pill },
  { label: "Categories", href: "/dashboard/categories", icon: FolderTree },
  { label: "Suppliers", href: "/dashboard/suppliers", icon: Truck },
  {
    label: "Purchase orders",
    href: "/dashboard/purchases",
    icon: ClipboardList,
  },
  { label: "Customers", href: "/dashboard/customers", icon: UsersRound },
];

function NavigationLinks({ mobile = false }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Dashboard navigation"
      className={cn("flex flex-col gap-1", mobile && "p-3")}
    >
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-200 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function DashboardSidebar() {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <PackageSearch className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="font-heading text-sm font-semibold text-sidebar-foreground">
              MediFlow
            </p>
            <p className="text-xs text-muted-foreground">Pharmacy management</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-3 pb-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Workspace
          </p>
          <NavigationLinks />
        </div>

        <div className="border-t border-sidebar-border p-3">
          <Link
            href="/dashboard/settings"
            className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-3 focus-visible:ring-sidebar-ring/50 focus-visible:outline-none"
          >
            <Settings className="size-4" aria-hidden="true" />
            Settings
          </Link>
          <div
            className="mt-3 flex items-center gap-3 rounded-lg bg-sidebar-accent p-3"
            role="status"
          >
            <span className="relative flex size-3 shrink-0" aria-hidden="true">
              <span className="relative inline-flex size-3 rounded-full bg-primary" />
            </span>
            <div>
              <p className="text-sm font-medium text-sidebar-accent-foreground">
                Server online
              </p>
              <p className="text-xs text-muted-foreground">
                All services operational
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <PackageSearch className="size-4" />
          </span>
          <span className="font-heading text-sm font-semibold text-foreground">
            MediFlow
          </span>
        </Link>
        <details className="relative">
          <summary className="list-none">
            <Button
              variant="outline"
              size="icon-sm"
              className="cursor-pointer"
              aria-label="Open dashboard navigation"
            >
              <Menu />
            </Button>
          </summary>
          <div className="absolute top-12 right-0 z-50 w-72 rounded-xl border border-border bg-popover shadow-lg">
            <NavigationLinks mobile />
            <div className="border-t border-border p-3">
              <Link
                href="/dashboard/settings"
                className="flex min-h-11 items-center justify-between rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                Settings <ChevronRight className="size-4" />
              </Link>
            </div>
          </div>
        </details>
      </div>
    </>
  );
}

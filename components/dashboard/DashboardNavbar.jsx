"use client";

import { Bell, ChevronDown, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import ThemeToggle from "@/components/dashboard/ThemeToggle";
import { useLogout } from "@/hook/useAuth";
import { useProfile } from "@/hook/useProfile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardNavbar() {
  const router = useRouter();
  const logoutMutation = useLogout();
  const { data: profile } = useProfile();
  const initials =
    `${profile?.first_name?.[0] ?? ""}${profile?.last_name?.[0] ?? profile?.username?.[0] ?? "U"}`.toUpperCase();
  const displayName =
    `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim() ||
    profile?.username ||
    "Account";
  const roleLabel = profile?.role
    ? `${profile.role[0]}${profile.role.slice(1).toLowerCase()}`
    : "Loading profile";

  function handleLogout() {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Signed out successfully.");
        router.replace("/auth/login");
      },
      onError: () => {
        toast.error("Unable to sign out. Please try again.");
      },
    });
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">Workspace</p>
        <p className="truncate text-sm font-semibold text-foreground">
          Dashboard overview
        </p>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          className="hidden cursor-pointer sm:inline-flex"
          aria-label="Search pharmacy records"
        >
          <Search />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="relative cursor-pointer"
          aria-label="View notifications"
        >
          <Bell />
          <Badge className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full p-0 text-[10px]">
            3
          </Badge>
        </Button>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="cursor-pointer px-1.5 sm:px-2">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {initials}
                </span>
                <span className="hidden text-left sm:block">
                  <span className="block text-sm font-medium text-foreground">
                    {displayName}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {roleLabel}
                  </span>
                </span>
                <ChevronDown
                  className="hidden sm:block"
                  data-icon="inline-end"
                />
              </Button>
            }
          >
            Open user account menu
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuGroup>
              <DropdownMenuLabel>{displayName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/profile")}
              >
                Profile settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/settings")}
              >
                Store preferences
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

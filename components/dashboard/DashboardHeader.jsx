"use client";

import {
  CalendarDays,
  ChevronDown,
  MapPin,
  Plus,
  ShoppingCart,
} from "lucide-react";

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

const locations = [
  "Main Street Pharmacy",
  "Northside Branch",
  "City Clinic Counter",
];
const dateRanges = ["Today", "Last 7 days", "This month"];

export default function DashboardHeader() {
  return (
    <header className="flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm font-medium text-primary">
          Friday, August 29, 2026
        </p>
        <h1 className="mt-1 font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Good morning, Admin
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here is your pharmacy performance at a glance.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" className="cursor-pointer">
                <MapPin data-icon="inline-start" />
                Main Street Pharmacy
                <ChevronDown data-icon="inline-end" />
              </Button>
            }
          >
            Select store location
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Store locations</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {locations.map((location) => (
                <DropdownMenuItem key={location}>{location}</DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" className="cursor-pointer">
                <CalendarDays data-icon="inline-start" />
                Today
                <ChevronDown data-icon="inline-end" />
              </Button>
            }
          >
            Select reporting date range
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Date range</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {dateRanges.map((range) => (
                <DropdownMenuItem key={range}>{range}</DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button className="cursor-pointer">
          <ShoppingCart data-icon="inline-start" />
          New Sale (POS)
        </Button>
        <Button variant="secondary" className="cursor-pointer">
          <Plus data-icon="inline-start" />
          Add Stock
        </Button>
      </div>
    </header>
  );
}

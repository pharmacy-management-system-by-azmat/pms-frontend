import {
  BadgeCheck,
  CalendarDays,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const roleLabels = {
  ADMIN: "Administrator",
  PHARMACIST: "Pharmacist",
  CASHIER: "Cashier",
};

export default function ProfileOverview({ profile }) {
  const initials =
    `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? profile.username?.[0] ?? "U"}`.toUpperCase();
  const fullName =
    `${profile.first_name} ${profile.last_name}`.trim() || profile.username;

  return (
    <Card className="overflow-visible">
      <CardContent className="gap-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-semibold text-primary-foreground">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate font-heading text-2xl font-semibold tracking-tight text-foreground">
                {fullName}
              </h1>
              <Badge variant="secondary" className="text-primary">
                <BadgeCheck />
                Verified staff
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              @{profile.username}
            </p>
            <Badge className="mt-3">
              {roleLabels[profile.role] ?? profile.role}
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 border-t border-border pt-5 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg bg-muted/60 p-3">
            <Mail className="size-4 text-primary" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Work email</p>
              <p className="truncate text-sm font-medium text-foreground">
                {profile.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-muted/60 p-3">
            <Phone className="size-4 text-primary" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="truncate text-sm font-medium text-foreground">
                {profile.phone || "Not set"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-muted/60 p-3">
            <CalendarDays className="size-4 text-primary" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Member since</p>
              <p className="truncate text-sm font-medium text-foreground">
                {new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  year: "numeric",
                }).format(new Date(profile.date_joined))}
              </p>
            </div>
          </div>
        </div>
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-4 text-primary" />
          Your role and username are managed by an administrator.
        </p>
      </CardContent>
    </Card>
  );
}

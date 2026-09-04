"use client";

import { CircleAlert } from "lucide-react";

import ProfileForm from "@/components/profile/ProfileForm";
import ProfileOverview from "@/components/profile/ProfileOverview";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/hook/useProfile";

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-72" />
      <Skeleton className="h-96" />
    </div>
  );
}

export default function ProfilePageContent() {
  const { data: profile, isPending, error } = useProfile();

  if (isPending) return <ProfileSkeleton />;
  if (error)
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/10 px-6 text-center">
        <CircleAlert className="size-6 text-destructive" />
        <h1 className="mt-3 font-semibold text-foreground">
          Unable to load profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
      </div>
    );

  return (
    <div className="space-y-6">
      <ProfileOverview profile={profile} />
      <ProfileForm key={profile.id} profile={profile} />
    </div>
  );
}

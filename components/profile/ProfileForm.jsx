"use client";

import { LoaderCircle, Save } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { useUpdateProfile } from "@/hook/useProfile";

export default function ProfileForm({ profile }) {
  const [form, setForm] = useState(() => ({
    first_name: profile.first_name ?? "",
    last_name: profile.last_name ?? "",
    email: profile.email ?? "",
    phone: profile.phone ?? "",
  }));
  const updateProfile = useUpdateProfile();

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.email.trim()
    ) {
      toast.error("First name, last name, and email are required.");
      return;
    }

    try {
      await updateProfile.mutateAsync(form);
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal details</CardTitle>
        <CardDescription>
          Keep the contact details your team uses up to date.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          onSubmit={handleSubmit}
        >
          <div className="space-y-2">
            <Label htmlFor="first_name">First name</Label>
            <Input
              id="first_name"
              name="first_name"
              value={form.first_name}
              onChange={updateField}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last name</Label>
            <Input
              id="last_name"
              name="last_name"
              value={form.last_name}
              onChange={updateField}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={updateField}
              placeholder="Add a phone number"
              className="h-11"
            />
          </div>
          <div className="sm:col-span-2 flex justify-end border-t border-border pt-5">
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={updateProfile.isPending}
            >
              {updateProfile.isPending ? (
                <>
                  <LoaderCircle
                    className="animate-spin"
                    data-icon="inline-start"
                  />
                  Saving…
                </>
              ) : (
                <>
                  <Save data-icon="inline-start" />
                  Save changes
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

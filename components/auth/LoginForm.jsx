"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  PackageSearch,
  ScanLine,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import ThemeToggle from "@/components/dashboard/ThemeToggle";
import { useLogin } from "@/hook/useAuth";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const loginMutation = useLogin();

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.trim();
    const password = formData.get("password");

    if (!email || !password) {
      const validationMessage =
        "Enter your email address and password to continue.";
      setError(validationMessage);
      toast.error(validationMessage);
      return;
    }

    setError("");
    try {
      await loginMutation.mutateAsync({
        email,
        password,
        remember: formData.get("remember") === "on",
      });
      toast.success("Signed in successfully. Welcome back!");
      router.replace("/dashboard");
    } catch (loginError) {
      setError(loginError.message);
      toast.error(loginError.message);
    }
  }

  return (
    <section className="relative flex min-h-screen flex-col bg-background px-5 py-6 sm:px-8 lg:px-12">
      <div className="flex items-center justify-between lg:justify-end">
        <div className="flex items-center gap-2 lg:hidden">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <PackageSearch className="size-4" />
          </span>
          <span className="font-heading text-sm font-semibold text-foreground">
            MediFlow
          </span>
        </div>
        <ThemeToggle />
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-full border border-border text-primary">
              <ScanLine className="size-4" />
            </span>
            <p className="text-sm font-medium text-muted-foreground">
              Staff access
            </p>
          </div>
          <h2 className="mt-5 font-heading text-4xl font-semibold tracking-tight text-foreground">
            Welcome back.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Use your staff credentials to open today&apos;s workspace.
          </p>
        </div>

        <form
          className="mt-9 space-y-5 border-t border-border pt-8"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="staff@mediflow.com"
                className="h-12 rounded-xl pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium text-primary transition-colors hover:text-primary/80 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <LockKeyhole
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                className="h-12 rounded-xl pr-10 pl-9"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute top-1/2 right-1 -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="remember" name="remember" />
            <Label
              htmlFor="remember"
              className="cursor-pointer text-sm font-normal text-muted-foreground"
            >
              Keep me signed in for 30 days
            </Label>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="h-12 w-full cursor-pointer rounded-xl"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <LoaderCircle
                  className="animate-spin"
                  data-icon="inline-start"
                />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <p className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          Need help accessing your account?{" "}
          <a
            href="mailto:support@mediflow.example"
            className="font-medium text-primary hover:text-primary/80"
          >
            Contact support
          </a>
        </p>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        © 2026 MediFlow. All rights reserved.
      </p>
    </section>
  );
}

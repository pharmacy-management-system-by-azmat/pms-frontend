import AuthBrandPanel from "@/components/auth/AuthBrandPanel";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Sign in | MediFlow",
  description: "Sign in to the MediFlow pharmacy management system.",
};

export default function LoginPage() {
  return (
    <main className="grid min-h-full lg:grid-cols-2">
      <AuthBrandPanel />
      <LoginForm />
    </main>
  );
}

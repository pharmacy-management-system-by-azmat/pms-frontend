import ProfilePageContent from "@/components/profile/ProfilePageContent";

export const metadata = { title: "My Profile | MediFlow" };

export default function ProfilePage() {
  return (
    <main className="min-h-full bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Account
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground">
          My profile
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review your staff account and update your personal details.
        </p>
        <div className="mt-6">
          <ProfilePageContent />
        </div>
      </div>
    </main>
  );
}

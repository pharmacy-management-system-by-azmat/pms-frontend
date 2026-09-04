import PosWorkspace from "@/components/pos/PosWorkspace";

export const metadata = {
  title: "Point of Sale | MediFlow",
  description: "Create pharmacy point-of-sale transactions in MediFlow.",
};

export default function PosPage() {
  return (
    <main className="min-h-full bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex w-full flex-col gap-6">
        <PosWorkspace />
      </div>
    </main>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <main className="min-h-full bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full space-y-6">
        <div className="flex justify-between gap-4">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-64" />
          </div>
          <Skeleton className="h-10 w-52" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-44" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Skeleton className="h-96 xl:col-span-2" />
          <Skeleton className="h-96" />
        </div>
        <Skeleton className="h-96" />
      </div>
    </main>
  );
}

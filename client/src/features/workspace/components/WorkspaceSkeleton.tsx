import { Skeleton } from "@/components/ui/skeleton";

export function WorkspaceSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="space-y-4 rounded-xl border p-6"
        >
          <Skeleton className="h-10 w-10 rounded-lg" />

          <Skeleton className="h-6 w-40" />

          <Skeleton className="h-4 w-full" />

          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}
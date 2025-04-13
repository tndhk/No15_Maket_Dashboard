import { Skeleton } from "@/components/ui/skeleton";

interface SymbolsTableSkeletonProps {
  rowCount?: number;
}

export function SymbolsTableSkeleton({ rowCount = 5 }: SymbolsTableSkeletonProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-10 w-40" />
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-20" />
                </th>
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-24" />
                </th>
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-16" />
                </th>
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-16" />
                </th>
                <th className="px-4 py-3 text-center">
                  <Skeleton className="h-4 w-16 mx-auto" />
                </th>
              </tr>
            </thead>
            <tbody>
              {Array(rowCount)
                .fill(0)
                .map((_, index) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Skeleton className="h-6 w-16" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-6 w-32" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-6 w-12" />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center space-x-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 
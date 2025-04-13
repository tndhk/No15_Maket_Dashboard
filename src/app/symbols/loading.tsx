import { Skeleton } from "@/components/ui/skeleton";
import { SymbolsTableSkeleton } from "@/components/features/symbols/SymbolsTableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function SymbolsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">銘柄一覧</h1>
          <p className="text-muted-foreground mt-1">
            登録されている銘柄の一覧と詳細情報
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <RefreshCcw className="h-4 w-4 mr-2" />
            更新
          </Button>
          <Button size="sm" className="h-8" asChild>
            <Link href="/symbols/create">
              <PlusCircle className="h-4 w-4 mr-2" />
              新規登録
            </Link>
          </Button>
        </div>
      </div>

      <SymbolsTableSkeleton rowCount={10} />
    </div>
  );
} 
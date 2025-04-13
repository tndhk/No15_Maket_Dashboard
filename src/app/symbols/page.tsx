"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { getSymbols } from "@/lib/dal/symbols";
import { SymbolsTable } from "@/components/features/symbols/SymbolsTable";
import { SymbolsTableSkeleton } from "@/components/features/symbols/SymbolsTableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "銘柄一覧 - 金融データダッシュボード",
  description: "登録された銘柄の一覧と詳細情報",
};

// クライアントコンポーネント
export default function SymbolsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 検索パラメータを取得
  const search = typeof searchParams.search === "string" ? searchParams.search : "";
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1;

  // 全銘柄の価格データを更新
  const handleRefreshAll = async () => {
    if (isRefreshing) return;

    try {
      setIsRefreshing(true);
      
      // 仮の実装：実際にはこちらに全銘柄更新APIを呼び出す処理
      toast.info("全銘柄のデータ更新をリクエストしました");
      
      // 3秒後に更新完了とする（デモ用）
      setTimeout(() => {
        toast.success("全銘柄のデータが更新されました");
        router.refresh();
        setIsRefreshing(false);
      }, 3000);
    } catch (error) {
      console.error("Error refreshing all symbols:", error);
      toast.error("データの更新に失敗しました");
      setIsRefreshing(false);
    }
  };

  // APIから銘柄データを取得
  const SymbolsList = async () => {
    const { items, meta } = await getSymbols({
      search,
      category: category as any,
      page,
      limit: 20,
    });

    return (
      <SymbolsTable
        symbols={items}
        onSearch={(search) => console.log("Search:", search)}
        onCategoryFilter={(category) => console.log("Category:", category)}
      />
    );
  };

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
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8"
            onClick={handleRefreshAll}
            disabled={isRefreshing}
          >
            <RefreshCcw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
            {isRefreshing ? "更新中..." : "更新"}
          </Button>
          <Button size="sm" className="h-8" asChild>
            <Link href="/symbols/create">
              <PlusCircle className="h-4 w-4 mr-2" />
              新規登録
            </Link>
          </Button>
        </div>
      </div>

      <Suspense fallback={<SymbolsTableSkeleton rowCount={10} />}>
        <SymbolsList />
      </Suspense>

      {/* ページネーションはサーバーサイドレンダリングに移行するため省略 */}
    </div>
  );
} 
// サーバーコンポーネント
import { Suspense } from "react";
import { getSymbols } from "@/lib/dal/symbols";
import { SymbolsTable } from "@/components/features/symbols/SymbolsTable";
import { SymbolsTableSkeleton } from "@/components/features/symbols/SymbolsTableSkeleton";
import { SymbolsPageHeader } from "@/components/features/symbols/SymbolsPageHeader";

export const metadata = {
  title: "銘柄一覧 - 金融データダッシュボード",
  description: "登録された銘柄の一覧と詳細情報",
};

// Next.js 13のApp Routerでは、searchParamsはすでにパースされているオブジェクトとして渡されます
export default async function SymbolsPage({ searchParams }: { searchParams: any }) {
  const params = await searchParams;
  // 検索パラメータを安全に取得
  const search = params.search ? String(params.search) : "";
  const category = params.category ? String(params.category) : undefined;
  const page = params.page ? parseInt(String(params.page)) : 1;

  // APIから銘柄データを取得
  const { items, meta } = await getSymbols({
    search,
    category: category as any,
    page,
    limit: 20,
  });

  return (
    <div className="space-y-6">
      <SymbolsPageHeader />

      <Suspense fallback={<SymbolsTableSkeleton rowCount={10} />}>
        <SymbolsTable 
          symbols={items} 
        />
      </Suspense>

      {/* ページネーションはサーバーサイドレンダリングに移行するため省略 */}
    </div>
  );
} 
'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, MoreHorizontal, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSymbolById, getSymbolPrices } from "@/lib/dal/symbols";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SymbolDetailSkeleton } from "@/components/features/symbols/SymbolDetailSkeleton";
import { cn, formatDate } from "@/lib/utils";
import { FavoriteButton } from "@/components/features/favorites/FavoriteButton";

export const generateMetadata = async ({ params }: { params: { id: string } }) => {
  try {
    const symbol = await getSymbolById(parseInt(params.id));
    return {
      title: `${symbol.name} (${symbol.symbol}) - 金融データダッシュボード`,
      description: `${symbol.name}の価格データと分析情報`,
    };
  } catch (error) {
    return {
      title: "銘柄詳細 - 金融データダッシュボード",
      description: "銘柄の詳細情報",
    };
  }
};

export default function SymbolDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [symbol, setSymbol] = useState<any>(null);
  const [prices, setPrices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // シンボルIDを取得
  const symbolId = parseInt(params.id as string);

  useEffect(() => {
    if (isNaN(symbolId)) {
      // IDが数値でない場合はリダイレクト
      router.push("/symbols");
      return;
    }

    fetchSymbolData();
  }, [symbolId, router]);

  // シンボルデータを取得
  async function fetchSymbolData() {
    setIsLoading(true);
    try {
      const symbolData = await getSymbolById(symbolId);
      setSymbol(symbolData);

      const priceData = await getSymbolPrices(symbolId, 30);
      setPrices(priceData);
    } catch (error) {
      console.error("Error fetching symbol details:", error);
      toast.error("シンボル情報の取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  }

  // データ更新
  async function handleRefresh() {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      // APIリクエストの実装（ここではモックデータを使用）
      toast.info("データ更新をリクエストしました");
      
      // 3秒後に更新完了とする（デモ用）
      setTimeout(() => {
        toast.success("データが更新されました");
        fetchSymbolData();
        setIsRefreshing(false);
      }, 3000);
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("データの更新に失敗しました");
      setIsRefreshing(false);
    }
  }

  // 戻るボタン
  function handleBack() {
    router.back();
  }

  // 読み込み中
  if (isLoading) {
    return <SymbolDetailSkeleton />;
  }

  // データが見つからない場合
  if (!symbol) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">シンボルが見つかりません</p>
        <Button onClick={handleBack} variant="outline" className="mt-4">
          戻る
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              {symbol.symbol}
              <span className="text-lg font-normal text-muted-foreground">
                {symbol.name}
              </span>
              <FavoriteButton symbolId={symbolId} />
            </h1>
            <p className="text-muted-foreground mt-1">
              <span
                className={cn(
                  "inline-block px-2 py-1 text-xs rounded-full mr-2",
                  getCategoryClass(symbol.category)
                )}
              >
                {getCategoryLabel(symbol.category)}
              </span>
              登録日: {formatDate(symbol.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCcw
              className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")}
            />
            {isRefreshing ? "更新中..." : "データ更新"}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">その他</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>編集</DropdownMenuItem>
              <DropdownMenuItem>削除</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 詳細情報 */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">詳細情報</h2>
            {symbol.description ? (
              <p className="text-sm text-muted-foreground">{symbol.description}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">説明はありません</p>
            )}
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">シンボル情報</h2>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-muted-foreground">データ数</dt>
                <dd className="text-sm">{symbol._count?.prices || 0} 件</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-muted-foreground">ステータス</dt>
                <dd className="text-sm">
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs",
                      symbol.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300"
                    )}
                  >
                    {symbol.isActive ? "有効" : "無効"}
                  </span>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-muted-foreground">最終更新</dt>
                <dd className="text-sm">{formatDate(symbol.updatedAt)}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">価格データ</h2>
          {prices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-2 py-2 text-left">日付</th>
                    <th className="px-2 py-2 text-right">始値</th>
                    <th className="px-2 py-2 text-right">高値</th>
                    <th className="px-2 py-2 text-right">安値</th>
                    <th className="px-2 py-2 text-right">終値</th>
                  </tr>
                </thead>
                <tbody>
                  {prices.slice(0, 5).map((price) => (
                    <tr key={price.id} className="border-b last:border-0">
                      <td className="px-2 py-2">{formatDate(price.date)}</td>
                      <td className="px-2 py-2 text-right">{price.open?.toFixed(2) || "-"}</td>
                      <td className="px-2 py-2 text-right">{price.high?.toFixed(2) || "-"}</td>
                      <td className="px-2 py-2 text-right">{price.low?.toFixed(2) || "-"}</td>
                      <td className="px-2 py-2 text-right">{price.close.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {prices.length > 5 && (
                <div className="mt-2 text-center">
                  <Button variant="link" size="sm">
                    さらに表示
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              価格データはありません
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// カテゴリに基づいたラベルを取得する関数
function getCategoryLabel(category: string): string {
  switch (category) {
    case "stock":
      return "株式";
    case "crypto":
      return "仮想通貨";
    case "forex":
      return "為替";
    case "index":
      return "指数";
    case "other":
      return "その他";
    default:
      return category;
  }
}

// カテゴリに基づいたクラスを取得する関数
function getCategoryClass(category: string): string {
  switch (category) {
    case "stock":
      return "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300";
    case "crypto":
      return "bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-300";
    case "forex":
      return "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300";
    case "index":
      return "bg-orange-100 text-orange-800 dark:bg-orange-800/20 dark:text-orange-300";
    case "other":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-300";
  }
} 
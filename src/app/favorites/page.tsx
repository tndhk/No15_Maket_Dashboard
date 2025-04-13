"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/features/favorites/FavoriteButton";
import { getUserFavorites } from "@/lib/dal/favorites";

export default function FavoritesPage() {
  const router = useRouter();
  const { userId, isSignedIn, isLoaded } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // お気に入り一覧を取得
  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        // 未ログインの場合はログインページにリダイレクト
        router.push("/sign-in");
        return;
      }

      if (userId) {
        fetchFavorites();
      }
    }
  }, [isLoaded, isSignedIn, userId, router]);

  // お気に入り一覧を取得する関数
  async function fetchFavorites() {
    setIsLoading(true);
    try {
      const data = await getUserFavorites(userId!);
      setFavorites(data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast.error("お気に入り一覧の取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  }

  // お気に入り削除時のコールバック
  const handleFavoriteToggle = (symbolId: number, isFavorite: boolean) => {
    if (!isFavorite) {
      // お気に入りから削除されたら一覧から削除
      setFavorites((prev) => prev.filter((fav) => fav.symbolId !== symbolId));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">お気に入り一覧</h1>
        <p className="text-muted-foreground mt-1">
          お気に入り登録した銘柄の一覧
        </p>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground">
          読み込み中...
        </div>
      ) : favorites.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left">銘柄コード</th>
                <th className="px-4 py-3 text-left">銘柄名</th>
                <th className="px-4 py-3 text-left">カテゴリ</th>
                <th className="px-4 py-3 text-left">データ数</th>
                <th className="px-4 py-3 text-center">アクション</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((favorite) => (
                <tr
                  key={favorite.id}
                  className="border-t hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/symbols/${favorite.symbolId}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {favorite.symbol.symbol}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{favorite.symbol.name}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted">
                      {getCategoryLabel(favorite.symbol.category)}
                    </span>
                  </td>
                  <td className="px-4 py-3">{favorite.symbol._count?.prices || 0}</td>
                  <td className="px-4 py-3 text-center">
                    <FavoriteButton
                      symbolId={favorite.symbolId}
                      initialIsFavorite={true}
                      size="sm"
                      className="h-8 w-8 p-0"
                      onToggle={(isFav) => handleFavoriteToggle(favorite.symbolId, isFav)}
                    />
                    <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Link href={`/symbols/${favorite.symbolId}`}>
                        <Search className="h-4 w-4" />
                        <span className="sr-only">詳細</span>
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-8 text-center text-muted-foreground border rounded-md">
          お気に入りに登録された銘柄はありません
        </div>
      )}
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
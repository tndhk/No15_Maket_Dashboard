"use client";

import { useState, useCallback, useEffect } from "react";
import { Star } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { addFavorite, removeFavorite, isFavorite } from "@/lib/dal/favorites";
import { toast } from "sonner";

interface FavoriteButtonProps {
  symbolId: number;
  initialIsFavorite?: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  onToggle?: (isFavorite: boolean) => void;
}

export function FavoriteButton({
  symbolId,
  initialIsFavorite = false,
  variant = "ghost",
  size = "icon",
  className,
  onToggle,
}: FavoriteButtonProps) {
  const { userId, isSignedIn } = useAuth();
  const [favorite, setFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  // 初期状態を取得
  useEffect(() => {
    if (isSignedIn && userId) {
      const checkFavoriteStatus = async () => {
        try {
          const { isFavorite: isFav } = await isFavorite(userId, symbolId);
          setFavorite(isFav);
        } catch (error) {
          console.error("Error checking favorite status:", error);
        }
      };

      checkFavoriteStatus();
    }
  }, [symbolId, userId, isSignedIn]);

  // お気に入りトグル
  const toggleFavorite = useCallback(async () => {
    if (!isSignedIn) {
      toast.error("お気に入り機能を使用するにはログインが必要です");
      return;
    }

    if (!userId) {
      return;
    }

    setIsLoading(true);

    try {
      if (favorite) {
        // お気に入り解除
        await removeFavorite(userId, symbolId);
        toast.success("お気に入りから削除しました");
      } else {
        // お気に入り追加
        await addFavorite(userId, symbolId);
        toast.success("お気に入りに追加しました");
      }

      // 状態更新
      setFavorite(!favorite);
      
      // コールバック実行
      if (onToggle) {
        onToggle(!favorite);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error(
        favorite
          ? "お気に入りの削除に失敗しました"
          : "お気に入りの追加に失敗しました"
      );
    } finally {
      setIsLoading(false);
    }
  }, [favorite, symbolId, userId, isSignedIn, onToggle]);

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={toggleFavorite}
      disabled={isLoading || !isSignedIn}
      aria-label={favorite ? "お気に入りから削除" : "お気に入りに追加"}
    >
      <Star
        className={cn(
          "h-6 w-6 cursor-pointer transition-colors",
          favorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground dark:text-gray-300"
        )}
      />
    </Button>
  );
} 
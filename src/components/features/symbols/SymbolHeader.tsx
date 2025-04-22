import React from "react";
import { cn } from "@/lib/utils";

interface SymbolHeaderProps {
  name: string;
  symbol: string;
  category: string;
  status: string;
}

export default function SymbolHeader({
  name,
  symbol,
  category,
  status,
}: SymbolHeaderProps) {
  // カテゴリーに基づいたスタイルクラスを取得
  const getCategoryClass = (category: string) => {
    switch (category.toLowerCase()) {
      case "crypto":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300";
      case "stock":
        return "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300";
      case "forex":
        return "bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-300";
      case "index":
        return "bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-300";
    }
  };

  // カテゴリーのラベルを取得
  const getCategoryLabel = (category: string) => {
    switch (category.toLowerCase()) {
      case "crypto":
        return "暗号資産";
      case "stock":
        return "株式";
      case "forex":
        return "為替";
      case "index":
        return "指数";
      default:
        return category;
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="flex items-center text-2xl sm:text-3xl font-bold mb-1">
          {name || "銘柄詳細"} 
          <span className="text-lg font-normal text-muted-foreground dark:text-gray-300">
            {symbol && `(${symbol})`}
          </span>
        </h1>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span
          className={cn(
            "inline-block px-2 py-1 text-xs rounded-full",
            getCategoryClass(category)
          )}
        >
          {getCategoryLabel(category)}
        </span>
        <span
          className={cn(
            "inline-block px-2 py-1 text-xs rounded-full",
            status === "active"
              ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300"
          )}
        >
          {status === "active" ? "有効" : "無効"}
        </span>
      </div>
    </div>
  );
} 
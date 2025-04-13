"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { symbolCategoryEnum } from "@/lib/validations/symbol";
import { FavoriteButton } from "@/components/features/favorites/FavoriteButton";

interface SymbolsTableProps {
  symbols: any[];
  onSearch: (search: string) => void;
  onCategoryFilter: (category: string | null) => void;
  isFetching?: boolean;
}

export function SymbolsTable({
  symbols,
  onSearch,
  onCategoryFilter,
  isFetching = false,
}: SymbolsTableProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<string>("symbol");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // ソート条件の変更
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // ソート用のヘッダーセル
  const SortableHeader = ({ field, label }: { field: string; label: string }) => (
    <div
      className="flex items-center cursor-pointer hover:text-primary"
      onClick={() => handleSort(field)}
    >
      <span>{label}</span>
      <div className="flex flex-col ml-1">
        <ChevronUp
          className={cn(
            "h-3 w-3",
            sortField === field && sortDirection === "asc"
              ? "text-primary"
              : "text-muted-foreground"
          )}
        />
        <ChevronDown
          className={cn(
            "h-3 w-3",
            sortField === field && sortDirection === "desc"
              ? "text-primary"
              : "text-muted-foreground"
          )}
        />
      </div>
    </div>
  );

  // 検索実行
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(search);
  };

  // カテゴリ選択
  const handleCategoryChange = (value: string) => {
    if (value === "all") {
      onCategoryFilter(null);
    } else {
      onCategoryFilter(value);
    }
  };

  // ソートされたシンボルリスト
  const sortedSymbols = [...symbols].sort((a, b) => {
    const fieldA = sortField === "name" ? a.name : a.symbol;
    const fieldB = sortField === "name" ? b.name : b.symbol;
    
    if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
    if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <Input
            placeholder="銘柄コードまたは名前で検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80"
          />
          <Button type="submit" variant="secondary" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        
        <div className="flex gap-2 items-center">
          <span className="text-sm text-muted-foreground">カテゴリ:</span>
          <Select onValueChange={handleCategoryChange} defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="すべて" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {Object.values(symbolCategoryEnum.enum).map((category) => (
                <SelectItem key={category} value={category}>
                  {getCategoryLabel(category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left">
                  <SortableHeader field="symbol" label="銘柄コード" />
                </th>
                <th className="px-4 py-3 text-left">
                  <SortableHeader field="name" label="銘柄名" />
                </th>
                <th className="px-4 py-3 text-left">カテゴリ</th>
                <th className="px-4 py-3 text-left">データ数</th>
                <th className="px-4 py-3 text-center">アクション</th>
              </tr>
            </thead>
            <tbody className={cn(isFetching && "opacity-50")}>
              {sortedSymbols.length > 0 ? (
                sortedSymbols.map((symbol) => (
                  <tr
                    key={symbol.id}
                    className="border-t hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link href={`/symbols/${symbol.id}`} className="font-medium text-primary hover:underline">
                        {symbol.symbol}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{symbol.name}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        getCategoryClass(symbol.category)
                      )}>
                        {getCategoryLabel(symbol.category)}
                      </span>
                    </td>
                    <td className="px-4 py-3">{symbol._count?.prices || 0}</td>
                    <td className="px-4 py-3 text-center">
                      <FavoriteButton symbolId={symbol.id} size="sm" className="h-8 w-8 p-0" />
                      <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Link href={`/symbols/${symbol.id}`}>
                          <Search className="h-4 w-4" />
                          <span className="sr-only">詳細</span>
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    表示するシンボルがありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
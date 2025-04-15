"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FavoriteButton } from "@/components/features/favorites/FavoriteButton";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

// 型定義
export interface SymbolsTableProps {
  symbols: Array<{
    id: number;
    symbol: string;
    name: string;
    category: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    _count?: {
      prices: number;
    };
  }>;
}

export function SymbolsTable({ symbols }: SymbolsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // 検索とフィルターの状態を管理
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  
  // URLパラメータが変更されたらローカルステートを更新
  useEffect(() => {
    const newSearch = searchParams.get("search") || "";
    const newCategory = searchParams.get("category") || "all";
    
    setSearch(newSearch);
    setCategory(newCategory);
  }, [searchParams]);
  
  // 検索とフィルター処理
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    
    if (category && category !== "all") {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    
    // ページをリセット
    params.delete("page");
    
    router.push(`${pathname}?${params.toString()}`);
  };
  
  // エンターキーでの検索
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="銘柄名または証券コードで検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={category}
            onValueChange={setCategory}
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="カテゴリー" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="stock">株式</SelectItem>
              <SelectItem value="crypto">暗号資産</SelectItem>
              <SelectItem value="forex">外国為替</SelectItem>
              <SelectItem value="commodity">商品</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSearch}>検索</Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <table className="w-full">
          <caption className="p-4 text-sm text-muted-foreground">
            合計 {symbols.length} 件の銘柄
          </caption>
          <thead className="bg-muted/50">
            <tr>
              <th className="w-[50px] p-2"></th>
              <th className="p-2 text-left">銘柄コード</th>
              <th className="p-2 text-left">名称</th>
              <th className="p-2 text-left">カテゴリー</th>
              <th className="p-2 text-left">更新日</th>
              <th className="p-2 text-left">データ数</th>
              <th className="p-2 text-left">ステータス</th>
              <th className="w-[100px] p-2">アクション</th>
            </tr>
          </thead>
          <tbody>
            {symbols.map((symbol) => (
              <tr key={symbol.id} className="border-t hover:bg-muted/50">
                <td className="p-2">
                  <FavoriteButton symbolId={symbol.id} />
                </td>
                <td className="p-2 font-medium">
                  <Link href={`/symbols/${symbol.id}`} className="hover:underline">
                    {symbol.symbol}
                  </Link>
                </td>
                <td className="p-2">{symbol.name}</td>
                <td className="p-2">
                  <Badge variant="outline">
                    {symbol.category === "stock" && "株式"}
                    {symbol.category === "crypto" && "暗号資産"}
                    {symbol.category === "forex" && "外国為替"}
                    {symbol.category === "commodity" && "商品"}
                    {!["stock", "crypto", "forex", "commodity"].includes(symbol.category) && symbol.category}
                  </Badge>
                </td>
                <td className="p-2">{formatDate(symbol.updatedAt)}</td>
                <td className="p-2">{symbol._count?.prices || 0}</td>
                <td className="p-2">
                  {symbol.isActive ? (
                    <Badge>アクティブ</Badge>
                  ) : (
                    <Badge variant="destructive">非アクティブ</Badge>
                  )}
                </td>
                <td className="p-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/symbols/${symbol.id}`}>
                      詳細
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
            
            {symbols.length === 0 && (
              <tr>
                <td colSpan={8} className="h-24 text-center">
                  銘柄が見つかりませんでした
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 
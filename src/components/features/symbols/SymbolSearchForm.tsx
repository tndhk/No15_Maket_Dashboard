"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { symbolCategoryEnum } from "@/lib/validations/symbol";
import { cn } from "@/lib/utils";

// 検索結果の型定義
export interface SearchResult {
  symbol: string;
  name: string;
  category: string;
  exchange?: string;
  region?: string;
}

interface SymbolSearchFormProps {
  onSearch: (query: string, category: string) => Promise<void>;
  onResultSelect: (result: SearchResult) => void;
  results: SearchResult[];
  isSearching: boolean;
}

export function SymbolSearchForm({
  onSearch,
  onResultSelect,
  results,
  isSearching,
}: SymbolSearchFormProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("stock");

  // 検索処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length === 0) return;
    await onSearch(query, category);
  };

  // カテゴリ変更
  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="銘柄コードまたは名前で検索..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-40">
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="カテゴリ" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(symbolCategoryEnum.enum).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {getCategoryLabel(cat)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isSearching || query.trim().length === 0}>
            {isSearching ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            検索
          </Button>
        </div>
      </form>

      {results.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left">銘柄コード</th>
                <th className="px-4 py-3 text-left">銘柄名</th>
                <th className="px-4 py-3 text-left">取引所/地域</th>
                <th className="px-4 py-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr
                  key={`${result.symbol}-${result.exchange || ""}`}
                  className="border-t hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">{result.symbol}</td>
                  <td className="px-4 py-3">{result.name}</td>
                  <td className="px-4 py-3">{result.exchange || result.region || "-"}</td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onResultSelect(result)}
                    >
                      選択
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
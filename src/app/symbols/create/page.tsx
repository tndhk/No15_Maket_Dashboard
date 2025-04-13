"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SymbolSearchForm, SearchResult } from "@/components/features/symbols/SymbolSearchForm";
import { SymbolCreateForm } from "@/components/features/symbols/SymbolCreateForm";
import { searchSymbols } from "@/lib/api/symbol-search";
import { createSymbol } from "@/lib/dal/symbols";
import { z } from "zod";
import { createSymbolSchema } from "@/lib/validations/symbol";

// 型定義
type SymbolFormValues = z.infer<typeof createSymbolSchema>;

export default function CreateSymbolPage() {
  const router = useRouter();
  
  // 状態管理
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [activeTab, setActiveTab] = useState("search");
  
  // 検索処理
  const handleSearch = async (query: string, category: string) => {
    setIsSearching(true);
    try {
      const results = await searchSymbols(query, category);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("検索中にエラーが発生しました");
    } finally {
      setIsSearching(false);
    }
  };
  
  // 検索結果の選択処理
  const handleResultSelect = (result: SearchResult) => {
    setSelectedResult(result);
    // 選択後にフォームタブに切り替え
    setActiveTab("form");
  };
  
  // フォーム送信処理
  const handleFormSubmit = async (values: SymbolFormValues) => {
    setIsSubmitting(true);
    try {
      // APIを呼び出して銘柄を作成
      const symbol = await createSymbol(values);
      
      toast.success("銘柄を登録しました");
      
      // 成功したら一覧画面に戻る
      router.push("/symbols");
      router.refresh();
    } catch (error) {
      console.error("Error creating symbol:", error);
      toast.error("銘柄の登録に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">銘柄登録</h1>
        <p className="text-muted-foreground mt-1">
          新しい銘柄を検索して登録します
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>銘柄の検索と登録</CardTitle>
          <CardDescription>
            検索タブから銘柄を検索するか、直接フォームに入力して登録できます
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search">銘柄検索</TabsTrigger>
              <TabsTrigger value="form">登録フォーム</TabsTrigger>
            </TabsList>
            
            <TabsContent value="search" className="space-y-4">
              <SymbolSearchForm
                onSearch={handleSearch}
                onResultSelect={handleResultSelect}
                results={searchResults}
                isSearching={isSearching}
              />
            </TabsContent>
            
            <TabsContent value="form">
              <SymbolCreateForm
                onSubmit={handleFormSubmit}
                isSubmitting={isSubmitting}
                defaultValues={selectedResult ? {
                  symbol: selectedResult.symbol,
                  name: selectedResult.name,
                  category: selectedResult.category as any,
                  description: "",
                  isActive: true,
                } : undefined}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 
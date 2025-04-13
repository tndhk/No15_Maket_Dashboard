"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SymbolCreateForm } from "@/components/features/symbols/SymbolCreateForm";
import { getSymbolById, updateSymbol } from "@/lib/dal/symbols";
import { z } from "zod";
import { createSymbolSchema, updateSymbolSchema } from "@/lib/validations/symbol";

// 型定義
type SymbolFormValues = z.infer<typeof createSymbolSchema>;

export default function EditSymbolPage() {
  const params = useParams();
  const router = useRouter();
  
  const [symbol, setSymbol] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // シンボルIDを取得
  const symbolId = parseInt(params.id as string);

  useEffect(() => {
    if (isNaN(symbolId)) {
      // IDが数値でない場合はリダイレクト
      router.push("/admin/symbols");
      return;
    }

    fetchSymbol();
  }, [symbolId, router]);

  // シンボルデータを取得
  async function fetchSymbol() {
    setIsLoading(true);
    try {
      const data = await getSymbolById(symbolId);
      setSymbol(data);
    } catch (error) {
      console.error("Error fetching symbol:", error);
      toast.error("シンボル情報の取得に失敗しました");
      router.push("/admin/symbols");
    } finally {
      setIsLoading(false);
    }
  }

  // フォーム送信処理
  const handleFormSubmit = async (values: SymbolFormValues) => {
    setIsSubmitting(true);
    try {
      // 更新データを作成
      const updateData = {
        ...values,
        id: symbolId
      };
      
      // シンボル更新を実行
      await updateSymbol(updateData);
      
      toast.success("銘柄情報を更新しました");
      router.push("/admin/symbols");
    } catch (error) {
      console.error("Error updating symbol:", error);
      toast.error("銘柄情報の更新に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 読み込み中
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    );
  }

  // データが見つからない場合
  if (!symbol) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">シンボルが見つかりません</p>
        <Button onClick={() => router.push("/admin/symbols")} variant="outline" className="mt-4">
          戻る
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/symbols")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">シンボル編集</h1>
          <p className="text-muted-foreground mt-1">
            {`${symbol.symbol} (${symbol.name}) の情報を編集`}
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>シンボル情報</CardTitle>
          <CardDescription>
            シンボルの基本情報を編集できます
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SymbolCreateForm
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
            defaultValues={{
              symbol: symbol.symbol,
              name: symbol.name,
              description: symbol.description || "",
              category: symbol.category,
              isActive: symbol.isActive,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
} 
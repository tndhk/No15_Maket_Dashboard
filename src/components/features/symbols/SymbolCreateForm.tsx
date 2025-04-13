"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createSymbolSchema } from "@/lib/validations/symbol";
import { SearchResult } from "./SymbolSearchForm";

// 型をバリデーションスキーマから生成
type SymbolFormValues = z.infer<typeof createSymbolSchema>;

interface SymbolCreateFormProps {
  onSubmit: (values: SymbolFormValues) => Promise<void>;
  isSubmitting?: boolean;
  defaultValues?: Partial<SymbolFormValues>;
}

export function SymbolCreateForm({
  onSubmit,
  isSubmitting = false,
  defaultValues,
}: SymbolCreateFormProps) {
  // フォーム設定
  const form = useForm<SymbolFormValues>({
    resolver: zodResolver(createSymbolSchema),
    defaultValues: {
      symbol: defaultValues?.symbol || "",
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      category: defaultValues?.category || "stock",
      isActive: defaultValues?.isActive ?? true,
    },
  });

  // 検索結果からフォームに値を設定
  const populateFromSearchResult = (result: SearchResult) => {
    form.setValue("symbol", result.symbol);
    form.setValue("name", result.name);
    form.setValue("category", result.category as any);
  };

  // フォーム送信処理
  const handleSubmit = async (values: SymbolFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 銘柄コード */}
          <FormField
            control={form.control}
            name="symbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>銘柄コード</FormLabel>
                <FormControl>
                  <Input placeholder="例: AAPL" {...field} />
                </FormControl>
                <FormDescription>
                  銘柄の一意の識別子（例: AAPL、BTC、USD/JPY）
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 銘柄名 */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>銘柄名</FormLabel>
                <FormControl>
                  <Input placeholder="例: Apple Inc." {...field} />
                </FormControl>
                <FormDescription>
                  銘柄の正式名称
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 説明 */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>説明</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="銘柄についての説明（任意）"
                  className="min-h-24"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                銘柄の詳細情報（任意）
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* カテゴリ */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>カテゴリ</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="カテゴリを選択" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="stock">株式</SelectItem>
                    <SelectItem value="crypto">仮想通貨</SelectItem>
                    <SelectItem value="forex">為替</SelectItem>
                    <SelectItem value="index">指数</SelectItem>
                    <SelectItem value="other">その他</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  銘柄のカテゴリ
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 有効状態 */}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">有効にする</FormLabel>
                  <FormDescription>
                    無効にすると検索結果に表示されなくなります
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full md:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              保存中...
            </>
          ) : (
            "銘柄を保存"
          )}
        </Button>
      </form>
    </Form>
  );
} 
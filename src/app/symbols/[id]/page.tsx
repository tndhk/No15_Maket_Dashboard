'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
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
import { getCurrentUser } from "@/lib/auth/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SymbolHeader from "@/components/features/symbols/SymbolHeader";
import SymbolDetailCard from "@/components/features/symbols/SymbolDetailCard";
import SymbolPriceChart from "@/components/features/symbols/SymbolPriceChart";
import SymbolPriceTable from "@/components/features/symbols/SymbolPriceTable";
import prisma from "@/lib/db";
import { RefreshPriceDataForm } from "@/components/features/prices/RefreshPriceDataForm";

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

interface SymbolPageProps {
  params: {
    id: string;
  };
}

export default async function SymbolPage({ params }: SymbolPageProps) {
  const user = await getCurrentUser();
  const symbolId = parseInt(params.id);

  if (isNaN(symbolId)) {
    return notFound();
  }

  const symbol = await prisma.symbol.findUnique({
    where: { id: symbolId },
    include: {
      priceData: {
        orderBy: { date: "desc" },
        take: 30, // 最新30日分のデータ
      },
    },
  });

  if (!symbol) {
    return notFound();
  }

  // 価格データをチャート用に整形
  const chartData = symbol.priceData.map((data) => ({
    date: data.date.toISOString().split("T")[0],
    close: data.close,
  })).reverse();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <SymbolHeader
          name={symbol.name}
          symbol={symbol.symbol}
          category={symbol.category}
          status={symbol.status}
        />
        <div className="flex items-center gap-2">
          <FavoriteButton
            symbolId={symbol.id}
            initialIsFavorite={false}
            iconOnly={false}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="chart">チャート</TabsTrigger>
              <TabsTrigger value="table">価格履歴</TabsTrigger>
            </TabsList>
            <TabsContent value="chart" className="h-96">
              {chartData.length > 0 ? (
                <SymbolPriceChart data={chartData} />
              ) : (
                <div className="flex h-full items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <div>
                    <p className="mb-2 text-lg font-medium">価格データがありません</p>
                    <p className="text-sm text-muted-foreground">
                      右側のフォームから価格データを取得してください
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="table">
              {symbol.priceData.length > 0 ? (
                <SymbolPriceTable priceData={symbol.priceData} />
              ) : (
                <div className="flex h-96 items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <div>
                    <p className="mb-2 text-lg font-medium">価格データがありません</p>
                    <p className="text-sm text-muted-foreground">
                      右側のフォームから価格データを取得してください
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-8">
          <SymbolDetailCard
            symbol={symbol.symbol}
            name={symbol.name}
            category={symbol.category}
            description={symbol.description || "詳細情報はありません"}
            status={symbol.status}
            createdAt={symbol.createdAt}
            updatedAt={symbol.updatedAt}
            id={symbol.id}
          />
          
          {/* 価格データ更新フォーム */}
          <RefreshPriceDataForm 
            symbolId={symbol.id} 
            symbolName={symbol.name} 
            symbol={symbol.symbol} 
            category={symbol.category} 
          />
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
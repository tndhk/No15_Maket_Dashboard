"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SymbolPriceChart from "@/components/features/symbols/SymbolPriceChart";
import SymbolPriceTable from "@/components/features/symbols/SymbolPriceTable";

interface ChartDataPoint {
  date: string;
  close: number;
}

interface PriceData {
  id: number;
  symbolId: number;
  date: Date;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number;
  volume: number | null;
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SymbolPriceDisplayProps {
  chartData: ChartDataPoint[];
  priceData: PriceData[];
}

export function SymbolPriceDisplay({ chartData, priceData }: SymbolPriceDisplayProps) {
  return (
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
              <p className="text-sm text-muted-foreground dark:text-gray-300">
                右側のフォームから価格データを取得してください
              </p>
            </div>
          </div>
        )}
      </TabsContent>
      <TabsContent value="table">
        {priceData.length > 0 ? (
          <SymbolPriceTable priceData={priceData} />
        ) : (
          <div className="flex h-96 items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <div>
              <p className="mb-2 text-lg font-medium">価格データがありません</p>
              <p className="text-sm text-muted-foreground dark:text-gray-300">
                右側のフォームから価格データを取得してください
              </p>
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
} 
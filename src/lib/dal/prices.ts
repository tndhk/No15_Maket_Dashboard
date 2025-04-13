import { prisma } from "@/lib/prisma";
import type { Price } from "@prisma/client";
import type { z } from "zod";
import type { priceFilterSchema } from "@/lib/validations/price";

// 価格データを検索するための関数
export async function getPrices(
  filters: z.infer<typeof priceFilterSchema>
) {
  try {
    const {
      symbolId,
      startDate,
      endDate,
      page = 1,
      limit = 30,
    } = filters;

    // 検索条件を構築
    const where = {
      symbolId,
      ...(startDate && endDate
        ? {
            date: {
              gte: startDate,
              lte: endDate,
            },
          }
        : startDate
        ? { date: { gte: startDate } }
        : endDate
        ? { date: { lte: endDate } }
        : {}),
    };

    // 総数を取得
    const totalCount = await prisma.price.count({ where });

    // データを取得（ページネーション付き、最新の日付順）
    const items = await prisma.price.findMany({
      where,
      orderBy: { date: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    // ページネーション情報を計算
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      items,
      meta: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPrevPage,
      },
    };
  } catch (error) {
    console.error("Failed to get prices:", error);
    throw new Error("価格データの取得に失敗しました");
  }
}

// 価格データを一括更新する関数（既存のデータを消去して新しいデータを挿入）
export async function refreshPriceData(symbolId: number, data: Omit<Price, "id" | "symbolId" | "createdAt" | "updatedAt">[]) {
  try {
    // トランザクション内で実行
    return await prisma.$transaction(async (tx) => {
      // 1. 既存のレコードを削除
      await tx.price.deleteMany({
        where: { symbolId },
      });

      // 2. 新しいデータを挿入
      if (data.length > 0) {
        const priceRecords = data.map(price => ({
          symbolId,
          date: price.date,
          open: price.open,
          high: price.high,
          low: price.low,
          close: price.close,
          volume: price.volume,
          source: price.source || "api",
        }));

        await tx.price.createMany({
          data: priceRecords,
        });
      }

      // 3. シンボルの更新日時を更新
      await tx.symbol.update({
        where: { id: symbolId },
        data: { updatedAt: new Date() },
      });

      // 4. ログの記録
      await tx.apiLog.create({
        data: {
          endpoint: `symbols/${symbolId}/refresh`,
          status: "success",
          statusCode: 200,
          requestBody: JSON.stringify({ count: data.length }),
          response: JSON.stringify({ success: true, count: data.length }),
        },
      });

      return { success: true, count: data.length };
    });
  } catch (error) {
    console.error(`Failed to refresh price data for symbol ID ${symbolId}:`, error);
    
    // エラーをログに記録
    await prisma.apiLog.create({
      data: {
        endpoint: `symbols/${symbolId}/refresh`,
        status: "error",
        statusCode: 500,
        requestBody: JSON.stringify({ symbolId }),
        response: error instanceof Error ? error.message : String(error),
      },
    });
    
    throw new Error("価格データの更新に失敗しました");
  }
}

// 価格データをランダムに生成する関数（デモ・開発用）
export async function generateDemoData(symbolId: number, days = 30) {
  try {
    // シンボル情報を取得して基準価格を決定
    const symbol = await prisma.symbol.findUnique({
      where: { id: symbolId },
    });

    if (!symbol) {
      throw new Error("シンボルが見つかりません");
    }

    // カテゴリに応じた価格範囲を設定
    const basePrice = symbol.category === "crypto" 
      ? Math.random() * 50000 + 1000  // 仮想通貨: 1,000〜51,000
      : Math.random() * 500 + 50;     // 株式など: 50〜550

    // データ生成
    const now = new Date();
    const prices = Array(days)
      .fill(0)
      .map((_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // 基準価格から±2%の変動を与える
        const open = basePrice * (1 + (Math.random() - 0.5) * 0.04);
        const close = basePrice * (1 + (Math.random() - 0.5) * 0.04);
        const high = Math.max(open, close) * (1 + Math.random() * 0.01);
        const low = Math.min(open, close) * (1 - Math.random() * 0.01);
        const volume = Math.floor(Math.random() * 1000000) + 100000;
        
        return {
          date,
          open,
          high,
          low,
          close,
          volume,
          source: "demo",
        };
      });

    // 生成したデータで一括更新
    return await refreshPriceData(symbolId, prices);
  } catch (error) {
    console.error(`Failed to generate demo data for symbol ID ${symbolId}:`, error);
    throw new Error("デモデータの生成に失敗しました");
  }
} 
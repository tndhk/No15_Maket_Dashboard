"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/auth";
import { UserRole } from "@/lib/auth/roles";
import { prisma } from "@/lib/prisma";
import { createApiLog } from "@/lib/dal/logs";
import { getSymbolById } from "@/lib/dal/symbols";
import { AlphaVantageAPI } from "@/lib/api/alphavantage";
import { YahooFinanceAPI } from "@/lib/api/yahoo-finance";
import { CoinGeckoAPI } from "@/lib/api/coingecko";

// リフレッシュリクエストの入力スキーマ
const refreshPriceDataSchema = z.object({
  symbolId: z.coerce.number().positive(),
  dataSource: z.enum(["alphavantage", "yahoo", "coingecko"]).default("alphavantage"),
});

/**
 * シンボルの価格データを更新・取得するためのServer Action
 */
export async function refreshPriceData(formData: FormData) {
  // 現在のユーザーを取得
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("認証が必要です");
  }
  
  // フォームデータを取得
  const validatedFields = refreshPriceDataSchema.safeParse({
    symbolId: formData.get("symbolId"),
    dataSource: formData.get("dataSource"),
  });
  
  if (!validatedFields.success) {
    console.error("Validation error:", validatedFields.error);
    throw new Error("入力データが不正です");
  }
  
  const { symbolId, dataSource } = validatedFields.data;
  
  try {
    // シンボルの情報を取得
    const symbol = await getSymbolById(symbolId);
    
    // データソースに基づいてAPIを選択
    let api;
    switch (dataSource) {
      case "alphavantage":
        api = new AlphaVantageAPI();
        break;
      case "yahoo":
        api = new YahooFinanceAPI();
        break;
      case "coingecko":
        api = new CoinGeckoAPI();
        break;
      default:
        api = new AlphaVantageAPI();
    }
    
    // 価格データを取得
    const priceData = await api.fetchPriceData(symbol.symbol, symbol.category);
    
    // 取得したデータの件数
    const insertedCount = priceData.length;
    
    // 成功ログを記録
    await createApiLog({
      endpoint: `/api/symbols/${symbolId}/prices`,
      status: "success",
      statusCode: 200,
      requestBody: JSON.stringify({ symbolId, dataSource }),
      response: JSON.stringify({ count: insertedCount }),
    });
    
    // キャッシュを再検証
    revalidatePath(`/symbols/${symbolId}`);
    
    // リダイレクト
    return { status: "success", message: `${insertedCount}件のデータを取得しました`, count: insertedCount };
    
  } catch (error) {
    console.error("Error fetching price data:", error);
    
    // エラーログを記録
    await createApiLog({
      endpoint: `/api/symbols/${symbolId}/prices`,
      status: "error",
      statusCode: 500,
      requestBody: JSON.stringify({ symbolId, dataSource }),
      response: JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
    });
    
    throw error instanceof Error ? error : new Error("価格データの取得に失敗しました");
  }
}

/**
 * すべてのシンボルの価格データを更新するためのServer Action
 * 管理者専用機能
 */
export async function refreshAllPriceData(formData: FormData) {
  // 現在のユーザーを取得
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("認証が必要です");
  }
  
  // 管理者権限チェック
  if (user.role !== UserRole.ADMIN) {
    throw new Error("管理者権限が必要です");
  }
  
  // データソースを取得
  const dataSource = formData.get("dataSource") as string || "alphavantage";
  
  try {
    // アクティブなシンボルを取得
    const symbols = await prisma.symbol.findMany({
      where: { isActive: true },
    });
    
    // 更新結果の配列
    const results = [];
    
    // 各シンボルについて処理
    for (const symbol of symbols) {
      try {
        // データソースに基づいてAPIを選択
        let api;
        switch (dataSource) {
          case "alphavantage":
            api = new AlphaVantageAPI();
            break;
          case "yahoo":
            api = new YahooFinanceAPI();
            break;
          case "coingecko":
            api = new CoinGeckoAPI();
            break;
          default:
            api = new AlphaVantageAPI();
        }
        
        // 価格データを取得
        const priceData = await api.fetchPriceData(symbol.symbol, symbol.category);
        
        // 結果を配列に追加
        results.push({
          symbolId: symbol.id,
          symbol: symbol.symbol,
          status: "success",
          count: priceData.length,
        });
        
      } catch (error) {
        // エラーが発生した場合も結果を記録
        results.push({
          symbolId: symbol.id,
          symbol: symbol.symbol,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
    
    // ログを記録
    await createApiLog({
      endpoint: `/api/symbols/refresh-all`,
      status: "success",
      statusCode: 200,
      requestBody: JSON.stringify({ dataSource }),
      response: JSON.stringify({ results }),
    });
    
    // キャッシュを再検証
    revalidatePath(`/symbols`);
    
    return { 
      status: "success", 
      message: `${symbols.length}件のシンボルを処理しました`, 
      results 
    };
    
  } catch (error) {
    console.error("Error refreshing all price data:", error);
    
    // エラーログを記録
    await createApiLog({
      endpoint: `/api/symbols/refresh-all`,
      status: "error",
      statusCode: 500,
      requestBody: JSON.stringify({ dataSource }),
      response: JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
    });
    
    throw error instanceof Error ? error : new Error("価格データの一括取得に失敗しました");
  }
} 
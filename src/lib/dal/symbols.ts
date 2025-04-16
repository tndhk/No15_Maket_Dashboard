import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type { z } from "zod";
import type { symbolFilterSchema, createSymbolSchema, updateSymbolSchema } from "@/lib/validations/symbol";

// 型定義
type SymbolFilter = z.infer<typeof symbolFilterSchema>;
type CreateSymbolInput = z.infer<typeof createSymbolSchema>;
type UpdateSymbolInput = z.infer<typeof updateSymbolSchema>;

// シンボルを検索するための関数
export async function getSymbols(filter: SymbolFilter) {
  try {
    const { search, category, isActive, page = 1, limit = 20 } = filter;
    
    // 検索条件
    const where: any = {};
    
    // 検索キーワード
    if (search) {
      where.OR = [
        { symbol: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
      ];
    }
    
    // カテゴリフィルター
    if (category) {
      where.category = category;
    }
    
    // 有効状態フィルター
    if (typeof isActive === "boolean") {
      where.isActive = isActive;
    }

    // 件数取得
    const total = await prisma.symbol.count({ where });
    
    // データ取得（プライスカウントも含む）
    const items = await prisma.symbol.findMany({
      where,
      include: {
        prices: {
          orderBy: { date: "desc" },
          take: 1,
        },
        _count: {
          select: {
            prices: true,
          },
        },
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        symbol: "asc",
      },
    });
    
    // ページネーション情報
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;
    
    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasMore,
      },
    };
  } catch (error) {
    console.error("Error getting symbols:", error);
    throw new Error("Failed to fetch symbols");
  }
}

// シンボルの詳細を取得する関数
export async function getSymbolById(id: number) {
  try {
    const symbol = await prisma.symbol.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            prices: true,
          },
        },
      },
    });
    
    if (!symbol) {
      throw new Error("Symbol not found");
    }
    
    return symbol;
  } catch (error) {
    console.error("Error getting symbol by ID:", error);
    throw new Error("Failed to fetch symbol details");
  }
}

// シンボルに関連する価格データを最新の日付順で取得する関数
export async function getSymbolPrices(symbolId: number, limit = 30) {
  try {
    const prices = await prisma.price.findMany({
      where: { symbolId },
      orderBy: { date: "desc" },
      take: limit,
    });

    return prices;
  } catch (error) {
    console.error(`Failed to get prices for symbol ID ${symbolId}:`, error);
    throw new Error("価格データの取得に失敗しました");
  }
}

/**
 * 新しい銘柄を作成する
 */
export async function createSymbol(data: CreateSymbolInput) {
  try {
    // 重複チェック
    const existingSymbol = await prisma.symbol.findFirst({
      where: { symbol: data.symbol },
    });
    
    if (existingSymbol) {
      throw new Error(`Symbol '${data.symbol}' already exists`);
    }
    
    // 新規作成
    const symbol = await prisma.symbol.create({
      data,
    });
    
    return symbol;
  } catch (error) {
    console.error("Error creating symbol:", error);
    throw error instanceof Error ? error : new Error("Failed to create symbol");
  }
}

/**
 * 銘柄を更新する
 */
export async function updateSymbol(data: UpdateSymbolInput) {
  try {
    const { id, ...updateData } = data;
    
    // 存在チェック
    const existingSymbol = await prisma.symbol.findUnique({
      where: { id },
    });
    
    if (!existingSymbol) {
      throw new Error("Symbol not found");
    }
    
    // 重複チェック（シンボルコードを変更する場合）
    if (updateData.symbol && updateData.symbol !== existingSymbol.symbol) {
      const duplicateSymbol = await prisma.symbol.findFirst({
        where: { 
          symbol: updateData.symbol,
          id: { not: id }
        },
      });
      
      if (duplicateSymbol) {
        throw new Error(`Symbol '${updateData.symbol}' already exists`);
      }
    }
    
    // 更新
    const symbol = await prisma.symbol.update({
      where: { id },
      data: updateData,
    });
    
    return symbol;
  } catch (error) {
    console.error("Error updating symbol:", error);
    throw error instanceof Error ? error : new Error("Failed to update symbol");
  }
}

/**
 * 銘柄を削除する
 */
export async function deleteSymbol(id: number) {
  try {
    // 存在チェック
    const existingSymbol = await prisma.symbol.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            prices: true,
          },
        },
      },
    });
    
    if (!existingSymbol) {
      throw new Error("Symbol not found");
    }
    
    // 関連するデータがある場合は削除しない
    if (existingSymbol._count.prices > 0) {
      throw new Error("Cannot delete symbol with associated price data");
    }
    
    // 削除
    await prisma.symbol.delete({
      where: { id },
    });
    
    return { success: true, id };
  } catch (error) {
    console.error("Error deleting symbol:", error);
    throw error instanceof Error ? error : new Error("Failed to delete symbol");
  }
} 
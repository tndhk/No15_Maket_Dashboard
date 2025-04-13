import { prisma } from "@/lib/prisma";

// ログの型定義
export type LogFilter = {
  endpoint?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
};

/**
 * API取得ログを取得する
 */
export async function getApiLogs(filter: LogFilter = {}) {
  try {
    const {
      endpoint,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 20
    } = filter;
    
    // 検索条件
    const where: any = {};
    
    // エンドポイントでフィルタリング
    if (endpoint) {
      where.endpoint = {
        contains: endpoint,
      };
    }
    
    // ステータスでフィルタリング
    if (status) {
      where.status = status;
    }
    
    // 日付範囲でフィルタリング
    if (startDate || endDate) {
      where.createdAt = {};
      
      if (startDate) {
        where.createdAt.gte = startDate;
      }
      
      if (endDate) {
        where.createdAt.lte = endDate;
      }
    }

    // 件数取得
    const total = await prisma.apiLog.count({ where });
    
    // データ取得
    const items = await prisma.apiLog.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        createdAt: "desc",
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
    console.error("Error getting API logs:", error);
    throw new Error("APIログの取得に失敗しました");
  }
}

/**
 * 新しいAPIログを記録する
 */
export async function createApiLog(data: {
  endpoint: string;
  status: string;
  statusCode?: number;
  requestBody?: string;
  response?: string;
}) {
  try {
    const log = await prisma.apiLog.create({
      data,
    });
    
    return log;
  } catch (error) {
    console.error("Error creating API log:", error);
    // ログ記録の失敗はサイレントに処理（アプリケーションの動作に影響を与えない）
    return null;
  }
}

/**
 * APIログをクリアする（古いログの削除）
 */
export async function clearApiLogs(olderThan?: Date) {
  try {
    // デフォルトでは30日以上前のログを削除
    const cutoffDate = olderThan || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const result = await prisma.apiLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });
    
    return {
      deletedCount: result.count,
    };
  } catch (error) {
    console.error("Error clearing API logs:", error);
    throw new Error("APIログのクリアに失敗しました");
  }
} 
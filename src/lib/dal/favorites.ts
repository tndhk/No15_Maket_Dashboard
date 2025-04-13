import { prisma } from "@/lib/prisma";

/**
 * ユーザーのお気に入りシンボル一覧を取得
 */
export async function getUserFavorites(userId: string) {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        symbol: {
          include: {
            _count: {
              select: {
                prices: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return favorites;
  } catch (error) {
    console.error("Error getting user favorites:", error);
    throw new Error("お気に入りの取得に失敗しました");
  }
}

/**
 * お気に入りに追加
 */
export async function addFavorite(userId: string, symbolId: number) {
  try {
    // シンボルが存在するか確認
    const symbol = await prisma.symbol.findUnique({
      where: { id: symbolId }
    });

    if (!symbol) {
      throw new Error("指定されたシンボルが見つかりません");
    }

    // すでにお気に入りに追加されていないか確認
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_symbolId: {
          userId,
          symbolId
        }
      }
    });

    if (existingFavorite) {
      // すでに追加済みの場合はそのまま返す
      return existingFavorite;
    }

    // 新規お気に入りの作成
    const favorite = await prisma.favorite.create({
      data: {
        userId,
        symbolId
      },
      include: {
        symbol: true
      }
    });

    return favorite;
  } catch (error) {
    console.error("Error adding favorite:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("お気に入りの追加に失敗しました");
  }
}

/**
 * お気に入りから削除
 */
export async function removeFavorite(userId: string, symbolId: number) {
  try {
    // お気に入りの存在確認
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_symbolId: {
          userId,
          symbolId
        }
      }
    });

    if (!favorite) {
      throw new Error("指定されたお気に入りが見つかりません");
    }

    // お気に入りの削除
    await prisma.favorite.delete({
      where: {
        id: favorite.id
      }
    });

    return { success: true, symbolId };
  } catch (error) {
    console.error("Error removing favorite:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("お気に入りの削除に失敗しました");
  }
}

/**
 * ユーザーがシンボルをお気に入りに登録しているか確認
 */
export async function isFavorite(userId: string, symbolId: number) {
  try {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_symbolId: {
          userId,
          symbolId
        }
      }
    });

    return { isFavorite: !!favorite };
  } catch (error) {
    console.error("Error checking favorite status:", error);
    throw new Error("お気に入り状態の確認に失敗しました");
  }
} 
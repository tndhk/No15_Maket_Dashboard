import { PrismaClient } from "@prisma/client";

// PrismaClientのグローバルインスタンス
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 開発環境でのホットリロード時に複数のインスタンスが作成されるのを防止
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// 本番環境ではグローバル変数にPrismaインスタンスを保存しない
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma; 
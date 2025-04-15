import { PrismaClient } from "@prisma/client";

// PrismaClientのインスタンス生成を担当する関数
function createPrismaClient() {
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  } catch (error) {
    console.error("Failed to create Prisma Client:", error);
    // 緊急措置として、初期化試行後に数秒待機してから再試行
    if (process.env.NODE_ENV === "development") {
      console.log("Retrying Prisma Client initialization in 3 seconds...");
      setTimeout(() => {
        try {
          return new PrismaClient();
        } catch (retryError) {
          console.error("Retry failed:", retryError);
          throw new Error("Could not initialize Prisma Client after retry");
        }
      }, 3000);
    }
    throw new Error("Failed to initialize Prisma Client");
  }
}

// PrismaClientのグローバルインスタンス
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 開発環境でのホットリロード時に複数のインスタンスが作成されるのを防止
export const prisma = globalForPrisma.prisma || createPrismaClient();

// 本番環境ではグローバル変数にPrismaインスタンスを保存しない
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma; 
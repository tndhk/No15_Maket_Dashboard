import { clearApiLogs } from "@/lib/dal/logs";
import { NextResponse } from "next/server";

// 認証ヘッダーをチェックする関数
function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  
  // 本番環境では、環境変数などから安全なトークンを取得する
  const expectedToken = process.env.CRON_SECRET || "your-secret-token";
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  
  const token = authHeader.split(" ")[1];
  return token === expectedToken;
}

// Cronジョブのハンドラー
export async function GET(request: Request) {
  try {
    // 認証チェック
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // 30日以上前のログを削除
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const result = await clearApiLogs(thirtyDaysAgo);
    
    return NextResponse.json({
      success: true,
      message: `${result.deletedCount}件の古いログを削除しました`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { 
        error: "ログ削除に失敗しました", 
        message: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}

// クライアントからのリクエストは受け付けない
export const dynamic = "force-dynamic";
export const maxDuration = 300; // 最大実行時間（秒） 
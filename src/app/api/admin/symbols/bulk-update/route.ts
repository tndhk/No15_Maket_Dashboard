import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/auth";
import { UserRole } from "@/lib/auth/roles";
import { createApiLog } from "@/lib/dal/logs";

export async function POST(request: Request) {
  try {
    // ユーザー認証と権限チェック
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }
    
    if (user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: "管理者権限が必要です" },
        { status: 403 }
      );
    }
    
    // リクエストボディを取得
    const body = await request.json();
    const { ids, action, value } = body;
    
    // バリデーション
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "無効なIDリストです" },
        { status: 400 }
      );
    }
    
    if (!action || (action !== "status" && action !== "category")) {
      return NextResponse.json(
        { error: "無効な操作です" },
        { status: 400 }
      );
    }
    
    if (value === undefined) {
      return NextResponse.json(
        { error: "値が指定されていません" },
        { status: 400 }
      );
    }
    
    // 更新データを準備
    const updateData: any = {};
    
    if (action === "status") {
      updateData.isActive = Boolean(value);
    } else if (action === "category") {
      updateData.category = String(value);
    }
    
    // 一括更新を実行
    const result = await prisma.symbol.updateMany({
      where: {
        id: {
          in: ids.map((id: any) => Number(id)),
        },
      },
      data: updateData,
    });
    
    // ログを記録
    await createApiLog({
      endpoint: "/api/admin/symbols/bulk-update",
      status: "success",
      statusCode: 200,
      requestBody: JSON.stringify(body),
      response: JSON.stringify({ count: result.count }),
    });
    
    return NextResponse.json({ 
      success: true,
      count: result.count 
    });
    
  } catch (error) {
    console.error("Bulk update error:", error);
    
    // エラーログを記録
    await createApiLog({
      endpoint: "/api/admin/symbols/bulk-update",
      status: "error",
      statusCode: 500,
      requestBody: JSON.stringify(await request.json().catch(() => ({}))),
      response: JSON.stringify({ error: "Internal Server Error" }),
    });
    
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 
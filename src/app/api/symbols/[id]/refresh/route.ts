import { NextResponse } from "next/server";
import { generateDemoData } from "@/lib/dal/prices";
import { getSymbolById } from "@/lib/dal/symbols";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // パラメータの取得
    const symbolId = Number(params.id);
    if (isNaN(symbolId) || symbolId <= 0) {
      return NextResponse.json(
        { error: "無効なシンボルIDです" },
        { status: 400 }
      );
    }

    // シンボルの存在確認
    try {
      await getSymbolById(symbolId);
    } catch (error) {
      return NextResponse.json(
        { error: "指定されたシンボルが見つかりません" },
        { status: 404 }
      );
    }

    // クエリパラメータの解析
    const url = new URL(request.url);
    const days = Number(url.searchParams.get("days") || "30");
    const validDays = !isNaN(days) && days > 0 && days <= 365 ? days : 30;

    // デモデータの生成（実際の環境では外部APIからのデータ取得を実装）
    const result = await generateDemoData(symbolId, validDays);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error refreshing price data:", error);
    return NextResponse.json(
      { error: "データの更新中にエラーが発生しました" },
      { status: 500 }
    );
  }
} 
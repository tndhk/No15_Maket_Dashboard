#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

// 型定義
interface ExportedData {
  symbols: unknown[];
  prices: unknown[];
  favorites: unknown[];
  apiLogs: unknown[];
  exportDate: string;
  version: string;
}

// Prismaクライアントの初期化
const prisma = new PrismaClient();

/**
 * SQLiteデータをJSONファイルにエクスポートする関数
 */
async function exportSqliteData(outputPath: string): Promise<void> {
  console.log('SQLiteデータのエクスポートを開始します...');
  
  try {
    // 各テーブルからデータを取得
    console.log('シンボルデータを取得中...');
    const symbols = await prisma.symbol.findMany();
    console.log(`${symbols.length}件のシンボルデータを取得しました`);
    
    console.log('価格データを取得中...');
    const prices = await prisma.price.findMany();
    console.log(`${prices.length}件の価格データを取得しました`);
    
    console.log('お気に入りデータを取得中...');
    const favorites = await prisma.favorite.findMany();
    console.log(`${favorites.length}件のお気に入りデータを取得しました`);
    
    console.log('APIログデータを取得中...');
    const apiLogs = await prisma.apiLog.findMany();
    console.log(`${apiLogs.length}件のAPIログデータを取得しました`);
    
    // エクスポートデータの作成
    const exportData: ExportedData = {
      symbols,
      prices,
      favorites,
      apiLogs,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    // 出力先のディレクトリが存在しない場合は作成
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // JSONファイルに書き込み
    fs.writeFileSync(
      outputPath,
      JSON.stringify(exportData, null, 2),
      'utf-8'
    );
    
    console.log(`データのエクスポートが完了しました: ${outputPath}`);
    console.log(`エクスポートしたレコード数:
- シンボル: ${symbols.length}件
- 価格データ: ${prices.length}件
- お気に入り: ${favorites.length}件
- APIログ: ${apiLogs.length}件`);
    
  } catch (error) {
    console.error('データのエクスポート中にエラーが発生しました:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// コマンドライン引数から出力パスを取得またはデフォルトパスを使用
const outputPath = process.argv[2] || path.join(process.cwd(), 'data', 'sqlite-export.json');

// スクリプトの実行
exportSqliteData(outputPath)
  .catch(e => {
    console.error(e);
    process.exit(1);
  }); 
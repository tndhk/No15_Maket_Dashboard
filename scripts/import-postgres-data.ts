#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

// 型定義
interface Price {
  id: number;
  symbolId: number;
  date: string | Date;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number;
  volume: number | null;
  source: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface Symbol {
  id: number;
  symbol: string;
  name: string;
  category: string;
  status: string;
  description?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface Favorite {
  id: number;
  userId: string;
  symbolId: number;
  createdAt?: string | Date;
}

interface ApiLog {
  id: number;
  userId?: string | null;
  symbolId?: number | null;
  source: string;
  endpoint: string;
  status: string;
  message?: string | null;
  createdAt?: string | Date;
}

// Prismaクライアントの初期化
const prisma = new PrismaClient();

/**
 * JSONデータをPostgreSQLにインポートする関数
 */
async function importPostgresData(filePath: string) {
  console.log('PostgreSQLへのデータインポートを開始します...');
  
  if (!filePath) {
    console.error('ファイルパスが指定されていません');
    console.log('使用方法: npx ts-node scripts/import-postgres-data.ts <jsonファイルパス>');
    process.exit(1);
  }
  
  try {
    // ファイルの読み込み
    const fullPath = path.resolve(process.cwd(), filePath);
    console.log(`ファイルを読み込んでいます: ${fullPath}`);
    
    if (!fs.existsSync(fullPath)) {
      console.error(`ファイルが見つかりません: ${fullPath}`);
      process.exit(1);
    }
    
    const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
    
    // トランザクション内でインポートを実行
    await prisma.$transaction(async (tx) => {
      // 既存データのカウント
      const existingSymbolsCount = await tx.symbol.count();
      const existingPricesCount = await tx.price.count();
      
      console.log(`現在のデータ: シンボル ${existingSymbolsCount}件, 価格 ${existingPricesCount}件`);
      
      // データのインポート
      if (data.symbols && data.symbols.length > 0) {
        console.log(`${data.symbols.length}件のシンボルデータをインポートします...`);
        for (const symbol of data.symbols as Symbol[]) {
          // idはDBで自動生成される可能性があるため削除
          const { id, ...symbolData } = symbol;
          
          await tx.symbol.upsert({
            where: { id },
            update: symbolData,
            create: symbolData
          });
        }
      }
      
      if (data.prices && data.prices.length > 0) {
        console.log(`${data.prices.length}件の価格データをインポートします...`);
        // 大量のデータはバッチ処理が効率的
        const batchSize = 1000;
        
        for (let i = 0; i < data.prices.length; i += batchSize) {
          const batch = data.prices.slice(i, i + batchSize) as Price[];
          console.log(`バッチ処理中: ${i + 1} から ${i + batch.length} / ${data.prices.length}`);
          
          const createOperations = batch.map((price: Price) => {
            const { id, ...priceData } = price;
            return tx.price.upsert({
              where: { id },
              update: priceData,
              create: priceData
            });
          });
          
          await Promise.all(createOperations);
        }
      }
      
      if (data.favorites && data.favorites.length > 0) {
        console.log(`${data.favorites.length}件のお気に入りデータをインポートします...`);
        for (const favorite of data.favorites as Favorite[]) {
          const { id, ...favoriteData } = favorite;
          
          await tx.favorite.upsert({
            where: { id },
            update: favoriteData,
            create: favoriteData
          });
        }
      }
      
      // APIログはオプション（量が多い場合はスキップも検討）
      if (data.apiLogs && data.apiLogs.length > 0) {
        console.log(`${data.apiLogs.length}件のAPIログデータをインポートします...`);
        
        // 最新の1000件だけをインポート
        const recentLogs = data.apiLogs.slice(-1000) as ApiLog[];
        
        for (const log of recentLogs) {
          const { id, ...logData } = log;
          
          await tx.apiLog.upsert({
            where: { id },
            update: logData,
            create: logData
          });
        }
      }
    });
    
    console.log('データのインポートが完了しました');
    
    // インポート後の集計
    const symbolsCount = await prisma.symbol.count();
    const pricesCount = await prisma.price.count();
    const favoritesCount = await prisma.favorite.count();
    const apiLogsCount = await prisma.apiLog.count();
    
    console.log(`インポート結果:
- シンボル: ${symbolsCount}件
- 価格データ: ${pricesCount}件
- お気に入り: ${favoritesCount}件
- APIログ: ${apiLogsCount}件`);
    
  } catch (error) {
    console.error('データのインポート中にエラーが発生しました:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// コマンドライン引数からファイルパスを取得
const filePath = process.argv[2];

// スクリプトの実行
importPostgresData(filePath)
  .catch(e => {
    console.error(e);
    process.exit(1);
  }); 
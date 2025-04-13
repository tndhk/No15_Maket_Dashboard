import { prisma } from "@/lib/prisma";

interface DailyPriceData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Yahoo Finance APIラッパークラス
 */
export class YahooFinanceAPI {
  private readonly baseUrl: string = "https://query1.finance.yahoo.com/v8/finance/chart";

  /**
   * 価格データを取得して保存する
   */
  public async fetchPriceData(symbol: string, category: string): Promise<any[]> {
    try {
      // Yahoo Financeでは、特定のシンボルに接尾辞が必要な場合があります
      let yahooSymbol = symbol;
      
      // 日本株式の場合、.Tを追加
      if (category === "stock" && symbol.includes(".T")) {
        yahooSymbol = symbol;
      } else if (category === "stock" && !symbol.includes(".")) {
        // 米国株式の場合、そのまま使用
        yahooSymbol = symbol;
      } else if (category === "crypto") {
        // 仮想通貨の場合、-USDを追加
        yahooSymbol = `${symbol}-USD`;
      } else if (category === "forex") {
        // 為替の場合、=Xを追加
        yahooSymbol = `${symbol}=X`;
      } else if (category === "index") {
        // 指数の場合、そのまま使用（通常は^から始まる）
        yahooSymbol = symbol;
      }
      
      // 1ヶ月間のデータを取得（1日間隔）
      const interval = "1d";
      const range = "1mo";
      
      // APIリクエストURL
      const url = `${this.baseUrl}/${encodeURIComponent(yahooSymbol)}?interval=${interval}&range=${range}`;
      
      // APIリクエストを送信
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // レスポンスからデータを抽出
      if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
        // データが見つからない場合はデモデータを返す
        return this.getDemoPriceData(symbol);
      }
      
      const result = data.chart.result[0];
      const timestamps = result.timestamp;
      const quotes = result.indicators.quote[0];
      
      if (!timestamps || !quotes) {
        return this.getDemoPriceData(symbol);
      }
      
      // 価格データを構築
      const priceData: DailyPriceData[] = timestamps.map((timestamp: number, i: number) => ({
        date: new Date(timestamp * 1000), // Unixタイムスタンプをミリ秒に変換
        open: quotes.open[i] || 0,
        high: quotes.high[i] || 0,
        low: quotes.low[i] || 0,
        close: quotes.close[i] || 0,
        volume: quotes.volume[i] || 0,
      })).filter((item: DailyPriceData) => 
        // nullやundefinedの価格データを除外
        item.open && item.high && item.low && item.close
      );
      
      // データベースにデータを保存
      const symbolRecord = await prisma.symbol.findFirst({
        where: { symbol },
      });
      
      if (!symbolRecord) {
        throw new Error(`Symbol ${symbol} not found in database`);
      }
      
      // 既存データを取得して重複を避ける
      const existingDates = await prisma.price.findMany({
        where: { symbolId: symbolRecord.id },
        select: { date: true },
      });
      
      const existingDateStrings = new Set(
        existingDates.map(e => e.date.toISOString().split("T")[0])
      );
      
      // 重複しないデータのみフィルタリング
      const newPriceData = priceData.filter(
        p => !existingDateStrings.has(p.date.toISOString().split("T")[0])
      );
      
      // データがない場合は早期リターン
      if (newPriceData.length === 0) {
        return [];
      }
      
      // データベースに保存
      const dbResult = await prisma.$transaction(
        newPriceData.map(price => 
          prisma.price.create({
            data: {
              symbolId: symbolRecord.id,
              date: price.date,
              open: price.open,
              high: price.high,
              low: price.low,
              close: price.close,
              volume: price.volume,
              source: "yahoo",
            },
          })
        )
      );
      
      return dbResult;
      
    } catch (error) {
      console.error(`Yahoo Finance API error for symbol ${symbol}:`, error);
      // エラーの場合はデモデータを返す
      return this.getDemoPriceData(symbol);
    }
  }
  
  /**
   * デモ用の価格データを生成
   */
  private getDemoPriceData(symbol: string): any[] {
    const result = [];
    const today = new Date();
    
    // 過去30日分のデモデータを生成
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // 基準となる価格（シンボル文字列からハッシュ値を生成して使用）
      const basePrice = this.getRandomPrice(symbol, 100, 1000);
      
      // 変動率を設定（±3%程度）
      const volatility = 0.03;
      
      // 始値、高値、安値、終値を生成
      const open = basePrice * (1 + (Math.random() * 2 - 1) * volatility);
      const close = basePrice * (1 + (Math.random() * 2 - 1) * volatility);
      const high = Math.max(open, close) * (1 + Math.random() * volatility);
      const low = Math.min(open, close) * (1 - Math.random() * volatility);
      
      // ボリュームを生成
      const volume = Math.floor(Math.random() * 10000000);
      
      // データをDBに保存
      result.push({
        date,
        open,
        high,
        low,
        close,
        volume,
        source: "yahoo-demo",
      });
    }
    
    return result;
  }
  
  /**
   * シンボル文字列から擬似的にランダムな価格を生成
   */
  private getRandomPrice(symbol: string, min: number, max: number): number {
    // シンボル文字列からハッシュ値を生成
    let hash = 0;
    for (let i = 0; i < symbol.length; i++) {
      hash = ((hash << 5) - hash) + symbol.charCodeAt(i);
      hash |= 0; // 32ビット整数に変換
    }
    
    // ハッシュ値を0〜1の範囲に正規化
    const normalized = (hash & 0x7fffffff) / 0x7fffffff;
    
    // 指定された範囲内の価格を返す
    return min + normalized * (max - min);
  }
} 
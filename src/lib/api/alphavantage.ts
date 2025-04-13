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
 * Alpha Vantage APIラッパークラス
 */
export class AlphaVantageAPI {
  private readonly apiKey: string;
  private readonly baseUrl: string = "https://www.alphavantage.co/query";

  constructor() {
    // 本番環境では環境変数から取得
    this.apiKey = process.env.ALPHA_VANTAGE_API_KEY || "demo";
  }

  /**
   * 価格データを取得して保存する
   */
  public async fetchPriceData(symbol: string, category: string): Promise<any[]> {
    try {
      // カテゴリに応じた関数を選択
      let apiFunction = "TIME_SERIES_DAILY";
      
      if (category === "crypto") {
        apiFunction = "DIGITAL_CURRENCY_DAILY";
      } else if (category === "forex") {
        apiFunction = "FX_DAILY";
      }
      
      // APIリクエストURL
      const url = `${this.baseUrl}?function=${apiFunction}&symbol=${encodeURIComponent(symbol)}&apikey=${this.apiKey}&outputsize=compact`;
      
      // APIリクエストを送信
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // デモキーの場合の処理
      if (data.Note) {
        console.warn("Alpha Vantage API limit reached:", data.Note);
        // デモデータを返す
        return this.getDemoPriceData(symbol);
      }
      
      // レスポンスのフォーマットに応じてデータを抽出
      let priceData: DailyPriceData[] = [];
      
      if (apiFunction === "TIME_SERIES_DAILY" && data["Time Series (Daily)"]) {
        priceData = this.parseTimeSeriesDaily(data["Time Series (Daily)"]);
      } else if (apiFunction === "DIGITAL_CURRENCY_DAILY" && data["Time Series (Digital Currency Daily)"]) {
        priceData = this.parseDigitalCurrencyDaily(data["Time Series (Digital Currency Daily)"]);
      } else if (apiFunction === "FX_DAILY" && data["Time Series FX (Daily)"]) {
        priceData = this.parseFXDaily(data["Time Series FX (Daily)"]);
      } else {
        // データが見つからない場合はデモデータを返す
        return this.getDemoPriceData(symbol);
      }
      
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
      const result = await prisma.$transaction(
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
              source: "alphavantage",
            },
          })
        )
      );
      
      return result;
      
    } catch (error) {
      console.error(`Alpha Vantage API error for symbol ${symbol}:`, error);
      throw error;
    }
  }
  
  /**
   * 株式の日足データをパース
   */
  private parseTimeSeriesDaily(timeSeries: any): DailyPriceData[] {
    return Object.entries(timeSeries).map(([dateStr, values]: [string, any]) => ({
      date: new Date(dateStr),
      open: parseFloat(values["1. open"]),
      high: parseFloat(values["2. high"]),
      low: parseFloat(values["3. low"]),
      close: parseFloat(values["4. close"]),
      volume: parseInt(values["5. volume"], 10),
    }));
  }
  
  /**
   * 仮想通貨の日足データをパース
   */
  private parseDigitalCurrencyDaily(timeSeries: any): DailyPriceData[] {
    return Object.entries(timeSeries).map(([dateStr, values]: [string, any]) => ({
      date: new Date(dateStr),
      open: parseFloat(values["1a. open (USD)"]),
      high: parseFloat(values["2a. high (USD)"]),
      low: parseFloat(values["3a. low (USD)"]),
      close: parseFloat(values["4a. close (USD)"]),
      volume: parseInt(values["5. volume"], 10),
    }));
  }
  
  /**
   * 為替の日足データをパース
   */
  private parseFXDaily(timeSeries: any): DailyPriceData[] {
    return Object.entries(timeSeries).map(([dateStr, values]: [string, any]) => ({
      date: new Date(dateStr),
      open: parseFloat(values["1. open"]),
      high: parseFloat(values["2. high"]),
      low: parseFloat(values["3. low"]),
      close: parseFloat(values["4. close"]),
      volume: 0, // FXデータにはボリュームがないため0を設定
    }));
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
        source: "alphavantage-demo",
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
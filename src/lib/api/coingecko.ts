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
 * CoinGecko APIラッパークラス
 */
export class CoinGeckoAPI {
  private readonly baseUrl: string = "https://api.coingecko.com/api/v3";
  
  /**
   * 価格データを取得して保存する
   */
  public async fetchPriceData(symbol: string, category: string): Promise<any[]> {
    // CoinGeckoは仮想通貨専用のため、他のカテゴリはデモデータを返す
    if (category !== "crypto") {
      return this.getDemoPriceData(symbol);
    }
    
    try {
      // 通貨ID（小文字）とシンボル（大文字）は異なる可能性がある
      // 簡易的な変換: シンボルを小文字に変換
      const coinId = symbol.toLowerCase();
      
      // 最初に通貨IDを検索
      const coinsListUrl = `${this.baseUrl}/coins/list`;
      const coinsListResponse = await fetch(coinsListUrl);
      
      if (!coinsListResponse.ok) {
        throw new Error(`API request failed with status ${coinsListResponse.status}`);
      }
      
      const coinsList = await coinsListResponse.json();
      
      // シンボルに一致するコインを探す
      const coin = coinsList.find(
        (c: any) => c.symbol.toLowerCase() === coinId || c.id.toLowerCase() === coinId
      );
      
      if (!coin) {
        // コインが見つからない場合はデモデータを返す
        return this.getDemoPriceData(symbol);
      }
      
      // コインの過去30日間の市場データを取得
      const days = 30;
      const marketChartUrl = `${this.baseUrl}/coins/${coin.id}/market_chart?vs_currency=usd&days=${days}`;
      
      const marketChartResponse = await fetch(marketChartUrl);
      
      if (!marketChartResponse.ok) {
        throw new Error(`API request failed with status ${marketChartResponse.status}`);
      }
      
      const marketChartData = await marketChartResponse.json();
      
      // CoinGecko APIからのデータは[timestamp, value]の配列
      const prices = marketChartData.prices || []; // 終値
      const marketCaps = marketChartData.market_caps || []; // 時価総額
      const volumes = marketChartData.total_volumes || []; // 出来高
      
      // データを整形
      const priceData: DailyPriceData[] = [];
      
      // 日付ごとに集約（CoinGeckoは時間単位のデータも返すため）
      const dailyData: { [key: string]: DailyPriceData } = {};
      
      // 価格データから日付ごとの終値を抽出
      for (const [timestamp, price] of prices) {
        const date = new Date(timestamp);
        const dateKey = date.toISOString().split("T")[0];
        
        if (!dailyData[dateKey]) {
          dailyData[dateKey] = {
            date: new Date(dateKey),
            open: price,
            high: price,
            low: price,
            close: price,
            volume: 0,
          };
        } else {
          // 高値と安値を更新
          dailyData[dateKey].high = Math.max(dailyData[dateKey].high, price);
          dailyData[dateKey].low = Math.min(dailyData[dateKey].low, price);
          // 終値として最後の価格を使用
          dailyData[dateKey].close = price;
        }
      }
      
      // 出来高データを追加
      for (const [timestamp, volume] of volumes) {
        const date = new Date(timestamp);
        const dateKey = date.toISOString().split("T")[0];
        
        if (dailyData[dateKey]) {
          dailyData[dateKey].volume = volume;
        }
      }
      
      // オブジェクトから配列に変換
      for (const key in dailyData) {
        priceData.push(dailyData[key]);
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
              source: "coingecko",
            },
          })
        )
      );
      
      return dbResult;
      
    } catch (error) {
      console.error(`CoinGecko API error for symbol ${symbol}:`, error);
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
      const basePrice = this.getRandomPrice(symbol, 100, 10000);
      
      // 仮想通貨は変動が大きいので、変動率を高めに設定
      const volatility = 0.05;
      
      // 始値、高値、安値、終値を生成
      const open = basePrice * (1 + (Math.random() * 2 - 1) * volatility);
      const close = basePrice * (1 + (Math.random() * 2 - 1) * volatility);
      const high = Math.max(open, close) * (1 + Math.random() * volatility);
      const low = Math.min(open, close) * (1 - Math.random() * volatility);
      
      // ボリュームを生成
      const volume = Math.floor(Math.random() * 100000000);
      
      // データをDBに保存
      result.push({
        date,
        open,
        high,
        low,
        close,
        volume,
        source: "coingecko-demo",
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
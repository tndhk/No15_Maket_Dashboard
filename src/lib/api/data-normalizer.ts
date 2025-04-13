import { StandardPriceData, normalizeAPIResponse } from "@/lib/utils";

/**
 * Alpha Vantageからの応答を標準形式に変換
 */
export function normalizeAlphaVantageData(response: any, category: string): StandardPriceData[] {
  const results: StandardPriceData[] = [];
  
  try {
    let timeSeriesData: any = null;
    
    // カテゴリに応じたレスポンスフィールドを選択
    if (category === "crypto" && response["Time Series (Digital Currency Daily)"]) {
      timeSeriesData = response["Time Series (Digital Currency Daily)"];
    } else if (category === "forex" && response["Time Series FX (Daily)"]) {
      timeSeriesData = response["Time Series FX (Daily)"];
    } else if (response["Time Series (Daily)"]) {
      timeSeriesData = response["Time Series (Daily)"];
    }
    
    if (!timeSeriesData) {
      throw new Error("予期しないAPIレスポンス形式です");
    }
    
    // 日付ごとに処理
    for (const [dateStr, values] of Object.entries(timeSeriesData)) {
      let priceData: StandardPriceData;
      const valueObj = values as Record<string, string>;
      
      if (category === "crypto") {
        priceData = {
          date: new Date(dateStr),
          open: parseFloat(valueObj["1a. open (USD)"]) || null,
          high: parseFloat(valueObj["2a. high (USD)"]) || null,
          low: parseFloat(valueObj["3a. low (USD)"]) || null,
          close: parseFloat(valueObj["4a. close (USD)"]) || 0,
          volume: parseInt(valueObj["5. volume"], 10) || null,
          source: "alphavantage",
        };
      } else if (category === "forex") {
        priceData = {
          date: new Date(dateStr),
          open: parseFloat(valueObj["1. open"]) || null,
          high: parseFloat(valueObj["2. high"]) || null,
          low: parseFloat(valueObj["3. low"]) || null,
          close: parseFloat(valueObj["4. close"]) || 0,
          volume: null, // FXにはボリュームがない
          source: "alphavantage",
        };
      } else {
        priceData = {
          date: new Date(dateStr),
          open: parseFloat(valueObj["1. open"]) || null,
          high: parseFloat(valueObj["2. high"]) || null,
          low: parseFloat(valueObj["3. low"]) || null,
          close: parseFloat(valueObj["4. close"]) || 0,
          volume: parseInt(valueObj["5. volume"], 10) || null,
          source: "alphavantage",
        };
      }
      
      results.push(priceData);
    }
    
  } catch (error) {
    console.error("Alpha Vantage data normalization error:", error);
    throw error;
  }
  
  return results;
}

/**
 * Yahoo Financeからの応答を標準形式に変換
 */
export function normalizeYahooFinanceData(response: any): StandardPriceData[] {
  const results: StandardPriceData[] = [];
  
  try {
    const quotes = response.chart?.result?.[0]?.indicators?.quote?.[0];
    const timestamps = response.chart?.result?.[0]?.timestamp;
    
    if (!quotes || !timestamps) {
      throw new Error("予期しないAPIレスポンス形式です");
    }
    
    const { open, high, low, close, volume } = quotes;
    
    for (let i = 0; i < timestamps.length; i++) {
      // タイムスタンプをミリ秒単位に変換
      const date = new Date(timestamps[i] * 1000);
      
      const priceData: StandardPriceData = {
        date,
        open: open[i] || null,
        high: high[i] || null,
        low: low[i] || null,
        close: close[i] || 0,
        volume: volume[i] || null,
        source: "yahoo",
      };
      
      results.push(priceData);
    }
    
  } catch (error) {
    console.error("Yahoo Finance data normalization error:", error);
    throw error;
  }
  
  return results;
}

/**
 * CoinGeckoからの応答を標準形式に変換
 */
export function normalizeCoinGeckoData(response: any): StandardPriceData[] {
  const results: StandardPriceData[] = [];
  
  try {
    const prices = response.prices || [];
    const volumes = response.total_volumes || [];
    
    if (prices.length === 0) {
      throw new Error("価格データがありません");
    }
    
    // 日付ごとのデータを集約
    const dailyData: Record<string, StandardPriceData> = {};
    
    // 価格データを処理
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
          volume: null,
          source: "coingecko",
        };
      } else {
        dailyData[dateKey].high = Math.max(dailyData[dateKey].high || 0, price);
        dailyData[dateKey].low = Math.min(dailyData[dateKey].low || Infinity, price);
        dailyData[dateKey].close = price;
      }
    }
    
    // ボリュームデータを追加
    for (const [timestamp, volume] of volumes) {
      const date = new Date(timestamp);
      const dateKey = date.toISOString().split("T")[0];
      
      if (dailyData[dateKey]) {
        dailyData[dateKey].volume = volume;
      }
    }
    
    // オブジェクトから配列に変換
    for (const key in dailyData) {
      results.push(dailyData[key]);
    }
    
  } catch (error) {
    console.error("CoinGecko data normalization error:", error);
    throw error;
  }
  
  return results;
}

/**
 * データソースに応じて適切なノーマライザーを選択
 */
export function normalizeApiData(data: any, source: string, category: string = "stock"): StandardPriceData[] {
  try {
    switch (source) {
      case "alphavantage":
        return normalizeAPIResponse<StandardPriceData[]>(
          data,
          source,
          (responseData) => normalizeAlphaVantageData(responseData, category)
        );
      case "yahoo":
        return normalizeAPIResponse<StandardPriceData[]>(
          data,
          source,
          normalizeYahooFinanceData
        );
      case "coingecko":
        return normalizeAPIResponse<StandardPriceData[]>(
          data,
          source,
          normalizeCoinGeckoData
        );
      default:
        throw new Error(`未対応のデータソース: ${source}`);
    }
  } catch (error) {
    console.error(`Data normalization error for source ${source}:`, error);
    return [];
  }
} 
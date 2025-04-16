import { AlphaVantageAPI } from "./alphavantage";
import { CoinGeckoAPI } from "./coingecko";
import { YahooFinanceAPI } from "./yahoo-finance";

/**
 * シンボル・カテゴリに応じて適切なAPIラッパーを呼び出し、価格データを取得・保存する共通サービス
 */
export async function fetchAndSavePriceData(symbol: string, category: string) {
  if (category === "crypto") {
    // CoinGecko優先
    return await new CoinGeckoAPI().fetchPriceData(symbol, category);
  } else if (category === "stock" || category === "forex") {
    // Alpha Vantage優先、失敗時はYahoo Finance
    try {
      return await new AlphaVantageAPI().fetchPriceData(symbol, category);
    } catch {
      return await new YahooFinanceAPI().fetchPriceData(symbol, category);
    }
  } else if (category === "index") {
    // 指数はYahoo Financeで取得
    return await new YahooFinanceAPI().fetchPriceData(symbol, category);
  } else {
    // その他はYahoo Finance
    return await new YahooFinanceAPI().fetchPriceData(symbol, category);
  }
} 
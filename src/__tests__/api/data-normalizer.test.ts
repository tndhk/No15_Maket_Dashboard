import { describe, test, expect } from '@jest/globals';
import {
  normalizeAlphaVantageData,
  normalizeYahooFinanceData,
  normalizeCoinGeckoData,
  normalizeApiData
} from "@/lib/api/data-normalizer";

// Alpha Vantageのモックレスポンス
const mockAlphaVantageResponse = {
  "Meta Data": {
    "1. Information": "Daily Prices (open, high, low, close) and Volumes",
    "2. Symbol": "AAPL",
    "3. Last Refreshed": "2023-04-15",
    "4. Output Size": "Compact",
    "5. Time Zone": "US/Eastern"
  },
  "Time Series (Daily)": {
    "2023-04-15": {
      "1. open": "165.0800",
      "2. high": "166.9800",
      "3. low": "164.6900",
      "4. close": "165.2100",
      "5. volume": "64583465"
    },
    "2023-04-14": {
      "1. open": "163.5900",
      "2. high": "166.3200",
      "3. low": "163.0700",
      "4. close": "165.0500",
      "5. volume": "73477565"
    }
  }
};

// Yahoo Financeのモックレスポンス
const mockYahooFinanceResponse = {
  chart: {
    result: [
      {
        meta: {
          symbol: "AAPL",
          regularMarketPrice: 165.21
        },
        timestamp: [1681516800, 1681430400],
        indicators: {
          quote: [
            {
              open: [165.08, 163.59],
              high: [166.98, 166.32],
              low: [164.69, 163.07],
              close: [165.21, 165.05],
              volume: [64583465, 73477565]
            }
          ]
        }
      }
    ]
  }
};

// CoinGeckoのモックレスポンス
const mockCoinGeckoResponse = {
  prices: [
    [1681516800000, 30000],
    [1681516500000, 29500],
    [1681430400000, 29800],
    [1681430100000, 29900]
  ],
  market_caps: [
    [1681516800000, 580000000000],
    [1681516500000, 575000000000],
    [1681430400000, 577000000000],
    [1681430100000, 578000000000]
  ],
  total_volumes: [
    [1681516800000, 18000000000],
    [1681516500000, 17500000000],
    [1681430400000, 17800000000],
    [1681430100000, 17900000000]
  ]
};

describe("データノーマライザー", () => {
  describe("Alpha Vantageデータの正規化", () => {
    test("株式データの正規化", () => {
      const result = normalizeAlphaVantageData(mockAlphaVantageResponse, "stock");
      
      expect(result).toHaveLength(2);
      expect(result[0].date).toBeInstanceOf(Date);
      expect(result[0].open).toBe(165.08);
      expect(result[0].high).toBe(166.98);
      expect(result[0].low).toBe(164.69);
      expect(result[0].close).toBe(165.21);
      expect(result[0].volume).toBe(64583465);
      expect(result[0].source).toBe("alphavantage");
    });

    test("データがない場合はエラーを投げる", () => {
      expect(() => {
        normalizeAlphaVantageData({ "Meta Data": {} }, "stock");
      }).toThrow();
    });
  });

  describe("Yahoo Financeデータの正規化", () => {
    test("株式データの正規化", () => {
      const result = normalizeYahooFinanceData(mockYahooFinanceResponse);
      
      expect(result).toHaveLength(2);
      expect(result[0].date).toBeInstanceOf(Date);
      expect(result[0].open).toBe(165.08);
      expect(result[0].high).toBe(166.98);
      expect(result[0].low).toBe(164.69);
      expect(result[0].close).toBe(165.21);
      expect(result[0].volume).toBe(64583465);
      expect(result[0].source).toBe("yahoo");
    });

    test("データがない場合はエラーを投げる", () => {
      expect(() => {
        normalizeYahooFinanceData({ chart: {} });
      }).toThrow();
    });
  });

  describe("CoinGeckoデータの正規化", () => {
    test("仮想通貨データの正規化", () => {
      const result = normalizeCoinGeckoData(mockCoinGeckoResponse);
      
      // 日付ごとにデータが集約されるため、2日分のデータになる
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result[0].date).toBeInstanceOf(Date);
      expect(result[0].open).toBeDefined();
      expect(result[0].high).toBeDefined();
      expect(result[0].low).toBeDefined();
      expect(result[0].close).toBeDefined();
      expect(result[0].volume).toBeDefined();
      expect(result[0].source).toBe("coingecko");
    });

    test("価格データがない場合はエラーを投げる", () => {
      expect(() => {
        normalizeCoinGeckoData({ market_caps: [] });
      }).toThrow();
    });
  });

  describe("データソースに基づく正規化", () => {
    test("Alpha Vantageデータの正規化", () => {
      const result = normalizeApiData(mockAlphaVantageResponse, "alphavantage", "stock");
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].source).toBe("alphavantage");
    });

    test("Yahoo Financeデータの正規化", () => {
      const result = normalizeApiData(mockYahooFinanceResponse, "yahoo");
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].source).toBe("yahoo");
    });

    test("CoinGeckoデータの正規化", () => {
      const result = normalizeApiData(mockCoinGeckoResponse, "coingecko");
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].source).toBe("coingecko");
    });

    test("未対応のデータソースは空配列を返す", () => {
      const result = normalizeApiData({}, "unknown");
      expect(result).toEqual([]);
    });
  });
}); 
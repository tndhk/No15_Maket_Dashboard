import { SearchResult } from "@/components/features/symbols/SymbolSearchForm";

// このキーはデモ用です。本番環境では環境変数から取得するべきです。
const ALPHA_VANTAGE_API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || "";
const COINAPI_KEY = "demo";

/**
 * Alpha Vantage APIを使用して株式銘柄を検索する
 */
export async function searchStocks(query: string): Promise<SearchResult[]> {
  console.log(`[searchStocks] called with query=${query}, API_KEY=${ALPHA_VANTAGE_API_KEY}`);
  try {
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(
      query
    )}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    console.log("[searchStocks] URL=", url);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();
    // エラーメッセージが返ってきた場合はデモ結果を返す
    if ((data as any)["Error Message"]) {
      console.warn("Alpha Vantage API error:", (data as any)["Error Message"]);
      return getDemoSearchResults(query, "stock");
    }
    console.log("[searchStocks] data=", JSON.stringify(data).slice(0,500));
    
    // デモキーの場合、APIが制限される場合があるのでエラーチェック
    if (data.Note) {
      console.warn("Alpha Vantage API limit reached:", data.Note);
      
      // デモモード：ダミーのデータを返す
      return getDemoSearchResults(query, "stock");
    }

    if (!data.bestMatches) {
      return [];
    }

    return data.bestMatches.map((match: any) => ({
      symbol: match["1. symbol"],
      name: match["2. name"],
      category: "stock",
      region: match["4. region"],
      exchange: match["8. exchange"],
    }));
  } catch (error) {
    console.error("Error searching stocks:", error);
    // エラー時はデモデータを返す
    return getDemoSearchResults(query, "stock");
  }
}

/**
 * CoinAPI.ioを使用して仮想通貨銘柄を検索する
 */
export async function searchCryptos(query: string): Promise<SearchResult[]> {
  try {
    // 実際にはここでCoinAPIを呼び出す
    // デモのため、ダミーデータを返す
    return getDemoSearchResults(query, "crypto");
  } catch (error) {
    console.error("Error searching cryptos:", error);
    return getDemoSearchResults(query, "crypto");
  }
}

/**
 * 為替レートを検索する
 */
export async function searchForex(query: string): Promise<SearchResult[]> {
  // デモのため、ダミーデータを返す
  return getDemoSearchResults(query, "forex");
}

/**
 * 指数を検索する
 */
export async function searchIndices(query: string): Promise<SearchResult[]> {
  // デモのため、ダミーデータを返す
  return getDemoSearchResults(query, "index");
}

/**
 * カテゴリに基づいて適切な検索関数を呼び出す
 */
export async function searchSymbols(
  query: string,
  category: string
): Promise<SearchResult[]> {
  switch (category) {
    case "stock":
      return searchStocks(query);
    case "crypto":
      return searchCryptos(query);
    case "forex":
      return searchForex(query);
    case "index":
      return searchIndices(query);
    default:
      return searchStocks(query);
  }
}

// デモ用のダミーデータを生成する関数
function getDemoSearchResults(query: string, category: string): SearchResult[] {
  const upperQuery = query.toUpperCase();
  
  if (category === "stock") {
    return [
      {
        symbol: `${upperQuery}`,
        name: `${upperQuery} Corporation`,
        category: "stock",
        exchange: "NASDAQ",
        region: "United States",
      },
      {
        symbol: `${upperQuery}.T`,
        name: `${upperQuery} Japan Corporation`,
        category: "stock",
        exchange: "TSE",
        region: "Japan",
      },
      {
        symbol: `${upperQuery}L`,
        name: `${upperQuery} Limited`,
        category: "stock",
        exchange: "LSE",
        region: "United Kingdom",
      },
    ];
  } else if (category === "crypto") {
    return [
      {
        symbol: `${upperQuery}USD`,
        name: `${upperQuery} to US Dollar`,
        category: "crypto",
        exchange: "Coinbase",
      },
      {
        symbol: `${upperQuery}JPY`,
        name: `${upperQuery} to Japanese Yen`,
        category: "crypto",
        exchange: "Binance",
      },
      {
        symbol: `${upperQuery}EUR`,
        name: `${upperQuery} to Euro`,
        category: "crypto",
        exchange: "Kraken",
      },
    ];
  } else if (category === "forex") {
    return [
      {
        symbol: `USD${upperQuery}`,
        name: `US Dollar to ${upperQuery}`,
        category: "forex",
      },
      {
        symbol: `EUR${upperQuery}`,
        name: `Euro to ${upperQuery}`,
        category: "forex",
      },
      {
        symbol: `GBP${upperQuery}`,
        name: `British Pound to ${upperQuery}`,
        category: "forex",
      },
    ];
  } else if (category === "index") {
    return [
      {
        symbol: `^${upperQuery}`,
        name: `${upperQuery} Index`,
        category: "index",
        region: "Global",
      },
      {
        symbol: `^${upperQuery}US`,
        name: `${upperQuery} US Index`,
        category: "index",
        region: "United States",
      },
      {
        symbol: `^${upperQuery}JP`,
        name: `${upperQuery} Japan Index`,
        category: "index",
        region: "Japan",
      },
    ];
  }
  
  return [];
} 
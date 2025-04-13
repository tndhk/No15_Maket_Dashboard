import { StandardPriceData } from "../utils";

/**
 * 価格データの平均値を計算する
 */
export function calculateAverage(priceData: { close: number; date: string }[]): number {
  if (priceData.length === 0) return 0;
  
  const sum = priceData.reduce((total, item) => total + item.close, 0);
  return sum / priceData.length;
}

/**
 * 始値と終値の変化量を計算する
 */
export function calculateChange(startPrice: number, endPrice: number): number {
  return endPrice - startPrice;
}

/**
 * 始値と終値のパーセント変化を計算する
 */
export function calculatePercentChange(startPrice: number, endPrice: number): number {
  if (startPrice === 0) return 0;
  if (startPrice === endPrice) return 0;
  
  return ((endPrice - startPrice) / startPrice) * 100;
}

/**
 * データセットから最高価格を見つける
 */
export function findHighestPrice(
  priceData: { close: number; date: string }[]
): { close: number; date: string } | null {
  if (priceData.length === 0) return null;
  
  return priceData.reduce(
    (highest, current) => (current.close > highest.close ? current : highest),
    priceData[0]
  );
}

/**
 * データセットから最低価格を見つける
 */
export function findLowestPrice(
  priceData: { close: number; date: string }[]
): { close: number; date: string } | null {
  if (priceData.length === 0) return null;
  
  return priceData.reduce(
    (lowest, current) => (current.close < lowest.close ? current : lowest),
    priceData[0]
  );
}

/**
 * チャート表示用にデータを整形する
 */
export function formatDataForChart(
  priceData: StandardPriceData[]
): { date: string; value: number }[] {
  return priceData.map(item => ({
    date: new Date(item.date).toISOString().split('T')[0],
    value: item.close
  }));
}

/**
 * 価格変化率の表示用に書式を整える
 */
export function formatPercentChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

/**
 * 移動平均を計算する
 */
export function calculateMovingAverage(
  priceData: { close: number; date: string }[],
  period: number
): { date: string; value: number }[] {
  if (priceData.length < period) {
    return [];
  }

  const result: { date: string; value: number }[] = [];

  for (let i = period - 1; i < priceData.length; i++) {
    const window = priceData.slice(i - period + 1, i + 1);
    const average = calculateAverage(window);
    
    result.push({
      date: priceData[i].date,
      value: Number(average.toFixed(2))
    });
  }

  return result;
} 
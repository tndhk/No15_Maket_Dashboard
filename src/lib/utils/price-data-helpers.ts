import { Price } from "@prisma/client";
import { StandardPriceData } from "@/lib/utils";

/**
 * 新しい価格データから既存のデータと重複しないものだけをフィルタリング
 */
export function filterNonDuplicatePriceData(
  newData: StandardPriceData[],
  existingData: Pick<Price, "date">[]
): StandardPriceData[] {
  if (!newData.length) return [];
  
  // 既存のデータの日付を文字列のセットに変換して高速検索できるようにする
  const existingDateSet = new Set(
    existingData.map(d => d.date.toISOString().split("T")[0])
  );
  
  // 既存のデータに含まれない日付のデータのみをフィルタリング
  return newData.filter(data => {
    const dateStr = data.date.toISOString().split("T")[0];
    return !existingDateSet.has(dateStr);
  });
}

/**
 * 価格データの整合性を検証
 */
export function validatePriceData(data: StandardPriceData[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // 各データポイントを検証
  data.forEach((item, index) => {
    // 必須フィールドの検証
    if (!item.date) {
      errors.push(`インデックス ${index} のデータに日付がありません`);
    }
    
    if (item.close === undefined || item.close === null) {
      errors.push(`インデックス ${index} のデータに終値がありません`);
    }
    
    // 値の範囲検証
    if (item.open !== null && item.open < 0) {
      errors.push(`インデックス ${index} のデータの始値が負の値です`);
    }
    
    if (item.high !== null && item.high < 0) {
      errors.push(`インデックス ${index} のデータの高値が負の値です`);
    }
    
    if (item.low !== null && item.low < 0) {
      errors.push(`インデックス ${index} のデータの安値が負の値です`);
    }
    
    if (item.close < 0) {
      errors.push(`インデックス ${index} のデータの終値が負の値です`);
    }
    
    if (item.volume !== null && item.volume < 0) {
      errors.push(`インデックス ${index} のデータの出来高が負の値です`);
    }
    
    // 高値・安値・始値・終値の整合性
    if (
      item.high !== null &&
      item.low !== null &&
      item.high < item.low
    ) {
      errors.push(`インデックス ${index} のデータの高値が安値より低くなっています`);
    }
    
    if (
      item.open !== null &&
      item.high !== null &&
      item.open > item.high
    ) {
      errors.push(`インデックス ${index} のデータの始値が高値より高くなっています`);
    }
    
    if (
      item.open !== null &&
      item.low !== null &&
      item.open < item.low
    ) {
      errors.push(`インデックス ${index} のデータの始値が安値より低くなっています`);
    }
    
    if (
      item.close !== null &&
      item.high !== null &&
      item.close > item.high
    ) {
      errors.push(`インデックス ${index} のデータの終値が高値より高くなっています`);
    }
    
    if (
      item.close !== null &&
      item.low !== null &&
      item.close < item.low
    ) {
      errors.push(`インデックス ${index} のデータの終値が安値より低くなっています`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * 日付順にデータをソート
 */
export function sortPriceDataByDate(data: StandardPriceData[], order: "asc" | "desc" = "desc"): StandardPriceData[] {
  return [...data].sort((a, b) => {
    const comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    return order === "asc" ? comparison : -comparison;
  });
}

/**
 * 指定された期間内のデータをフィルタリング
 */
export function filterPriceDataByDateRange(
  data: StandardPriceData[],
  startDate?: Date,
  endDate?: Date
): StandardPriceData[] {
  if (!startDate && !endDate) return data;
  
  return data.filter(item => {
    const itemDate = new Date(item.date);
    
    if (startDate && endDate) {
      return itemDate >= startDate && itemDate <= endDate;
    } else if (startDate) {
      return itemDate >= startDate;
    } else if (endDate) {
      return itemDate <= endDate;
    }
    
    return true;
  });
} 
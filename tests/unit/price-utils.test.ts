import { describe, it, expect } from 'vitest';
import { 
  calculateAverage, 
  calculateChange, 
  calculatePercentChange,
  findHighestPrice,
  findLowestPrice
} from '@/lib/utils/price-utils';

describe('価格ユーティリティ関数', () => {
  // テストデータ
  const priceData = [
    { close: 100, date: '2025-01-01' },
    { close: 110, date: '2025-01-02' },
    { close: 105, date: '2025-01-03' },
    { close: 120, date: '2025-01-04' },
    { close: 115, date: '2025-01-05' },
  ];

  describe('calculateAverage', () => {
    it('正しい平均価格を計算する', () => {
      const average = calculateAverage(priceData);
      expect(average).toBe(110); // (100 + 110 + 105 + 120 + 115) / 5 = 110
    });

    it('空の配列の場合は0を返す', () => {
      const average = calculateAverage([]);
      expect(average).toBe(0);
    });
  });

  describe('calculateChange', () => {
    it('始値と終値の間の変化量を計算する', () => {
      const change = calculateChange(priceData[0].close, priceData[4].close);
      expect(change).toBe(15); // 115 - 100 = 15
    });

    it('始値と終値が同じ場合は0を返す', () => {
      const change = calculateChange(100, 100);
      expect(change).toBe(0);
    });
  });

  describe('calculatePercentChange', () => {
    it('始値と終値の間のパーセント変化を計算する', () => {
      const percentChange = calculatePercentChange(priceData[0].close, priceData[4].close);
      expect(percentChange).toBe(15); // ((115 - 100) / 100) * 100 = 15%
    });

    it('始値が0の場合は0を返す', () => {
      const percentChange = calculatePercentChange(0, 100);
      expect(percentChange).toBe(0);
    });

    it('始値と終値が同じ場合は0を返す', () => {
      const percentChange = calculatePercentChange(100, 100);
      expect(percentChange).toBe(0);
    });
  });

  describe('findHighestPrice', () => {
    it('データセットから最高価格を見つける', () => {
      const highest = findHighestPrice(priceData);
      expect(highest).toEqual({ close: 120, date: '2025-01-04' });
    });

    it('空の配列の場合はnullを返す', () => {
      const highest = findHighestPrice([]);
      expect(highest).toBeNull();
    });
  });

  describe('findLowestPrice', () => {
    it('データセットから最低価格を見つける', () => {
      const lowest = findLowestPrice(priceData);
      expect(lowest).toEqual({ close: 100, date: '2025-01-01' });
    });

    it('空の配列の場合はnullを返す', () => {
      const lowest = findLowestPrice([]);
      expect(lowest).toBeNull();
    });
  });
}); 
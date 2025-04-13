import { describe, test, expect } from '@jest/globals';
import {
  filterNonDuplicatePriceData,
  validatePriceData,
  sortPriceDataByDate,
  filterPriceDataByDateRange
} from '@/lib/utils/price-data-helpers';
import { StandardPriceData } from '@/lib/utils';

describe('価格データヘルパー関数', () => {
  // テスト用のデータを準備
  const sampleData: StandardPriceData[] = [
    {
      date: new Date('2023-01-01'),
      open: 100,
      high: 110,
      low: 95,
      close: 105,
      volume: 1000,
      source: 'test'
    },
    {
      date: new Date('2023-01-02'),
      open: 105,
      high: 115,
      low: 100,
      close: 110,
      volume: 1200,
      source: 'test'
    },
    {
      date: new Date('2023-01-03'),
      open: 110,
      high: 120,
      low: 105,
      close: 115,
      volume: 1500,
      source: 'test'
    }
  ];

  describe('filterNonDuplicatePriceData', () => {
    test('既存のデータと重複しないデータのみを返す', () => {
      const existingData = [
        { date: new Date('2023-01-01') },
        { date: new Date('2023-01-02') }
      ];

      const result = filterNonDuplicatePriceData(sampleData, existingData);
      
      expect(result).toHaveLength(1);
      expect(result[0].date.toISOString()).toBe(new Date('2023-01-03').toISOString());
    });

    test('新しいデータがない場合は空配列を返す', () => {
      const result = filterNonDuplicatePriceData([], [{ date: new Date() }]);
      expect(result).toEqual([]);
    });

    test('既存のデータがない場合はすべての新しいデータを返す', () => {
      const result = filterNonDuplicatePriceData(sampleData, []);
      expect(result).toEqual(sampleData);
    });
  });

  describe('validatePriceData', () => {
    test('有効なデータの場合はvalid: trueを返す', () => {
      const result = validatePriceData(sampleData);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('日付がない場合はエラーを返す', () => {
      const invalidData = [
        {
          ...sampleData[0],
          date: null as unknown as Date
        }
      ];
      
      const result = validatePriceData(invalidData);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('日付がありません');
    });

    test('終値がない場合はエラーを返す', () => {
      const invalidData = [
        {
          ...sampleData[0],
          close: null as unknown as number
        }
      ];
      
      const result = validatePriceData(invalidData);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('終値がありません');
    });

    test('高値が安値より低い場合はエラーを返す', () => {
      const invalidData = [
        {
          ...sampleData[0],
          high: 90,
          low: 100
        }
      ];
      
      const result = validatePriceData(invalidData);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('高値が安値より低く');
    });
  });

  describe('sortPriceDataByDate', () => {
    test('日付の降順でデータをソートする（デフォルト）', () => {
      const result = sortPriceDataByDate(sampleData);
      expect(result[0].date).toEqual(new Date('2023-01-03'));
      expect(result[2].date).toEqual(new Date('2023-01-01'));
    });

    test('日付の昇順でデータをソートする', () => {
      const result = sortPriceDataByDate(sampleData, 'asc');
      expect(result[0].date).toEqual(new Date('2023-01-01'));
      expect(result[2].date).toEqual(new Date('2023-01-03'));
    });

    test('元の配列が変更されないことを確認', () => {
      const original = [...sampleData];
      sortPriceDataByDate(sampleData);
      expect(sampleData).toEqual(original);
    });
  });

  describe('filterPriceDataByDateRange', () => {
    test('開始日と終了日の間のデータのみを返す', () => {
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-01-02');
      
      const result = filterPriceDataByDateRange(sampleData, startDate, endDate);
      
      expect(result).toHaveLength(2);
      expect(result[0].date).toEqual(new Date('2023-01-01'));
      expect(result[1].date).toEqual(new Date('2023-01-02'));
    });

    test('開始日のみが指定された場合はそれ以降のデータを返す', () => {
      const startDate = new Date('2023-01-02');
      
      const result = filterPriceDataByDateRange(sampleData, startDate);
      
      expect(result).toHaveLength(2);
      expect(result[0].date).toEqual(new Date('2023-01-02'));
      expect(result[1].date).toEqual(new Date('2023-01-03'));
    });

    test('終了日のみが指定された場合はそれ以前のデータを返す', () => {
      const endDate = new Date('2023-01-02');
      
      const result = filterPriceDataByDateRange(sampleData, undefined, endDate);
      
      expect(result).toHaveLength(2);
      expect(result[0].date).toEqual(new Date('2023-01-01'));
      expect(result[1].date).toEqual(new Date('2023-01-02'));
    });

    test('日付範囲が指定されない場合はすべてのデータを返す', () => {
      const result = filterPriceDataByDateRange(sampleData);
      expect(result).toEqual(sampleData);
    });
  });
}); 
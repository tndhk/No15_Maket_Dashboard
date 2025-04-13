import { z } from "zod";

// 価格データ作成スキーマ
export const createPriceSchema = z.object({
  symbolId: z.number().int().positive(),
  date: z.coerce.date(),
  open: z.number().positive().optional().nullable(),
  high: z.number().positive().optional().nullable(),
  low: z.number().positive().optional().nullable(),
  close: z.number().positive(),
  volume: z.number().int().nonnegative().optional().nullable(),
  source: z.string().default("api"),
});

// 価格データ更新スキーマ
export const updatePriceSchema = createPriceSchema.partial().extend({
  id: z.number().int().positive(),
});

// 価格データ検索スキーマ
export const priceFilterSchema = z.object({
  symbolId: z.number().int().positive(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(1000).default(30),
}); 
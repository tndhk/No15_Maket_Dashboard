import { z } from "zod";

// 時間間隔の列挙型
export const timeframeEnum = z.enum(["daily", "weekly", "monthly", "quarterly", "yearly"]);

// 指標タイプの列挙型
export const metricTypeEnum = z.enum([
  "price_change",
  "price_volatility",
  "return_on_investment",
  "moving_average",
  "relative_strength",
  "correlation",
  "custom"
]);

// 分析データ作成スキーマ
export const createAnalyticsSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  symbolId: z.number().int().positive(),
  metricType: metricTypeEnum,
  timeframe: timeframeEnum,
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  parameters: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  isPublic: z.boolean().default(false),
  userId: z.number().int().positive(),
});

// 分析データ更新スキーマ
export const updateAnalyticsSchema = createAnalyticsSchema.partial().extend({
  id: z.number().int().positive(),
});

// 分析データ検索スキーマ
export const analyticsFilterSchema = z.object({
  search: z.string().optional(),
  symbolId: z.number().int().positive().optional(),
  metricType: metricTypeEnum.optional(),
  timeframe: timeframeEnum.optional(),
  userId: z.number().int().positive().optional(),
  isPublic: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
}); 
import { z } from "zod";

// 銘柄カテゴリ列挙型
export const symbolCategoryEnum = z.enum(["stock", "crypto", "forex", "index", "other"]);

// 銘柄作成スキーマ
export const createSymbolSchema = z.object({
  symbol: z
    .string()
    .min(1, "銘柄コードは必須です")
    .max(10, "銘柄コードは10文字以内にしてください")
    .regex(/^[A-Za-z0-9.]+$/, "銘柄コードには英数字とドットのみ使用できます"),
  name: z
    .string()
    .min(1, "銘柄名は必須です")
    .max(100, "銘柄名は100文字以内にしてください"),
  description: z
    .string()
    .max(500, "説明は500文字以内にしてください")
    .optional()
    .nullable(),
  category: symbolCategoryEnum.default("stock"),
  isActive: z.boolean().default(true),
});

// 銘柄更新スキーマ（部分的な更新を許可）
export const updateSymbolSchema = createSymbolSchema.partial().extend({
  // IDは必須（どの銘柄を更新するか）
  id: z.number().int().positive(),
});

// 銘柄検索・フィルタリングスキーマ
export const symbolFilterSchema = z.object({
  search: z.string().optional(),
  category: symbolCategoryEnum.optional(),
  isActive: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

// 銘柄IDパラメータスキーマ
export const symbolIdSchema = z.object({
  id: z.number().int().positive(),
}); 
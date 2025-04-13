import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// テーマ管理用のユーティリティ
export type Theme = "dark" | "light" | "system"

export function getSystemTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

// 日付関連のユーティリティ
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toISOString().split('T')[0] // YYYY-MM-DD形式
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return d.toISOString().replace('T', ' ').substring(0, 19) // YYYY-MM-DD HH:MM:SS形式
}

// 数値フォーマット用のユーティリティ
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ja-JP', { 
    style: 'currency', 
    currency: 'JPY',
    minimumFractionDigits: 0
  }).format(value)
}

export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('ja-JP', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value)
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100)
}

// API データ整形用のユーティリティ
export function normalizeAPIResponse<T>(
  data: any, 
  source: string, 
  transformFn: (data: any) => T
): T {
  try {
    return transformFn(data);
  } catch (error) {
    console.error(`Data normalization error from ${source}:`, error);
    throw new Error(`データの正規化に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// 価格データを標準形式に整形
export interface StandardPriceData {
  date: Date;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number;
  volume: number | null;
  source: string;
}

// 日付の範囲を生成
export function generateDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}

// エラーハンドリング用のヘルパー
export interface ApiError {
  status: number;
  message: string;
  source: string;
}

export function createApiError(status: number, message: string, source: string): ApiError {
  return { status, message, source };
}

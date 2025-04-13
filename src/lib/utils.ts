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

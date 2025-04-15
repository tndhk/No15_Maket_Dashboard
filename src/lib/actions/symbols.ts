'use server';
import { createSymbol } from '@/lib/dal/symbols';

export async function handleFormSubmit(values: { symbol: string; name: string; category: "stock" | "crypto" | "forex" | "index" | "other"; isActive: boolean; description?: string | null; }) {
  try {
    const symbol = await createSymbol(values);
    return { success: true, symbol };
  } catch (error) {
    console.error('Error creating symbol:', error);
    return { success: false, error: '銘柄の登録に失敗しました' };
  }
} 
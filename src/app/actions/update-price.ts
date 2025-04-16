'use server';

import { fetchAndSavePriceData } from "@/lib/api/fetchAndSavePriceData";

export async function updatePriceAction(symbol: string, category: string) {
  await fetchAndSavePriceData(symbol, category);
} 
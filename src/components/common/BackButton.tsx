'use client';

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="text-sm text-blue-500 hover:underline"
    >
      ← 前の画面に戻る
    </button>
  );
} 
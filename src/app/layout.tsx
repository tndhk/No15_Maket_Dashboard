import "./globals.css";
import type { Metadata } from "next";
import { RootLayout } from "@/components/layouts/RootLayout";

export const metadata: Metadata = {
  title: "金融データダッシュボード",
  description: "リアルタイムデータと過去のトレンドを視覚的に把握できる金融データトラッキングプラットフォーム",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}

import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { jaJP } from "@clerk/localizations";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Inter } from "next/font/google";
import BackButton from "@/components/common/BackButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "金融データダッシュボード",
  description: "金融データ可視化ツール",
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* サイドバー */}
        <div className="hidden md:flex md:w-64 md:flex-col border-r">
          {/* サイドバーの内容 */}
        </div>
        
        {/* メインコンテンツ */}
        <div className="flex-1 pt-16 pb-12 px-4 md:px-6">
          {/* 戻るリンク */}
          <div className="mb-4">
            <BackButton />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={jaJP}>
      <html lang="ja" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            defaultTheme="system"
            storageKey="finance-dashboard-theme"
          >
            <RootLayout>{children}</RootLayout>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

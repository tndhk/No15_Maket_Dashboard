import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "認証 - 金融データダッシュボード",
  description: "ログインまたは新規アカウント作成",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {children}
    </div>
  );
} 
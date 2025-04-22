import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-4">金融データダッシュボード</h1>
        <p className="text-muted-foreground dark:text-gray-300">
          リアルタイムデータと過去のトレンドを視覚的に把握できるインタラクティブなプラットフォームです。
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg shadow-md flex flex-col h-full">
          <h2 className="text-xl font-semibold mb-3">銘柄監視</h2>
          <p className="text-muted-foreground dark:text-gray-300 mb-4">
            お気に入りの銘柄をリアルタイムで監視し、価格変動を追跡できます。
          </p>
          <div className="mt-auto">
            <Button asChild>
              <Link href="/symbols">銘柄を追加</Link>
            </Button>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-md flex flex-col h-full">
          <h2 className="text-xl font-semibold mb-3">トレンド分析</h2>
          <p className="text-muted-foreground dark:text-gray-300 mb-4">
            過去のデータを分析し、市場動向やトレンドを把握できます。
          </p>
          <div className="mt-auto">
            <Button asChild>
              <Link href="/dashboard">分析を開始</Link>
            </Button>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-md flex flex-col h-full">
          <h2 className="text-xl font-semibold mb-3">カスタムアラート</h2>
          <p className="text-muted-foreground dark:text-gray-300 mb-4">
            重要な価格変動や市場イベントの通知を設定できます。
          </p>
          <div className="mt-auto">
            <Button asChild>
              <Link href="/settings">アラートを設定</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">最近の更新</h2>
        <div className="space-y-4">
          <div className="border-b pb-3">
            <p className="font-medium">銘柄データの更新</p>
            <CardDescription className="text-sm text-muted-foreground dark:text-gray-300">2023年5月10日 15:30</CardDescription>
          </div>
          <div className="border-b pb-3">
            <p className="font-medium">新機能の追加</p>
            <p className="text-sm text-muted-foreground dark:text-gray-300">2023年5月5日 10:15</p>
          </div>
          <div>
            <p className="font-medium">システムメンテナンス完了</p>
            <p className="text-sm text-muted-foreground dark:text-gray-300">2023年5月1日 08:00</p>
          </div>
        </div>
      </section>
    </div>
  );
}

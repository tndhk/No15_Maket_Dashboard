import Image from "next/image";

export default function Home() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-4">金融データダッシュボード</h1>
        <p className="text-muted-foreground">
          リアルタイムデータと過去のトレンドを視覚的に把握できるインタラクティブなプラットフォームです。
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">銘柄監視</h2>
          <p className="text-muted-foreground mb-4">
            お気に入りの銘柄をリアルタイムで監視し、価格変動を追跡できます。
          </p>
          <div className="mt-auto">
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              銘柄を追加
            </button>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">トレンド分析</h2>
          <p className="text-muted-foreground mb-4">
            過去のデータを分析し、市場動向やトレンドを把握できます。
          </p>
          <div className="mt-auto">
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              分析を開始
            </button>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">カスタムアラート</h2>
          <p className="text-muted-foreground mb-4">
            重要な価格変動や市場イベントの通知を設定できます。
          </p>
          <div className="mt-auto">
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              アラートを設定
            </button>
          </div>
        </div>
      </section>

      <section className="bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">最近の更新</h2>
        <div className="space-y-4">
          <div className="border-b pb-3">
            <p className="font-medium">銘柄データの更新</p>
            <p className="text-sm text-muted-foreground">2023年5月10日 15:30</p>
          </div>
          <div className="border-b pb-3">
            <p className="font-medium">新機能の追加</p>
            <p className="text-sm text-muted-foreground">2023年5月5日 10:15</p>
          </div>
          <div>
            <p className="font-medium">システムメンテナンス完了</p>
            <p className="text-sm text-muted-foreground">2023年5月1日 08:00</p>
          </div>
        </div>
      </section>
    </div>
  );
}

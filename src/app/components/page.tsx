"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ComponentsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-6">共通UIコンポーネント</h1>
        <p className="text-muted-foreground mb-8">
          金融データダッシュボードで使用する基本的なUIコンポーネントの一覧です。
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">ボタン</h2>
        <div className="flex flex-wrap gap-4">
          <Button>標準ボタン</Button>
          <Button variant="secondary">セカンダリ</Button>
          <Button variant="destructive">削除</Button>
          <Button variant="outline">アウトライン</Button>
          <Button variant="ghost">ゴースト</Button>
          <Button variant="link">リンク</Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">カード</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>カードタイトル</CardTitle>
              <CardDescription>カードの説明文をここに記述します。</CardDescription>
            </CardHeader>
            <CardContent>
              <p>カードのコンテンツ部分です。様々な情報を表示できます。</p>
            </CardContent>
            <CardFooter>
              <Button>アクション</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>銘柄情報</CardTitle>
              <CardDescription>株式や仮想通貨の情報を表示</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>現在価格:</span>
                  <span className="font-medium">¥5,432</span>
                </div>
                <div className="flex justify-between">
                  <span>変動率:</span>
                  <span className="text-green-500">+2.5%</span>
                </div>
                <div className="flex justify-between">
                  <span>取引量:</span>
                  <span>1,234,567</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">詳細</Button>
              <Button>お気に入り</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">入力フォーム</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">ユーザー名</label>
              <Input type="text" placeholder="ユーザー名を入力" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">メールアドレス</label>
              <Input type="email" placeholder="メールアドレスを入力" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">パスワード</label>
              <Input type="password" placeholder="パスワードを入力" />
            </div>
            <Button className="w-full">ログイン</Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">銘柄検索</label>
              <div className="flex gap-2">
                <Input type="text" placeholder="銘柄名またはシンボルを入力" />
                <Button>検索</Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">日付範囲</label>
              <div className="flex gap-2">
                <Input type="date" />
                <span className="flex items-center">～</span>
                <Input type="date" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">アラート</h2>
        <div className="space-y-4">
          <Alert>
            <AlertTitle>情報</AlertTitle>
            <AlertDescription>
              システムは正常に動作しています。
            </AlertDescription>
          </Alert>
          
          <Alert variant="destructive">
            <AlertTitle>エラー</AlertTitle>
            <AlertDescription>
              データの取得中にエラーが発生しました。後でもう一度お試しください。
            </AlertDescription>
          </Alert>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">ダイアログ</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>ダイアログを開く</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>確認</DialogTitle>
              <DialogDescription>
                この操作を実行してもよろしいですか？
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>キャンセル</Button>
              <Button onClick={() => setIsDialogOpen(false)}>確認</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
} 
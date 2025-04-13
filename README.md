# 金融データトラッキングダッシュボード

## ローカル開発環境のセットアップ

### 前提条件

- [Node.js](https://nodejs.org/) (v20.0.0 以上)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### 環境変数の設定

1. `.env.example` ファイルをコピーして `.env` ファイルを作成します。

```bash
cp .env.example .env
```

2. `.env` ファイルを編集して、必要な環境変数を設定します。
   - 開発環境では `DATABASE_URL="file:./dev.db"` を使用します（SQLite）
   - Clerk認証用のAPIキーを設定します
   - 外部API（Alpha Vantage、Yahoo Finance、CoinGecko）のキーを設定します

### データベースのセットアップ

```bash
# Prismaマイグレーションを実行
npx prisma migrate dev --name init

# (オプション) サンプルデータを追加
npx prisma db seed
```

### Dockerでの起動方法

```bash
# Dockerコンテナのビルドと起動
docker compose up --build -d

# ログの確認
docker compose logs -f

# コンテナの停止
docker compose down
```

### Dockerなしでの起動方法

```bash
# 依存関係のインストール
npm install --legacy-peer-deps

# 開発サーバーの起動
npm run dev
```

### アクセス方法

アプリケーションは以下のURLでアクセスできます：
- [http://localhost:3000](http://localhost:3000)

### 開発用コマンド

```bash
# コードのリント
npm run lint

# テストの実行
npm test

# ビルド
npm run build

# ビルドしたアプリケーションの起動
npm start

# Prisma Studioの起動（データベース管理ツール）
npx prisma studio
```

## 本番環境へのデプロイ

本番環境へのデプロイについては、[database.md](database.md) を参照してください。

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

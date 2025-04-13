# データベース移行ガイド: SQLite から PostgreSQL

## 概要

このドキュメントでは、金融データトラッキングダッシュボードのデータベースを開発環境のSQLiteから本番環境のPostgreSQLに移行するための手順を説明します。

## 前提条件

- Supabaseアカウントの作成
- PostgreSQLデータベースの作成
- 必要な環境変数の設定

## 移行手順

### 1. Supabaseプロジェクトの作成

1. Supabaseダッシュボードにログイン
2. 「New Project」をクリック
3. プロジェクト名を入力（例：financial-dashboard-prod）
4. 地域を選択（例：東京）
5. パスワードを設定（安全なパスワードを生成して保存）
6. 「Create new project」をクリック

### 2. 接続情報の取得

1. プロジェクトダッシュボードの「Settings」→「Database」に移動
2. 「Connection String」セクションで「URI」を選択
3. 接続文字列をコピー
4. プレースホルダーをあなたのパスワードに置き換え

### 3. 環境変数の設定

以下の環境変数を本番環境（Vercel）で設定します：

```
DATABASE_URL=postgres://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres
```

### 4. スキーマの移行

```bash
# 開発環境で実行
npx prisma db push --preview-feature
```

または、マイグレーションファイルを使用する場合：

```bash
# 開発環境で実行
npx prisma migrate deploy
```

### 5. シードデータの投入（必要な場合）

```bash
# 開発環境で実行
npx prisma db seed
```

### 6. 接続テスト

```bash
# 開発環境で実行
npx prisma studio
```

Prisma Studioで正しく接続できることを確認します。

## トラブルシューティング

### 接続エラー

接続エラーが発生した場合、以下を確認してください：

1. DATABASE_URLが正しく設定されていること
2. データベースのファイアウォール設定で接続が許可されていること
3. IP制限がある場合、デプロイ環境のIPアドレスが許可されていること

### マイグレーションエラー

マイグレーションエラーが発生した場合：

1. 最新の変更を反映したスキーマファイルがあることを確認
2. マイグレーション履歴の競合がないことを確認
3. 必要に応じて `--force` フラグを使用（データロスのリスクあり）

## 注意事項

- 本番環境のデータベース接続情報は機密情報として扱ってください
- バックアップを定期的に取得してください
- データベースの監視を設定してパフォーマンスを確保してください

## 付録: SQLiteからのデータエクスポート

開発環境のデータをエクスポートするには：

```bash
# SQLiteデータをJSONに出力
npx ts-node scripts/export-sqlite-data.ts
```

その後、このJSONデータを使用してPostgreSQLにインポートできます：

```bash
# JSONデータをPostgreSQLにインポート
npx ts-node scripts/import-postgres-data.ts
```

（注：これらのスクリプトはプロジェクトに含める必要があります） 
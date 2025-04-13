import { test, expect } from '@playwright/test';

// 認証をスキップするためのモックオブジェクト
// Note: 実際の環境ではClerkを使用した認証が必要です
// テスト用に認証をバイパスするスクリプトが必要かもしれません

test.describe('ダッシュボードテスト', () => {
  test.beforeEach(async ({ page }) => {
    // 各テスト前にホームページに移動
    // 実際のテストでは認証が必要ですが、ここではスキップします
    await page.goto('/');
  });

  test('ホームページが正しく表示されること', async ({ page }) => {
    // ページタイトルの確認
    const title = await page.title();
    expect(title).toContain('マーケットダッシュボード');

    // ナビゲーションメニューの確認
    await expect(page.getByRole('link', { name: 'ダッシュボード' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'シンボル' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'お気に入り' })).toBeVisible();
  });

  test('シンボル一覧ページが正しく表示されること', async ({ page }) => {
    // シンボルページに移動
    await page.getByRole('link', { name: 'シンボル' }).click();
    
    // ページ見出しの確認
    const heading = page.getByRole('heading', { name: 'シンボル一覧' });
    await expect(heading).toBeVisible();

    // シンボルテーブルが表示されていることを確認
    const symbolsTable = page.locator('table');
    await expect(symbolsTable).toBeVisible();

    // 検索フォームが表示されていることを確認
    const searchForm = page.getByPlaceholder('シンボル名で検索...');
    await expect(searchForm).toBeVisible();
  });

  test('シンボル詳細ページが正しく表示されること', async ({ page }) => {
    // シンボルページに移動
    await page.getByRole('link', { name: 'シンボル' }).click();
    
    // 最初のシンボル行をクリック（存在すると仮定）
    const firstSymbolRow = page.locator('table tbody tr').first();
    await firstSymbolRow.getByRole('link').first().click();
    
    // シンボル詳細カードが表示されていることを確認
    const symbolDetailCard = page.locator('.card');
    await expect(symbolDetailCard).toBeVisible();

    // タブが表示されていることを確認
    await expect(page.getByRole('tab', { name: 'チャート' })).toBeVisible();
    await expect(page.getByRole('tab', { name: '価格履歴' })).toBeVisible();
  });

  test('お気に入りページが正しく表示されること', async ({ page }) => {
    // お気に入りページに移動
    await page.getByRole('link', { name: 'お気に入り' }).click();
    
    // ページ見出しの確認
    const heading = page.getByRole('heading', { name: 'お気に入り' });
    await expect(heading).toBeVisible();
  });

  test('シンボル登録ページが正しく表示されること', async ({ page }) => {
    // シンボルページに移動
    await page.getByRole('link', { name: 'シンボル' }).click();
    
    // シンボル登録ボタンをクリック
    await page.getByRole('link', { name: '新規シンボル登録' }).click();
    
    // ページ見出しの確認
    const heading = page.getByRole('heading', { name: 'シンボル登録' });
    await expect(heading).toBeVisible();

    // フォーム要素が表示されていることを確認
    await expect(page.getByLabel('シンボル名')).toBeVisible();
    await expect(page.getByLabel('コード')).toBeVisible();
    await expect(page.getByLabel('カテゴリ')).toBeVisible();
    await expect(page.getByRole('button', { name: '登録' })).toBeVisible();
  });
});

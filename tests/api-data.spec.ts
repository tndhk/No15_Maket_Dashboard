import { test, expect } from '@playwright/test';

test.describe('API機能テスト', () => {
  test.beforeEach(async ({ page }) => {
    // ホームページに移動
    await page.goto('/');
  });

  test('シンボル詳細ページでデータ更新機能が利用できる', async ({ page }) => {
    // テスト用のシンボルIDを指定（実際のデータに応じて変更）
    const testSymbolId = 1;
    await page.goto(`/symbols/${testSymbolId}`);
    
    // ローディング状態の処理
    await page.waitForSelector('h1', { state: 'visible' });
    
    // 価格データ更新フォームが存在するか確認
    await expect(page.getByText('価格データ更新')).toBeVisible();
    
    // データソース選択が存在するか確認
    await expect(page.getByText('データソース')).toBeVisible();
    await expect(page.getByLabel('Alpha Vantage')).toBeVisible();
    await expect(page.getByLabel('Yahoo Finance')).toBeVisible();
    await expect(page.getByLabel('CoinGecko')).toBeVisible();
    
    // 更新ボタンが存在するか確認
    const updateButton = page.getByRole('button', { name: '価格データを取得' });
    await expect(updateButton).toBeVisible();
    
    // 実際の更新処理はモックできるようにする（テスト環境ではAPIを実行しない）
    // 実際のAPIコールをシミュレートする場合はここでネットワークリクエストをインターセプト
  });

  test('シンボル一覧から詳細ページに遷移できる', async ({ page }) => {
    await page.goto('/symbols');
    
    // テーブルが表示されるまで待機
    await page.waitForSelector('table', { state: 'visible' });
    
    // 最初の行のリンクを取得（または特定の行を選択）
    const firstRowLink = page.locator('table tbody tr').first().locator('a');
    
    // リンクのhref属性を取得
    const href = await firstRowLink.getAttribute('href');
    expect(href).toBeTruthy();
    
    // リンクをクリック
    await firstRowLink.click();
    
    // 詳細ページに移動したことを確認
    await expect(page.getByText('シンボル詳細')).toBeVisible();
  });

  test('シンボル検索機能が正しく動作する', async ({ page }) => {
    await page.goto('/symbols');
    
    // 検索フォームが表示されるまで待機
    const searchInput = page.getByPlaceholder('シンボルや名前で検索...');
    await expect(searchInput).toBeVisible();
    
    // テスト用の検索キーワードを入力
    await searchInput.fill('AAPL');
    await searchInput.press('Enter');
    
    // 検索結果が表示されるまで待機（検索処理完了の指標となる要素）
    await page.waitForLoadState('networkidle');
    
    // 検索結果が表示されていることを確認
    // 注: 実際のデータが必要、テスト環境では検索結果をモックできるとよい
  });

  test('お気に入り機能が正しく動作する', async ({ page }) => {
    // テスト用のシンボルIDを指定（実際のデータに応じて変更）
    const testSymbolId = 1;
    await page.goto(`/symbols/${testSymbolId}`);
    
    // お気に入りボタンが表示されるまで待機
    const favoriteButton = page.getByRole('button').filter({ hasText: 'お気に入り' });
    await expect(favoriteButton).toBeVisible();
    
    // ボタンの初期状態を確認（星が塗りつぶされているかどうか）
    // 注: 実際のUIデザインによって確認方法は変わる
    
    // お気に入りボタンをクリック
    await favoriteButton.click();
    
    // ボタンの状態が変わったことを確認
    // 注: 実際のUIによって確認方法は変わる
    
    // お気に入りページに移動して追加されたことを確認
    await page.goto('/favorites');
    await page.waitForSelector('table', { state: 'visible' });
    
    // お気に入りリストにシンボルが表示されているか確認
    // 注: 実際のデータが必要、テスト環境では結果をモックできるとよい
  });
}); 
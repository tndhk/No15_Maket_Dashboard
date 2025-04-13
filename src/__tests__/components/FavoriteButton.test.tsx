import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FavoriteButton } from '@/components/features/favorites/FavoriteButton';

// モックの作成
jest.mock('@/lib/dal/favorites', () => ({
  addFavorite: jest.fn(() => Promise.resolve({ id: 1, symbolId: 123, userId: 'test-user' })),
  removeFavorite: jest.fn(() => Promise.resolve({ success: true })),
  checkIsFavorite: jest.fn(() => Promise.resolve(false)),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  }
}));

describe('FavoriteButton', () => {
  const mockProps = {
    symbolId: 123,
    initialIsFavorite: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('デフォルトではお気に入りではない状態で表示される', async () => {
    render(<FavoriteButton {...mockProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    
    // デフォルトでは星は塗りつぶされていない
    expect(button.innerHTML).toContain('Star');
    expect(button.innerHTML).not.toContain('StarFilled');
  });

  test('初期状態がお気に入りの場合、塗りつぶされた星が表示される', async () => {
    render(<FavoriteButton {...mockProps} initialIsFavorite={true} />);
    
    const button = screen.getByRole('button');
    
    // 塗りつぶされた星が表示されるはず
    await waitFor(() => {
      expect(button.innerHTML).toContain('StarFilled');
    });
  });

  test('ボタンをクリックするとお気に入り状態が切り替わる', async () => {
    const { rerender } = render(<FavoriteButton {...mockProps} />);
    
    const button = screen.getByRole('button');
    
    // 最初はお気に入りでない
    expect(button.innerHTML).toContain('Star');
    
    // ボタンをクリック
    fireEvent.click(button);
    
    // お気に入りに追加される処理中
    expect(button.getAttribute('aria-disabled')).toBe('true');
    
    // お気に入りに追加された後
    await waitFor(() => {
      expect(button.innerHTML).toContain('StarFilled');
    });
    
    // addFavoriteが呼ばれたことを確認
    const { addFavorite } = require('@/lib/dal/favorites');
    expect(addFavorite).toHaveBeenCalledWith(mockProps.symbolId);
    
    // 再レンダリングしてinitialIsFavoriteをtrueに変更
    rerender(<FavoriteButton {...mockProps} initialIsFavorite={true} />);
    
    // 再度クリック（お気に入りから削除）
    fireEvent.click(button);
    
    // お気に入りから削除された後
    await waitFor(() => {
      expect(button.innerHTML).toContain('Star');
    });
    
    // removeFavoriteが呼ばれたことを確認
    const { removeFavorite } = require('@/lib/dal/favorites');
    expect(removeFavorite).toHaveBeenCalledWith(mockProps.symbolId);
  });

  test('アイコンのみモードでもボタンが正しく表示される', () => {
    render(<FavoriteButton {...mockProps} iconOnly={true} />);
    
    const button = screen.getByRole('button');
    
    // テキストがないことを確認
    expect(button.textContent).not.toContain('お気に入り');
  });
}); 
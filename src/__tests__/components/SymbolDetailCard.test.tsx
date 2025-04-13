import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SymbolDetailCard from '@/components/features/symbols/SymbolDetailCard';

describe('SymbolDetailCard', () => {
  const mockProps = {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    category: 'stock',
    status: 'active',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-15'),
    description: 'テスト詳細',
    id: 123
  };

  test('全ての情報が正しく表示される', () => {
    render(<SymbolDetailCard {...mockProps} />);
    
    // ヘッダー
    expect(screen.getByText('シンボル詳細')).toBeInTheDocument();
    
    // 基本情報
    expect(screen.getByText('シンボル')).toBeInTheDocument();
    expect(screen.getByText('AAPL')).toBeInTheDocument();
    
    expect(screen.getByText('名前')).toBeInTheDocument();
    expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
    
    expect(screen.getByText('カテゴリー')).toBeInTheDocument();
    expect(screen.getByText('株式')).toBeInTheDocument();
    
    expect(screen.getByText('ステータス')).toBeInTheDocument();
    expect(screen.getByText('有効')).toBeInTheDocument();
    
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    
    expect(screen.getByText('作成日')).toBeInTheDocument();
    expect(screen.getByText('2023-01-01')).toBeInTheDocument();
    
    expect(screen.getByText('更新日')).toBeInTheDocument();
    expect(screen.getByText('2023-01-15')).toBeInTheDocument();
    
    // 説明文
    expect(screen.getByText('説明')).toBeInTheDocument();
    expect(screen.getByText('テスト詳細')).toBeInTheDocument();
  });

  test('説明がない場合は説明セクションが表示されない', () => {
    const propsWithoutDescription = {
      ...mockProps,
      description: null
    };
    
    render(<SymbolDetailCard {...propsWithoutDescription} />);
    
    expect(screen.queryByText('説明')).not.toBeInTheDocument();
  });

  test('非アクティブなステータスが正しく表示される', () => {
    const inactiveProps = {
      ...mockProps,
      status: 'inactive'
    };
    
    render(<SymbolDetailCard {...inactiveProps} />);
    
    expect(screen.getByText('無効')).toBeInTheDocument();
  });

  test('異なるカテゴリーが正しく表示される', () => {
    const cryptoProps = {
      ...mockProps,
      category: 'crypto'
    };
    
    render(<SymbolDetailCard {...cryptoProps} />);
    
    expect(screen.getByText('仮想通貨')).toBeInTheDocument();
  });
}); 
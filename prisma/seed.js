import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding the database...');

  // サンプルシンボルの作成
  const symbols = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      description: 'アメリカのテクノロジー企業',
      category: 'stock',
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      description: 'アメリカのソフトウェア企業',
      category: 'stock',
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      description: 'Googleの親会社',
      category: 'stock',
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      description: '仮想通貨の一種',
      category: 'crypto',
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      description: 'スマートコントラクトプラットフォーム',
      category: 'crypto',
    },
  ];

  // シンボルの一括作成
  for (const symbolData of symbols) {
    const symbol = await prisma.symbol.upsert({
      where: { symbol: symbolData.symbol },
      update: {},
      create: symbolData,
    });

    console.log(`Created symbol: ${symbol.symbol}`);

    // 各シンボルのサンプル価格データを作成
    const now = new Date();
    const prices = Array(30)
      .fill(0)
      .map((_, i) => {
        const basePrice = symbolData.category === 'crypto' 
          ? Math.random() * 50000 + 1000
          : Math.random() * 500 + 50;
          
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        const open = basePrice * (1 + (Math.random() - 0.5) * 0.02);
        const close = basePrice * (1 + (Math.random() - 0.5) * 0.02);
        const high = Math.max(open, close) * (1 + Math.random() * 0.01);
        const low = Math.min(open, close) * (1 - Math.random() * 0.01);
        const volume = Math.floor(Math.random() * 1000000) + 100000;
        
        return {
          symbolId: symbol.id,
          date,
          open,
          high,
          low,
          close,
          volume,
        };
      });

    // 各価格データを個別に作成
    for (const price of prices) {
      await prisma.price.create({
        data: price,
      });
    }

    console.log(`Created ${prices.length} price records for ${symbol.symbol}`);
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

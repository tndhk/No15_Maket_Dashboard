FROM node:20-slim

# 必要なツールのインストール
RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps

# Prisma関連のファイルをコピー
COPY prisma ./prisma/

# Prisma Clientを生成
RUN npx prisma generate

# アプリケーションの残りのファイルをコピー
COPY . .

EXPOSE 3000

# デフォルトコマンド（docker-compose.ymlでオーバーライドされる）
CMD ["npm", "run", "dev"] 
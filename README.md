# Ikigai Quiz

このプロジェクトは、ユーザーの生きがい（Ikigai）を探求するためのインタラクティブなクイズアプリケーションです。Next.js、Prisma、TypeScriptを使用して構築されています。

## 技術スタック

- **フロントエンド**
  - Next.js 14
  - React 18
  - TailwindCSS
  - TypeScript

- **バックエンド**
  - Prisma (ORM)
  - PostgreSQL
  - Node.js

## セットアップ手順

1. リポジトリをクローンします：
   ```bash
   git clone [repository-url]
   cd ikigai-quiz
   ```

2. 依存関係をインストールします：
   ```bash
   npm install
   ```

3. 環境変数を設定します：
   - `.env`ファイルを作成し、必要な環境変数を設定します：
     ```
     DATABASE_URL="your-database-url"
     ```

4. データベースをセットアップします：
   ```bash
   npm run prisma:generate
   npm run prisma:push
   npm run prisma:seed
   ```

5. 開発サーバーを起動します：
   ```bash
   npm run dev
   ```

アプリケーションは http://localhost:3000 で実行されます。

## スクリプト

- `npm run dev` - 開発サーバーを起動
- `npm run build` - プロダクションビルドを作成
- `npm run start` - プロダクションサーバーを起動
- `npm run lint` - コードの静的解析を実行
- `npm run prisma:generate` - Prismaクライアントを生成
- `npm run prisma:push` - データベーススキーマを更新
- `npm run prisma:seed` - 初期データを投入

## プロジェクト構造

```
ikigai-quiz/
├── app/           # Next.jsアプリケーションのソースコード
├── prisma/        # Prismaの設定とスキーマ
├── public/        # 静的ファイル
└── components/    # Reactコンポーネント
```

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。 
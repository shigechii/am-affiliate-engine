# am-affiliate-engine

DMMアフィリエイト商品の自動収集、Neon (PostgreSQL) / Drizzle ORM による価格履歴トラッキング、Next.js による programmatic SEO (pSEO) 自動生成、および X (Twitter) 自動告知システムを備えたアフィリエイトポータルエンジン。

---

## 📚 ドキュメント & 本番準備

- [本番稼働インフラ・アカウント準備タスク (docs/PRODUCTION_SETUP.md)](./docs/PRODUCTION_SETUP.md)
  - DMM API, Neon DB, X (Twitter) API, Vercel, 独自ドメイン, Google Search Console などの準備チェックリスト。

---

## 🛠 開発手順 (Getting Started)

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. 環境変数の設定

`.env.local` を作成し、必要な環境変数を設定してください。

```bash
cp .env.example .env.local
```

### 3. 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスします。

---

## 🧪 スクリプト・検証コマンド

```bash
# スクリプトテスト実行
pnpm tsx scripts/hello.ts

# Lint & ビルド検証
pnpm lint && pnpm build

# DB 関連コマンド
pnpm db:generate
pnpm db:migrate
```


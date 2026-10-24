# 本番稼働向けインフラ・アカウント準備タスクガイド (PRODUCTION_SETUP.md)

本ドキュメントは、`am-affiliate-engine` の本番公開（プロダクション稼働）および自動運用を開始するために必要な、アカウント発行・APIキー取得・インフラ構築・環境変数設定などのタスクを集約したチェックリストです。

開発（Phase 1〜Phase 3）と並行して、特に **Phase 2 の着手タイミング** までに以下の事前準備を進めてください。

---

## 📋 1. アカウント・APIキー取得タスク (Phase 2 並行推進推奨)

### ① DMM Web API (データ収集・アフィリエイトリンク用)
- [ ] [DMM アフィリエイト](https://affiliate.dmm.com/) アカウントの作成・申請
- [ ] [DMM Web API アソシエイト](https://affiliate.dmm.com/api/) にて API アソシエイト ID（API ID）および アフィリエイト ID（PID）を取得
- [ ] 取得するキー:
  - `DMM_API_ID`: API 接続用 ID
  - `DMM_AFFILIATE_ID`: アフィリエイト報酬トラッキング用 ID (例: `xxxx-990`)

### ② Neon PostgreSQL (本番データベース)
- [ ] [Neon](https://neon.tech/) にサインアップし、本番用プロジェクトを作成
- [ ] データベース接続文字列 (`DATABASE_URL`) を取得
  - 例: `postgresql://user:pass@ep-xxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`

### ③ X (Twitter) API v2 (セール情報自動投稿用)
- [ ] [X Developer Portal](https://developer.x.com/) で Developer アカウントを申請
- [ ] プロジェクト / App を作成し、アクセス権限を **"Read and Write"** に設定
- [ ] 以下の 4 つの認証キーを発行:
  - `X_API_KEY` (Consumer Key)
  - `X_API_SECRET` (Consumer Secret)
  - `X_ACCESS_TOKEN`
  - `X_ACCESS_TOKEN_SECRET`

---

## 🔐 2. 環境変数 (Secrets) の設定タスク

取得したキーは、GitHub Actions（バッチ実行用）および Vercel（Webフロントエンド用）のそれぞれの環境変数に登録します。

### GitHub Repository Secrets (`Settings > Secrets and variables > Actions`)
- [ ] `DATABASE_URL`
- [ ] `DMM_API_ID`
- [ ] `DMM_AFFILIATE_ID`
- [ ] `X_API_KEY`
- [ ] `X_API_SECRET`
- [ ] `X_ACCESS_TOKEN`
- [ ] `X_ACCESS_TOKEN_SECRET`

### Vercel Environment Variables (`Project Settings > Environment Variables`)
- [ ] `DATABASE_URL`
- [ ] `DMM_API_ID`
- [ ] `DMM_AFFILIATE_ID`
- [ ] `NEXT_PUBLIC_SITE_URL` (例: `https://your-domain.com`)

---

## 🚀 3. デプロイ・ドメイン・SEO基盤構築タスク

### ① Vercel ホスティング環境
- [ ] [Vercel](https://vercel.com/) に GitHub リポジトリ (`am-affiliate-engine`) を連携
- [ ] Production (`main` ブランチ) および Preview (`dev` ブランチ) の自動デプロイを設定

### ② データベースマイグレーション
- [ ] 本番 Neon DB に対して初期スキーママイグレーションを実行
  ```bash
  DATABASE_URL="postgresql://..." pnpm db:migrate
  ```

### ③ 独自ドメイン & DNS 設定
- [ ] ドメイン取得サービス（お名前.com, Cloudflare, Value Domain 等）でドメインを取得
- [ ] Vercel にカスタムドメインを追加し、DNS（CNAME / A レコード）を設定

### ④ SEO & クローラー設定
- [ ] [Google Search Console](https://search.google.com/search-console) にサイトを登録（DNS テキストレコード検証）
- [ ] Dynamic Sitemap (`https://your-domain.com/sitemap.xml`) を Google Search Console へ送信
- [ ] Google Analytics 4 (GA4) の測定 ID 発行および測定タグの設定

---

## ⚖️ 4. 法的表記・規約対応タスク

- [ ] **プライバシーポリシーページの設置**
  - アフィリエイトプログラム（DMMアフィリエイト）への参加表記
  - アクセス解析ツール（Google Analytics等）による Cookie 使用に関する表記
- [ ] **免責事項・特定商取引法に基づく表記の確認**
  - 価格情報や在庫の変動に関する免責事項の記載
- [ ] **お問い合わせ窓口（フォームまたは公式 X アカウント）の設置**

---

## 🔔 5. 運用監視・アラート対応タスク

- [ ] GitHub Actions の Cron バッチ（データ同期・X自動投稿）失敗時の通知設定（Webhook経由で Slack / Discord または メール通知）
- [ ] 本番環境エラー監視ツール（Sentry 等）の導入検討

# Development Rules for AI Agent

## Issue & Branch Rules
- タスク着手時は必ず対象のIssue番号を確認し、ブランチ `feature/issue-<番号>-<概要>` を切って作業すること。
- 作業完了時は必ず `npm run build` および `npm run lint` がローカルで通ることを確認すること。

## Pull Request Rules
- PR作成時は本文の冒頭に `Closes #<番号>` を必ず含めること。
- PR本文には「変更概要」「実装した主要な関数/コンポーネント」「テスト結果」を簡潔に記載すること。
- GitHub CLI（gh）を使用してPRを作成すること。

## Project Phases
- Phase 1: ニッチ特化の最小構成、DMM APIバッチ連携、Next.js ISR構築、インデックス検証
- Phase 2: 最安値履歴トラッカー、CVR改善、通知導線
- Phase 3: カテゴリ横展開、マルチドメイン自動化

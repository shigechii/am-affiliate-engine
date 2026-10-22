#!/usr/bin/env bash
set -euo pipefail

# リポジトリ名取得（owner/repo）
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)

echo "Setting up branch protection for ${REPO}..."

# main ブランチの保護ルール（直接push禁止・PR必須・Force Push禁止）
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  "/repos/${REPO}/branches/main/protection" \
  --input - <<EOF
{
  "required_status_checks": null,
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": false,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 0
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
EOF

echo "main branch protection applied successfully."
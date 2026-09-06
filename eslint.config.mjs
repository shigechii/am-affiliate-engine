import nextConfig from "eslint-config-next";
import prettierConfig from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  ...nextConfig,
  prettierConfig,
  {
    rules: {
      // 固有ルールがあればここに追加
    },
  },
];

export default eslintConfig;
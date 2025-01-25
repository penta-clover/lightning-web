import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*"], // 프로젝트 전체에 적용할 기본 규칙
    rules: {
      "no-unused-vars": "warning", // 기본적으로 unused-vars 규칙 활성화
    },
  },
  {
    files: ["components/ui/**/*"], // 특정 폴더에만 적용
    rules: {
      "no-unused-vars": "off", // 특정 폴더에 대해 규칙 비활성화
    },
  },
];

export default eslintConfig;

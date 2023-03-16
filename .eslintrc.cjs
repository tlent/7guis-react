module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict",
    "plugin:unicorn/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  ignorePatterns: ["*.config.ts", "*.config.cjs", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint"],
  root: true,
  rules: {
    "unicorn/prevent-abbreviations": [
      "error",
      {
        replacements: {
          props: {
            properties: false,
          },
        },
      },
    ],
    "unicorn/no-useless-undefined": ["error", { checkArguments: false }],
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};

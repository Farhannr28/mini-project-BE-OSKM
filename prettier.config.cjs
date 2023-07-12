/** @type {import("prettier").Config} */
const config = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  bracketSpacing: true,
  trailingComma: "none",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  jsxSingleQuote: true,
  arrowParens: "always",
  endOfLine: "auto"
};

module.exports = config;

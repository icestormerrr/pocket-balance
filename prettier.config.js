export default {
  bracketSpacing: false,
  semi: true,
  trailingComma: "es5",
  arrowParens: "avoid",
  printWidth: 120,
  tabWidth: 2,
  // Load the Tailwind plugin last for compatibility with import organization.
  plugins: ["prettier-plugin-organize-imports", "prettier-plugin-tailwindcss"],
  // Read the Tailwind CSS v4 theme and custom utilities to determine class order.
  tailwindStylesheet: "./src/app/styles/globals.css",
  // Sort class strings inside these function calls, in addition to JSX className attributes.
  tailwindFunctions: ["cn", "clsx", "cva", "twMerge"],
};

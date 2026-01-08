import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default tseslint.config(
  {
    ignores: ["dist", "build", "node_modules"]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        React: "readonly", 
      },
    },
    plugins: {
      "react": pluginReact,
    },
    settings: {
      react: { version: "detect" }
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      
      "no-undef": "off", 

      "@typescript-eslint/no-empty-object-type": "off",

      "no-useless-escape": "off",

      "eslint-comments/no-unused-disable": "off",
      
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  }
);
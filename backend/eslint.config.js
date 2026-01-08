import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.node, 
        ...globals.jest, 
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "off", 
      "no-console": "off",    
      "no-empty": ["error", { "allowEmptyCatch": true }],
    },
  },
  
  {
    ignores: [
      "node_modules", 
      "dist", 
      "build", 
      "tests", 
      "tempCodeRunnerFile.js"
    ],
  },
];
import { base } from "../../eslint.config.mjs";

export default [
  ...base,
  {
    rules: {
      "@typescript-eslint/no-extraneous-class": "off",
    },
  },
];

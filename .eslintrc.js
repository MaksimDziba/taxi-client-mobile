module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/essential",
    "plugin:vue/strongly-recommended",
    "plugin:vue/recommended",
    "@vue/prettier",
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    parser: "@babel/eslint-parser",
  },
  rules: {
    "no-param-reassign": "off",
    curly: ["error", "all"],
    "no-confusing-arrow": ["error", { allowParens: true }],
    "no-tabs": "error",
    "no-unexpected-multiline": "error",
    "prefer-template": "error",
    "for-direction": "error",
    "padding-line-between-statements": [
      "error",
      { blankLine: "always", prev: "*", next: ["return"] },
      { blankLine: "always", prev: "*", next: ["block-like"] },
    ],
    "object-property-newline": "error",
    "no-else-return": ["error", { allowElseIf: true }],
    "no-self-assign": "error", // https://eslint.org/docs/rules/no-self-assign
    yoda: "error", // https://eslint.org/docs/rules/yoda
    "arrow-body-style": ["error", "as-needed"], // https://eslint.org/docs/rules/arrow-body-style
    "arrow-parens": ["error", "as-needed"],
    "prefer-const": "error",
    "object-shorthand": [
      "error",
      "always",
      { avoidExplicitReturnArrows: true },
    ],
    "block-spacing": "error",
    "prefer-destructuring": [
      "error",
      {
        VariableDeclarator: { object: true },
        AssignmentExpression: { object: false },
      },
      { enforceForRenamedProperties: false },
    ],
    "space-before-function-paren": [
      "error",
      {
        anonymous: "never",
        named: "never",
        asyncArrow: "always",
      },
    ],
    "vue/attributes-order": [
      "error",
      {
        order: [
          "CONDITIONALS",
          "DEFINITION",
          "LIST_RENDERING",
          ["UNIQUE", "SLOT"],
          "GLOBAL",
          "OTHER_ATTR",
          "OTHER_DIRECTIVES",
          "TWO_WAY_BINDING",
          "CONTENT",
          "RENDER_MODIFIERS",
          "EVENTS",
        ],
        alphabetical: false,
      },
    ],
    "vue/component-tags-order": [
      "error",
      {
        order: ["template", "script", "style"],
      },
    ],
    "vue/order-in-components": [
      "error",
      {
        order: [
          "name",
          "components",
          "extends",
          ["provide", "inject"],
          "props",
          "ROUTER_GUARDS",
          "validate",
          "data",
          "computed",
          "watch",
          "LIFECYCLE_HOOKS",
          "methods",
        ],
      },
    ],
    "vue/component-name-in-template-casing": [
      "error",
      "kebab-case",
      {
        registeredComponentsOnly: true,
      },
    ],
    "vue/custom-event-name-casing": ["error", "kebab-case"],
    "vue/no-template-target-blank": [
      "error",
      {
        allowReferrer: true,
        enforceDynamicLinks: "always",
      },
    ],
    "vue/no-unused-properties": [
      "error",
      {
        groups: ["props", "computed"],
      },
    ],
    "vue/padding-line-between-blocks": ["error", "always"],
    "vue/require-name-property": ["error"],
    "vue/v-for-delimiter-style": ["error", "in"],
    "vue/max-attributes-per-line": "off",
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-console":
      process.env.NODE_ENV === "production"
        ? ["warn", { allow: ["info", "error"] }]
        : "off",
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
      ],
      env: {
        jest: true,
      },
    },
  ],
};

/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-sass-guidelines',
    'stylelint-config-recess-order',
  ],
  rules: {
    'declaration-block-single-line-max-declarations': 1,
    '@stylistic/declaration-block-semicolon-newline-after': 'always',
    '@stylistic/block-opening-brace-newline-after': 'always-multi-line',
    '@stylistic/declaration-colon-space-after': 'always-single-line',
    '@stylistic/function-parentheses-space-inside': 'never-single-line',
    'declaration-empty-line-before': null,
    'custom-property-empty-line-before': null,
    'max-nesting-depth': 3,
    'selector-class-pattern': '[a-z\-_]+',
    'selector-no-qualifying-type': null,
  },
};

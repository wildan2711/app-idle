module.exports = {
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  plugins: [
    'prettier',
    '@typescript-eslint'
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  // add your custom rules here
  rules: {
    'arrow-parens': ['error', 'always'],
    'no-console': 'off',
    'space-before-function-paren': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { 'args': 'none' }],
    '@typescript-eslint/no-var-requires': 'off'
  }
}

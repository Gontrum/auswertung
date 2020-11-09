module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'airbnb-base'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'arrow-parens': [2, 'as-needed', { requireForBlockBody: true }],
    'comma-dangle': ['error', 'never'],
    'import/no-extraneous-dependencies': [
      'error', { devDependencies: ['config/*', 'postcss.config.js'] }
    ],
    semi: [2, 'never'],
    'no-console': ['error', { allow: ['warn', 'error'] }]
  }
}

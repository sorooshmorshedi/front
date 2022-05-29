module.exports = {
  plugins: ['cypress'],
  env: {
    mocha: true,
    'cypress/globals': false,
  },
  rules: {
    strict: 'off',
  },
};

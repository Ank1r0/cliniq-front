module.exports = {
    extends: ['react-app', 'react-app/jest', 'plugin:prettier/recommended'],
    plugins: ['prettier'],
    rules: {
        'import/no-anonymous-default-export': 'off',
        'import/no-webpack-loader-syntax': 'off',
        'prettier/prettier': ['warn', { endOfLine: 'auto' }],
        'react-hooks/exhaustive-deps': 'off',
    },
};

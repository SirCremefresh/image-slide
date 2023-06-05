module.exports = {
    env: {browser: true, es2020: true},
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:import/recommended',
        'plugin:import/react',
        'plugin:import/typescript',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {ecmaVersion: 'latest', sourceType: 'module'},
    plugins: ['react-refresh', 'import'],
    rules: {
        'react-refresh/only-export-components': 'warn',
        "import/no-unused-modules": [1, {"unusedExports": true}]
    },
    settings: {
        "import/resolver": {
            "typescript": {
                "project": [
                    "tsconfig.json",
                    "functions/tsconfig.json"
                ],
            }
        }
    }
}

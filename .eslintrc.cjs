module.exports = {
    env: {browser: true, es2020: true},
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:import/recommended',
        'plugin:import/react',
        'plugin:import/typescript',
        "plugin:tailwindcss/recommended",
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {ecmaVersion: 'latest', sourceType: 'module'},
    plugins: ['react-refresh', 'import'],
    rules: {
        'react-refresh/only-export-components': 'warn',
        "import/no-unused-modules": [1, {"unusedExports": true}],
        "sort-imports": ["error", {
            "ignoreCase": false,
            "ignoreDeclarationSort": true,
            "ignoreMemberSort": false,
            "memberSyntaxSortOrder": ["none", "all", "single", "multiple"]
        }],
    },
    settings: {
        "import/resolver": {
            "typescript": {
                "project": [
                    "tsconfig.json",
                    "functions/tsconfig.json"
                ],
            }
        },
        tailwindcss: {
            callees: ["classnames", "classNames", "clsx", "ctl"],
            removeDuplicates: true,
        },
    }
}

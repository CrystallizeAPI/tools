module.exports = {
    extends: ['@commitlint/config-conventional'],
    parserPreset: '@commitlint/config-conventional',
    formatter: '@commitlint/format',
    rules: {
        'subject-case': [0, 'never'],
    },
    ignores: [],
    defaultIgnores: true,
    helpUrl: 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint',
};

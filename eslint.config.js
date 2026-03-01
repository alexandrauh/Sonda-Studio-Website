import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfigWithVueTs(
    {
        name: 'app/files-to-lint',
        files: ['**/*.{ts,mts,tsx,vue}']
    },
    {
        name: 'app/files-to-ignore',
        ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/node_modules/**', '.mcp-servers/**']
    },
    pluginVue.configs['flat/recommended'],
    vueTsConfigs.recommended,
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^props$' }],
            'prefer-const': 'warn',
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'vue/multi-word-component-names': 'off'
        }
    },
    skipFormatting
)

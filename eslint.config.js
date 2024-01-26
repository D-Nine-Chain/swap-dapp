// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    unocss: true,
    formatters: true,
    rules: {
      'no-console': 'off',
      'no-debugger': 'warn',
      'unused-imports/no-unused-vars': 'warn',
    },
  },
)

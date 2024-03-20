import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWebFonts,
  presetWind,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { presetExtra } from 'unocss-preset-extra'

export default defineConfig({
  shortcuts: [
    ['col', 'flex flex-col'],
    ['row', 'flex flex-row'],
    ['w-limited', 'max-w-[var(--content-max-width)] px-[var(--content-x-padding)] mx-auto'],
    ['align-central', 'items-center justify-center'],
  ],
  theme: {
    colors: {
      'bg': 'var(--home-background)',
      'brand-gradient': 'var(--gradient)',
      'brand': 'var(--brand)',
    },
  },
  presets: [
    presetWind(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetTypography(),
    presetWebFonts({
      provider: 'fontshare',
      fonts: {
        sans: 'Satoshi',
        serif: 'Stardom',
        mono: 'JetBrains Mono',
      },
    }),
    presetExtra(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  safelist: 'prose m-auto text-left text-center flex grid'.split(' '),
})

import type { MaybeRefOrGetter } from '@vueuse/core'
import { availableLocales, loadLanguageAsync } from '~/modules/i18n'

export function truncateAddress(address: MaybeRefOrGetter<string | null | undefined>) {
  function truncateWalletAddress(walletAddress: string | null | undefined, startChars = 8, endChars = 4): string {
    if (!walletAddress)
      return '-'
    if (walletAddress.length < startChars + endChars + 3)
      return walletAddress

    const prefix = walletAddress.slice(0, startChars)
    const suffix = walletAddress.slice(-endChars)

    return `${prefix}...${suffix}`
  }
  return computed(() => truncateWalletAddress(toValue(address)))
}

export async function setupI18n() {
  if (typeof window === 'undefined') {
    loadLanguageAsync('en')
    return
  }
  const { locale } = useI18n()
  const userLocale = navigator?.language ?? 'en'
  const storagedLocale = useLocalStorage('locale-user-selected', userLocale)
  console.info(
    'locale',
    locale.value,
    'user locale',
    userLocale,
    'storaged locale',
    storagedLocale.value,
    'available locales',
    availableLocales,
  )
  if (!locale.value) {
    if (availableLocales.includes(userLocale)) {
      await loadLanguageAsync(userLocale)
    }
    else {
      await loadLanguageAsync('en')
      storagedLocale.value = 'en'
    }
  }
}

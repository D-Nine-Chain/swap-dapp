import type { MaybeRefOrGetter } from '@vueuse/core'

export function truncateAddress(address: MaybeRefOrGetter<string | null | undefined>) {
  function truncateWalletAddress(walletAddress: string | null | undefined, startChars = 8, endChars = 4): string {
    if (!walletAddress)
      return '-'
    if (walletAddress.length < startChars + endChars + 3)
      return walletAddress

    const prefix = walletAddress.slice(2, startChars)
    const suffix = walletAddress.slice(-endChars)

    return `${prefix}...${suffix}`
  }
  return computed(() => truncateWalletAddress(toValue(address)))
}

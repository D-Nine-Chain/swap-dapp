import tp from 'tp-js-sdk'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'

export const useWalletStore = defineStore('web3-wallet', () => {
  const isTokenPacket = ref(typeof window.tronWeb === 'object')
  const address = ref<string>()

  onMounted(async () => {
    const wallet = await tp.getCurrentWallet()
    address.value = wallet.data.address as any
  })
  return {
    isTokenPacket,
    address,
  }
})

export const useWalletStoreRefs = () => storeToRefs(useWalletStore())

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useWalletStore as any, import.meta.hot))

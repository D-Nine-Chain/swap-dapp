import { checkAddress } from '@polkadot/util-crypto'
import type { MaybeRefOrGetter } from '@vueuse/core'
import { FetchError, ofetch } from 'ofetch'

const baseURL = import.meta.env.VITE_APP_CROSS_TRANSFER_ENDPOINT
let D9CrossChainContractAddress = import.meta.env.VITE_APP_D9_CROSSCHAIN_CONTRACT_ADDRESS
const { tronTransferContract } = await ofetch<{ tronTransferContract: string }>(`/tron/transfer-contract/address`, {
  baseURL,
})
D9CrossChainContractAddress = tronTransferContract

export function useCrossChain(
  amount: MaybeRefOrGetter<string>,
  receiverAddress: MaybeRefOrGetter<string>,
) {
  const { t } = useI18n()
  const tron = useTronWallet()

  const error = ref<string>()
  const isLoading = ref(false)
  const data = ref()

  async function execute() {
    isLoading.value = true
    error.value = undefined
    try {
      const baseURL = import.meta.env.VITE_APP_CROSS_TRANSFER_ENDPOINT
      let receiver = toValue(receiverAddress)
      if (receiver.length === 49 && receiver.startsWith('Dn'))
        receiver = receiver.substring(2)

      const [addressValid] = checkAddress(receiver, 9)
      if (!addressValid)
        throw new Error(t('swap-form.invalid-receiving-address', { address: receiver }))

      await tron.approveContract(toValue(amount), D9CrossChainContractAddress)

      const txId = await ofetch<string | object>(`transfer/id/next/${receiver}`, {
        baseURL,
      })
      const form = {
        transferId: txId,
        toAddress: receiver,
        amount: Number(toValue(amount)),
        fromAddress: toValue(tron.account),
        fromChain: 'TRON',
        userId: receiver,
        toChain: 'D9',
      }
      console.info('form', form)
      const resp = await ofetch<typeof form | { error: string }>('transfer/commit', { baseURL, method: 'POST', body: form })
      data.value = resp
      return resp
    }
    catch (err: any) {
      console.info('useCrossChain', 'err', err)
      if (err instanceof FetchError) {
        if (err.data?.error)
          error.value = err.data.error
        else
          error.value = err.message
      }
      else {
        error.value = (typeof err === 'object' && 'message' in err)
          ? err.message ?? err?.toString()
          : err?.toString()
      }
      triggerRef(error)
    }
    finally {
      isLoading.value = false
      tron.getBalance().then().catch(console.warn)
    }
    return false
  }

  return {
    error,
    data,
    isLoading,
    execute,
  }
}

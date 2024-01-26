/* eslint-disable no-throw-literal */
import type { MaybeRefOrGetter } from '@vueuse/core'

function useTransactionID(address: MaybeRefOrGetter<string>) {
  return useFetch<string>(() => `${import.meta.env.VITE_APP_CROSS_TRANSFER_ENDPOINT}transfer/id/next/${toValue(address)}`, {
    immediate: false,
    refetch: false,
  }).get().text()
}

function useTransactionData(id: MaybeRefOrGetter<string | null>, toAddress: MaybeRefOrGetter<string>, amount: MaybeRefOrGetter<number>) {
  const { address } = useWalletStoreRefs()
  return computed(() => ({
    transactionId: toValue(id),
    toAddress: toValue(toAddress),
    amount: toValue(amount),
    fromAddress: toValue(address),
    fromChain: 'TRON',
    toChain: 'D9',
  }))
}

function useCommitTransaction(data: MaybeRefOrGetter<ReturnType<typeof useTransactionData>>) {
  return useFetch<any>(() => `${import.meta.env.VITE_APP_CROSS_TRANSFER_ENDPOINT}transfer/commit`, {
    immediate: false,
    refetch: false,
  }).post(data).json()
}

function useFinishTransaction(data: MaybeRefOrGetter<ReturnType<typeof useTransactionData>>) {
  return useFetch<any>(() => `${import.meta.env.VITE_APP_CROSS_TRANSFER_ENDPOINT}transfer/dispatch`, {
    timeout: 60000,
    immediate: false,
    refetch: false,
  }).post(data).json()
}

export function useCrossChain(
  toAddress: MaybeRefOrGetter<string>,
  amount: MaybeRefOrGetter<number>,
) {
  const _toAddress = computed(() => {
    const address = toValue(toAddress)
    return address.length > 47 ? address.substring(2) : address
  })
  const { data, error: getIDError, execute: getID } = useTransactionID(_toAddress)
  const body = useTransactionData(data, _toAddress, amount)
  const commit = useCommitTransaction(body)
  const dispatch = useFinishTransaction(body)
  return useAsyncState(async () => {
    await getID()
    if (getIDError.value)
      throw { error: 'get transaction id failed. please retry later' }
    await commit.execute()
    if (commit.error.value)
      throw await streamToJSON(commit.response.value?.body)
    console.info('commit result', commit.data.value)

    await dispatch.execute()
    if (dispatch.error.value)
      throw await streamToJSON(dispatch.response.value?.body)
    console.info('dispatch result', dispatch.data.value)

    return dispatch.data.value
  }, undefined, {
    immediate: false,
  })
}

async function streamToJSON(stream: any) {
  if (!stream)
    return { error: '' }
  const reader = stream.getReader()
  const textDecoder = new TextDecoder()
  let result = ''

  async function read() {
    const { done, value } = await reader.read()

    if (done)
      return JSON.parse(result)

    result += textDecoder.decode(value, { stream: true })
    return read()
  }

  return read()
}

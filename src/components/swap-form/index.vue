<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import BigNumber from 'bignumber.js'

const toastCtrl = useToast()
const { t } = useI18n()
const { usdtBalance } = storeToRefs(useTronWallet())
const amount = ref<string>('')
const receiverAddress = ref<string>('')

const {
  execute,
  isLoading,
  error,
} = useCrossChain(amount, receiverAddress)

watch(error, (_error: any) => {
  if (!_error)
    return
  console.warn('failed', _error)
  if (typeof _error !== 'string') {
    if (Array.isArray(_error))
      _error = (_error[0] as any).message
    else if ('message' in _error)
      _error = _error.message
  }

  toastCtrl.add({ severity: 'error', summary: t('swap-form.toast.transaction'), detail: _error, life: 5000 })
  error.value = undefined
})

async function handleSubmit() {
  let detail = ''

  if (!receiverAddress.value)
    detail = t('swap-form.receiver-required')
  else if (usdtBalance.value?.lt(new BigNumber(amount.value)))
    detail = t('swap-form.insufficient-balance')
  else if (usdtBalance.value?.lt(20000))
    detail = t('swap-form.at-least-2000')
  else if (new BigNumber(amount.value).isZero() || new BigNumber(amount.value).isNaN())
    detail = t('swap-form.pls-input-amount')
  if (detail) {
    error.value = detail
    return
  }

  if (await execute())
    toastCtrl.add({ severity: 'success', summary: t('swap-form.toast.transaction'), life: 3000, detail: t('swap-form.toast.transaction-successful') })
}
</script>

<template>
  <form
    col b-1 rounded-2xl bg-white p-8 shadow-sm animated animated-fade-in animated-faster sm:p-12
  >
    <img src="/imgs/big-logo.png" m-auto mb-4 max-w-22rem w-full>
    <!-- <h1 text-center text-3xl font-bold tracking-wide>
      {{ $t('swap-form.title') }}
    </h1> -->
    <Toast />

    <SwapFormAccountInput mt-10 />
    <SwapFormReceiverInput v-model="receiverAddress" mt-8 />
    <SwapFormTronUSDTInput v-model="amount" mt-8 />
    <SwapFormD9USDTInput v-model="amount" mt-8 />
    <!-- <SwapFormSwapInfo mt-8 /> -->

    <Button
      mt-10 w-full text-center
      :loading="isLoading" @click="handleSubmit"
    >
      {{ $t('action.submit') }}
    </Button>

    <ProgressBar v-show="isLoading" class="bg-[rgba(100,100,100,0.4)]" mode="indeterminate" style="height: 6px" />

    <SwapFormTips mt-4 />

    <div grow />
  </form>
</template>

<style scoped lang="scss">
:deep() {
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
    appearance: textfield;
  }
}
</style>

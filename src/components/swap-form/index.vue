<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'

const toastCtrl = useToast()

const { t } = useI18n()
const { isTronWeb, approveToSwapContract } = useWalletStore()
const amount = ref<string>('')
const receiverAddress = ref<string>('')

const { isLoading, execute, error: approveError } = useAsyncState(
  () => approveToSwapContract(amount.value),
  null,
  { immediate: false, shallow: true },
)

const { execute: submit, isLoading: crosschainLoading, error } = useCrossChain(receiverAddress, computed(() => Number(amount.value)))

watch(approveError, (_error) => {
  if (!_error)
    return
  toastCtrl.add({ severity: 'error', summary: t('swap-form.toast.approval'), detail: t('common.failed', { error: _error }) })
})
watch(error, (_error) => {
  if (!_error)
    return
  const { error } = _error as { error: string, success: boolean }
  toastCtrl.add({ severity: 'error', summary: t('swap-form.toast.transaction'), detail: error, life: 5000 })
})

async function handleSubmit() {
  await execute()
  if (approveError.value)
    return

  await submit()
  if (error.value)
    return

  toastCtrl.add({ severity: 'success', summary: t('swap-form.toast.transaction'), detail: t('swap-form.toast.transaction-successful') })
}
</script>

<template>
  <form
    col b-1 rounded-2xl bg-white p-8 shadow-sm dark:b-gray-7 dark:bg-gray-9 sm:p-12
  >
    <h1 text-center text-3xl font-bold tracking-wide>
      {{ $t('swap-form.title') }}
    </h1>
    <Toast />

    <template v-if="isTronWeb">
      <SwapFormAccountInput mt-10 />
      <SwapFormReceiverInput v-model="receiverAddress" mt-8 />
      <SwapFormTronInput v-model="amount" mt-8 />
      <SwapFormD9Input v-model="amount" mt-8 />
      <!-- <SwapFormSwapInfo mt-8 /> -->

      <Button
        mt-10 w-full text-center
        :disabled="!amount"
        :loading="isLoading || crosschainLoading" @click="handleSubmit"
      >
        {{ $t('action.submit') }}
      </Button>
      <ProgressBar v-show="isLoading || crosschainLoading" class="bg-[rgba(100,100,100,0.4)]" mode="indeterminate" style="height: 6px" />
    </template>
    <template v-else>
      <p my-12 text-center text-red font-bold prose>
        {{ $t('swap-form.unsupported') }}
      </p>
    </template>

    <div grow />
    <img src="/imgs/big-logo.png" max-w-16rem self-center py-8 sm:hidden>
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

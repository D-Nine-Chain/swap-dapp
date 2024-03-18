<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'

const toastCtrl = useToast()

const { t } = useI18n()
const amount = ref<string>('')
const receiverAddress = ref<string>('')

const {
  execute,
  isLoading,
  error,
} = useCrossChain(amount, receiverAddress)

watch(error, (_error) => {
  if (!_error)
    return
  toastCtrl.add({ severity: 'error', summary: t('swap-form.toast.transaction'), detail: error, life: 5000 })
})

async function handleSubmit() {
  if (await execute())
    toastCtrl.add({ severity: 'success', summary: t('swap-form.toast.transaction'), life: 3000, detail: t('swap-form.toast.transaction-successful') })
}
</script>

<template>
  <form
    col b-1 rounded-2xl bg-white p-8 shadow-sm sm:p-12
  >
    <h1 text-center text-3xl font-bold tracking-wide>
      {{ $t('swap-form.title') }}
    </h1>
    <Toast />

    <SwapFormAccountInput mt-10 />
    <SwapFormReceiverInput v-model="receiverAddress" mt-8 />
    <SwapFormTronInput v-model="amount" mt-8 />
    <SwapFormD9Input v-model="amount" mt-8 />
    <!-- <SwapFormSwapInfo mt-8 /> -->

    <Button
      mt-10 w-full text-center
      :disabled="!amount || !receiverAddress"
      :loading="isLoading" @click="handleSubmit"
    >
      {{ $t('action.submit') }}
    </Button>

    <ProgressBar v-show="isLoading" class="bg-[rgba(100,100,100,0.4)]" mode="indeterminate" style="height: 6px" />

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

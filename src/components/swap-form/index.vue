<script setup lang="ts">
const { isTokenPacket } = useWalletStore()
const amount = ref<string>('')
const receiverAddress = ref<string>('')
</script>

<template>
  <form col b-1 rounded-2xl bg-white p-8 shadow-sm dark:b-gray-7 dark:bg-gray-9 sm:p-12>
    <h1 text-center text-3xl font-bold>
      CROSSCHAIN BRIDGE
    </h1>

    <template v-if="isTokenPacket">
      <SwapFormAccountInput mt-10 />
      <SwapFormReceiverInput v-model="receiverAddress" mt-8 />
      <SwapFormTronInput v-model="amount" mt-8 />
      <SwapFormD9Input v-model="amount" mt-8 />

      <div mt-8 rounded-xl bg-gray-1 p-4 dark:bg-gray-8>
        <p class="row justify-between">
          Exchange price <span>1:1</span>
        </p>
        <p class="row justify-between" mt-2>
          Fee <span>~ 0 USDT</span>
        </p>
      </div>

      <div mt-10>
        <Button w-full text-center>
          Submit
        </Button>
      </div>
    </template>
    <template v-else>
      <p my-12 text-center text-red font-bold>
        Sorry, Only support Token Packet mobile app or TronLink browser extension.
        Please use the Token Packet mobile app to open it or install TronLink extension.
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

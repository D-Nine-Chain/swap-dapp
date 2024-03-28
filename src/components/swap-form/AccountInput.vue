<script setup lang="ts">
const { account } = storeToRefs(useTronWallet())
const truncated = truncateAddress(account)
</script>

<template>
  <div rounded-xl bg-gray-1 p-4>
    <label for="wallet-address" text-gray-5>{{ $t('swap-form.current-wallet-address') }}</label>
    <p
      w-full
      overflow-hidden
      text-ellipsis
      bg-transparent
      text-xl
      font-bold
      shadow-none
    >
      {{ truncated || '-' }}
    </p>
  </div>
</template>

<style scoped>

</style>

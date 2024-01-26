<script setup lang="ts">
const { address } = useWalletStoreRefs()
const truncated = truncateAddress(address)
</script>

<template>
  <div rounded-xl bg-gray-1 p-4 dark:bg-gray-8>
    <label for="wallet-address" text-gray-5 dark:text-gray-4>Your wallet address</label>
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

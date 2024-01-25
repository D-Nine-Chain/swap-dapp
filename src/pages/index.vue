<script setup lang="ts">
useHead({
  title: 'D9 Network TRON-USDT Approval',
  meta: [
    {
      name: 'description',
      content: 'D9 Network TRON-USDT Approval. Swap TRON to USDT',
    },
  ],
})
</script>

<template>
  <div class="wrapper" relative sm="h-100vh w-100vw flex align-central">
    <div absolute inset-0 z-0 backdrop-blur-lg lt-sm:hidden class="dark:bg-[rgba(0,0,0,0.8)]" />

    <img src="/imgs/big-logo.png" absolute bottom-10 max-w-16rem lt-sm:hidden>

    <SwapForm lt-sm="h-full rounded-0 b-0" z-1 min-h-15rem w-full sm:max-w-30rem sm:min-w-25rem />
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  background: url(/imgs/cover.png);
  background-size: cover;
  background-position: center;
}
</style>

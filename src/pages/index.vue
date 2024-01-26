<script setup lang="ts">
// useHead({
//   title: 'D9 Network TRON-USDT Approval',
//   meta: [
//     {
//       name: 'description',
//       content: 'D9 Network TRON-USDT Approval. Swap TRON to USDT',
//     },
//   ],
// })
</script>

<template>
  <div class="wrapper" min-h-100vh w-100vw flex align-central>
    <div fixed inset-0 z-0 sm:backdrop-blur-lg class="dark:bg-[rgba(0,0,0,0.8)]" />

    <img src="/imgs/big-logo.png" fixed bottom-10 max-w-16rem lt-sm:hidden>

    <SwapForm
      lt-sm="rounded-0 b-0" z-10 h-auto w-full place-self-stretch
      sm="max-w-30rem min-w-25rem place-self-center h-full"
    />
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  background: url(/imgs/cover.png);
  background-size: cover;
  background-position: center;
}
</style>

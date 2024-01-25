<script setup lang="ts">
// https://github.com/vueuse/head
useHead({
  title: 'D9 Network Swap',
  meta: [
    {
      name: 'description',
      content: 'D9 Network',
    },
    {
      name: 'theme-color',
      content: () => isDark.value ? '#00aba9' : '#ffffff',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: () => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg',
    },
  ],
})

useWalletStore()
</script>

<template>
  <div class="router-root">
    <RouterView />
  </div>
</template>

<style lang="scss">
.router-root {
  --gradient: linear-gradient(90deg, rgb(0, 90, 216) 0%, rgb(4, 165, 252) 100%);
}

.brand-gradient {
  background: rgb(0, 94, 225);
  background: var(--gradient);
}
</style>

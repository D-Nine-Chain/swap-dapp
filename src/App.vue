<script setup lang="ts">
preferredDark.value = false
toggleDark(false)

setupI18n()
useTronWallet()
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

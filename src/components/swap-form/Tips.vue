<script setup lang="ts">

</script>

<template>
  <div text-sm color-gray>
    <p v-for="l, i in $tm('swap-form.tips')" :key="i">
      {{ $rt(l) }}
    </p>
  </div>
</template>

<style scoped>

</style>

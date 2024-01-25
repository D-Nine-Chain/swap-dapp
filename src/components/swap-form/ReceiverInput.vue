<script setup lang="ts">
const receiverAddress = defineModel<string>()
</script>

<template>
  <div rounded-xl bg-gray-1 p-4 dark:bg-gray-8>
    <label for="receiver" text-gray-5 dark:text-gray-4>Receiver</label>
    <InputText v-model="receiverAddress" name="receiver" placeholder="Input receiver address" type="text" w-full bg-transparent text-xl font-bold shadow-none />
  </div>
</template>

<style scoped>

</style>

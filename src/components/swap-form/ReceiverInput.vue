<script setup lang="ts">
const receiverAddress = defineModel<string>()
const { t } = useI18n()
</script>

<template>
  <div rounded-xl bg-gray-1 p-4 dark:bg-gray-8>
    <label for="receiver" text-gray-5 dark:text-gray-4>{{ $t('swap-form.receiver') }}</label>
    <InputText v-model="receiverAddress" name="receiver" :placeholder="t('swap-form.placeholder.input-receiver')" type="text" w-full bg-transparent text-xl font-bold shadow-none />
  </div>
</template>

<style scoped>

</style>

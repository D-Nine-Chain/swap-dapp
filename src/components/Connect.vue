<script setup lang="ts">
const { connect } = useTronWallet()
</script>

<template>
  <Card dark="bg-gray-9 text-white">
    <template #title>
      <p text-center>
        {{ $t('swap-form.title') }}
      </p>
    </template>
    <template #content>
      <p v-if="true" mt-1rem text-center text-red font-bold prose>
        {{ $t('swap-form.unsupported') }}
      </p>

      <div v-else text-center>
        <Button :loading="connect.isLoading" @click="connect.execute()">
          {{ $t("tron.connect") }}
        </Button>
      </div>
    </template>
  </Card>
</template>

<style scoped></style>

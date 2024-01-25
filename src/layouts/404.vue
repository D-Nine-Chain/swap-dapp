<script setup lang="ts">
const router = useRouter()
const { t } = useI18n()
</script>

<template>
  <main text="center dark:gray-200" h-100dvh h-100svh col align-central>
    <div text-25>
      <div i-carbon-warning inline-block text-gray />
    </div>

    <RouterView />

    <div mt-10>
      <button
        p="2 x-4"
        rounded
        text-sm
        active:opacity-50
        @click="router.back()"
      >
        {{ t('button.back') }}
      </button>
    </div>
  </main>
</template>

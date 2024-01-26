<script setup lang="ts">
import Skeleton from 'primevue/skeleton'

const { t } = useI18n()
const { balance } = useWalletStoreRefs()
const amount = defineModel<string>()
</script>

<template>
  <div relative row rounded-xl bg-gray-1 p-3 dark:bg-gray-8>
    <div relative w-14 shrink-0 p-1>
      <img h-full w-full src="/imgs/tron.png" alt="">
      <img absolute bottom-0 right-0 w-6 src="/imgs/usdt.png" alt="">
    </div>
    <div ml-4 col grow items-end justify-between>
      <p text-sm text-gray-5 dark:text-gray-4>
        <Skeleton v-if="!balance" class="bg-[rgba(100,100,100,0.5)]" width="6rem" inline-block vertical-text-bottom />
        <template v-else>
          {{ $t('common.balance', { balance: balance?.toFixed(6) }) }}
        </template>
      </p>
      <InputText
        v-model="amount" name="sendAmount" :placeholder="t('swap-form.placeholder.input-amount')" type="number" w-full bg-transparent text-end text-xl font-bold
        shadow-none
      />
    </div>

    <div
      class="bottom--51% left-50% translate-x--50%"
      absolute h-14 w-14 col align-central b-3 b-gray-1 rounded-xl bg-gray-2 shadow-lg dark:b-gray-7 dark:bg-gray-6
    >
      <svg
        xmlns="http://www.w3.org/2000/svg" rotate="-90deg" text-2xl text-gray-5 dark:text-gray-4 width="32" height="32"
        viewBox="0 0 24 24"
      >
        <g
          fill="none" stroke="currentColor" stroke-dasharray="8" stroke-dashoffset="8" stroke-linecap="round"
          stroke-linejoin="round" stroke-width="2"
        >
          <path d="M12 12L17 7M12 12L17 17">
            <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="8;0" />
          </path>
          <path d="M6 12L11 7M6 12L11 17">
            <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.3s" values="8;0" />
          </path>
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped>

</style>

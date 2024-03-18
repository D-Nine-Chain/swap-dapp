<script setup lang="ts">
const amount = defineModel<string>()

const { t } = useI18n()
</script>

<template>
  <div row rounded-xl bg-gray-1 p-3>
    <div relative h-14 w-14 shrink-0 p-1>
      <div h-full w-full rounded-full p-1.5 class="bg-[rgb(0,90,223)]">
        <img h-full w-full rounded-full src="/imgs/d9.png" alt="">
      </div>
      <img absolute bottom-0 right-0 w-6 src="/imgs/usdt.png" alt="">
    </div>
    <div ml-4 col grow items-end justify-between>
      <p text-sm text-gray-5>
        <!-- Balance: 123,321.00 -->
      </p>
      <InputText
        v-model="amount"
        readonly name="receiveAmount"
        :placeholder="t('swap-form.placeholder.amount-received')"
        type="number" w-full bg-transparent text-end text-xl font-bold
        shadow-none
      />
    </div>
  </div>
</template>

<style scoped>

</style>

declare interface Window {
  tronWeb?: any
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}

declare module 'tp-js-sdk' {
  type Result<T> = Promise<{
    result: boolean
    data: T
    msg: string
  }>

  interface Wallet { name: string, address: string, blockchain: string }

  export async function getAppInfo(): Result<{ name: string }>
  export async function getCurrentWallet(): Result<Wallet>
  export async function getWallet(params: { walletTypes: ('eth' | 'btc' | 'tron') [], switch: boolean }): Result<Wallet>
}

import tp from 'tp-js-sdk'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import type { Observable } from 'rxjs'
import { combineLatest, distinctUntilChanged, firstValueFrom, fromEvent, shareReplay, takeWhile, timer } from 'rxjs'
import BigNumber from 'bignumber.js'

export const useWalletStore = defineStore('web3-wallet', () => {
  let tronWeb: any
  // optimization: window.tronWeb is sometimes not available from the beginning...
  const tronWeb$ = timer(0, 500).pipe(
    map(() => window.tronWeb),
    distinctUntilChanged(),
    takeWhile(tw => !!tw),
    timeout(6000),
    catchError(() => of(undefined)),
    tap((tw) => {
      tronWeb ??= tw
    }),
    map(() => tronWeb),
    shareReplay(1),
  )

  const usdtContract$: Observable<any> = tronWeb$.pipe(
    switchMap(tron => from(tron.contract().at(import.meta.env.VITE_APP_USDT_CONTRACT_ADDRESS))),
    shareReplay(1),
  )
  const address$ = combineLatest([tronWeb$, timer(0, 1000)]).pipe(
    map(([tronWeb]) => tronWeb?.defaultAddress?.base58),
    filter(value => !!value),
    distinctUntilChanged(),
    shareReplay(1),
  )
  const balance$ = combineLatest([address$, timer(0, 2000)]).pipe(
    switchMap(([addr]) => {
      return from(usdtContract$).pipe(
        filter(contract => !!contract),
        switchMap(contract => from(contract.balanceOf(addr).call())),
        map(result => BigNumber((result as any)?.toString() ?? 0)),
        map(bn => bn.dividedBy(BigNumber(10).pow(6)).toNumber() as number),
      )
    }),
    distinctUntilChanged(),
    shareReplay(1),
  )
  const isTronWeb = useObservable(tronWeb$.pipe(map(tw => !!tw)))
  const address = useObservable(address$)
  const balance = useObservable(balance$)

  onMounted(() => {
    combineLatest([from(tp.getCurrentWallet()), timer(0, 1500)]).pipe(
      map(([result]) => result.data),
      switchMap((wallet) => {
        if (wallet.blockchain === 'tron')
          return of(wallet)

        return from(tp.getWallet({
          walletTypes: ['tron'],
          switch: false,
        })).pipe(
          map(result => result.data),
        )
      }),
      take(1),
    ).subscribe()
  })

  return {
    isTronWeb,
    address,
    balance,
    async approveToSwapContract(amount: number | string) {
      const usdtContract = await firstValueFrom(usdtContract$)
      const allowance = await usdtContract.allowance(address.value, import.meta.env.VITE_APP_CROSSCHAIN_CONTRACT_ADDRESS).call()

      const allowanceSun = BigNumber(allowance[0].toString())
      const amountSun = BigNumber(amount).multipliedBy(BigNumber(10).pow(6))

      console.info('allowance', allowanceSun.toString(), amountSun.toString())
      if (allowanceSun.gte(amountSun))
        return
      return await usdtContract.approve(
        import.meta.env.VITE_APP_CROSSCHAIN_CONTRACT_ADDRESS,
        amountSun.toString(),
      ).send({
        feeLimit: tronWeb.toSun('400'),
      })
    },
  }
})

export const useWalletStoreRefs = () => storeToRefs(useWalletStore())

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useWalletStore as any, import.meta.hot))

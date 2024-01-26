import tp from 'tp-js-sdk'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import type { Observable } from 'rxjs'
import { combineLatest, distinctUntilChanged, firstValueFrom, fromEvent, shareReplay, takeWhile, timer } from 'rxjs'

export const useWalletStore = defineStore('web3-wallet', () => {
  let tronWeb: any
  const tronWeb$ = timer(0, 500).pipe(
    map(() => window.tronWeb),
    distinctUntilChanged(),
    takeWhile(tw => !!tw),
    timeout(6000),
    catchError(() => of(undefined)),
    tap((tw) => {
      tronWeb = tw
    }),
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
        map(result => tronWeb.toBigNumber(result)),
        map(bn => bn.dividedBy(10 ** 6).toNumber() as number),
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
      const allowanceSun = tronWeb.toBigNumber(allowance[0])
      const amountSun = tronWeb.BigNumber(amount).multipliedBy(10 ** 6)

      console.info('allowance', allowanceSun.toString(), amountSun.toString())
      if (allowanceSun >= amountSun)
        return

      return await usdtContract.approve(
        import.meta.env.VITE_APP_CROSSCHAIN_CONTRACT_ADDRESS,
        amountSun,
      ).send({
        feeLimit: tronWeb.toSun('400'),
      })
    },
  }
})

export const useWalletStoreRefs = () => storeToRefs(useWalletStore())

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useWalletStore as any, import.meta.hot))

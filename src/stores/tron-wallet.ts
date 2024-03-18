import BigNumber from 'bignumber.js'

const TronUSDTContractAddress = import.meta.env.VITE_APP_TRON_USDT_CONTRACT_ADDRESS

let contractCache = new Map<string, any>()

export const useTronWallet = defineStore('tron-wallet', () => {
  const tronWeb = shallowRef(window.tronLink?.tronWeb ? window.tronLink?.tronWeb : undefined)
  const connected = ref(false)

  const account = ref<string>()
  const isLocked = ref(false)
  const isTronNode = ref(true)
  const usdtBalance = shallowRef<BigNumber>()

  watch(tronWeb, (tron) => {
    connected.value = !!tron
    if (tron) {
      contractCache = new Map()
      isLocked.value = false
      account.value = tron.defaultAddress.base58
      console.info('tron', tron.value, 'account', account.value, 'isLocked', isLocked.value)
    }
  }, { immediate: true })

  useIntervalFn(async () => {
    if (!tronWeb.value || !connected.value)
      return
    await getBalance()
  }, 5000)

  onMounted(() => {
    if (window.tronLink?.ready)
      tronWeb.value = window.tronLink.tronWeb

    window.addEventListener('message', (event) => {
      const message = event.data.message
      if (message && message.action) {
        const data = message.data
        switch (message.action) {
          case 'accountsChanged':
            const newAddress = data.address
            console.info('accounts changed event', newAddress)
            isLocked.value = newAddress === false
            if (!isLocked.value)
              account.value = newAddress
            break
          case 'setNode':
            console.info('set node event', data)
            isTronNode.value = data.node?.chainId?.toString() === '0x2b6653dc'
            !isTronNode.value && console.warn('not tron node')
            break
          case 'connect':
            console.info('connect event', data, window.tronWeb, window.tronLink, window.tronLink.tronWeb)
            connected.value = true
            if (!tronWeb.value)
              tronWeb.value = window.tronLink.tronWeb
            break
          case 'disconnect':
            console.info('disconnect event', data)
            connected.value = false
            break
        }
      }
    })
  })

  async function connect() {
    if (window.tronLink.ready) {
      tronWeb.value = window.tronLink.tronWeb
      return true
    }
    else {
      const res = await window.tronLink.request({
        method: 'tron_requestAccounts',
        params: {
          websiteName: 'D9 Network Cross Chain',
        },
      })
      if (res.code === 200) {
        tronWeb.value = window.tronLink.tronWeb
        return true
      }
      return false
    }
  }

  async function approveContract(amount: number | string, contractAddress: string) {
    if (!account.value)
      throw new Error('No account selected or wallet not connected')
    const usdt = await getContract(TronUSDTContractAddress)
    const allowance = await usdt.allowance(account.value, contractAddress).call()
    console.info('approveContract', 'allowance', allowance)
    const allowanceSun = BigNumber(allowance[0].toString())
    const amountSun = BigNumber(amount).multipliedBy(BigNumber(10).pow(6))
    console.info('approveContract', 'allowance', allowanceSun.toString(), 'need', amountSun.toString(), 'original need', amount)
    if (allowanceSun.gte(amountSun))
      return
    return await usdt.approve(
      contractAddress,
      amountSun.toString(),
    ).send({
      feeLimit: tronWeb.value.toSun('400'),
    })
  }

  async function getBalance() {
    const usdt = await getContract(TronUSDTContractAddress)
    const result = await usdt.balanceOf(account.value).call()
    // console.info('getBalance', 'result', result)
    const balance = BigNumber(result?.toString() ?? 0).dividedBy(BigNumber(10).pow(6))
    usdtBalance.value = balance
    return balance
  }

  async function getContract(address: string) {
    if (contractCache.has(address))
      return contractCache.get(address)
    if (!tronWeb.value)
      throw new Error('tron web is undefined')
    const contract = tronWeb.value.contract().at(address)
    contractCache.set(address, contract)
    return contract
  }

  return {
    tronWeb,
    connected,
    isTronNode,
    isLocked,
    account,
    approveContract,
    usdtBalance,
    getBalance,
    connect: useAsyncState(() => connect(), false, { immediate: false }),
  }
})

import BigNumber from 'bignumber.js'
import { stringUtils } from 'ptokens-helpers'
import { Log } from 'viem'
import { NetworkId } from 'ptokens-constants'
import { polygon } from 'viem/chains'

import * as utils from '../src/lib'
import logs from './utils/logs.json'
import { publicClient } from './utils/viem-clients'

describe('ethereum utilities', () => {
  test('Should return a Viem chain', () => {
    require('ptokens-constants').INTERIM_NETWORK_ID = NetworkId.PolygonMainnet
    const chain = utils.getViemChain(NetworkId.PolygonMainnet)
    expect(chain).toBe(polygon)
  })

  test('Should throw if NetworkId is not supported', () => {
    try {
      const chain = utils.getViemChain('mockedNetworkId' as NetworkId)
      console.log(chain)
      fail()
    } catch (_err) {
      if (!(_err instanceof Error)) throw new Error('Invalid Error type')
      expect(_err.message).toEqual('mockedNetworkId is not supported as interim Chain, check ptokens-constants')
    }
  })

  test('Should return the correct Ethereum off-chain format', () => {
    const onChainAmount = 10000
    const decimals = 4
    const expectedOffChainAmount = BigNumber(1)
    const offChainAmount = utils.offChainFormat(onChainAmount, decimals)
    expect(offChainAmount).toStrictEqual(expectedOffChainAmount)
  })

  test('Should return the correct Ethereum on-chain format', () => {
    const offChainAmount = BigNumber(1)
    const decimals = 4
    const expectedOnChainAmount = BigNumber(10000)
    const onChainAmount = utils.onChainFormat(offChainAmount, decimals)
    expect(onChainAmount).toStrictEqual(expectedOnChainAmount)
  })

  test('Should return a valid gas limit', async () => {
    const getBlockSpy = jest.fn().mockResolvedValue({ gasLimit: 1000 })
    publicClient.getBlock = getBlockSpy
    const gasLimit = await utils.getGasLimit(publicClient)
    expect(typeof gasLimit).toBe('number')
  })

  test('Should return true since 0xhello is 0x prefixed', () => {
    const string0xPrefixed = '0xhello'
    const result = stringUtils.isHexPrefixed(string0xPrefixed)
    expect(result).toBe(true)
  })

  test('Should return false since hello is not 0x prefixed', () => {
    const string0xNotPrefixed = 'hello0x'
    const result = stringUtils.isHexPrefixed(string0xNotPrefixed)
    expect(result).toBe(false)
  })

  test('Should get operation ID from log', async () => {
    const res_1 = await Promise.allSettled(
      logs.slice(0, 3).map(
        (_log) => new Promise((_resolve) => _resolve(utils.getOperationIdFromLog(_log as unknown as Log<bigint>, '0xf9b459a1' as NetworkId))),
      ),
    )
    const res_2 = await Promise.allSettled(
      logs.slice(-3).map(
        (_log) => new Promise((_resolve) => _resolve(utils.getOperationIdFromLog(_log as unknown as Log<bigint>, '0xf9b459a1' as NetworkId))),
      ),
    )
    expect(
      res_1.map((_obj) => ('value' in _obj ? _obj.value : 'reason' in _obj ? (_obj.reason.message as string) : null)),
    ).toStrictEqual(Array(res_1.length).fill('0xb68e25afc0680bd3930459e5cfd3bc5b4cc0c07a67cfab9433a3d9337b2996ca'))
    expect(
      res_2.map((_obj) => ('value' in _obj ? _obj.value : 'reason' in _obj ? (_obj.reason.message as string) : null)),
    ).toStrictEqual(Array(res_2.length).fill('0xc3e33a15fb36d4c813c32d85e8005baf94b37d032c9830f00009aa536966e5b3'))
  })
})

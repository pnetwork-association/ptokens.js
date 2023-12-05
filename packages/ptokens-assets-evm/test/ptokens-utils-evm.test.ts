import BigNumber from 'bignumber.js'
import { NetworkId } from 'ptokens-constants'
import { stringUtils } from 'ptokens-helpers'
import { Log } from 'viem'
import { polygon } from 'viem/chains'

import PNetworkHubAbi from '../src/abi/PNetworkHubAbi'
import * as utils from '../src/lib'

import logs from './utils/logs.json'

describe('ethereum utilities', () => {
  test('Should return a Viem chain', () => {
    require('ptokens-constants').INTERIM_NETWORK_ID = NetworkId.PolygonMainnet
    const chain = utils.getViemChain(NetworkId.PolygonMainnet)
    expect(chain).toBe(polygon)
  })

  test('Should throw if NetworkId is not supported', () => {
    try {
      void utils.getViemChain('mockedNetworkId' as NetworkId)
      fail()
    } catch (_err) {
      if (!(_err instanceof Error)) throw new Error('Invalid Error type')
      expect(_err.message).toEqual('mockedNetworkId is not supported by ptokens.js')
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
    const res = await Promise.allSettled(
      logs
        .slice(0, 3)
        .concat(logs.slice(-3))
        .map(
          (_log) =>
            new Promise((_resolve) =>
              _resolve(utils.getOperationIdFromLog(_log as unknown as Log<bigint>, '0xf9b459a1' as NetworkId)),
            ),
        ),
    )
    const expectedRes = Array(3)
      .fill('0xb68e25afc0680bd3930459e5cfd3bc5b4cc0c07a67cfab9433a3d9337b2996ca')
      .concat(Array(3).fill('0xc3e33a15fb36d4c813c32d85e8005baf94b37d032c9830f00009aa536966e5b3'))
    expect(
      res.map((_obj) => ('value' in _obj ? _obj.value : 'reason' in _obj ? (_obj.reason.message as string) : null)),
    ).toStrictEqual(expectedRes)
  })

  test('Abi operation struct is consistent', () => {
    const operationQueuedStruct = PNetworkHubAbi.find((_) => _.type === 'event' && _.name === 'OperationQueued')?.inputs
    const operationExecutedStruct = PNetworkHubAbi.find((_) => _.type === 'event' && _.name === 'OperationExecuted')
      ?.inputs
    const operationCanceledFinalizedStruct = PNetworkHubAbi.find(
      (_) => _.type === 'event' && _.name === 'OperationCancelFinalized',
    )?.inputs
    expect(operationQueuedStruct).toStrictEqual(operationExecutedStruct)
    expect(operationExecutedStruct).toStrictEqual(operationCanceledFinalizedStruct)
  })
})

import BigNumber from 'bignumber.js'
import PromiEvent from 'promievent'
import { Blockchain, NetworkId, Network } from 'ptokens-constants'
import { TransactionReceipt, Log } from 'viem'

import { pTokensEvmAsset, pTokensEvmProvider } from '../src'
import pNetworkHubAbi from '../src/abi/PNetworkHubAbi'

import logs from './utils/logs.json'
import { publicClient, walletClient } from './utils/mock-viem-clients'
import receipt from './utils/receiptUserSend.json'

describe('EVM asset', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  describe('constructor', () => {
    test('Should create an EVM asset from constructor', () => {
      const asset = new pTokensEvmAsset({
        assetInfo: {
          networkId: NetworkId.GnosisMainnet,
          symbol: 'pSYM',
          assetTokenAddress: 'token-contract-address',
          decimals: 18,
          underlyingAssetDecimals: 18,
          underlyingAssetNetworkId: NetworkId.GnosisMainnet,
          underlyingAssetSymbol: 'SYM',
          underlyingAssetName: 'Symbol',
          underlyingAssetTokenAddress: 'underlying-asset-token-address',
          isNative: true,
        },
        factoryAddress: 'factory-address',
        hubAddress: 'hub-address',
        pTokenAddress: 'ptoken-address',
        provider: new pTokensEvmProvider(publicClient),
      })
      expect(asset.symbol).toStrictEqual('pSYM')
      expect(asset.blockchain).toStrictEqual(Blockchain.Gnosis)
      expect(asset.network).toStrictEqual(Network.Mainnet)
      expect(asset.networkId).toStrictEqual(NetworkId.GnosisMainnet)
      expect(asset.provider['_publicClient']).toStrictEqual(publicClient)
      expect(asset.weight).toEqual(1)
    })

    test('Should add a walletClient', () => {
      const asset = new pTokensEvmAsset({
        assetInfo: {
          networkId: NetworkId.GnosisMainnet,
          symbol: 'pSYM',
          assetTokenAddress: 'token-contract-address',
          decimals: 18,
          underlyingAssetDecimals: 18,
          underlyingAssetNetworkId: NetworkId.GnosisMainnet,
          underlyingAssetSymbol: 'SYM',
          underlyingAssetName: 'Symbol',
          underlyingAssetTokenAddress: 'underlying-asset-token-address',
          isNative: true,
        },
        factoryAddress: 'factory-address',
        hubAddress: 'hub-address',
        pTokenAddress: 'ptoken-address',
        provider: new pTokensEvmProvider(publicClient),
      })
      asset.setWalletClient(walletClient)
      expect(asset.provider['_walletClient']).toStrictEqual(walletClient)
    })
  })

  describe('swap', () => {
    beforeEach(() => {
      jest.restoreAllMocks()
    })

    test('Should not call swap if provider is missing', async () => {
      const asset = new pTokensEvmAsset({
        assetInfo: {
          networkId: NetworkId.GnosisMainnet,
          symbol: 'pSYM',
          assetTokenAddress: 'token-contract-address',
          decimals: 18,
          underlyingAssetDecimals: 18,
          underlyingAssetNetworkId: NetworkId.GnosisMainnet,
          underlyingAssetSymbol: 'SYM',
          underlyingAssetName: 'Symbol',
          underlyingAssetTokenAddress: 'underlying-asset-token-address',
          isNative: true,
        },
        factoryAddress: 'factory-address',
        hubAddress: 'hub-address',
        pTokenAddress: 'ptoken-address',
        provider: new pTokensEvmProvider(publicClient),
      })
      try {
        await asset['swap'](BigNumber(123.456789), 'destination-address', 'destination-chain-id')
        fail()
      } catch (_err) {
        if (!(_err instanceof Error)) throw new Error('Invalid Error type')
        expect(_err.message).toEqual('WalletClient not provided')
      }
    })

    test('Should call makeContractSend with userSend', async () => {
      const provider = new pTokensEvmProvider(publicClient, walletClient)
      // const getTransactionReceiptSpy = jest.fn().mockResolvedValue(receipt)
      // publicClient.getTransactionReceipt = getTransactionReceiptSpy
      const makeContractSendMock = jest.fn().mockImplementation(() => {
        const promi = new PromiEvent<TransactionReceipt>((resolve) =>
          setImmediate(() => {
            promi.emit('txBroadcasted', 'tx-hash')
            promi.emit('txConfirmed', receipt)
            return resolve(receipt as unknown as TransactionReceipt)
          }),
        )
        return promi
      })
      provider.makeContractSend = makeContractSendMock
      const asset = new pTokensEvmAsset({
        provider: provider,
        assetInfo: {
          networkId: NetworkId.GnosisMainnet,
          symbol: 'pSYM',
          assetTokenAddress: 'asset-token-address',
          decimals: 18,
          underlyingAssetDecimals: 18,
          underlyingAssetNetworkId: 'underlying-asset-network-id',
          underlyingAssetSymbol: 'underlying-asset-symbol',
          underlyingAssetName: 'underlying-asset-name',
          underlyingAssetTokenAddress: 'underlying-asset-token-address',
          isNative: true,
        },
        factoryAddress: 'factory-address',
        hubAddress: 'hub-address',
        pTokenAddress: 'ptoken-address',
      })
      let txHashBroadcasted = ''
      let swapResultConfirmed = null
      // promiEvent works weird with async await syntax -> TODO avoid async await with promiEvent
      const ret = await asset['swap'](BigNumber(123.456789), 'destination-address', 'destination-chain-id')
        .on('txBroadcasted', (_txHash) => {
          txHashBroadcasted = _txHash
        })
        .on('txConfirmed', (_swapResult) => {
          swapResultConfirmed = _swapResult
        })
      expect(txHashBroadcasted).toEqual({ txHash: 'tx-hash' })
      expect(swapResultConfirmed).toEqual({
        operationId: '0xbf4531f01b1d4f3bf8441f279f029060e4502285cfe033f36c6c9b8366232311',
        txHash: '0xa3ca2fe3981b265c3da018120abaf6a454b60f7b5363a3559531f82acdde4308',
      })
      expect(ret).toEqual({
        operationId: '0xbf4531f01b1d4f3bf8441f279f029060e4502285cfe033f36c6c9b8366232311',
        txHash: '0xa3ca2fe3981b265c3da018120abaf6a454b60f7b5363a3559531f82acdde4308',
      })
      expect(makeContractSendMock).toHaveBeenNthCalledWith(
        1,
        {
          abi: pNetworkHubAbi,
          contractAddress: 'hub-address',
          method: 'userSend',
          value: 0n,
        },
        [
          'destination-address',
          'destination-chain-id',
          'underlying-asset-name',
          'underlying-asset-symbol',
          18,
          'underlying-asset-token-address',
          'underlying-asset-network-id',
          'asset-token-address',
          '123456789000000000000',
          '0',
          '0',
          '0x',
          '0x0000000000000000000000000000000000000000000000000000000000000000',
        ],
      )
    })

    test('Should reject if makeContractSend rejects', async () => {
      const provider = new pTokensEvmProvider(publicClient, walletClient)
      jest.spyOn(provider, 'makeContractSend').mockImplementation(() => {
        const promi = new PromiEvent<TransactionReceipt>((resolve, reject) => {
          return reject(new Error('makeContractSend error'))
        })
        return promi
      })
      const asset = new pTokensEvmAsset({
        provider: provider,
        assetInfo: {
          networkId: NetworkId.GnosisMainnet,
          symbol: 'pSYM',
          assetTokenAddress: 'asset-token-address',
          decimals: 18,
          underlyingAssetDecimals: 18,
          underlyingAssetNetworkId: 'underlying-asset-network-id',
          underlyingAssetSymbol: 'underlying-asset-symbol',
          underlyingAssetName: 'underlying-asset-name',
          underlyingAssetTokenAddress: 'underlying-asset-token-address',
          isNative: true,
        },
        factoryAddress: 'factory-address',
        hubAddress: 'hub-address',
        pTokenAddress: 'ptoken-address',
      })
      try {
        await asset['swap'](BigNumber(123.456789), 'destination-address', 'destination-chain-id')
        fail()
      } catch (_err) {
        if (!(_err instanceof Error)) throw new Error('Invalid Error type')
        expect(_err.message).toStrictEqual('makeContractSend error')
      }
    })
  })

  describe('monitorCrossChainOperations', () => {
    beforeEach(() => {
      jest.restoreAllMocks()
    })

    test('Should call provider monitorCrossChainOperations', async () => {
      const log = logs[0]
      const provider = new pTokensEvmProvider(publicClient, walletClient)
      const monitorCrossChainOperationsSpy = jest
        .spyOn(provider, 'monitorCrossChainOperations')
        .mockResolvedValue(log as unknown as Log)
      const asset = new pTokensEvmAsset({
        provider: provider,
        assetInfo: {
          networkId: NetworkId.GnosisMainnet,
          symbol: 'pSYM',
          assetTokenAddress: 'asset-token-address',
          decimals: 18,
          underlyingAssetDecimals: 18,
          underlyingAssetNetworkId: 'underlying-asset-network-id',
          underlyingAssetSymbol: 'underlying-asset-symbol',
          underlyingAssetName: 'underlying-asset-name',
          underlyingAssetTokenAddress: 'underlying-asset-token-address',
          isNative: true,
        },
        factoryAddress: 'factory-address',
        hubAddress: 'hub-address',
        pTokenAddress: 'ptoken-address',
      })
      const ret = await asset['monitorCrossChainOperations']('operation-id')
      expect(ret).toStrictEqual(log as unknown as Log)
      expect(monitorCrossChainOperationsSpy).toHaveBeenCalledTimes(1)
    })
  })
})

import { Blockchain, NetworkId, Network } from 'ptokens-constants'

import { pTokensEvmAssetBuilder, pTokensEvmProvider } from '../src'
import ABI from '../src/abi/PFactoryAbi'

import { publicClient, walletClient } from './utils/mock-viem-clients'

describe('EVM asset', () => {
  beforeAll(() => {
    jest.restoreAllMocks()
  })

  test('Should create an EVM asset with provider', async () => {
    const assetInfo = {
      networkId: NetworkId.ArbitrumMainnet,
      isNative: false,
      symbol: 'pSYM',
      decimals: 18,
      underlyingAssetDecimals: 18,
      underlyingAssetNetworkId: NetworkId.GnosisMainnet,
      underlyingAssetSymbol: 'SYM',
      underlyingAssetName: 'Symbol',
      underlyingAssetTokenAddress: 'underlying-asset-token-address',
    }
    const provider = new pTokensEvmProvider(publicClient, walletClient)
    const makeContractCallSpy = jest
      .spyOn(provider, 'makeContractCall')
      .mockResolvedValueOnce('hub-address')
      .mockResolvedValueOnce('pToken-address')
    const builder = new pTokensEvmAssetBuilder(provider)
    builder.setBlockchain(NetworkId.ArbitrumMainnet)
    builder.setAssetInfo(assetInfo)
    builder.setProvider(provider)
    const asset = await builder.build()
    expect(makeContractCallSpy).toHaveBeenCalledTimes(2)
    expect(makeContractCallSpy).toHaveBeenNthCalledWith(1, {
      abi: ABI,
      method: 'hub',
      contractAddress: '0xcf9De65e9bB5F7fE8643dA066aB6cBC691De0Fe7',
    })
    expect(makeContractCallSpy).toHaveBeenNthCalledWith(
      2,
      {
        abi: ABI,
        method: 'getPTokenAddress',
        contractAddress: '0xcf9De65e9bB5F7fE8643dA066aB6cBC691De0Fe7',
      },
      [
        assetInfo.underlyingAssetName,
        assetInfo.underlyingAssetSymbol,
        assetInfo.underlyingAssetDecimals,
        assetInfo.underlyingAssetTokenAddress,
        assetInfo.underlyingAssetNetworkId,
      ],
    )
    expect(asset.hubAddress).toStrictEqual('hub-address')
    expect(asset.assetInfo.assetTokenAddress).toStrictEqual('pToken-address')
    expect(asset.blockchain).toStrictEqual(Blockchain.Arbitrum)
    expect(asset.network).toStrictEqual(Network.Mainnet)
    expect(asset.networkId).toStrictEqual(NetworkId.ArbitrumMainnet)
    expect(asset.weight).toEqual(1)
    expect(asset.provider).toEqual(provider)
  })

  test('Should create an EVM asset from a native token', async () => {
    const assetInfo = {
      networkId: NetworkId.ArbitrumMainnet,
      isNative: true,
      symbol: 'pSYM',
      assetTokenAddress: 'asset-token-address',
      decimals: 18,
      underlyingAssetDecimals: 18,
      underlyingAssetNetworkId: NetworkId.ArbitrumMainnet,
      underlyingAssetSymbol: 'SYM',
      underlyingAssetName: 'Symbol',
      underlyingAssetTokenAddress: 'asset-token-address',
    }
    const provider = new pTokensEvmProvider(publicClient, walletClient)
    const makeContractCallSpy = jest
      .spyOn(provider, 'makeContractCall')
      .mockResolvedValueOnce('hub-address')
      .mockResolvedValueOnce('pToken-address')
    const builder = new pTokensEvmAssetBuilder(provider)
    builder.setBlockchain(NetworkId.ArbitrumMainnet)
    builder.setAssetInfo(assetInfo)
    builder.setProvider(provider)
    const asset = await builder.build()
    expect(makeContractCallSpy).toHaveBeenCalledTimes(2)
    expect(makeContractCallSpy).toHaveBeenNthCalledWith(1, {
      abi: ABI,
      method: 'hub',
      contractAddress: '0xcf9De65e9bB5F7fE8643dA066aB6cBC691De0Fe7',
    })
    expect(asset.hubAddress).toStrictEqual('hub-address')
    expect(asset.assetInfo.assetTokenAddress).toStrictEqual('asset-token-address')
    expect(asset.blockchain).toStrictEqual(Blockchain.Arbitrum)
    expect(asset.network).toStrictEqual(Network.Mainnet)
    expect(asset.networkId).toStrictEqual(NetworkId.ArbitrumMainnet)
    expect(asset.weight).toEqual(1)
    expect(asset.provider).toEqual(provider)
  })

  // test('Should throw if wrong pToken address is passed', async () => {
  //   const assetInfo = {
  //     networkId: NetworkId.ArbitrumMainnet,
  //     isNative: false,
  //     symbol: 'pSYM',
  //     assetTokenAddress: 'asset-token-address',
  //     decimals: 18,
  //     underlyingAssetDecimals: 18,
  //     underlyingAssetNetworkId: NetworkId.ArbitrumMainnet,
  //     underlyingAssetSymbol: 'SYM',
  //     underlyingAssetName: 'Symbol',
  //     underlyingAssetTokenAddress: 'underlying-asset-token-address',
  //   }
  //   const provider = new pTokensEvmProvider(publicClient, walletClient)
  //   const makeContractCallSpy = jest
  //     .spyOn(provider, 'makeContractCall')
  //     .mockResolvedValueOnce('hub-address')
  //     .mockResolvedValueOnce('pToken-address')
  //   const builder = new pTokensEvmAssetBuilder(provider)
  //   builder.setBlockchain(NetworkId.ArbitrumMainnet)
  //   builder.setAssetInfo(assetInfo)
  //   builder.setProvider(provider)

  //   try {
  //     const asset = await builder.build()
  //     fail()
  //   } catch (_err) {
  //     if (!(_err instanceof Error)) throw new Error('Invalid Error type')
  //     expect(_err).toBeInstanceOf(Error)
  //     expect(_err.message).toBe('Invalid pToken address')
  //   }

  //   expect(makeContractCallSpy).toHaveBeenCalledTimes(2)
  //   expect(makeContractCallSpy).toHaveBeenNthCalledWith(1, {
  //     abi: ABI,
  //     method: 'hub',
  //     contractAddress: '0xcf9De65e9bB5F7fE8643dA066aB6cBC691De0Fe7',
  //   })
  //   expect(makeContractCallSpy).toHaveBeenNthCalledWith(
  //     2,
  //     {
  //       abi: ABI,
  //       method: 'getPTokenAddress',
  //       contractAddress: '0xcf9De65e9bB5F7fE8643dA066aB6cBC691De0Fe7',
  //     },
  //     [
  //       assetInfo.underlyingAssetName,
  //       assetInfo.underlyingAssetSymbol,
  //       assetInfo.underlyingAssetDecimals,
  //       assetInfo.underlyingAssetTokenAddress,
  //       assetInfo.underlyingAssetNetworkId,
  //     ],
  //   )
  // })

  test('Should not create an EVM asset without blockchain data', async () => {
    const provider = new pTokensEvmProvider(publicClient, walletClient)
    const builder = new pTokensEvmAssetBuilder(provider)
    try {
      await builder.build()
      fail()
    } catch (_err) {
      if (!(_err instanceof Error)) throw new Error('Invalid Error type')
      expect(_err.message).toStrictEqual('Missing chain ID')
    }
  })

  test('Should not create an EVM asset without asset info', async () => {
    const provider = new pTokensEvmProvider(publicClient, walletClient)
    const builder = new pTokensEvmAssetBuilder(provider)
    try {
      builder.setBlockchain(NetworkId.GnosisMainnet)
      await builder.build()
      fail()
    } catch (_err) {
      if (!(_err instanceof Error)) throw new Error('Invalid Error type')
      expect(_err.message).toStrictEqual('Missing asset info')
    }
  })
})

import { pTokensEvmAsset, pTokensEvmProvider } from 'ptokens-assets-evm'
import { NetworkId } from 'ptokens-constants'

import { pTokensSwapBuilder } from '../src/index'

describe('pTokensSwapBuilder', () => {
  test('Should build a swap', async () => {
    const builder = new pTokensSwapBuilder()
    const provider = {} as pTokensEvmProvider
    const originatingToken = new pTokensEvmAsset({
      provider: provider,
      assetInfo: {
        networkId: NetworkId.GnosisMainnet,
        symbol: 'A',
        assetTokenAddress: 'token-contract-address',
        decimals: 18,
        isNative: true,
        underlyingAssetDecimals: 18,
        underlyingAssetNetworkId: NetworkId.GnosisMainnet,
        underlyingAssetSymbol: 'SYM',
        underlyingAssetName: 'Symbol',
        underlyingAssetTokenAddress: 'underlying-asset-token-address',
      },
      factoryAddress: 'factory-address',
      hubAddress: 'hub-address',
      pTokenAddress: 'ptoken-address',
    })
    const destinationToken = new pTokensEvmAsset({
      provider: provider,
      assetInfo: {
        networkId: NetworkId.GnosisMainnet,
        symbol: 'B',
        assetTokenAddress: 'token-contract-address',
        decimals: 18,
        isNative: true,
        underlyingAssetDecimals: 18,
        underlyingAssetNetworkId: NetworkId.GnosisMainnet,
        underlyingAssetSymbol: 'SYM',
        underlyingAssetName: 'Symbol',
        underlyingAssetTokenAddress: 'underlying-asset-token-address',
      },
      factoryAddress: 'factory-address',
      hubAddress: 'hub-address',
      pTokenAddress: 'ptoken-address',
    })
    builder.setSourceAsset(originatingToken)
    builder.addDestinationAsset(
      destinationToken,
      '0x28B2A40b6046850a569843cF740f15CF29792Ac2',
      Buffer.from('user-data').toString('hex'),
    )
    builder.setAmount(1000)
    builder.setInterimHubAddress('0xE8B234b86046850a569843cF740f15CF29792D4f')
    const swap = await builder.build()
    expect(builder.destinationAssets).toEqual([destinationToken])
    expect(builder.amount).toEqual('1000')
    expect(swap.expectedOutputAmount).toEqual('998')
    expect(swap.amount).toBe('1000')
    expect(swap.sourceAsset).toStrictEqual(originatingToken)
    expect(swap.destinationAssets).toStrictEqual([destinationToken])
  })

  test('Should build a swap with a custom routerAddress', async () => {
    const builder = new pTokensSwapBuilder()
    const provider = {} as pTokensEvmProvider
    const originatingToken = new pTokensEvmAsset({
      provider: provider,
      assetInfo: {
        networkId: NetworkId.GnosisMainnet,
        symbol: 'A',
        assetTokenAddress: 'token-contract-address',
        decimals: 18,
        isNative: true,
        underlyingAssetDecimals: 18,
        underlyingAssetNetworkId: NetworkId.GnosisMainnet,
        underlyingAssetSymbol: 'SYM',
        underlyingAssetName: 'Symbol',
        underlyingAssetTokenAddress: 'underlying-asset-token-address',
      },
      factoryAddress: 'factory-address',
      hubAddress: 'hub-address',
      pTokenAddress: 'ptoken-address',
    })
    const destinationToken = new pTokensEvmAsset({
      provider: provider,
      assetInfo: {
        networkId: NetworkId.GnosisMainnet,
        symbol: 'B',
        assetTokenAddress: 'token-contract-address',
        decimals: 18,
        isNative: true,
        underlyingAssetDecimals: 18,
        underlyingAssetNetworkId: NetworkId.GnosisMainnet,
        underlyingAssetSymbol: 'SYM',
        underlyingAssetName: 'Symbol',
        underlyingAssetTokenAddress: 'underlying-asset-token-address',
      },
      factoryAddress: 'factory-address',
      hubAddress: 'hub-address',
      pTokenAddress: 'ptoken-address',
    })
    builder.setSourceAsset(originatingToken)
    builder.addDestinationAsset(
      destinationToken,
      '0x28B2A40b6046850a569843cF740f15CF29792Ac2',
      Buffer.from('user-data').toString('hex'),
    )
    builder.setAmount(1000)
    builder.setInterimHubAddress('0xE8B234b86046850a569843cF740f15CF29792D4f')
    const swap = await builder.build()
    expect(builder.destinationAssets).toEqual([destinationToken])
    expect(builder.amount).toEqual('1000')
    expect(swap.expectedOutputAmount).toEqual('998')
    expect(swap.amount).toBe('1000')
    expect(swap.sourceAsset).toStrictEqual(originatingToken)
    expect(swap.destinationAssets).toStrictEqual([destinationToken])
  })

  test('Should not build a swap if destination address is not valid', () => {
    const builder = new pTokensSwapBuilder()
    const provider = {} as pTokensEvmProvider
    const originatingToken = new pTokensEvmAsset({
      provider: provider,
      assetInfo: {
        networkId: NetworkId.GnosisMainnet,
        symbol: 'A',
        isNative: true,
        assetTokenAddress: 'token-contract-address',
        decimals: 18,
        underlyingAssetDecimals: 18,
        underlyingAssetNetworkId: NetworkId.GnosisMainnet,
        underlyingAssetSymbol: 'SYM',
        underlyingAssetName: 'Symbol',
        underlyingAssetTokenAddress: 'underlying-asset-token-address',
      },
      factoryAddress: 'factory-address',
      hubAddress: 'hub-address',
      pTokenAddress: 'ptoken-address',
    })
    const destinationToken = new pTokensEvmAsset({
      provider: provider,
      assetInfo: {
        networkId: NetworkId.GnosisMainnet,
        symbol: 'B',
        assetTokenAddress: 'token-contract-address',
        decimals: 18,
        isNative: true,
        underlyingAssetDecimals: 18,
        underlyingAssetNetworkId: NetworkId.GnosisMainnet,
        underlyingAssetSymbol: 'SYM',
        underlyingAssetName: 'Symbol',
        underlyingAssetTokenAddress: 'underlying-asset-token-address',
      },
      factoryAddress: 'factory-address',
      hubAddress: 'hub-address',
      pTokenAddress: 'ptoken-address',
    })
    builder.setSourceAsset(originatingToken)
    try {
      builder.addDestinationAsset(destinationToken, 'invalid-eth-address', Buffer.from('user-data').toString('hex'))
      fail()
    } catch (err) {
      expect(err.message).toBe('Invalid destination address')
    }
  })

  test('Should not build a swap if source asset is missing', async () => {
    const builder = new pTokensSwapBuilder()
    const provider = {} as pTokensEvmProvider
    const destinationToken = new pTokensEvmAsset({
      provider: provider,
      assetInfo: {
        networkId: NetworkId.GnosisMainnet,
        symbol: 'B',
        assetTokenAddress: 'token-contract-address',
        decimals: 18,
        isNative: true,
        underlyingAssetDecimals: 18,
        underlyingAssetNetworkId: NetworkId.GnosisMainnet,
        underlyingAssetSymbol: 'SYM',
        underlyingAssetName: 'Symbol',
        underlyingAssetTokenAddress: 'underlying-asset-token-address',
      },
      factoryAddress: 'factory-address',
      hubAddress: 'hub-address',
      pTokenAddress: 'ptoken-address',
    })
    builder.addDestinationAsset(destinationToken, '0x28B2A40b6046850a569843cF740f15CF29792Ac2')
    builder.setAmount(1000)
    try {
      await builder.build()
      fail()
    } catch (err) {
      expect(err.message).toBe('Missing source asset')
    }
  })

  test('Should not build a swap if amount is missing', async () => {
    const builder = new pTokensSwapBuilder()
    const provider = {} as pTokensEvmProvider
    const originatingToken = new pTokensEvmAsset({
      provider: provider,
      assetInfo: {
        networkId: NetworkId.GnosisMainnet,
        symbol: 'A',
        assetTokenAddress: 'token-contract-address',
        decimals: 18,
        isNative: true,
        underlyingAssetDecimals: 18,
        underlyingAssetNetworkId: NetworkId.GnosisMainnet,
        underlyingAssetSymbol: 'SYM',
        underlyingAssetName: 'Symbol',
        underlyingAssetTokenAddress: 'underlying-asset-token-address',
      },
      factoryAddress: 'factory-address',
      hubAddress: 'hub-address',
      pTokenAddress: 'ptoken-address',
    })
    const destinationToken = new pTokensEvmAsset({
      provider: provider,
      assetInfo: {
        networkId: NetworkId.GnosisMainnet,
        symbol: 'B',
        assetTokenAddress: 'token-contract-address',
        decimals: 18,
        isNative: true,
        underlyingAssetDecimals: 18,
        underlyingAssetNetworkId: NetworkId.GnosisMainnet,
        underlyingAssetSymbol: 'SYM',
        underlyingAssetName: 'Symbol',
        underlyingAssetTokenAddress: 'underlying-asset-token-address',
      },
      factoryAddress: 'factory-address',
      hubAddress: 'hub-address',
      pTokenAddress: 'ptoken-address',
    })
    builder.setSourceAsset(originatingToken)
    builder.addDestinationAsset(destinationToken, '0x28B2A40b6046850a569843cF740f15CF29792Ac2')
    try {
      await builder.build()
      fail()
    } catch (err) {
      expect(err.message).toBe('Missing amount')
    }
  })

  test('Should not build a swap if there are no destination assets', async () => {
    const builder = new pTokensSwapBuilder()
    const provider = {} as pTokensEvmProvider
    const originatingToken = new pTokensEvmAsset({
      provider: provider,
      assetInfo: {
        networkId: NetworkId.GnosisMainnet,
        symbol: 'A',
        assetTokenAddress: 'token-contract-address',
        decimals: 18,
        isNative: true,
        underlyingAssetDecimals: 18,
        underlyingAssetNetworkId: NetworkId.GnosisMainnet,
        underlyingAssetSymbol: 'SYM',
        underlyingAssetName: 'Symbol',
        underlyingAssetTokenAddress: 'underlying-asset-token-address',
      },
      factoryAddress: 'factory-address',
      hubAddress: 'hub-address',
      pTokenAddress: 'ptoken-address',
    })
    builder.setSourceAsset(originatingToken)
    builder.setAmount(1000)
    try {
      await builder.build()
      fail()
    } catch (err) {
      expect(err.message).toBe('Missing destination assets')
    }
  })
})

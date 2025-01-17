import { Blockchain, ChainId, Network } from '@p.network/ptokens-constants'
import { pTokensNode, pTokensNodeProvider } from '@p.network/ptokens-node'

import { pTokensEvmAssetBuilder, pTokensEvmProvider } from '../src'

const hostToXFees = {
  networkFee: 5e18,
  minNodeOperatorFee: 6e18,
  basisPoints: {
    hostToHost: 70,
    hostToNative: 80,
  },
}

jest.mock('web3')

describe('EVM asset', () => {
  test('Should create an EVM asset without provider', async () => {
    const assetInfo = {
      chainId: ChainId.EthereumMainnet,
      isNative: false,
      tokenAddress: '123456789',
      tokenReference: 'token-internal-address',
      fees: hostToXFees,
    }
    const getAssetInfoSpy = jest.spyOn(pTokensNode.prototype, 'getAssetInfoByChainId').mockResolvedValue(assetInfo)
    const node = new pTokensNode(new pTokensNodeProvider('node-provider-url'))
    const builder = new pTokensEvmAssetBuilder(node)
    builder.setBlockchain(ChainId.EthereumMainnet)
    builder.setSymbol('SYM')
    builder.setDecimals(18)
    const asset = await builder.build()
    expect(getAssetInfoSpy).toHaveBeenNthCalledWith(1, 'SYM', ChainId.EthereumMainnet)
    expect(asset.blockchain).toStrictEqual(Blockchain.Ethereum)
    expect(asset.network).toStrictEqual(Network.Mainnet)
    expect(asset.chainId).toStrictEqual(ChainId.EthereumMainnet)
    expect(asset.weight).toEqual(1)
    expect(asset.provider).toEqual(undefined)
  })

  test('Should create an EVM asset with provider', async () => {
    const assetInfo = {
      chainId: ChainId.EthereumMainnet,
      isNative: false,
      tokenAddress: '123456789',
      tokenReference: 'token-internal-address',
      decimals: 18,
      fees: hostToXFees,
    }
    const getAssetInfoSpy = jest.spyOn(pTokensNode.prototype, 'getAssetInfoByChainId').mockResolvedValue(assetInfo)
    const provider = new pTokensEvmProvider()
    const node = new pTokensNode(new pTokensNodeProvider('node-provider-url'))
    const builder = new pTokensEvmAssetBuilder(node)
    builder.setBlockchain(ChainId.EthereumMainnet)
    builder.setSymbol('SYM')
    builder.setProvider(provider)
    const asset = await builder.build()
    expect(getAssetInfoSpy).toHaveBeenNthCalledWith(1, 'SYM', ChainId.EthereumMainnet)
    expect(asset.blockchain).toStrictEqual(Blockchain.Ethereum)
    expect(asset.network).toStrictEqual(Network.Mainnet)
    expect(asset.chainId).toStrictEqual(ChainId.EthereumMainnet)
    expect(asset.weight).toEqual(1)
    expect(asset.provider).toEqual(provider)
  })

  test('Should not create an EVM asset without blockchain data', async () => {
    const node = new pTokensNode(new pTokensNodeProvider('node-provider-url'))
    const builder = new pTokensEvmAssetBuilder(node)
    try {
      await builder.build()
      fail()
    } catch (err) {
      expect(err.message).toStrictEqual('Missing chain ID')
    }
  })

  test('Should not create an EVM asset without symbol', async () => {
    const node = new pTokensNode(new pTokensNodeProvider('node-provider-url'))
    const builder = new pTokensEvmAssetBuilder(node)
    try {
      builder.setBlockchain(ChainId.EthereumMainnet)
      await builder.build()
      fail()
    } catch (err) {
      expect(err.message).toStrictEqual('Missing symbol')
    }
  })
})

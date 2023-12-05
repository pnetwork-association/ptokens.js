import BigNumber from 'bignumber.js'
import * as ptokensAssetEvm from 'ptokens-assets-evm'
import { NetworkId } from 'ptokens-constants'
import { PublicClient, TransactionReceipt } from 'viem'

import { pTokensSwap, pTokensSwapBuilder } from '../src/index'

import {
  mockedMonitorCrossChainOperations,
  pTokenAssetFailingMock,
  pTokenAssetMock,
  pTokensProviderMock,
} from './mocks/ptoken-asset'
import interimExecuteReceipt from './utils/interim-operation-execute-receipt.json'
import receipt from './utils/user-send-receipt.json'
import { getBigIntJson } from './utils/utils'

jest.setTimeout(10000)

describe('pTokensSwap', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('Should swap asset without user data', async () => {
    const sourceAsset = new pTokenAssetMock({
      assetInfo: {
        networkId: NetworkId.GnosisMainnet,
        symbol: 'SOURCE',
        assetTokenAddress: 'token-contract-address',
        decimals: 6,
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
    const assetProvider = new pTokensProviderMock()
    const destinationAsset = new pTokenAssetMock({
      assetInfo: {
        networkId: NetworkId.PolygonMainnet,
        symbol: 'DESTINATION',
        assetTokenAddress: 'token-contract-address',
        decimals: 6,
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
      provider: assetProvider,
    })
    const interimProvider = new ptokensAssetEvm.pTokensEvmProvider({} as PublicClient)
    jest
      .spyOn(interimProvider, 'waitForTransactionConfirmation')
      .mockResolvedValueOnce(getBigIntJson(interimExecuteReceipt) as TransactionReceipt)
      .mockResolvedValue(getBigIntJson(receipt) as TransactionReceipt)
    interimProvider['monitorCrossChainOperations'] = mockedMonitorCrossChainOperations
    const swapSpy = jest.spyOn(sourceAsset, 'swap')
    const swap = new pTokensSwap(
      sourceAsset,
      [
        {
          asset: destinationAsset,
          destinationAddress: 'destination-address',
          networkFees: BigNumber(1e18),
          forwardNetworkFees: BigNumber(2e18),
        },
      ],
      BigNumber(10),
      '0x4049a2FB47ffaBC2Ec66d2183b4f3206a0312677',
      interimProvider,
    )
    const promi = swap.execute()
    let inputTxBroadcasted = false,
      inputTxConfirmed = false,
      interimOperationQueued = false,
      interimOperationExecuted = false,
      operationQueued = false,
      operationExecuted = false
    let inputTxBroadcastedObj,
      inputTxConfirmedObj,
      interimOperationQueuedObj,
      interimOperationExecutedObj,
      outputTxQueuedObj,
      outputTxExecutedObj
    const ret = await promi
      .on('inputTxBroadcasted', (obj) => {
        inputTxBroadcastedObj = obj
        inputTxBroadcasted = true
      })
      .on('inputTxConfirmed', (obj) => {
        inputTxConfirmedObj = obj
        inputTxConfirmed = true
      })
      .on('interimOperationQueued', (obj) => {
        interimOperationQueuedObj = obj
        interimOperationQueued = true
      })
      .on('interimOperationExecuted', (obj) => {
        interimOperationExecutedObj = obj
        interimOperationExecuted = true
      })
      .on('operationQueued', (obj) => {
        outputTxQueuedObj = obj
        operationQueued = true
      })
      .on('operationExecuted', (obj) => {
        outputTxExecutedObj = obj
        operationExecuted = true
      })
    expect(swapSpy).toHaveBeenNthCalledWith(
      1,
      BigNumber(10),
      'destination-address',
      NetworkId.PolygonMainnet,
      BigNumber(1e18),
      BigNumber(2e18),
      '0x0000000000000000000000000000000000000000000000000000000000000000',
      undefined,
    )
    expect(inputTxBroadcasted).toBeTruthy()
    expect(inputTxBroadcastedObj).toStrictEqual({ txHash: 'originating-tx-hash' })
    expect(inputTxConfirmed).toBeTruthy()
    expect(inputTxConfirmedObj).toStrictEqual({ operationId: 'operation-id', txHash: 'originating-tx-hash' })
    expect(interimOperationQueued).toBeTruthy()
    expect(interimOperationQueuedObj).toStrictEqual({
      operationId: 'operation-id',
      txHash: 'interim-operation-queued-tx-hash',
    })
    expect(interimOperationExecuted).toBeTruthy()
    expect(interimOperationExecutedObj).toStrictEqual({
      operationId: 'operation-id',
      txHash: 'interim-operation-executed-tx-hash',
    })
    expect(operationQueued).toBeTruthy()
    expect(outputTxQueuedObj).toStrictEqual({
      operationId: '0xb68e25afc0680bd3930459e5cfd3bc5b4cc0c07a67cfab9433a3d9337b2996ca',
      txHash: 'operation-queued-tx-hash',
    })
    expect(operationExecuted).toBeTruthy()
    expect(outputTxExecutedObj).toStrictEqual({
      operationId: '0xb68e25afc0680bd3930459e5cfd3bc5b4cc0c07a67cfab9433a3d9337b2996ca',
      txHash: 'operation-executed-tx-hash',
    })
    expect(ret).toStrictEqual({
      operationId: '0xb68e25afc0680bd3930459e5cfd3bc5b4cc0c07a67cfab9433a3d9337b2996ca',
      txHash: 'operation-executed-tx-hash',
    })
  })

  test('Should swap asset with user data', async () => {
    const builder = new pTokensSwapBuilder()
    const sourceAsset = new pTokenAssetMock({
      assetInfo: {
        networkId: NetworkId.PolygonMainnet,
        symbol: 'SOURCE',
        assetTokenAddress: 'token-contract-address',
        decimals: 6,
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
    const assetProvider = new pTokensProviderMock()
    const destinationAsset = new pTokenAssetMock({
      assetInfo: {
        networkId: NetworkId.PolygonMainnet,
        symbol: 'DESTINATION',
        assetTokenAddress: 'token-contract-address',
        decimals: 6,
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
      provider: assetProvider,
    })
    const interimProvider = new ptokensAssetEvm.pTokensEvmProvider({} as PublicClient)
    jest
      .spyOn(interimProvider, 'waitForTransactionConfirmation')
      .mockResolvedValueOnce(getBigIntJson(interimExecuteReceipt) as TransactionReceipt)
      .mockResolvedValue(getBigIntJson(receipt) as TransactionReceipt)
    interimProvider['monitorCrossChainOperations'] = mockedMonitorCrossChainOperations
    const swapSpy = jest.spyOn(sourceAsset, 'swap')
    builder
      .setAmount(123.456)
      .setSourceAsset(sourceAsset)
      .addDestinationAsset(
        destinationAsset,
        '0x28B2A40b6046850a569843cF740f15CF29792Ac2',
        Buffer.from('user-data').toString('hex'),
      )
      .setInterimHubAddress('0x4049a2FB47ffaBC2Ec66d2183b4f3206a0312677')
      .setInterimProvider(interimProvider)
      .setInterimChain(NetworkId.PolygonMainnet)
    const swap = await builder.build()
    const promi = swap.execute()
    let inputTxBroadcasted = false,
      inputTxConfirmed = false,
      interimOperationQueued = false,
      interimOperationExecuted = false,
      operationQueued = false,
      operationExecuted = false
    let inputTxBroadcastedObj,
      inputTxConfirmedObj,
      interimOperationQueuedObj,
      interimOperationExecutedObj,
      outputTxQueuedObj,
      outputTxExecutedObj
    const ret = await promi
      .on('inputTxBroadcasted', (obj) => {
        inputTxBroadcastedObj = obj
        inputTxBroadcasted = true
      })
      .on('inputTxConfirmed', (obj) => {
        inputTxConfirmedObj = obj
        inputTxConfirmed = true
      })
      .on('interimOperationQueued', (obj) => {
        interimOperationQueuedObj = obj
        interimOperationQueued = true
      })
      .on('interimOperationExecuted', (obj) => {
        interimOperationExecutedObj = obj
        interimOperationExecuted = true
      })
      .on('operationQueued', (obj) => {
        outputTxQueuedObj = obj
        operationQueued = true
      })
      .on('operationExecuted', (obj) => {
        outputTxExecutedObj = obj
        operationExecuted = true
      })
    expect(swapSpy).toHaveBeenNthCalledWith(
      1,
      BigNumber(123.456),
      '0x28B2A40b6046850a569843cF740f15CF29792Ac2',
      NetworkId.PolygonMainnet,
      BigNumber(0),
      BigNumber(0),
      '0x0000000000000000000000000000000000000000000000000000000000000000',
      '757365722d64617461',
    )
    expect(inputTxBroadcasted).toBeTruthy()
    expect(inputTxBroadcastedObj).toStrictEqual({ txHash: 'originating-tx-hash' })
    expect(inputTxConfirmed).toBeTruthy()
    expect(inputTxConfirmedObj).toStrictEqual({ operationId: 'operation-id', txHash: 'originating-tx-hash' })
    expect(interimOperationQueued).toBeTruthy()
    expect(interimOperationQueuedObj).toStrictEqual({
      operationId: 'operation-id',
      txHash: 'interim-operation-queued-tx-hash',
    })
    expect(interimOperationExecuted).toBeTruthy()
    expect(interimOperationExecutedObj).toStrictEqual({
      operationId: 'operation-id',
      txHash: 'interim-operation-executed-tx-hash',
    })
    expect(operationQueued).toBeTruthy()
    expect(outputTxQueuedObj).toStrictEqual({
      operationId: '0xb68e25afc0680bd3930459e5cfd3bc5b4cc0c07a67cfab9433a3d9337b2996ca',
      txHash: 'operation-queued-tx-hash',
    })
    expect(operationExecuted).toBeTruthy()
    expect(outputTxExecutedObj).toStrictEqual({
      operationId: '0xb68e25afc0680bd3930459e5cfd3bc5b4cc0c07a67cfab9433a3d9337b2996ca',
      txHash: 'operation-executed-tx-hash',
    })
    expect(ret).toStrictEqual({
      operationId: '0xb68e25afc0680bd3930459e5cfd3bc5b4cc0c07a67cfab9433a3d9337b2996ca',
      txHash: 'operation-executed-tx-hash',
    })
  })

  test('Should reject if swap fails', async () => {
    const builder = new pTokensSwapBuilder()
    const sourceAsset = new pTokenAssetFailingMock({
      assetInfo: {
        networkId: NetworkId.GnosisMainnet,
        symbol: 'SRC',
        assetTokenAddress: 'token-contract-address',
        decimals: 6,
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
    const destinationAssetProvider = new pTokensProviderMock()
    const destinationAsset = new pTokenAssetMock({
      assetInfo: {
        networkId: NetworkId.PolygonMainnet,
        symbol: 'DST',
        assetTokenAddress: 'token-contract-address',
        decimals: 6,
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
    const swapSpy = jest.spyOn(sourceAsset, 'swap')
    const waitForTransactionConfirmationSpy = jest.spyOn(destinationAssetProvider, 'waitForTransactionConfirmation')
    builder
      .setAmount(123.456)
      .setSourceAsset(sourceAsset)
      .setNetworkFees(1e9)
      .setForwardNetworkFees(2e9)
      .addDestinationAsset(
        destinationAsset,
        '0xE37c0D48d68da5c5b14E5c1a9f1CFE802776D9FF',
        Buffer.from('user-data').toString('hex'),
      )
      .setInterimHubAddress('0x4049a2FB47ffaBC2Ec66d2183b4f3206a0312677')
    const swap = await builder.build()
    try {
      await swap.execute()
    } catch (_err) {
      expect(_err.message).toStrictEqual('swap error')
      expect(swapSpy).toHaveBeenNthCalledWith(
        1,
        BigNumber(123.456),
        '0xE37c0D48d68da5c5b14E5c1a9f1CFE802776D9FF',
        NetworkId.PolygonMainnet,
        BigNumber(1e9),
        BigNumber(2e9),
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '757365722d64617461',
      )
      expect(waitForTransactionConfirmationSpy).toHaveBeenCalledTimes(0)
    }
  })

  // Note: this test causes jest to report 'A worker process has failed to exit gracefully and has been force exited.
  // // This is likely caused by tests leaking due to improper teardown. Try running with --detectOpenHandles to find leaks.
  // // Active timers can also cause this, ensure that .unref() was called on them.'
  // // This is because the polling function withing the transactions monitoring does not exit when abort is sent
  // test('Should abort a running swap', async () => {
  //   const node = new pTokensNode(new pTokensNodeProvider('test-url'))
  //   jest.spyOn(pTokensNode.prototype, 'getSupportedChainsByAsset').mockImplementation(() => {
  //     return Promise.resolve([
  //       {
  //         networkId: NetworkId.BitcoinMainnet,
  //         isNative: false,
  //         assetTokenAddress: '',
  //         isSystemToken: false,
  //       },
  //       {
  //         networkId: NetworkId.GnosisMainnet,
  //         isNative: false,
  //         assetTokenAddress: '',
  //         isSystemToken: false,
  //       },
  //     ])
  //   })
  //   const getTransactionStatusSpy = jest.spyOn(pTokensNode.prototype, 'getTransactionStatus')
  //   getTransactionStatusSpy.mockResolvedValue({ inputs: [], outputs: [] })

  //   const builder = new pTokensSwapBuilder()
  //   const sourceAsset = new pTokenAssetMock({
  //     symbol: 'SOURCE',
  //     networkId: NetworkId.BitcoinMainnet,
  //     blockchain: Blockchain.Bitcoin,
  //     network: Network.Mainnet,
  //   })
  //   const destinationAsset = new pTokenAssetMock({
  //     symbol: 'DESTINATION',
  //     networkId: NetworkId.GnosisMainnet,
  //     blockchain: Blockchain.Ethereum,
  //     network: Network.Mainnet,
  //   })
  //   builder.setAmount(123.456).setSourceAsset(sourceAsset).addDestinationAsset(destinationAsset, 'destination-address')
  //   const swap = await builder.build()
  //   try {
  //     const promi = swap.execute()
  //     setTimeout(() => swap.abort(), 1000)
  //     await promi
  //   } catch (err) {
  //     expect(err.message).toStrictEqual('Swap aborted by user')
  //   }
  // })
})

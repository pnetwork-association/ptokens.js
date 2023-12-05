import BigNumber from 'bignumber.js'
import PromiEvent from 'promievent'
import { getOperationIdFromLog } from 'ptokens-assets-evm'
import { INTERIM_CHAIN_NETWORK_ID } from 'ptokens-constants'
import { SwapResult, pTokensAsset } from 'ptokens-entities'

import { interimProvider } from './lib'

export type DestinationInfo = {
  asset: pTokensAsset
  destinationAddress: string
  networkFees: BigNumber
  forwardNetworkFees: BigNumber
  userData?: string
  toNative?: boolean
}

export class pTokensSwap {
  private _sourceAsset: pTokensAsset
  private _destinationAssets: DestinationInfo[]
  private _amount: BigNumber
  private _controller: AbortController
  private _interimHubAddress: string
  private _interimProvider: interimProvider

  /**
   * Create and initialize a pTokensSwap object. pTokensSwap object shall be created using a pTokensSwapBuilder object.
   * @param sourceAsset - The pTokensAsset that will be the source asset for the swap.
   * @param destinationAssets - The pTokensAsset array that will be destination assets for the swap.
   * @param amount - The amount of source asset that will be swapped.
   * @param interimNetworkId - The NetworkId of the InterimChain.
   */
  constructor(
    sourceAsset: pTokensAsset,
    destinationAssets: DestinationInfo[],
    amount: BigNumber.Value,
    interimHubAddress: string,
    interimProvider: interimProvider,
  ) {
    this._sourceAsset = sourceAsset
    if (destinationAssets.length !== 1) throw new Error('There must be one and only one destination asset')
    this._destinationAssets = destinationAssets
    this._amount = BigNumber(amount)
    this._controller = new AbortController()
    this._interimHubAddress = interimHubAddress
    this._interimProvider = interimProvider
    if (!this.isAmountSufficient()) throw new Error('Insufficient amount to cover fees')
  }

  /**
   * Return the pTokensAsset set as source asset for the swap.
   */
  get sourceAsset(): pTokensAsset {
    return this._sourceAsset
  }

  /**
   * Return the pTokensAsset array set as destination assets for the swap.
   */
  get destinationAssets(): pTokensAsset[] {
    return this._destinationAssets.map((_el) => _el.asset)
  }

  /**
   * Return the amount of source asset that will be swapped.
   */
  get amount(): string {
    return this._amount.toFixed()
  }

  /**
   * Return the pTokensNode set when creating the builder.
   */
  private getSwapBasisPoints() {
    // take the first destination asset as, for now, pNetwork supports just one destination
    return 20
  }

  /**
   * Get expected protocol fees for the swap
   */
  get protocolFees() {
    const interimAmount = this._amount.multipliedBy(1e18)
    const basisPoints = this.getSwapBasisPoints()
    return BigNumber.maximum(interimAmount.multipliedBy(basisPoints).dividedBy(10000)).dividedBy(1e18).toFixed()
  }

  /**
   * Get expected network fees for the swap
   */
  get networkFees() {
    return BigNumber(this._destinationAssets[0].networkFees)
      .plus(this._destinationAssets[0].forwardNetworkFees)
      .dividedBy(1e18)
      .toFixed()
  }

  /**
   * Get expected output amount for the swap
   */
  get expectedOutputAmount() {
    return this._amount.minus(this.protocolFees).minus(this.networkFees).toFixed()
  }

  private isAmountSufficient() {
    return BigNumber(this.expectedOutputAmount).isGreaterThanOrEqualTo(0)
  }

  private monitorInterimTransactions(_operationId: string) {
    return this._interimProvider.monitorCrossChainOperations(this._interimHubAddress, _operationId)
  }

  private monitorOutputTransactions(_operationId: string) {
    return this.destinationAssets[0]['monitorCrossChainOperations'](_operationId)
  }

  /**
   * Abort a running swap.
   */
  /* istanbul ignore next */
  abort() {
    this._controller.abort()
  }

  /**
   * Execute a swap. The function returns a PromiEvent, i.e. a Promise that can also emit events.
   * In particular, the events fired during the execution are the following:
   * * _inputTxBroadcasted_ -\> fired with hash of the transaction initiating the swap when it is broadcasted;
   * * _inputTxConfirmed_ -\> fired with hash of the transaction initiating the swap when it is confirmed;
   * * _operationQueued_ -\> fired with a SwapResult object when pNetwork queues the operation in the destination blockchain;
   * * _operationExecuted_ -\> fired with a SwapResult object when pNetwork executes the queued operation;
   * * _operationCancelled_ -\> fired with a SwapResult object when pNetwork cancels the queued operation;
   * @returns A PromiEvent that resolves with the transaction status of the resulting output transactions.
   * If the destination asset has a provider, the PromiEvent resolves when the output transaction is confirmed; otherwise when it is broadcasted.
   */
  execute() {
    const promi = new PromiEvent<SwapResult>(
      (resolve, reject) =>
        (async () => {
          try {
            this._controller.signal.addEventListener('abort', () => reject(new Error('Swap aborted by user')))
            const swapResult = await this.sourceAsset['swap'](
              this._amount,
              this._destinationAssets[0].destinationAddress,
              this._destinationAssets[0].asset.networkId,
              this._destinationAssets[0].networkFees,
              this._destinationAssets[0].forwardNetworkFees,
              this._destinationAssets[0].toNative
                ? '0x0000000000000000000000000000000000000000000000000000000000000001'
                : '0x0000000000000000000000000000000000000000000000000000000000000000',
              this._destinationAssets[0].userData,
            )
              .on('txBroadcasted', (_swapResult: SwapResult) => {
                promi.emit('inputTxBroadcasted', { txHash: _swapResult.txHash })
              })
              .on('txConfirmed', (_swapResult: SwapResult) => {
                promi.emit('inputTxConfirmed', _swapResult)
              })
            const interimLog = await this.monitorInterimTransactions(swapResult.operationId)
              .on('operationQueued', (_hash: string) => {
                promi.emit('interimOperationQueued', { txHash: _hash, operationId: swapResult.operationId })
              })
              .on('operationExecuted', (_hash: string) => {
                promi.emit('interimOperationExecuted', { txHash: _hash, operationId: swapResult.operationId })
              })
              .on('operationCancelled', (_hash: string) => {
                promi.emit('interimOperationCancelled', { txHash: _hash, operationId: swapResult.operationId })
              })
            // const interimExecutedReceipt = await this._interimProvider.waitForTransactionConfirmation(interimTxHash, 2)
            const destChainOperationId = getOperationIdFromLog(interimLog, INTERIM_CHAIN_NETWORK_ID)
            const outputLog = await this.monitorOutputTransactions(destChainOperationId)
              .on('operationQueued', (_hash: string) => {
                promi.emit('operationQueued', { txHash: _hash, operationId: destChainOperationId })
              })
              .on('operationExecuted', (_hash: string) => {
                promi.emit('operationExecuted', { txHash: _hash, operationId: destChainOperationId })
              })
              .on('operationCancelled', (_hash: string) => {
                promi.emit('operationCancelled', { txHash: _hash, operationId: destChainOperationId })
              })
            return resolve({ txHash: outputLog, operationId: destChainOperationId })
          } catch (err) {
            return reject(err)
          }
        })() as unknown,
    )
    return promi
  }
}

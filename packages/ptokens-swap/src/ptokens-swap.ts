import BigNumber from 'bignumber.js'
import PromiEvent from 'promievent'
import { SwapResult, pTokensAsset } from 'ptokens-entities'

export type DestinationInfo = {
  asset: pTokensAsset
  destinationAddress: string
  userData?: string
  toNative?: boolean
}

export class pTokensSwap {
  private _sourceAsset: pTokensAsset
  private _destinationAssets: DestinationInfo[]
  private _amount: BigNumber
  private _controller: AbortController

  /**
   * Create and initialize a pTokensSwap object. pTokensSwap object shall be created using a pTokensSwapBuilder object.
   * @param sourceAsset - The pTokensAsset that will be the source asset for the swap.
   * @param destinationAssets - The pTokensAsset array that will be destination assets for the swap.
   * @param amount - The amount of source asset that will be swapped.
   */
  constructor(sourceAsset: pTokensAsset, destinationAssets: DestinationInfo[], amount: BigNumber.Value) {
    this._sourceAsset = sourceAsset
    this._destinationAssets = destinationAssets
    this._amount = BigNumber(amount)
    this._controller = new AbortController()
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

  // /**
  //  * Return the pTokensNode set when creating the builder.
  //  */
  // private getSwapBasisPoints() {
  //   // take the first destination asset as, for now, pNetwork supports just one destination
  //   if ('nativeToNative' in this._sourceAsset.assetInfo.fees.basisPoints)
  //     return this._sourceAsset.assetInfo.fees.basisPoints.nativeToNative
  //   else if ('hostToNative' in this._sourceAsset.assetInfo.fees.basisPoints)
  //     return this._sourceAsset.assetInfo.fees.basisPoints.hostToNative
  //   else throw new Error('Invalid basis points')
  // }

  // /**
  //  * Get expected protocol fees for the swap
  //  */
  // get protocolFees() {
  //   const interimAmount = this._amount.multipliedBy(1e18)
  //   const basisPoints = this.getSwapBasisPoints()
  //   return BigNumber.maximum(
  //     this._sourceAsset.assetInfo.fees.minNodeOperatorFee,
  //     interimAmount.multipliedBy(basisPoints).dividedBy(10000)
  //   )
  //     .dividedBy(1e18)
  //     .toFixed()
  // }

  // /**
  //  * Get expected network fees for the swap
  //  */
  // get networkFees() {
  //   return BigNumber(this._destinationAssets[0].asset.assetInfo.fees.networkFee).dividedBy(1e18).toFixed()
  // }

  /**
   * Get expected output amount for the swap
   */
  get expectedOutputAmount() {
    return this._amount.toFixed() // .minus(this.protocolFees).minus(this.networkFees).toFixed()
  }

  private isAmountSufficient() {
    return BigNumber(this.expectedOutputAmount).isGreaterThanOrEqualTo(0)
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
   * * _depositAddress_ -\> fired with the deposit address where a user would transfer the source asset (applies for source pTokensUtxoAsset only);
   * * _inputTxBroadcasted_ -\> fired with hash of the transaction initiating the swap when it is broadcasted;
   * * _inputTxConfirmed_ -\> fired with hash of the transaction initiating the swap when it is confirmed;
   * * _inputTxDetected_ -\> fired with a InnerTransactionStatus object related to the input transaction, when the pNetwork detects the swap request;
   * * _outputTxDetected_ -\> fired with a InnerTransactionStatus object related to the output transaction, when the pNetwork builds the output transaction;
   * * _outputTxBroadcasted_ -\> fired with a InnerTransactionStatus object related to the output transaction, when the pNetwork broadcasts the output transaction;
   * * _outputTxConfirmed_ -\> fired with a InnerTransactionStatus object related to the output transaction, when it is confirmed, only when the destination asset has a provider;
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
              this._destinationAssets[0].userData,
              this._destinationAssets[0].toNative
                ? '0x0000000000000000000000000000000000000000000000000000000000000001'
                : '0x0000000000000000000000000000000000000000000000000000000000000000'
            )
              .on('txBroadcasted', (_swapResult: SwapResult) => {
                promi.emit('inputTxBroadcasted', { txHash: _swapResult.txHash })
              })
              .on('txConfirmed', (_swapResult: SwapResult) => {
                promi.emit('inputTxConfirmed', _swapResult)
              })
            const outputTx = await this.monitorOutputTransactions(swapResult.operationId)
              .on('operationQueued', (_hash: string) => {
                promi.emit('operationQueued', { txHash: _hash, operationId: swapResult.operationId })
              })
              .on('operationExecuted', (_hash: string) => {
                promi.emit('operationExecuted', { txHash: _hash, operationId: swapResult.operationId })
              })
              .on('operationCancelled', (_hash: string) => {
                promi.emit('operationCancelled', { txHash: _hash, operationId: swapResult.operationId })
              })
            return resolve({ txHash: outputTx, operationId: swapResult.operationId })
          } catch (err) {
            return reject(err)
          }
        })() as unknown
    )
    return promi
  }
}

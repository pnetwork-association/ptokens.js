import BigNumber from 'bignumber.js'
import PromiEvent from 'promievent'
import { BlockchainType } from 'ptokens-constants'
import { pTokensAsset, pTokenAssetConfig, SwapResult } from 'ptokens-entities'
import { Log, TransactionReceipt, WalletClient } from 'viem'

import pNetworkHubAbi from './abi/PNetworkHubAbi'
import { getOperationIdFromTransactionReceipt, onChainFormat } from './lib'
import { pTokensEvmProvider } from './ptokens-evm-provider'

const USER_SEND_METHOD = 'userSend'

export type pTokenEvmAssetConfig = pTokenAssetConfig & {
  /** An pTokensEvmProvider for interacting with the underlaying blockchain */
  provider: pTokensEvmProvider
}

export class pTokensEvmAsset extends pTokensAsset {
  private _provider: pTokensEvmProvider

  /**
   * Create and initialize a pTokensEvmAsset object. pTokensEvmAsset objects shall be created with a pTokensEvmAssetBuilder instance.
   */
  constructor(config: pTokenEvmAssetConfig) {
    if (config.assetInfo.decimals === undefined) throw new Error('Missing decimals')
    super(config, BlockchainType.EVM)
    this._provider = config.provider
  }

  get provider() {
    return this._provider
  }

  /**
   * Set a walletProvider.
   * @param _walletClient - A viem walletClient.
   * @returns The same builder. This allows methods chaining.
   */
  setWalletClient(_walletClient: WalletClient): this {
    this._provider.setWalletClient(_walletClient)
    return this
  }

  protected swap(
    _amount: BigNumber,
    _destinationAddress: string,
    _destinationChainId: string,
    _networkFees = BigNumber(0),
    _forwardNetworkFees = BigNumber(0),
    _optionsMask = '0x0000000000000000000000000000000000000000000000000000000000000000',
    _userData = '0x',
  ): PromiEvent<SwapResult> {
    const promi = new PromiEvent<SwapResult>(
      (resolve, reject) =>
        (async () => {
          try {
            if (!this._provider) return reject(new Error('Missing provider'))
            const args = [
              _destinationAddress, // destinationAccount
              _destinationChainId, // destinationNetworkId
              this.assetInfo.underlyingAssetName, // underlyingAssetName
              this.assetInfo.underlyingAssetSymbol, // underlyingAssetSymbol
              this.assetInfo.underlyingAssetDecimals, // underlyingAssetDecimals
              this.assetInfo.underlyingAssetTokenAddress, // underlyingAssetTokenAddress
              this.assetInfo.underlyingAssetNetworkId, // underlyingAssetNetworkId
              this.assetInfo.assetTokenAddress, // assetTokenAddress
              onChainFormat(_amount, this.assetInfo.decimals).toString(), // assetAmount
              _networkFees.toString(), // networkFeeAssetAmount
              _forwardNetworkFees.toString(), // forwardNetworkFeeAssetAmount
              _userData, // userData
              _optionsMask,
            ]
            const txReceipt: TransactionReceipt = await this._provider
              .makeContractSend(
                {
                  method: USER_SEND_METHOD,
                  abi: pNetworkHubAbi,
                  contractAddress: this.hubAddress,
                  value: 0n,
                },
                args,
              )
              .once('txBroadcasted', (_hash: string) => {
                promi.emit('txBroadcasted', { txHash: _hash })
              })
            const ret = {
              txHash: txReceipt.transactionHash.toString(),
              operationId: getOperationIdFromTransactionReceipt(this.networkId, txReceipt),
            }
            promi.emit('txConfirmed', ret)
            return resolve(ret)
          } catch (_err) {
            return reject(_err)
          }
        })() as unknown,
    )
    return promi
  }

  protected monitorCrossChainOperations(_operationId: string): PromiEvent<Log> {
    return this.provider.monitorCrossChainOperations(this.hubAddress, _operationId)
  }
}

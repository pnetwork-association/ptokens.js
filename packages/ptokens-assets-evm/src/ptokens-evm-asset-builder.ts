import { BlockchainType } from 'ptokens-constants'
import { pTokensAssetBuilder } from 'ptokens-entities'

import factoryAbi from './abi/PFactroryAbi'
import { pTokensEvmAsset } from './ptokens-evm-asset'
import { pTokensEvmProvider } from './ptokens-evm-provider'

export class pTokensEvmAssetBuilder extends pTokensAssetBuilder {
  private _provider: pTokensEvmProvider

  constructor(_provider: pTokensEvmProvider) {
    super(BlockchainType.EVM)
    this._provider = _provider
  }

  /**
   * Set a pTokensEvmProvider for creating and sending transactions.
   * @param _provider - A pTokensEvmProvider object.
   * @returns The same builder. This allows methods chaining.
   */
  setProvider(_provider: pTokensEvmProvider): this {
    this._provider = _provider
    return this
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  protected async _build(): Promise<pTokensEvmAsset> {
    const routerAddress = await this._provider.makeContractCall<string, []>({
      contractAddress: this.factoryAddress,
      method: 'router',
      abi: factoryAbi,
    })
    const stateManagerAddress: string = await this._provider.makeContractCall<string, []>({
      contractAddress: this.factoryAddress,
      method: 'stateManager',
      abi: factoryAbi,
    })
    const config = {
      networkId: this._networkId,
      blockchain: this._blockchain,
      network: this._network,
      assetInfo: this.assetInfo,
      provider: this._provider,
      factoryAddress: this.factoryAddress,
      routerAddress,
      stateManagerAddress,
    }
    return new pTokensEvmAsset(config)
  }
}

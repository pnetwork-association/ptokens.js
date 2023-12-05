import { BlockchainType } from 'ptokens-constants'
import { pTokensAssetBuilder } from 'ptokens-entities'

import { getEvmHubAddress, getEvmPToken } from './lib'
import { pTokenEvmAssetConfig, pTokensEvmAsset } from './ptokens-evm-asset'
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
    const hubAddress = await getEvmHubAddress(this._networkId, this._provider)
    const pTokenAddress = await getEvmPToken(this._networkId, this._provider, this.assetInfo)
    if (this.assetInfo.isNative) {
      if (this.assetInfo.assetTokenAddress != this.assetInfo.underlyingAssetTokenAddress)
        throw new Error(
          `Asset is native but ${this.assetInfo.assetTokenAddress} != ${this.assetInfo.underlyingAssetTokenAddress}`,
        )
      if (!this.assetInfo.pTokenAddress) this.assetInfo.pTokenAddress = pTokenAddress
      if (this.assetInfo.pTokenAddress != pTokenAddress)
        throw new Error(
          `Passed pToken is not correct: received -> ${this.assetInfo.pTokenAddress} correct -> ${pTokenAddress}`,
        )
    } else {
      if (this.assetInfo.assetTokenAddress == this.assetInfo.underlyingAssetTokenAddress)
        throw new Error(
          `pToken cannot be underlying of itself: ${this.assetInfo.assetTokenAddress} must be different from ${this.assetInfo.underlyingAssetTokenAddress}`,
        )
      if (!this.assetInfo.assetTokenAddress) this.assetInfo.assetTokenAddress = pTokenAddress
      if (this.assetInfo.assetTokenAddress != pTokenAddress)
        throw new Error(`Asset is pToken but ${this.assetInfo.assetTokenAddress} != ${pTokenAddress}`)
    }

    const config: pTokenEvmAssetConfig = {
      assetInfo: this.assetInfo,
      provider: this._provider,
      factoryAddress: this.factoryAddress,
      hubAddress: hubAddress,
      pTokenAddress: pTokenAddress,
    }
    return new pTokensEvmAsset(config)
  }
}

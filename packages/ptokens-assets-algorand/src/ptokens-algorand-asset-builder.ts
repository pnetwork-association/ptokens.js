import { BlockchainType, pTokensAssetBuilder } from 'ptokens-entities'
import { pTokensNode } from 'ptokens-node'
import { pTokensAlgorandAsset } from './ptokens-algorand-asset'
import { pTokensAlgorandProvider } from './ptokens-algorand-provider'

export class pTokensAlgorandAssetBuilder extends pTokensAssetBuilder {
  private provider: pTokensAlgorandProvider

  constructor(node: pTokensNode) {
    super(node, BlockchainType.ALGORAND)
  }

  setProvider(provider: pTokensAlgorandProvider): this {
    this.provider = provider
    return this
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async _build(): Promise<pTokensAlgorandAsset> {
    const config = {
      node: this._node,
      symbol: this._symbol,
      assetInfo: this._assetInfo,
      provider: this.provider,
      type: BlockchainType.ALGORAND,
    }
    return new pTokensAlgorandAsset(config)
  }
}

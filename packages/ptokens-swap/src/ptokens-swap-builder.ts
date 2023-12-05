import BigNumber from 'bignumber.js'
import { getDefaultEvmProvider, getEvmHubAddress } from 'ptokens-assets-evm'
import { BlockchainType, INTERIM_CHAIN_NETWORK_ID, NetworkId, networkIdToTypeMap } from 'ptokens-constants'
import { pTokensAsset } from 'ptokens-entities'
import { validators } from 'ptokens-helpers'

import { interimProvider } from './lib'
import { pTokensSwap, DestinationInfo } from './ptokens-swap'

export class pTokensSwapBuilder {
  private _sourceAsset: pTokensAsset
  private _destinationAssets: DestinationInfo[] = []
  private _amount: BigNumber
  private _networkFees: BigNumber
  private _forwardNetworkFees: BigNumber
  private _interimNetworkId: NetworkId
  private _interimProvider: interimProvider
  private _interimHubAddress: string

  /**
   * Return the pTokensAsset set as source asset for the swap.
   */
  get sourceAsset(): pTokensAsset {
    return this._sourceAsset
  }

  /**
   * Set the source asset for the swap.
   * @param _asset - A pTokenAsset that will be the swap source asset.
   * @returns The same builder. This allows methods chaining.
   */
  setSourceAsset(_asset: pTokensAsset) {
    this._sourceAsset = _asset
    return this
  }

  /**
   * Return the network fees absolute amount
   */
  get networkFees() {
    return this._networkFees || BigNumber(0)
  }

  /**
   * Set network fees absolute amount - withdrawal takes place in the interim chain
   * @param _amount - The absolute amount of fees willing to pay to relayers in the interim chain
   * @returns The same builder. This allows methods chaining.
   */
  setNetworkFees(_amount: BigNumber.Value) {
    this._networkFees = BigNumber(_amount)
    return this
  }

  /**
   * Return the forward network fees absolute amount
   */
  get forwardNetworkFees() {
    return this._forwardNetworkFees || BigNumber(0)
  }

  /**
   * Set forward network fees absolute amount - withdrawal takes place in the final chain
   * @param _amount - The absolute amount of fees willing to pay to relayers in the final chain
   * @returns The same builder. This allows methods chaining.
   */
  setForwardNetworkFees(_amount: BigNumber.Value) {
    this._forwardNetworkFees = BigNumber(_amount)
    return this
  }

  /**
   * Return the pTokensAsset array set as destination assets for the swap.
   * Actually, only one destination asset is supported by pNetwork v2.
   */
  get destinationAssets(): pTokensAsset[] {
    return this._destinationAssets.map((_el) => _el.asset)
  }

  /**
   * Add a destination pTokensAsset for the swap.
   * @param _asset - A pTokenAsset that will be one of the destination assets.
   * @param _destinationAddress - The destination address that will receive the _asset.
   * @param _userData - Optional user data.
   * @param _toNative - Optional flag to specify if the destination asset is the native one.
   * @param _networkFees - Optional interim chain network fees for this specific destination.
   * @param _forwardNetworkFees - Optional final chain network fees for this specific destination.
   * @returns The same builder. This allows methods chaining.
   */
  addDestinationAsset(
    _asset: pTokensAsset,
    _destinationAddress: string,
    _userData = '0x',
    _toNative = false,
    _networkFees?: BigNumber,
    _forwardNetworkFees?: BigNumber,
  ) {
    const isValidAddressFunction = validators.chainIdToAddressValidatorMap.get(_asset.networkId)
    if (!isValidAddressFunction(_destinationAddress)) throw new Error('Invalid destination address')
    this._destinationAssets.push({
      asset: _asset,
      destinationAddress: _destinationAddress,
      userData: _userData,
      toNative: _toNative,
      networkFees: _networkFees || this.networkFees,
      forwardNetworkFees: _forwardNetworkFees || this.forwardNetworkFees,
    })
    return this
  }

  /**
   * Return the amount of source asset that will be swapped.
   */
  get amount(): string {
    return this._amount.toFixed()
  }

  /**
   * Set the amount of source asset that will be swapped.
   * @param _amount - The amount of source asset that will be swapped.
   * @returns The same builder. This allows methods chaining.
   */
  setAmount(_amount: BigNumber.Value) {
    this._amount = BigNumber(_amount)
    return this
  }

  /**
   * Set Interim Chain NetworkId.
   * @param _networkId - The NetworkId of the Interim Chain.
   * @returns The same builder. This allows methods chaining.
   */
  setInterimChain(_networkId: NetworkId) {
    this._interimNetworkId = _networkId
    return this
  }

  /**
   * Set a Interim provider.
   * @param provider - A pTokensAssetProvider.
   * @returns The same builder. This allows methods chaining.
   */
  setInterimProvider(interimProvider: interimProvider): this {
    this._interimProvider = interimProvider
    return this
  }

  /**
   * Set the Interim Hub address.
   * @param interimHubAddress - A EVM address.
   * @returns The same builder. This allows methods chaining.
   */
  setInterimHubAddress(interimHubAddress: string): this {
    this._interimHubAddress = interimHubAddress
    return this
  }

  private isValidSwap() {
    return true // TODO: check ptoken adresses are the same
  }

  async getInterimHubAddress(): Promise<string> {
    return networkIdToTypeMap.get(INTERIM_CHAIN_NETWORK_ID) === BlockchainType.EVM
      ? await getEvmHubAddress(INTERIM_CHAIN_NETWORK_ID, this._interimProvider)
      : null
  }

  /**
   * Build a pTokensSwap object from the parameters set when interacting with the builder.
   * @returns - An immutable pTokensSwap object.
   */
  async build(): Promise<pTokensSwap> {
    if (!this._sourceAsset) throw new Error('Missing source asset')
    if (this._destinationAssets.length === 0) throw new Error('Missing destination assets')
    if (!this._amount) throw new Error('Missing amount')
    if (!this.isValidSwap()) throw new Error('Invalid swap')
    if (!this._interimNetworkId) this.setInterimChain(INTERIM_CHAIN_NETWORK_ID)
    // Only EVM is currently supported
    if (!this._interimProvider)
      networkIdToTypeMap.get(INTERIM_CHAIN_NETWORK_ID) === BlockchainType.EVM
        ? this.setInterimProvider(getDefaultEvmProvider(INTERIM_CHAIN_NETWORK_ID))
        : null
    if (!this._interimHubAddress) this.setInterimHubAddress(await this.getInterimHubAddress())

    return new pTokensSwap(
      this.sourceAsset,
      this._destinationAssets,
      this._amount,
      this._interimHubAddress,
      this._interimProvider,
    )
  }
}

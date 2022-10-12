import { BlockchainType } from 'ptokens-constants'
import { pTokensAsset, pTokenAssetConfig } from 'ptokens-entities'
import { pTokensEvmProvider } from './ptokens-evm-provider'
import { onChainFormat } from './lib'

import PromiEvent from 'promievent'
import BigNumber from 'bignumber.js'
import { AbiItem } from 'web3-utils'

import pERC20VaultContractAbi from './abi/pERC20VaultContractAbi.json'
import pTokenOnEVMContractAbi from './abi/pTokenOnETHV2ContractAbi.json'

const SYSTEM_TOKEN_PEG_IN_METHOD = 'pegInEth'
const ERC20_TOKEN_PEG_IN_METHOD = 'pegIn'
const ERC20_TOKEN_PEG_OUT_METHOD = 'redeem'

export type pTokenEvmAssetConfig = pTokenAssetConfig & { provider?: pTokensEvmProvider }
export class pTokensEvmAsset extends pTokensAsset {
  private provider: pTokensEvmProvider

  constructor(config: pTokenEvmAssetConfig) {
    if (config.assetInfo.decimals === undefined) throw new Error('Missing decimals')
    super(config, BlockchainType.EVM)
    this.provider = config.provider
  }

  nativeToInterim(
    amount: BigNumber,
    destinationAddress: string,
    destinationChainId: string,
    userData?: Uint8Array
  ): PromiEvent<string> {
    const promi = new PromiEvent<string>(
      (resolve, reject) =>
        (async () => {
          try {
            if (!this.provider) return reject(new Error('Missing provider'))
            if (!this.assetInfo.isNative)
              return reject(new Error('Invalid call to nativeToInterim() for non-native token'))
            if (!this.assetInfo.vaultAddress) return reject(new Error('Missing vault address'))
            const txHash: string = await this.provider
              .makeContractSend(
                {
                  method: !this.assetInfo.tokenAddress ? SYSTEM_TOKEN_PEG_IN_METHOD : ERC20_TOKEN_PEG_IN_METHOD,
                  abi: pERC20VaultContractAbi as unknown as AbiItem,
                  contractAddress: this.assetInfo.vaultAddress,
                  value: !this.assetInfo.tokenAddress ? +onChainFormat(amount, this.assetInfo.decimals) : 0,
                },
                userData
                  ? !this.assetInfo.tokenAddress
                    ? [destinationAddress, destinationChainId, userData]
                    : [
                        onChainFormat(amount, this.assetInfo.decimals).toFixed(),
                        this.assetInfo.tokenAddress,
                        destinationAddress,
                        userData,
                        destinationChainId,
                      ]
                  : !this.assetInfo.tokenAddress
                  ? [destinationAddress, destinationChainId]
                  : [
                      onChainFormat(amount, this.assetInfo.decimals).toFixed(),
                      this.assetInfo.tokenAddress,
                      destinationAddress,
                      destinationChainId,
                    ]
              )
              .once('txBroadcasted', (_hash) => promi.emit('txBroadcasted', _hash))
              .once('txConfirmed', (_hash: string) => promi.emit('txConfirmed', _hash))
              .once('txError', reject)
            return resolve(txHash)
          } catch (err) {
            return reject(err)
          }
        })() as unknown
    )
    return promi
  }

  hostToInterim(
    amount: BigNumber,
    destinationAddress: string,
    destinationChainId: string,
    userData?: Uint8Array
  ): PromiEvent<string> {
    const promi = new PromiEvent<string>(
      (resolve, reject) =>
        (async () => {
          try {
            if (!this.provider) return reject(new Error('Missing provider'))
            if (this.assetInfo.isNative) return reject(new Error('Invalid call to hostToInterim() for native token'))
            const txHash: string = await this.provider
              .makeContractSend(
                {
                  method: ERC20_TOKEN_PEG_OUT_METHOD,
                  abi: pTokenOnEVMContractAbi as unknown as AbiItem,
                  contractAddress: this.assetInfo.tokenAddress,
                  value: 0,
                },
                userData
                  ? [
                      onChainFormat(amount, this.assetInfo.decimals).toFixed(),
                      userData,
                      destinationAddress,
                      destinationChainId,
                    ]
                  : [onChainFormat(amount, this.assetInfo.decimals).toFixed(), destinationAddress, destinationChainId]
              )
              .once('txBroadcasted', (_hash) => promi.emit('txBroadcasted', _hash))
              .once('txConfirmed', (_hash: string) => promi.emit('txConfirmed', _hash))
              .once('error', reject)
            return resolve(txHash)
          } catch (err) {
            return reject(err)
          }
        })() as unknown
    )
    return promi
  }
}

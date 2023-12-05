import { pTokensEvmProvider } from 'ptokens-assets-evm'
import { BlockchainType, InterimChainType } from 'ptokens-constants'

export type interimProvider = InterimChainType extends BlockchainType.EVM ? pTokensEvmProvider : never

import { sha256 } from '@noble/hashes/sha256'
import { AbiEvent, AbiEventParameter } from 'abitype'
import BigNumber from 'bignumber.js'
import { FactoryAddress, NetworkId } from 'ptokens-constants'
import { AssetInfo } from 'ptokens-entities'
import {
  Log,
  toBytes,
  toHex,
  encodeAbiParameters,
  decodeEventLog,
  getEventSelector,
  Chain,
  TransactionReceipt,
  createPublicClient,
  http,
} from 'viem'
import { arbitrum, bsc, gnosis, polygon } from 'viem/chains'

import factoryAbi from '../abi/PFactoryAbi'
import pNetworkHubAbi from '../abi/PNetworkHubAbi'
import { pTokensEvmProvider } from '../ptokens-evm-provider'

const events = pNetworkHubAbi.filter(({ type }) => type === 'event') as AbiEvent[]
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const networkIdToViemChain: Record<NetworkId, Chain> = {
  [NetworkId.ArbitrumMainnet]: arbitrum,
  [NetworkId.BscMainnet]: bsc,
  [NetworkId.GnosisMainnet]: gnosis,
  [NetworkId.PolygonMainnet]: polygon,
}

export const formatAddress = (_address: string): `0x${string}` =>
  _address.startsWith('0x') ? (_address as `0x${string}`) : (('0x' + _address) as `0x${string}`)

export const getViemChain = (networkId: NetworkId): Chain => {
  switch (networkId) {
    case NetworkId.PolygonMainnet:
      return polygon
      break
    default:
      throw new Error(`${networkId} is not supported by ptokens.js`)
  }
}

export function onChainFormat(_amount: BigNumber.Value, _decimals: number): BigNumber {
  return BigNumber(_amount).multipliedBy(BigNumber(10).pow(_decimals))
}

export function offChainFormat(_amount: BigNumber.Value, _decimals: number) {
  return BigNumber(_amount).dividedBy(BigNumber(10).pow(_decimals))
}

export enum EVENT_NAMES {
  OPERATION_QUEUED = 'OperationQueued',
  OPERATION_EXECUTED = 'OperationExecuted',
  OPERATION_CANCELLED = 'OperationCancelled',
  USER_OPERATION = 'UserOperation',
}

export const eventNameToSignatureMap = new Map<string, string>(
  events.map((_event) => {
    const signature = getEventSelector(_event)
    return [_event.name, signature]
  }),
)

const getOperationIdFromObj = (_obj: any) => {
  const events = pNetworkHubAbi.filter((_) => _.type === 'event') as AbiEvent[]
  const tuple = events.find((_event) => _event.name === (EVENT_NAMES.OPERATION_EXECUTED as string))
    ?.inputs as AbiEventParameter[]

  const coded = encodeAbiParameters(tuple, [
    {
      originBlockHash: _obj.originatingBlockHash || _obj.originBlockHash || _obj.blockHash,
      originTransactionHash: _obj.originatingTransactionHash || _obj.originTransactionHash || _obj.transactionHash,
      originNetworkId: _obj.originatingNetworkId || _obj.originNetworkId || _obj.networkId,
      nonce: _obj.nonce,
      originAccount: _obj.originAccount,
      destinationAccount: _obj.destinationAccount,
      destinationNetworkId: _obj.destinationNetworkId,
      forwardDestinationNetworkId: _obj.forwardDestinationNetworkId,
      underlyingAssetName: _obj.underlyingAssetName,
      underlyingAssetSymbol: _obj.underlyingAssetSymbol,
      underlyingAssetDecimals: _obj.underlyingAssetDecimals,
      underlyingAssetTokenAddress: _obj.underlyingAssetTokenAddress,
      underlyingAssetNetworkId: _obj.underlyingAssetNetworkId,
      assetAmount: _obj.assetAmount,
      userDataProtocolFeeAssetAmount: _obj.userDataProtocolFeeAssetAmount,
      networkFeeAssetAmount: _obj.networkFeeAssetAmount,
      forwardNetworkFeeAssetAmount: _obj.forwardNetworkFeeAssetAmount,
      userData: _obj.userData || '0x',
      optionsMask: _obj.optionsMask,
      isForProtocol: _obj.isForProtocol,
    },
  ])

  return toHex(sha256(toBytes(coded)))
}

export const getOperationIdFromLog = (_log: Log, _networkId: NetworkId | null = null) => {
  const decodedLog = decodeEventLog({
    abi: pNetworkHubAbi,
    ..._log,
  })
  return getOperationIdFromObj(
    Object.assign(
      {},
      'operation' in decodedLog.args ? decodedLog.args.operation : decodedLog.args,
      {
        transactionHash: _log.transactionHash,
        blockHash: _log.blockHash,
      },
      _networkId ? { networkId: _networkId } : {},
    ),
  )
}

export const getOperationIdFromTransactionReceipt = (_networkId: NetworkId, _receipt: TransactionReceipt<bigint>) => {
  const relevantLog = _receipt.logs.find(
    (_log) => _log.topics[0] === eventNameToSignatureMap.get(EVENT_NAMES.USER_OPERATION), //||
    // _log.topics[0] === eventNameToSignatureMap.get(EVENT_NAMES.OPERATION_QUEUED) ||
    // _log.topics[0] === eventNameToSignatureMap.get(EVENT_NAMES.OPERATION_EXECUTED) ||
    // _log.topics[0] === eventNameToSignatureMap.get(EVENT_NAMES.OPERATION_CANCELLED),
  )
  if (!relevantLog) throw new Error('No valid event in the receipt logs')
  const operationIds = getOperationIdFromLog(relevantLog, _networkId)
  return operationIds
}

export const getDefaultEvmProvider = (_networkId: NetworkId) =>
  new pTokensEvmProvider(
    createPublicClient({
      chain: networkIdToViemChain[_networkId],
      transport: http(),
    }),
  )

export const getFactoryAddress = (_networkId: NetworkId): string => {
  const factoryAddress = FactoryAddress.get(_networkId)
  if (!factoryAddress) throw new Error(`Could not retreive ${_networkId} Factory address`)
  return factoryAddress
}

export const getEvmHubAddress = async (_networkId: NetworkId, _evmProvider: pTokensEvmProvider): Promise<string> => {
  try {
    return await _evmProvider.makeContractCall<string, []>({
      contractAddress: getFactoryAddress(_networkId),
      method: 'hub',
      abi: factoryAbi,
    })
  } catch (_err) {
    if (!(_err instanceof Error)) throw new Error('Invalid Error type')
    throw new Error(_err.message)
  }
}

export const getEvmPToken = async (
  _networkId: NetworkId,
  _evmProvider: pTokensEvmProvider,
  _assetInfo: AssetInfo,
): Promise<string> => {
  try {
    return await _evmProvider.makeContractCall<string, [string, string, number, string, string]>(
      {
        contractAddress: getFactoryAddress(_networkId),
        method: 'getPTokenAddress',
        abi: factoryAbi,
      },
      [
        _assetInfo.underlyingAssetName,
        _assetInfo.underlyingAssetSymbol,
        _assetInfo.underlyingAssetDecimals,
        _assetInfo.underlyingAssetTokenAddress,
        _assetInfo.underlyingAssetNetworkId,
      ],
    )
  } catch (_err) {
    if (!(_err instanceof Error)) throw new Error('Invalid Error type')
    throw new Error(_err.message)
  }
}

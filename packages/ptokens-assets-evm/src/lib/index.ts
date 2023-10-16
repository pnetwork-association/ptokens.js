import { sha256 } from '@noble/hashes/sha256'
import { AbiEvent } from 'abitype'
import BigNumber from 'bignumber.js'
import { NetworkId } from 'ptokens-constants'
import { polygon } from 'viem/chains'
import {
  TransactionReceipt,
  Log,
  toBytes,
  toHex,
  encodeAbiParameters,
  parseAbiParameter,
  decodeEventLog,
  getEventSelector,
  PublicClient,
  Block,
  Chain,
} from 'viem'

import pNetworkHubAbi from '../abi/PNetworkHubAbi'


const events = pNetworkHubAbi.filter(({ type }) => type === 'event') as AbiEvent[]
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const getViemChain = (networkId: NetworkId): Chain => {
  switch (networkId) {
    case NetworkId.PolygonMainnet: 
      return polygon
      break
    default: throw new Error(`${networkId} is not supported as interim Chain, check ptokens-constants`)
  }
}

export function onChainFormat(_amount: BigNumber.Value, _decimals: number): BigNumber {
  return BigNumber(_amount).multipliedBy(BigNumber(10).pow(_decimals))
}

export function offChainFormat(_amount: BigNumber.Value, _decimals: number) {
  return BigNumber(_amount).dividedBy(BigNumber(10).pow(_decimals))
}

export async function getGasLimit(_publicClient: PublicClient): Promise<bigint> {
  const block: Block = await _publicClient.getBlock({ blockTag: 'latest' })
  return block.gasLimit
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
  const abiParameter = parseAbiParameter(
    '(bytes32 originBlockHash, bytes32 originTransactionHash, bytes32 optionsMask, uint256 nonce, uint256 underlyingAssetDecimals, uint256 assetAmount, uint256 userDataProtocolFeeAssetAmount, uint256 networkFeeAssetAmount, uint256 forwardNetworkFeeAssetAmount, address underlyingAssetTokenAddress, bytes4 originNetworkId, bytes4 destinationNetworkId, bytes4 forwardDestinationNetworkId, bytes4 underlyingAssetNetworkId, string originAccount, string destinationAccount, string underlyingAssetName, string underlyingAssetSymbol, bytes userData, bool isForProtocol) operation',
  )

  const coded = encodeAbiParameters(
    [abiParameter],
    [
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
    ],
  )

  return toHex(sha256(toBytes(coded)))
}

export const getOperationIdFromLog = (_log: Log<bigint>, _networkId: NetworkId | null = null) => {
  const decodedLog = decodeEventLog({
    abi: pNetworkHubAbi,
    data: _log.data,
    topics: _log.topics,
  })
  const id = getOperationIdFromObj(
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
  return id
}

export const getOperationIdFromTransactionReceipt = (_networkId: NetworkId, _receipt: TransactionReceipt<bigint>) => {
  const relevantLog = _receipt.logs.find(
    (_log) =>
      _log.topics[0] === eventNameToSignatureMap.get(EVENT_NAMES.USER_OPERATION) //||
      // _log.topics[0] === eventNameToSignatureMap.get(EVENT_NAMES.OPERATION_QUEUED) ||
      // _log.topics[0] === eventNameToSignatureMap.get(EVENT_NAMES.OPERATION_EXECUTED) ||
      // _log.topics[0] === eventNameToSignatureMap.get(EVENT_NAMES.OPERATION_CANCELLED),
  )
  if (!relevantLog) throw new Error('No valid event in the receipt logs')
  const operationIds = getOperationIdFromLog(relevantLog, _networkId)
  return operationIds
}

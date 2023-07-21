import BigNumber from 'bignumber.js'
import { NetworkId } from 'ptokens-constants'
import { Web3, Log, TransactionReceipt, Contract } from 'web3'
import { encodeEventSignature, decodeLog, encodeParameters } from 'web3-eth-abi'
import { AbiEventFragment, ContractAbi } from 'web3-types'
import { keccak256 } from 'web3-utils'

import events from '../abi/events'

export function onChainFormat(_amount: BigNumber.Value, _decimals: number): BigNumber {
  return BigNumber(_amount).multipliedBy(BigNumber(10).pow(_decimals))
}

export function offChainFormat(_amount: BigNumber.Value, _decimals: number) {
  return BigNumber(_amount).dividedBy(BigNumber(10).pow(_decimals))
}

export async function getAccount(_web3: Web3): Promise<string> {
  if (_web3.eth.defaultAccount) return _web3.eth.defaultAccount
  const accounts = await _web3.eth.getAccounts()
  return accounts[0]
}

export function getContract(_abi: ContractAbi, _contractAddress: string, _account: string = undefined) {
  const contract = new Contract(_abi, _contractAddress)
  contract.defaultAccount = _account
  return contract
}

export async function getGasLimit(_web3: Web3) {
  const block = await _web3.eth.getBlock('latest')
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
    const signature = encodeEventSignature(_event)
    return [_event.name, signature]
  })
)

const topicToAbiMap = new Map(
  events.map((_event) => {
    const signature = eventNameToSignatureMap.get(_event.name)
    return [signature, _event as AbiEventFragment]
  })
)

const getOperationIdFromObj = (_obj: any) => {
  const types = [
    'bytes32',
    'bytes32',
    'bytes4',
    'uint256',
    'string',
    'bytes4',
    'string',
    'string',
    'uint256',
    'address',
    'bytes4',
    'uint256',
    'bytes',
    'bytes32',
  ]
  return keccak256(
    encodeParameters(types, [
      _obj.originatingBlockHash || _obj.originBlockHash || _obj.blockHash,
      _obj.originatingTransactionHash || _obj.originTransactionHash || _obj.transactionHash,
      _obj.originatingNetworkId || _obj.originNetworkId || _obj.networkId,
      _obj.nonce,
      _obj.destinationAccount,
      _obj.destinationNetworkId,
      _obj.underlyingAssetName,
      _obj.underlyingAssetSymbol,
      _obj.underlyingAssetDecimals,
      _obj.underlyingAssetTokenAddress,
      _obj.underlyingAssetNetworkId,
      _obj.assetAmount,
      _obj.userData || '0x',
      _obj.optionsMask,
    ])
  )
}

const getEventInputsFromSignature = (_signature: string) => {
  if (topicToAbiMap.has(_signature)) return [...topicToAbiMap.get(_signature).inputs]
  throw new Error(`Missing abi for event signature ${_signature}`)
}

export const getOperationIdFromLog = (_log: Log, _networkId: NetworkId = null) => {
  const decodedLog = decodeLog(getEventInputsFromSignature(_log.topics[0].toString()), _log.data.toString(), [])
  return getOperationIdFromObj(
    Object.assign(
      {},
      decodedLog.operation ? decodedLog.operation : decodedLog,
      {
        transactionHash: _log.transactionHash,
        blockHash: _log.blockHash,
      },
      _networkId ? { networkId: _networkId } : {}
    )
  )
}

export const getOperationIdFromTransactionReceipt = (_networkId: NetworkId, _receipt: TransactionReceipt) => {
  return getOperationIdFromLog(
    _receipt.logs.find(
      (_log) =>
        _log.topics[0] === eventNameToSignatureMap.get(EVENT_NAMES.USER_OPERATION) ||
        _log.topics[0] === eventNameToSignatureMap.get(EVENT_NAMES.OPERATION_QUEUED) ||
        _log.topics[0] === eventNameToSignatureMap.get(EVENT_NAMES.OPERATION_EXECUTED) ||
        _log.topics[0] === eventNameToSignatureMap.get(EVENT_NAMES.OPERATION_CANCELLED)
    ),
    _networkId
  )
}

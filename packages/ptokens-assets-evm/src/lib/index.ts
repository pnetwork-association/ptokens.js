import { sha256 } from '@noble/hashes/sha256'
import BigNumber from 'bignumber.js'
import { NetworkId } from 'ptokens-constants'
import { PublicClient, keccak256, Abi } from 'viem'
import { Web3, Log, TransactionReceipt } from 'web3'
import { encodeEventSignature, decodeLog, encodeParameters } from 'web3-eth-abi'
import { AbiEventFragment, ContractAbi } from 'web3-types'
import { hexToBytes, bytesToHex } from 'web3-utils'

import pNetworkHubAbi from '../abi/PNetworkHubAbi'

const events = pNetworkHubAbi.filter(({ type }) => type === 'event') as AbiEventFragment[]

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export function onChainFormat(_amount: BigNumber.Value, _decimals: number): BigNumber {
  return BigNumber(_amount).multipliedBy(BigNumber(10).pow(_decimals))
}

export function offChainFormat(_amount: BigNumber.Value, _decimals: number) {
  return BigNumber(_amount).dividedBy(BigNumber(10).pow(_decimals))
}

// export async function getAccount(_web3: Web3): Promise<string> {
//   if (_web3.eth.defaultAccount) return _web3.eth.defaultAccount
//   const accounts = await _web3.eth.getAccounts()
//   return accounts[0]
// }

// export function getContract(_web3: Web3, _abi: Abi, _contractAddress: string, _account: string = undefined) {
//   const contract = new _web3.eth.Contract(_abi, _contractAddress)
//   contract.defaultAccount = _account
//   return contract
// }

export async function getGasLimit(_publicClient: PublicClient) {
  const block = await _publicClient.getBlock({blockTag: 'latest'})
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
  }),
)

const topicToAbiMap = new Map(
  events.map((_event) => {
    const signature = eventNameToSignatureMap.get(_event.name)
    return [signature, _event]
  }),
)

// event UserOperation(
//   uint256 nonce,
//   string originAccount,
//   string destinationAccount,
//   bytes4 destinationNetworkId,
//   string underlyingAssetName,
//   string underlyingAssetSymbol,
//   uint256 underlyingAssetDecimals,
//   address underlyingAssetTokenAddress,
//   bytes4 underlyingAssetNetworkId,
//   address assetTokenAddress,
//   uint256 assetAmount,
//   address protocolFeeAssetTokenAddress,
//   uint256 protocolFeeAssetAmount,
//   uint256 networkFeeAssetAmount,
//   uint256 forwardNetworkFeeAssetAmount,
//   bytes4 forwardDestinationNetworkId,
//   bytes userData,
//   bytes32 optionsMask,
//   bool isForProtocol
// );

// struct Operation {
//   bytes32 originBlockHash;
//   bytes32 originTransactionHash;
//   bytes4 originNetworkId;
//   uint256 nonce;
//   string originAccount;
//   string destinationAccount;
//   bytes4 destinationNetworkId;
//   bytes4 forwardDestinationNetworkId;
//   string underlyingAssetName;
//   string underlyingAssetSymbol;
//   uint256 underlyingAssetDecimals;
//   address underlyingAssetTokenAddress;
//   bytes4 underlyingAssetNetworkId;
//   uint256 assetAmount;
//   uint256 protocolFeeAssetAmount;
//   uint256 networkFeeAssetAmount;
//   uint256 forwardNetworkFeeAssetAmount;
//   bytes userData;
//   bytes32 optionsMask;
//   bool isForProtocol;
// }

// function operationIdOf(Operation calldata operation) public pure returns (bytes32) {
//   return
//       sha256(
//           abi.encode(
//               operation.originBlockHash,
//               operation.originTransactionHash,
//               operation.originNetworkId,
//               operation.nonce,
//               operation.originAccount,
//               operation.destinationAccount,
//               operation.destinationNetworkId,
//               operation.forwardDestinationNetworkId,
//               operation.underlyingAssetName,
//               operation.underlyingAssetSymbol,
//               operation.underlyingAssetDecimals,
//               operation.underlyingAssetTokenAddress,
//               operation.underlyingAssetNetworkId,
//               operation.assetAmount,
//               operation.protocolFeeAssetAmount,
//               operation.networkFeeAssetAmount,
//               operation.forwardNetworkFeeAssetAmount,
//               operation.userData,
//               operation.optionsMask,
//               operation.isForProtocol
//           )
//       );
// }

const getOperationIdFromObj = (_obj: any) => {
  const types = [
    'bytes32', // operation.originBlockHash,
    'bytes32', // operation.originTransactionHash,
    'bytes4', // operation.originNetworkId,
    'uint256', // operation.nonce,
    'string', // operation.originAccount,
    'string', // operation.destinationAccount,
    'bytes4', // operation.destinationNetworkId,
    'bytes4', // operation.forwardDestinationNetworkId,
    'string', // operation.underlyingAssetName,
    'string', // operation.underlyingAssetSymbol,
    'uint256', // operation.underlyingAssetDecimals,
    'address', // operation.underlyingAssetTokenAddress,
    'bytes4', // operation.underlyingAssetNetworkId,
    'uint256', // operation.assetAmount,
    'uint256', // operation.protocolFeeAssetAmount,
    'uint256', // operation.networkFeeAssetAmount,
    'uint256', // operation.forwardNetworkFeeAssetAmount,
    'bytes', // operation.userData,
    'bytes32', // operation.optionsMask,
    'bool', // operation.isForProtocol
  ]

  const coded = encodeParameters(types, [
    _obj.originatingBlockHash || _obj.originBlockHash || _obj.blockHash,
    _obj.originatingTransactionHash || _obj.originTransactionHash || _obj.transactionHash,
    _obj.originatingNetworkId || _obj.originNetworkId || _obj.networkId,
    _obj.nonce,
    _obj.originAccount,
    _obj.destinationAccount,
    _obj.destinationNetworkId,
    _obj.forwardDestinationNetworkId,
    _obj.underlyingAssetName,
    _obj.underlyingAssetSymbol,
    _obj.underlyingAssetDecimals,
    _obj.underlyingAssetTokenAddress,
    _obj.underlyingAssetNetworkId,
    _obj.assetAmount,
    _obj.protocolFeeAssetAmount,
    _obj.networkFeeAssetAmount,
    _obj.forwardNetworkFeeAssetAmount,
    _obj.userData || '0x',
    _obj.optionsMask,
    _obj.isForProtocol,
  ])
  return bytesToHex(sha256(hexToBytes(coded)))
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
      _networkId ? { networkId: _networkId } : {},
    ),
  )
}

export const getOperationIdFromTransactionReceipt = (_networkId: NetworkId, _receipt: TransactionReceipt) => {
  return getOperationIdFromLog(
    _receipt.logs.find(
      (_log) =>
        _log.topics[0] === eventNameToSignatureMap.get(EVENT_NAMES.USER_OPERATION) ||
        _log.topics[0] === eventNameToSignatureMap.get(EVENT_NAMES.OPERATION_QUEUED) ||
        _log.topics[0] === eventNameToSignatureMap.get(EVENT_NAMES.OPERATION_EXECUTED) ||
        _log.topics[0] === eventNameToSignatureMap.get(EVENT_NAMES.OPERATION_CANCELLED),
    ),
    _networkId,
  )
}

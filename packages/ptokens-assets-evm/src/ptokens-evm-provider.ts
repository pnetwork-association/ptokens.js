import polling from 'light-async-polling'
import PromiEvent from 'promievent'
import { pTokensAssetProvider } from 'ptokens-entities'
import { stringUtils } from 'ptokens-helpers'
import {
  DEFAULT_RETURN_FORMAT,
  Web3,
  TransactionReceipt,
  Log,
  ContractAbi,
  SupportedProviders,
  EthExecutionAPI,
} from 'web3'
import { SendTransactionEvents } from 'web3/lib/commonjs/eth.exports'
import { Web3PromiEvent } from 'web3-core'
import { PayableTxOptions } from 'web3-eth-contract'

import { EVENT_NAMES, eventNameToSignatureMap, getAccount, getContract, getOperationIdFromLog } from './lib/'

const BLOCK_OFFSET = 1000

export type MakeContractSendOptions = {
  /** The method to be called. */
  method: string
  /** The contract ABI. */
  abi: ContractAbi
  /** The contract address. */
  contractAddress: string
  /** The value being sent with the transaction. */
  value: string
  /** The gas limit for the transaction. */
  gasLimit?: number
}

export type MakeContractCallOptions = {
  /** The method to be called. */
  method: string
  /** The contract ABI. */
  abi: ContractAbi
  /** The contract address. */
  contractAddress: string
}

class SendOptions implements PayableTxOptions {
  from: string
  value: string
  gasPrice: string
  gas: string
  constructor(from: string, value: string) {
    this.from = from
    this.value = value
  }
  maybeSetGasPrice(gasPrice: number) {
    if (gasPrice) this.gasPrice = gasPrice.toString()
    return this
  }
  maybeSetGasLimit(gasLimit: number) {
    if (gasLimit) this.gas = gasLimit.toString()
    return this
  }
}

export class pTokensEvmProvider implements pTokensAssetProvider {
  private _web3: Web3
  private _gasPrice: number
  private _gasLimit: number

  /**
   * Create and initialize a pTokensEvmProvider object.
   * @param _provider - A web3.js provider (refer to https://web3js.readthedocs.io/en/v1.8.0/web3.html#setprovider).
   */
  constructor(_provider: string | SupportedProviders<EthExecutionAPI>) {
    this._web3 = new Web3(_provider)
  }

  /**
   * Return the gasPrice set with _setGasPrice()_.
   */
  get gasPrice() {
    return this._gasPrice
  }

  /**
   * Set transactions gas price.
   * @param _gasPrice - The desired gas price to be used when sending transactions.
   * @returns The same provider. This allows methods chaining.
   */
  setGasPrice(_gasPrice: number) {
    if (BigInt(_gasPrice) <= 0n || BigInt(_gasPrice) >= 1e12) {
      throw new Error('Invalid gas price')
    }
    this._gasPrice = _gasPrice
    return this
  }

  /**
   * Return the gasLimit set with _setGasLimit()_.
   */
  get gasLimit() {
    return this._gasLimit
  }

  /**
   * Set transactions gas limit.
   * @param _gasPrice - The desired gas limit to be used when sending transactions.
   * @returns The same provider. This allows methods chaining.
   */
  setGasLimit(_gasLimit: number) {
    if (_gasLimit <= 0 || _gasLimit >= 10e6) {
      throw new Error('Invalid gas limit')
    }
    this._gasLimit = _gasLimit
    return this
  }

  /**
   * Set a private key to sign transactions.
   * @param _key - A private key to sign transactions.
   * @returns The same provider. This allows methods chaining.
   */
  setPrivateKey(_key: string) {
    const account = this._web3.eth.accounts.privateKeyToAccount(stringUtils.addHexPrefix(_key))
    this._web3.eth.accounts.wallet.add(account)
    this._web3.eth.defaultAccount = account.address
    return this
  }

  async getLatestBlockNumber() {
    const block = await this._web3.eth.getBlock('latest')
    return block.number
  }

  async getTransactionReceipt(_hash: string) {
    const receipt = await this._web3.eth.getTransactionReceipt(_hash)
    return receipt
  }

  /**
   * Send a transaction to the smart contract and execute its method.
   * Note this can alter the smart contract state.
   * The function returns a PromiEvent, i.e. a Promise that can also emit events.
   * In particular, the events fired during the execution are the following:
   * * _txBroadcasted_ -\> fired with the transactions hash when the transaction is broadcasted on-chain;
   * * _txConfirmed_ -\> fired with the transactions hash when the transaction is confirmed on-chain;
   * * _txError -\> fired whenever an error occurs during the transaction execution;
   * @param _options - An object specifying the contract interaction.
   * @param _args - The arguments to be passed to the contract method being called.
   * @returns A PromiEvent that resolves with the hash of the resulting transaction.
   */
  makeContractSend<T extends unknown[] = []>(_options: MakeContractSendOptions, _args: T | [] = []) {
    const promi = new PromiEvent<TransactionReceipt>(
      (resolve, reject) =>
        (async () => {
          try {
            const { method, abi, contractAddress, value, gasLimit } = _options
            const account = await getAccount(this._web3)
            const contract = getContract(abi, contractAddress, account)
            const b = contract.methods[method] as (...args: T | []) => {
              send: (
                opts?: PayableTxOptions
              ) => Web3PromiEvent<TransactionReceipt, SendTransactionEvents<typeof DEFAULT_RETURN_FORMAT>>
            }
            const receipt = b(..._args)
              .send(
                new SendOptions(account, value)
                  .maybeSetGasLimit(gasLimit || this.gasLimit)
                  .maybeSetGasPrice(this.gasPrice)
              )
              .once('transactionHash', (_hash) => {
                promi.emit('txBroadcasted', _hash)
              })
              .once('receipt', (_receipt) => {
                promi.emit('txConfirmed', _receipt)
              })
              .once('error', (_error) => {
                promi.emit('txError', _error)
              })
            return resolve(receipt)
          } catch (_err) {
            return reject(_err)
          }
        })() as unknown
    )
    return promi
  }

  /**
   * Call a “constant” method and execute its smart contract method in the EVM without sending any transaction.
   * Note calling cannot alter the smart contract state.
   * @param _options - An object specifying the contract interaction.
   * @param _args - The arguments to be passed to the contract method being called.
   * @returns A Promise that resolves with the return value(s) of the smart contract method.
   */
  async makeContractCall<R, T extends unknown[] = []>(
    _options: MakeContractCallOptions,
    _args: T | [] = []
  ): Promise<R> {
    const { method, abi, contractAddress } = _options
    const account = await getAccount(this._web3)
    const contract = getContract(abi, contractAddress, account)
    const b = contract.methods[method] as (...args: T | []) => { call: () => Promise<R> }
    return b(..._args).call()
  }

  async waitForTransactionConfirmation(_tx: string, _pollingTime = 1000) {
    let receipt: TransactionReceipt = null
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await polling(async () => {
      try {
        receipt = await this._web3.eth.getTransactionReceipt(_tx)
        if (!receipt) return false
        else if (receipt.status) return true
        else return false
      } catch (_err) {
        return false
      }
    }, _pollingTime)
    return receipt.transactionHash.toString()
  }

  protected async _pollForStateManagerOperation(
    _stateManagerAddress: string,
    _eventName: EVENT_NAMES,
    _fromBlock: bigint,
    _operationId: string,
    _pollingTime = 1000
  ) {
    let log: Log
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await polling(async () => {
      try {
        const logs = (await this._web3.eth.getPastLogs({
          fromBlock: _fromBlock,
          address: _stateManagerAddress,
          topics: [eventNameToSignatureMap.get(_eventName)],
        })) as Log[]
        log = logs.find((_log) => getOperationIdFromLog(_log) === _operationId)
        if (log) return true
        return false
      } catch (_err) {
        return false
      }
    }, _pollingTime)
    return log
  }

  monitorCrossChainOperations(_stateManagerAddress: string, _operationId: string) {
    const promi = new PromiEvent<string>(
      (resolve, reject) =>
        (async () => {
          try {
            const fromBlock = (await this.getLatestBlockNumber()) - BigInt(BLOCK_OFFSET)
            await this._pollForStateManagerOperation(
              _stateManagerAddress,
              EVENT_NAMES.OPERATION_QUEUED,
              fromBlock,
              _operationId
            ).then((_log) => {
              promi.emit('operationQueued', _log.transactionHash)
              return _log
            })
            const finalTxLog = await Promise.any([
              this._pollForStateManagerOperation(
                _stateManagerAddress,
                EVENT_NAMES.OPERATION_EXECUTED,
                fromBlock,
                _operationId
              ).then((_log) => {
                promi.emit('operationExecuted', _log.transactionHash)
                return _log
              }),
              // TODO: need a way to stop this polling whenever the OPERATION_EXECUTED polling resolves
              // this._pollForStateManagerOperation(
              //   _stateManagerAddress,
              //   EVENT_NAMES.OPERATION_CANCELLED,
              //   fromBlock,
              //   _operationId
              // ).then((_log) => {
              //   promi.emit('operationCancelled', _log.transactionHash)
              //   return _log
              // }),
            ])
            return resolve(finalTxLog.transactionHash.toString())
          } catch (_err) {
            return reject(_err)
          }
        })() as unknown
    )
    return promi
  }
}

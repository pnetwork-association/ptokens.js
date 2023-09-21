import polling from 'light-async-polling'
import PromiEvent from 'promievent'
import { pTokensAssetProvider } from 'ptokens-entities'
import { stringUtils } from 'ptokens-helpers'
import { Abi, PublicClient, WalletClient, TransactionReceipt } from 'viem'
import events from './abi/events'
// import { privateKeyToAccount } from 'viem/accounts'

import { EVENT_NAMES, getOperationIdFromLog } from './lib/'

const BLOCK_OFFSET = 1000

export type MakeContractSendOptions = {
  /** The method to be called. */
  method: string
  /** The contract ABI. */
  abi: Abi
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
  abi: Abi
  /** The contract address. */
  contractAddress: string
}

// class SendObject<T> {
//   account: `0x${string}`
//   address: `0x${string}`
//   abi: Abi
//   functionName: string
//   value: string
//   gasPrice: string
//   gas: string
//   args: [] | T
//   constructor(value: string) {
//     this.value = value
//   }
//   maybeSetGasPrice(account: `0x${string}`, address:`0x${string}`, gasPrice: number) {
//     if (gasPrice) this.gasPrice = gasPrice.toString()
//     return this
//   }
//   maybeSetGasLimit(gasLimit: number) {
//     if (gasLimit) this.gas = gasLimit.toString()
//     return this
//   }
// }

export class pTokensEvmProvider implements pTokensAssetProvider {
  private _publicClient: PublicClient
  private _walletClient: WalletClient
  private _gasPrice: number
  private _gasLimit: number

  /**
   * Create and initialize a pTokensEvmProvider object.
   * @param _provider - A web3.js provider (refer to https://web3js.readthedocs.io/en/v1.8.0/web3.html#setprovider).
   */
  constructor(_publicClient: PublicClient, _walletClient: WalletClient) {
    this._publicClient = _publicClient
    this._walletClient = _walletClient
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
    // TODO
    return this
  }

  async getLatestBlockNumber() {
    const block = await this._publicClient.getBlock({ blockTag: 'latest'})
    return block.number
  }

  async getTransactionReceipt(_hash: string) {
    const receipt = await this._publicClient.getTransactionReceipt({ hash: stringUtils.addHexPrefix(_hash)})
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
            const [account] = await this._walletClient.getAddresses()
            const { request } = await this._publicClient.simulateContract({
              account,
              address: stringUtils.addHexPrefix(contractAddress),
              abi: abi,
              functionName: method,
              value: value,
              args: _args,
              gas: (gasLimit || this.gasLimit) ? (gasLimit || this.gasLimit) : undefined,
              gasPrice: this.gasPrice ? this.gasPrice : undefined
            })
            const txHash = await this._walletClient.writeContract(request as any)
            promi.emit('txBroadcasted', txHash)
            const txReceipt = await this._publicClient.waitForTransactionReceipt({ hash: txHash })
            promi.emit('txConfirmed', txReceipt)
            return resolve(txReceipt)
          } catch (_err) {
            promi.emit('txError', _err)
            return reject(_err)
          }
        })() as unknown,
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
    _args: T | [] = [],
  ): Promise<R> {
    const { method, abi, contractAddress } = _options
    return this._publicClient.readContract({
      address: stringUtils.addHexPrefix(contractAddress),
      abi: abi,
      functionName: method,
      args: _args
    }) as Promise<R>
  }

  async waitForTransactionConfirmation(_tx: string, _pollingTime = 1000) {
    let receipt: TransactionReceipt = null
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await polling(async () => {
      try {
        receipt = await this._publicClient.getTransactionReceipt({ hash: stringUtils.addHexPrefix(_tx) })
        if (!receipt) return false
        else if (receipt.status) return true
        else return false
      } catch (_err) {
        return false
      }
    }, _pollingTime)
    return receipt.transactionHash.toString()
  }

  protected async _pollForHubOperation(
    _hubAddress: string,
    _eventName: EVENT_NAMES,
    _fromBlock: bigint,
    _operationId: string,
    _pollingTime = 1000,
  ) {
    let log
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await polling(async () => {
      try {
        const logs = await this._publicClient.getLogs({
          fromBlock: _fromBlock,
          address: stringUtils.addHexPrefix(_hubAddress),
          events: events,
        })
        log = logs.find((_log) => getOperationIdFromLog(_log) === _operationId)
        if (log) return true
        return false
      } catch (_err) {
        return false
      }
    }, _pollingTime)
    return log
  }

  monitorCrossChainOperations(_hubAddress: string, _operationId: string) {
    const promi = new PromiEvent<string>(
      (resolve, reject) =>
        (async () => {
          try {
            const fromBlock = (await this.getLatestBlockNumber()) - BigInt(BLOCK_OFFSET)
            await this._pollForHubOperation(_hubAddress, EVENT_NAMES.OPERATION_QUEUED, fromBlock, _operationId).then(
              (_log) => {
                promi.emit('operationQueued', _log.transactionHash)
                return _log
              },
            )
            const finalTxLog = await Promise.any([
              this._pollForHubOperation(_hubAddress, EVENT_NAMES.OPERATION_EXECUTED, fromBlock, _operationId).then(
                (_log) => {
                  promi.emit('operationExecuted', _log.transactionHash)
                  return _log
                },
              ),
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
        })() as unknown,
    )
    return promi
  }
}

import PromiEvent from 'promievent'
import { BlockchainType } from 'ptokens-constants'
import { pTokensAsset, pTokensAssetProvider, pTokenAssetConfig, SwapResult } from 'ptokens-entities'

import logs from '../utils/logs.json'

export class pTokensProviderMock implements pTokensAssetProvider {
  /* istanbul ignore next */
  waitForTransactionConfirmation(_txHash: string): Promise<string> {
    return Promise.resolve(_txHash)
  }
  monitorCrossChainOperations(): PromiEvent<any> {
    const promi = new PromiEvent<any>((resolve) =>
      setImmediate(() => {
        promi.emit('operationQueued', 'operation-queued-tx-hash')
        promi.emit('operationExecuted', 'operation-executed-tx-hash')
        return resolve('operation-executed-tx-hash')
      }),
    )
    return promi
  }
  /* eslint-disable @typescript-eslint/no-unused-vars */
  makeContractCall(...args: any[]): Promise<any> {
    return new Promise((resolve) => resolve('contract-called'))
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export const mockedMonitorCrossChainOperations = (_hubAddress: string, _operationId: string): PromiEvent<any> => {
  const promi = new PromiEvent<any>((resolve) =>
    setImmediate(() => {
      promi.emit('operationQueued', 'interim-operation-queued-tx-hash')
      promi.emit('operationExecuted', 'interim-operation-executed-tx-hash')
      return resolve(logs[0])
    }),
  )
  return promi
}
/* eslint-enable @typescript-eslint/no-unused-vars */

export type pTokenAssetMockConfig = pTokenAssetConfig & {
  /** An pTokensAlgorandProvider for interacting with the underlaying blockchain */
  provider?: pTokensProviderMock
}
export class pTokenAssetMock extends pTokensAsset {
  private _provider: pTokensProviderMock

  get provider() {
    return this._provider
  }

  constructor(_config: pTokenAssetMockConfig) {
    super(_config, BlockchainType.EVM)
    if (_config.provider) this._provider = _config.provider
  }

  swap(): PromiEvent<SwapResult> {
    const promi = new PromiEvent<SwapResult>((resolve) =>
      setImmediate(() => {
        promi.emit('txBroadcasted', { txHash: 'originating-tx-hash' })
        promi.emit('txConfirmed', { txHash: 'originating-tx-hash', operationId: 'operation-id' })
        resolve({ txHash: 'originating-tx-hash', operationId: 'operation-id' })
      }),
    )
    return promi
  }

  protected monitorCrossChainOperations(): PromiEvent<any> {
    return this.provider.monitorCrossChainOperations()
  }
}

export class pTokenAssetFailingMock extends pTokensAsset {
  private _provider: pTokensProviderMock

  /* istanbul ignore next */
  get provider() {
    return this._provider
  }

  constructor(_config: pTokenAssetMockConfig) {
    super(_config, BlockchainType.EVM)
    if (_config.provider) this._provider = _config.provider
  }

  swap(): PromiEvent<SwapResult> {
    const promi = new PromiEvent<SwapResult>((resolve, reject) =>
      setImmediate(() => {
        promi.emit('txBroadcasted', 'originating-tx-hash')
        return reject(new Error('swap error'))
      }),
    )
    return promi
  }

  /* istanbul ignore next */
  protected monitorCrossChainOperations(): PromiEvent<any> {
    const promi = new PromiEvent<any>((resolve, reject) =>
      setImmediate(() => {
        return reject(new Error('monitorCrossChainOperations error'))
      }),
    )
    return promi
  }
}

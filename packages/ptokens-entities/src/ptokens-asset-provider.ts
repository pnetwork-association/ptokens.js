import PromiEvent from 'promievent'

export abstract class pTokensAssetProvider {
  /**
   * Wait for the confirmation of a transaction pushed on-chain.
   * @param _txHash - The hash of the transaction.
   * @returns A Promise that resolve with the same transaction hash __txHash_.
   */
  abstract waitForTransactionConfirmation(_txHash: string, ...args: any[]): Promise<any>

  abstract getSwaps(_from: bigint): PromiEvent<boolean>

  abstract makeContractCall<R>(...args: any[]): Promise<R>
}

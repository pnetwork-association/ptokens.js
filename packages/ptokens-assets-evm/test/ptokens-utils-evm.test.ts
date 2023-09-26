import BigNumber from 'bignumber.js'
import { stringUtils } from 'ptokens-helpers'
import { Log } from 'viem'

import * as utils from '../src/lib/index'

import abi from './utils/exampleContractABI'
import logs from './utils/logs.json'
import { NetworkId } from 'ptokens-constants'

const TEST_CONTRACT_ADDRESS = '0x15FA11dFB23eae46Fda69fB6A148f41677B4a090'
const TEST_ETH_PRIVATE_KEY = '422c874bed50b69add046296530dc580f8e2e253879d98d66023b7897ab15742'

describe('ethereum utilities', () => {
  // test('Should return the correct Ethereum off-chain format', () => {
  //   const onChainAmount = 10000
  //   const decimals = 4
  //   const expectedOffChainAmount = BigNumber(1)
  //   const offChainAmount = utils.offChainFormat(onChainAmount, decimals)
  //   expect(offChainAmount).toStrictEqual(expectedOffChainAmount)
  // })

  // test('Should return the correct Ethereum on-chain format', () => {
  //   const offChainAmount = BigNumber(1)
  //   const decimals = 4
  //   const expectedOnChainAmount = BigNumber(10000)
  //   const onChainAmount = utils.onChainFormat(offChainAmount, decimals)
  //   expect(onChainAmount).toStrictEqual(expectedOnChainAmount)
  // })

  // test('Should return the current Ethereum account with non injected Web3 instance', async () => {
  //   const web3 = new Web3('http://provider.eth')
  //   const expectedEthereumAccount = '0xdf3B180694aB22C577f7114D822D28b92cadFd75'
  //   const account = web3.eth.accounts.privateKeyToAccount(stringUtils.addHexPrefix(TEST_ETH_PRIVATE_KEY))
  //   web3.eth.defaultAccount = account.address
  //   const ethereumAccount = await utils.getAccount(web3)
  //   expect(ethereumAccount).toStrictEqual(expectedEthereumAccount)
  // })

  // test('Should return the current Ethereum account with injected Web3 instance', async () => {
  //   const web3 = new Web3('http://provider.eth')
  //   const expectedEthereumAccount = '0xdf3B180694aB22C577f7114D822D28b92cadFd75'
  //   const getAccountsSpy = jest
  //     .spyOn(web3.eth, 'getAccounts')
  //     .mockImplementation(() => Promise.resolve([expectedEthereumAccount]))
  //   const ethereumAccount = await utils.getAccount(web3)
  //   expect(ethereumAccount).toStrictEqual(expectedEthereumAccount)
  //   expect(getAccountsSpy).toHaveBeenNthCalledWith(1)
  // })

  // test('Should return a valid Web3.eth.Contract instance', () => {
  //   const web3 = new Web3()
  //   const contract = utils.getContract(web3, abi, TEST_CONTRACT_ADDRESS)
  //   expect(contract.defaultAccount).toStrictEqual(undefined)
  //   expect(Object.keys(contract.methods)).toStrictEqual([
  //     'setNumber',
  //     'setNumber(uint256)',
  //     '0x3fb5c1cb',
  //     'number',
  //     'number()',
  //     '0x8381f58a',
  //   ])
  //   expect(contract.options.address).toStrictEqual(TEST_CONTRACT_ADDRESS)
  // })

  // test('Should return a valid Web3.eth.Contract instance with default account', () => {
  //   const web3 = new Web3()
  //   const contract = utils.getContract(web3, abi, TEST_CONTRACT_ADDRESS, 'account')
  //   expect(contract.defaultAccount).toStrictEqual('account')
  //   expect(Object.keys(contract.methods)).toStrictEqual([
  //     'setNumber',
  //     'setNumber(uint256)',
  //     '0x3fb5c1cb',
  //     'number',
  //     'number()',
  //     '0x8381f58a',
  //   ])
  //   expect(contract.options.address).toStrictEqual(TEST_CONTRACT_ADDRESS)
  // })

  // test('Should return a valid gas limit', async () => {
  //   const web3 = new Web3('http://provider.eth')
  //   const getBlockSpy = jest.fn().mockResolvedValue({ gasLimit: 1000 })
  //   web3.eth.getBlock = getBlockSpy
  //   const gasLimit = await utils.getGasLimit(web3)
  //   expect(typeof gasLimit).toBe('number')
  // })

  // test('Should return true since 0xhello is 0x prefixed', () => {
  //   const string0xPrefixed = '0xhello'
  //   const result = stringUtils.isHexPrefixed(string0xPrefixed)
  //   expect(result).toBe(true)
  // })

  // test('Should return false since hello is not 0x prefixed', () => {
  //   const string0xNotPrefixed = 'hello0x'
  //   const result = stringUtils.isHexPrefixed(string0xNotPrefixed)
  //   expect(result).toBe(false)
  // })

  test('Should get operation ID from log', async () => {
    const res = await Promise.allSettled(
      logs.map(
        (_log) => new Promise((_resolve) => _resolve(utils.getOperationIdFromLog(_log as unknown as Log<number>, '0x5aca268b' as NetworkId))),
      ),
    )
    expect(
      res.map((_obj) => ('value' in _obj ? _obj.value : 'reason' in _obj ? (_obj.reason.message as string) : null)),
    ).toStrictEqual(['0xd9feb6e60cd73c396cbaeb3e5fa55c774c03a274c54f5bc53a62a59855ec7cc4'])
  })
})

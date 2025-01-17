import { Blockchain, ChainId, Network } from '@p.network/ptokens-constants'
import { pTokensNode, pTokensNodeProvider } from '@p.network/ptokens-node'

import { pTokensAlgorandAsset, pTokensAlgorandProvider, BasicSignatureProvider } from '../src'

import algosdk from 'algosdk'
import PromiEvent from 'promievent'
import BigNumber from 'bignumber.js'

const TEST_MNEMONIC =
  'remind hat sibling sock multiply heart tuition magic bounce option yard rely daring raven basket wood bike educate ensure museum gorilla oyster tower ability claim'

const nativeToXFees = {
  networkFee: 1e18,
  minNodeOperatorFee: 2e18,
  basisPoints: {
    nativeToHost: 30,
    nativeToNative: 40,
  },
}

const hostToXFees = {
  networkFee: 5e18,
  minNodeOperatorFee: 6e18,
  basisPoints: {
    hostToHost: 70,
    hostToNative: 80,
  },
}

describe('Algorand asset', () => {
  test('Should create an Algorand asset from constructor', () => {
    const node = new pTokensNode(new pTokensNodeProvider('test-url'))
    const asset = new pTokensAlgorandAsset({
      node,
      symbol: 'SYM',
      assetInfo: {
        chainId: ChainId.AlgorandMainnet,
        isNative: true,
        tokenAddress: 'token-contract-address',
        tokenReference: 'token-internal-address',
        decimals: 6,
        vaultAddress: 'vault-contract-address',
        identity: 'HIBVFSZFK4FEANCOZFIVZNBHLJK3ERRHKDRZVGX4RZU7WQIMSSKL4PQZMA',
        fees: nativeToXFees,
      },
    })
    expect(asset.symbol).toStrictEqual('SYM')
    expect(asset.chainId).toStrictEqual(ChainId.AlgorandMainnet)
    expect(asset.blockchain).toStrictEqual(Blockchain.Algorand)
    expect(asset.network).toStrictEqual(Network.Mainnet)
    expect(asset.weight).toEqual(1)
    expect(asset.identity).toEqual('HIBVFSZFK4FEANCOZFIVZNBHLJK3ERRHKDRZVGX4RZU7WQIMSSKL4PQZMA')
  })

  test('Should reject if decimals are missing', () => {
    const node = new pTokensNode(new pTokensNodeProvider('test-url'))
    try {
      new pTokensAlgorandAsset({
        node,
        symbol: 'SYM',
        assetInfo: {
          chainId: ChainId.AlgorandMainnet,
          isNative: true,
          tokenAddress: 'token-contract-address',
          tokenReference: 'token-internal-address',
          fees: nativeToXFees,
        },
      })
      fail()
    } catch (err) {
      expect(err.message).toStrictEqual('Missing decimals')
    }
  })

  test('Should reject if custom transactions are undefined', () => {
    const node = new pTokensNode(new pTokensNodeProvider('test-url'))
    const asset = new pTokensAlgorandAsset({
      node,
      symbol: 'SYM',
      assetInfo: {
        chainId: ChainId.AlgorandMainnet,
        isNative: true,
        tokenAddress: 'token-contract-address',
        tokenReference: 'token-internal-address',
        decimals: 6,
        vaultAddress: 'vault-contract-address',
        identity: 'HIBVFSZFK4FEANCOZFIVZNBHLJK3ERRHKDRZVGX4RZU7WQIMSSKL4PQZMA',
        fees: nativeToXFees,
      },
    })
    try {
      asset.setCustomTransactions(undefined)
      fail()
    } catch (err) {
      expect(err.message).toStrictEqual('Invalid undefined transactions')
    }
  })

  test('Should reject if custom transactions is an empty array', () => {
    const node = new pTokensNode(new pTokensNodeProvider('test-url'))
    const asset = new pTokensAlgorandAsset({
      node,
      symbol: 'SYM',
      assetInfo: {
        chainId: ChainId.AlgorandMainnet,
        isNative: true,
        tokenAddress: 'token-contract-address',
        tokenReference: 'token-internal-address',
        decimals: 6,
        vaultAddress: 'vault-contract-address',
        identity: 'HIBVFSZFK4FEANCOZFIVZNBHLJK3ERRHKDRZVGX4RZU7WQIMSSKL4PQZMA',
        fees: nativeToXFees,
      },
    })
    try {
      asset.setCustomTransactions([])
      fail()
    } catch (err) {
      expect(err.message).toStrictEqual('Invalid empty transactions array')
    }
  })

  describe('nativeToInterim', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })

    test('Should reject calling nativeToInterim', async () => {
      const node = new pTokensNode(new pTokensNodeProvider('test-url'))
      const asset = new pTokensAlgorandAsset({
        node,
        symbol: 'SYM',
        assetInfo: {
          chainId: ChainId.AlgorandMainnet,
          isNative: true,
          tokenAddress: 'token-contract-address',
          tokenReference: 'token-internal-address',
          decimals: 6,
          vaultAddress: 'vault-contract-address',
          fees: nativeToXFees,
        },
      })
      try {
        await asset['nativeToInterim']()
        fail()
      } catch (err) {
        expect(err.message).toEqual('Method not implemented.')
      }
    })
  })

  describe('hostToInterim', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })

    test('Should not call hostToInterim if provider is missing', async () => {
      const node = new pTokensNode(new pTokensNodeProvider('test-url'))
      const asset = new pTokensAlgorandAsset({
        node,
        symbol: 'SYM',
        assetInfo: {
          chainId: ChainId.AlgorandMainnet,
          isNative: true,
          tokenAddress: 'token-contract-address',
          tokenReference: 'token-internal-address',
          decimals: 6,
          vaultAddress: 'vault-contract-address',
          fees: nativeToXFees,
        },
      })
      try {
        await asset['hostToInterim'](BigNumber(123.456789), 'destination-address', 'destination-chain-id')
        fail()
      } catch (err) {
        expect(err.message).toEqual('Missing provider')
      }
    })

    test('Should not call hostToInterim for native tokens', async () => {
      const node = new pTokensNode(new pTokensNodeProvider('test-url'))
      const client = new algosdk.Algodv2('algorand-endpoint')
      const signatureProvider = new BasicSignatureProvider(TEST_MNEMONIC)
      const provider = new pTokensAlgorandProvider(client, signatureProvider)
      const account = algosdk.mnemonicToSecretKey(TEST_MNEMONIC)
      provider.setAccount(account.addr)
      const transactSpy = jest.spyOn(provider, 'transactInGroup').mockImplementation(() => {
        const promi = new PromiEvent<string>((resolve) =>
          setImmediate(() => {
            promi.emit('txBroadcasted', 'group-id')
            promi.emit('txConfirmed', 'group-id')
            return resolve('tx-hash')
          })
        )
        return promi
      })
      const asset = new pTokensAlgorandAsset({
        node,
        symbol: 'SYM',
        provider: provider,
        assetInfo: {
          chainId: ChainId.AlgorandMainnet,
          isNative: true,
          tokenAddress: 'token-contract-address',
          tokenReference: 'token-internal-address',
          decimals: 6,
          vaultAddress: 'vault-contract-address',
          fees: nativeToXFees,
        },
      })
      try {
        await asset['hostToInterim'](BigNumber(123.456789), 'destination-address', 'destination-chain-id')
        fail()
      } catch (err) {
        expect(err.message).toEqual('Invalid call to hostToInterim() for native token')
        expect(transactSpy).toHaveBeenCalledTimes(0)
      }
    })

    test('Should not call hostToInterim if token owner is missing', async () => {
      const node = new pTokensNode(new pTokensNodeProvider('test-url'))
      const client = new algosdk.Algodv2('algorand-endpoint')
      const signatureProvider = new BasicSignatureProvider(TEST_MNEMONIC)
      const provider = new pTokensAlgorandProvider(client, signatureProvider)
      const transactSpy = jest.spyOn(provider, 'transactInGroup')
      const asset = new pTokensAlgorandAsset({
        node,
        symbol: 'SYM',
        provider: provider,
        assetInfo: {
          chainId: ChainId.AlgorandMainnet,
          isNative: false,
          tokenAddress: '123456789',
          tokenReference: 'token-internal-address',
          decimals: 6,
          identity: 'HIBVFSZFK4FEANCOZFIVZNBHLJK3ERRHKDRZVGX4RZU7WQIMSSKL4PQZMA',
          fees: hostToXFees,
        },
      })
      try {
        await asset['hostToInterim'](BigNumber(123.456789), 'destination-address', 'destination-chain-id')
        fail()
      } catch (err) {
        expect(err.message).toEqual('Missing account')
        expect(transactSpy).toHaveBeenCalledTimes(0)
      }
    })

    test('Should not call hostToInterim if identityis missing', async () => {
      const node = new pTokensNode(new pTokensNodeProvider('test-url'))
      const client = new algosdk.Algodv2('algorand-endpoint')
      const signatureProvider = new BasicSignatureProvider(TEST_MNEMONIC)
      const provider = new pTokensAlgorandProvider(client, signatureProvider)
      const account = algosdk.mnemonicToSecretKey(TEST_MNEMONIC)
      provider.setAccount(account.addr)
      const transactSpy = jest.spyOn(provider, 'transactInGroup')
      const asset = new pTokensAlgorandAsset({
        node,
        symbol: 'SYM',
        provider: provider,
        assetInfo: {
          chainId: ChainId.AlgorandMainnet,
          isNative: false,
          tokenAddress: '123456789',
          tokenReference: 'token-internal-address',
          decimals: 6,
          fees: hostToXFees,
        },
      })
      try {
        await asset['hostToInterim'](BigNumber(123.456789), 'destination-address', 'destination-chain-id')
        fail()
      } catch (err) {
        expect(err.message).toEqual('Missing identity')
        expect(transactSpy).toHaveBeenCalledTimes(0)
      }
    })

    test('Should call transact non-native token without userdata', async () => {
      const node = new pTokensNode(new pTokensNodeProvider('test-url'))
      const client = new algosdk.Algodv2('algorand-endpoint')
      const signatureProvider = new BasicSignatureProvider(TEST_MNEMONIC)
      const provider = new pTokensAlgorandProvider(client, signatureProvider)
      const account = algosdk.mnemonicToSecretKey(TEST_MNEMONIC)
      provider.setAccount(account.addr)
      const suggestedParams = {
        fee: 100,
        lastRound: 10000,
        firstRound: 9000,
        genesisID: 'mainnet-v1.0',
        genesisHash: 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=',
      }
      const getTransactionParamsSpy = jest.spyOn(provider, 'getTransactionParams').mockResolvedValue(suggestedParams)
      const transactSpy = jest.spyOn(provider, 'transactInGroup').mockImplementation(() => {
        const promi = new PromiEvent<string>((resolve) =>
          setImmediate(() => {
            promi.emit('txBroadcasted', 'group-id')
            promi.emit('txConfirmed', 'group-id')
            return resolve('tx-hash')
          })
        )
        return promi
      })
      const asset = new pTokensAlgorandAsset({
        node,
        symbol: 'SYM',
        provider: provider,
        assetInfo: {
          chainId: ChainId.AlgorandMainnet,
          isNative: false,
          tokenAddress: '123456789',
          tokenReference: 'token-internal-address',
          decimals: 6,
          identity: 'HIBVFSZFK4FEANCOZFIVZNBHLJK3ERRHKDRZVGX4RZU7WQIMSSKL4PQZMA',
          fees: hostToXFees,
        },
      })
      let txHashBroadcasted = ''
      let txHashConfirmed = ''
      const ret = await asset['hostToInterim'](BigNumber(123.456789), 'destination-address', ChainId.BitcoinMainnet)
        .on('txBroadcasted', (_txHash) => {
          txHashBroadcasted = _txHash
        })
        .on('txConfirmed', (_txHash) => {
          txHashConfirmed = _txHash
        })
      expect(txHashBroadcasted).toEqual('group-id')
      expect(txHashConfirmed).toEqual('group-id')
      expect(ret).toEqual('tx-hash')
      expect(getTransactionParamsSpy).toHaveBeenNthCalledWith(1)
      expect(transactSpy).toHaveBeenNthCalledWith(1, [
        algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: account.addr,
          to: 'HIBVFSZFK4FEANCOZFIVZNBHLJK3ERRHKDRZVGX4RZU7WQIMSSKL4PQZMA',
          amount: 123456789,
          suggestedParams,
          assetIndex: 123456789,
          note: Uint8Array.from(Buffer.from('94009401cceccc97ccdeb364657374696e6174696f6e2d6164647265737390', 'hex')),
        }),
      ])
    })

    test('Should call transact non-native token with user data', async () => {
      const node = new pTokensNode(new pTokensNodeProvider('test-url'))
      const client = new algosdk.Algodv2('algorand-endpoint')
      const signatureProvider = new BasicSignatureProvider(TEST_MNEMONIC)
      const provider = new pTokensAlgorandProvider(client, signatureProvider)
      const account = algosdk.mnemonicToSecretKey(TEST_MNEMONIC)
      provider.setAccount(account.addr)
      const suggestedParams = {
        fee: 100,
        lastRound: 10000,
        firstRound: 9000,
        genesisID: 'mainnet-v1.0',
        genesisHash: 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=',
      }
      const getTransactionParamsSpy = jest.spyOn(provider, 'getTransactionParams').mockResolvedValue(suggestedParams)
      const transactSpy = jest.spyOn(provider, 'transactInGroup').mockImplementation(() => {
        const promi = new PromiEvent<string>((resolve) =>
          setImmediate(() => {
            promi.emit('txBroadcasted', 'tx-hash')
            promi.emit('txConfirmed', 'tx-hash')
            return resolve('tx-hash')
          })
        )
        return promi
      })
      const asset = new pTokensAlgorandAsset({
        node,
        symbol: 'SYM',
        provider: provider,
        assetInfo: {
          chainId: ChainId.AlgorandMainnet,
          isNative: false,
          tokenAddress: '123456789',
          tokenReference: 'token-internal-address',
          decimals: 6,
          identity: 'HIBVFSZFK4FEANCOZFIVZNBHLJK3ERRHKDRZVGX4RZU7WQIMSSKL4PQZMA',
          fees: hostToXFees,
        },
      })
      let txHashBroadcasted = ''
      let txHashConfirmed = ''
      const ret = await asset['hostToInterim'](
        BigNumber(123.456789),
        'destination-address',
        ChainId.BitcoinMainnet,
        Uint8Array.from(Buffer.from('c0ffee', 'hex'))
      )
        .on('txBroadcasted', (_txHash) => {
          txHashBroadcasted = _txHash
        })
        .on('txConfirmed', (_txHash) => {
          txHashConfirmed = _txHash
        })
      expect(txHashBroadcasted).toEqual('tx-hash')
      expect(txHashConfirmed).toEqual('tx-hash')
      expect(ret).toEqual('tx-hash')
      expect(getTransactionParamsSpy).toHaveBeenNthCalledWith(1)
      expect(transactSpy).toHaveBeenNthCalledWith(1, [
        algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: account.addr,
          to: 'HIBVFSZFK4FEANCOZFIVZNBHLJK3ERRHKDRZVGX4RZU7WQIMSSKL4PQZMA',
          amount: 123456789,
          suggestedParams,
          assetIndex: 123456789,
          note: Uint8Array.from(
            Buffer.from('94009401cceccc97ccdeb364657374696e6174696f6e2d6164647265737393ccc0ccffccee', 'hex')
          ),
        }),
      ])
    })

    test('Should call transact with custom transactions', async () => {
      const node = new pTokensNode(new pTokensNodeProvider('test-url'))
      const client = new algosdk.Algodv2('algorand-endpoint')
      const signatureProvider = new BasicSignatureProvider(TEST_MNEMONIC)
      const provider = new pTokensAlgorandProvider(client, signatureProvider)
      const account = algosdk.mnemonicToSecretKey(TEST_MNEMONIC)
      provider.setAccount(account.addr)
      const suggestedParams = {
        fee: 100,
        lastRound: 10000,
        firstRound: 9000,
        genesisID: 'mainnet-v1.0',
        genesisHash: 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=',
      }
      const getTransactionParamsSpy = jest.spyOn(provider, 'getTransactionParams').mockResolvedValue(suggestedParams)
      const transactSpy = jest.spyOn(provider, 'transactInGroup').mockImplementation(() => {
        const promi = new PromiEvent<string>((resolve) =>
          setImmediate(() => {
            promi.emit('txBroadcasted', 'group-id')
            promi.emit('txConfirmed', 'group-id')
            return resolve('tx-hash')
          })
        )
        return promi
      })
      const asset = new pTokensAlgorandAsset({
        node,
        symbol: 'SYM',
        provider: provider,
        assetInfo: {
          chainId: ChainId.AlgorandMainnet,
          isNative: false,
          tokenAddress: '123456789',
          tokenReference: 'token-internal-address',
          decimals: 6,
          identity: 'HIBVFSZFK4FEANCOZFIVZNBHLJK3ERRHKDRZVGX4RZU7WQIMSSKL4PQZMA',
          fees: hostToXFees,
        },
      })
      const customTx = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: account.addr,
        to: asset.identity,
        amount: 1,
        suggestedParams,
        assetIndex: 1,
        note: Uint8Array.from(Buffer.from('c0ffee', 'hex')),
      })
      asset.setCustomTransactions([customTx.get_obj_for_encoding()])
      let txHashBroadcasted = ''
      let txHashConfirmed = ''
      const ret = await asset['hostToInterim'](
        BigNumber(123.456789),
        'destination-address',
        ChainId.BitcoinMainnet,
        Uint8Array.from(Buffer.from('c0ffee', 'hex'))
      )
        .on('txBroadcasted', (_txHash) => {
          txHashBroadcasted = _txHash
        })
        .on('txConfirmed', (_txHash) => {
          txHashConfirmed = _txHash
        })
      expect(txHashBroadcasted).toEqual('group-id')
      expect(txHashConfirmed).toEqual('group-id')
      expect(ret).toEqual('tx-hash')
      expect(getTransactionParamsSpy).toHaveBeenCalledTimes(0)
      expect(transactSpy).toHaveBeenNthCalledWith(1, [
        algosdk.Transaction.from_obj_for_encoding(customTx.get_obj_for_encoding()),
      ])
    })

    test('Should reject if transact throws', async () => {
      const node = new pTokensNode(new pTokensNodeProvider('test-url'))
      const client = new algosdk.Algodv2('algorand-endpoint')
      const signatureProvider = new BasicSignatureProvider(TEST_MNEMONIC)
      const provider = new pTokensAlgorandProvider(client, signatureProvider)
      const account = algosdk.mnemonicToSecretKey(TEST_MNEMONIC)
      provider.setAccount(account.addr)
      jest.spyOn(provider, 'getTransactionParams').mockResolvedValue({
        fee: 100,
        lastRound: 10000,
        firstRound: 9000,
        genesisID: 'mainnet-v1.0',
        genesisHash: 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=',
      })
      jest.spyOn(provider, 'transactInGroup').mockImplementation(() => {
        const promi = new PromiEvent<string>((resolve, reject) =>
          setImmediate(() => {
            return reject(new Error('Transact exception'))
          })
        )
        return promi
      })
      const asset = new pTokensAlgorandAsset({
        node,
        symbol: 'SYM',
        provider: provider,
        assetInfo: {
          chainId: ChainId.AlgorandMainnet,
          isNative: false,
          tokenAddress: '123456789',
          tokenReference: 'token-internal-address',
          decimals: 6,
          identity: 'HIBVFSZFK4FEANCOZFIVZNBHLJK3ERRHKDRZVGX4RZU7WQIMSSKL4PQZMA',
          fees: hostToXFees,
        },
      })
      try {
        await asset['hostToInterim'](BigNumber(123.456789), 'destination-address', 'destination-chain-id')
        fail()
      } catch (err) {
        expect(err.message).toEqual('Transact exception')
      }
    })
  })
})

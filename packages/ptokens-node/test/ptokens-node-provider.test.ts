import { http } from '@p.network/ptokens-helpers'
import jsonrpc, { JsonRpcError } from 'jsonrpc-lite'

import { pTokensNodeProvider } from '../src/index'

jest.mock('@p.network/ptokens-helpers')

describe('pTokensNodeProvider', () => {
  describe('getUrl', () =>
    test('Should return the URL set when calling constructor', () => {
      const provider = new pTokensNodeProvider('a-url')
      expect(provider.url).toStrictEqual('a-url')
    }))

  describe('sendRpcRequest', () => {
    test('Should call fetch with correct parameters', async () => {
      const provider = new pTokensNodeProvider('http://test-node.p.tokens')
      const httpPostSpy = jest.spyOn(http, 'fetchJsonByPost').mockResolvedValue(jsonrpc.success(1, { data: 'data' }))
      await provider.sendRpcRequest(1, 'method', ['param', 1])
      expect(httpPostSpy).toHaveBeenNthCalledWith(1, 'http://test-node.p.tokens', {
        jsonrpc: '2.0',
        id: 1,
        method: 'method',
        params: ['param', 1],
      })
    })

    test('Should throw if fetchJsonByPost throws', async () => {
      const provider = new pTokensNodeProvider('http://test-node.p.tokens')
      const httpPostSpy = jest.spyOn(http, 'fetchJsonByPost').mockRejectedValue(new Error('fetchJsonByPost error'))
      try {
        await provider.sendRpcRequest(1, 'method', ['param', 1])
        fail()
      } catch (err) {
        expect(err.message).toEqual('fetchJsonByPost error')
        expect(httpPostSpy).toHaveBeenNthCalledWith(1, 'http://test-node.p.tokens', {
          jsonrpc: '2.0',
          id: 1,
          method: 'method',
          params: ['param', 1],
        })
      }
    })

    test('Should throw if response has error', async () => {
      const provider = new pTokensNodeProvider('http://test-node.p.tokens')
      const httpPostSpy = jest
        .spyOn(http, 'fetchJsonByPost')
        .mockResolvedValue(jsonrpc.error(1, new JsonRpcError('error', 500)))
      try {
        await provider.sendRpcRequest(1, 'method', ['param', 1])
        fail()
      } catch (err) {
        expect(err.message).toEqual('JSON RPC error error')
        expect(httpPostSpy).toHaveBeenNthCalledWith(1, 'http://test-node.p.tokens', {
          jsonrpc: '2.0',
          id: 1,
          method: 'method',
          params: ['param', 1],
        })
      }
    })

    test('Should throw if response is not RPC', async () => {
      const provider = new pTokensNodeProvider('http://test-node.p.tokens')
      const httpPostSpy = jest.spyOn(http, 'fetchJsonByPost').mockResolvedValue({ data: 'non-rpc-response' })
      try {
        await provider.sendRpcRequest(1, 'method', ['param', 1])
        fail()
      } catch (err) {
        expect(err.message).toEqual('Invalid JSON RPC response {"data":"non-rpc-response"}')
        expect(httpPostSpy).toHaveBeenNthCalledWith(1, 'http://test-node.p.tokens', {
          jsonrpc: '2.0',
          id: 1,
          method: 'method',
          params: ['param', 1],
        })
      }
    })
  })
})

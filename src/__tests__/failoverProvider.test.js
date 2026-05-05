import { describe, it, expect, jest } from '@jest/globals'
import { FailoverProvider } from '../failoverProvider.js'

// Minimal mock for a JsonRpcProvider — only `send` matters
const mockProvider = (impl) => ({ send: jest.fn(impl) })

describe('FailoverProvider', () => {
  describe('happy path', () => {
    it('returns result from first provider', async () => {
      const p1 = mockProvider(() => Promise.resolve('0x1'))
      const provider = new FailoverProvider([p1], 1)
      const result = await provider.send('eth_blockNumber', [])
      expect(result).toBe('0x1')
      expect(p1.send).toHaveBeenCalledWith('eth_blockNumber', [])
    })
  })

  describe('failover on transport errors', () => {
    it('tries next provider on NETWORK_ERROR', async () => {
      const err = Object.assign(new Error('network error'), { code: 'NETWORK_ERROR' })
      const p1 = mockProvider(() => Promise.reject(err))
      const p2 = mockProvider(() => Promise.resolve('0x2'))
      const provider = new FailoverProvider([p1, p2], 1)
      const result = await provider.send('eth_blockNumber', [])
      expect(result).toBe('0x2')
    })

    it('tries next provider on SERVER_ERROR (e.g. 403/408/429)', async () => {
      const err = Object.assign(new Error('server error'), { code: 'SERVER_ERROR' })
      const p1 = mockProvider(() => Promise.reject(err))
      const p2 = mockProvider(() => Promise.resolve('0x2'))
      const provider = new FailoverProvider([p1, p2], 1)
      const result = await provider.send('eth_blockNumber', [])
      expect(result).toBe('0x2')
    })

    it('tries next provider on timeout (ETIMEDOUT / ECONNRESET)', async () => {
      const err = Object.assign(new Error('timeout'), { code: 'ETIMEDOUT' })
      const p1 = mockProvider(() => Promise.reject(err))
      const p2 = mockProvider(() => Promise.resolve('0x2'))
      const provider = new FailoverProvider([p1, p2], 1)
      const result = await provider.send('eth_blockNumber', [])
      expect(result).toBe('0x2')
    })
  })

  describe('failover on -32000 method not available', () => {
    it('tries next provider when eth_getLogs returns -32000', async () => {
      const err = Object.assign(new Error('method not available'), { code: -32000 })
      const p1 = mockProvider((method) => {
        if (method === 'eth_getLogs') return Promise.reject(err)
        return Promise.resolve([])
      })
      const p2 = mockProvider(() => Promise.resolve([{ data: '0xabc' }]))
      const provider = new FailoverProvider([p1, p2], 1)
      const result = await provider.send('eth_getLogs', [{}])
      expect(result).toEqual([{ data: '0xabc' }])
    })
  })

  describe('failover on pruned history (code 4444)', () => {
    it('tries next provider when eth_getLogs returns code 4444', async () => {
      const err = Object.assign(new Error('pruned history unavailable'), { code: 4444 })
      const p1 = mockProvider(() => Promise.reject(err))
      const p2 = mockProvider(() => Promise.resolve([{ data: '0xabc' }]))
      const provider = new FailoverProvider([p1, p2], 1)
      const result = await provider.send('eth_getLogs', [{}])
      expect(result).toEqual([{ data: '0xabc' }])
    })
  })

  describe('failover on CALL_EXCEPTION with data=null', () => {
    it('tries next provider when eth_call returns CALL_EXCEPTION with null data', async () => {
      const err = Object.assign(new Error('call exception'), { code: 'CALL_EXCEPTION', data: null })
      const p1 = mockProvider(() => Promise.reject(err))
      const p2 = mockProvider(() => Promise.resolve('0xresult'))
      const provider = new FailoverProvider([p1, p2], 1)
      const result = await provider.send('eth_call', [{}])
      expect(result).toBe('0xresult')
    })

    it('does NOT failover on CALL_EXCEPTION with non-null data (legitimate revert)', async () => {
      const err = Object.assign(new Error('call exception'), { code: 'CALL_EXCEPTION', data: '0x1234' })
      const p1 = mockProvider(() => Promise.reject(err))
      const p2 = mockProvider(() => Promise.resolve('0xresult'))
      const provider = new FailoverProvider([p1, p2], 1)
      await expect(provider.send('eth_call', [{}])).rejects.toMatchObject({ code: 'CALL_EXCEPTION' })
      expect(p2.send).not.toHaveBeenCalled()
    })
  })

  describe('failover on empty getLogs for historical blocks', () => {
    it('tries next provider when eth_getLogs returns empty array for old block range', async () => {
      // Block range clearly historical: toBlock much lower than a near-future block
      const params = [{ fromBlock: '0xC57049', toBlock: '0xC57049' }] // block 12939337
      const p1 = mockProvider(() => Promise.resolve([]))
      const p2 = mockProvider(() => Promise.resolve([{ data: '0xabc' }]))
      const provider = new FailoverProvider([p1, p2], 1)
      const result = await provider.send('eth_getLogs', params)
      expect(result).toEqual([{ data: '0xabc' }])
    })

    it('does NOT failover on empty getLogs for recent/latest block range', async () => {
      const params = [{ fromBlock: 'latest', toBlock: 'latest' }]
      const p1 = mockProvider(() => Promise.resolve([]))
      const p2 = mockProvider(() => Promise.resolve([{ data: '0xabc' }]))
      const provider = new FailoverProvider([p1, p2], 1)
      const result = await provider.send('eth_getLogs', params)
      expect(result).toEqual([])
      expect(p2.send).not.toHaveBeenCalled()
    })
  })

  describe('exhausts all providers', () => {
    it('throws last error when all providers fail', async () => {
      const err1 = Object.assign(new Error('err1'), { code: 'NETWORK_ERROR' })
      const err2 = Object.assign(new Error('err2'), { code: 'SERVER_ERROR' })
      const p1 = mockProvider(() => Promise.reject(err1))
      const p2 = mockProvider(() => Promise.reject(err2))
      const provider = new FailoverProvider([p1, p2], 1)
      await expect(provider.send('eth_blockNumber', [])).rejects.toMatchObject({ message: 'err2' })
    })
  })
})

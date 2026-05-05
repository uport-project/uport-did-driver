// FailoverProvider: sequential failover across multiple JsonRpcProvider instances.
// Extends JsonRpcProvider so it can be used anywhere a full ethers provider is expected.
// Overrides `send` to try each backing provider in order, failing over on retriable errors.

import { JsonRpcProvider } from 'ethers'

const RETRIABLE_CODES = new Set(['NETWORK_ERROR', 'SERVER_ERROR', 'ETIMEDOUT', 'ECONNRESET', 'ENOTFOUND'])

function isRetriableError(err) {
  if (RETRIABLE_CODES.has(err.code)) return true
  if (err.code === -32000) return true
  if (err.code === 4444) return true
  if (err.code === 'CALL_EXCEPTION' && err.data == null) return true
  return false
}

// Any specific block tag (not 'latest'/'pending'/'earliest') is an archive query.
// ethr-did-resolver uses 'latest' for current state and specific block numbers for versionId queries.
function isHistoricalBlockRange(params) {
  const filter = params?.[0]
  if (!filter) return false
  const toBlock = filter.toBlock
  return !(!toBlock || toBlock === 'latest' || toBlock === 'pending' || toBlock === 'earliest')
}

export class FailoverProvider extends JsonRpcProvider {
  #providers

  constructor(providers, chainId, options) {
    // Use the first provider's connection URL as the "primary" for JsonRpcProvider init
    // We'll override send() so this URL is never actually used directly
    const firstUrl = providers[0]?._getConnection?.()?.url ?? 'http://localhost:8545'
    super(firstUrl, chainId, { staticNetwork: true, ...options })
    this.#providers = providers
  }

  async send(method, params) {
    let lastError
    for (const provider of this.#providers) {
      try {
        const result = await provider.send(method, params)
        if (method === 'eth_getLogs' && Array.isArray(result) && result.length === 0) {
          if (isHistoricalBlockRange(params)) {
            lastError = Object.assign(new Error('empty historical logs'), { code: 'EMPTY_HISTORICAL' })
            continue
          }
        }
        return result
      } catch (err) {
        if (isRetriableError(err)) {
          lastError = err
          continue
        }
        throw err
      }
    }
    throw lastError
  }
}

// Factory: builds a FailoverProvider from a list of RPC URLs
export function buildFailoverProvider(chainId, rpcUrls) {
  const providers = rpcUrls.map((url) => new JsonRpcProvider(url, chainId, { staticNetwork: true }))
  return new FailoverProvider(providers, chainId)
}

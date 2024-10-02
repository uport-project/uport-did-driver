import app, { providerConfig, timers } from '../app.js'
import request from 'supertest'
import { afterAll, describe, expect, it, jest } from '@jest/globals'
import { deployments } from 'ethr-did-resolver'

jest.setTimeout(30000)

describe('did:ethr driver', () => {
  afterAll(() => {
    // poor man's benchmarking
    for (const rpcUrl of Object.keys(timers)) {
      const average =
        Object.values(timers[rpcUrl]).reduce((acc, val) => acc + val, 0) /
        Object.values(timers[rpcUrl]).length
      console.log(`Average time for ${rpcUrl}: ${average}ms`)
    }
  })

  it.skip('configures all official deployments', () => {
    const configured = providerConfig.networks.map((network) => network.chainId)
    const known = deployments.map((deployment) => deployment.chainId)
    const knownButNotConfigured = known.filter((x) => !new Set(configured).has(x))
    expect(knownButNotConfigured).toEqual([])
  })

  it.skip('configures only official deployments', () => {
    const configured = providerConfig.networks.map((network) => network.chainId)
    const known = deployments.map((deployment) => deployment.chainId)
    const configuredButUnknown = configured.filter((x) => !new Set(known).has(x))
    expect(configuredButUnknown).toEqual([])
  })

  it('responds with didResolutionResult', async () => {
    expect.assertions(4)
    const did = 'did:ethr:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736'
    const response = await request(app).get(`/1.0/identifiers/${did}`)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('didDocument')
    expect(response.body).toHaveProperty('didDocumentMetadata')
    expect(response.body.didResolutionMetadata).toEqual({
      contentType: 'application/did+ld+json',
    })
  })

  describe('responds with known did doc for ', () => {
    it('did:ethr:0xdca7ef03e98e0dc2b855be647c39abe984fcf21b', async () => {
      expect.assertions(2)
      const did = 'did:ethr:0xdca7ef03e98e0dc2b855be647c39abe984fcf21b'
      const response = await request(app).get(`/1.0/identifiers/${did}`)
      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        didDocumentMetadata: {},
        didResolutionMetadata: {
          contentType: 'application/did+ld+json',
        },
        didDocument: {
          '@context': [
            'https://www.w3.org/ns/did/v1',
            'https://w3id.org/security/suites/secp256k1recovery-2020/v2',
            'https://w3id.org/security/v3-unstable',
          ],
          authentication: ['did:ethr:0xdca7ef03e98e0dc2b855be647c39abe984fcf21b#controller'],
          assertionMethod: ['did:ethr:0xdca7ef03e98e0dc2b855be647c39abe984fcf21b#controller'],
          id: 'did:ethr:0xdca7ef03e98e0dc2b855be647c39abe984fcf21b',
          verificationMethod: [
            {
              blockchainAccountId: 'eip155:1:0xdCa7EF03e98e0DC2B855bE647C39ABe984fcF21B',
              id: 'did:ethr:0xdca7ef03e98e0dc2b855be647c39abe984fcf21b#controller',
              controller: 'did:ethr:0xdca7ef03e98e0dc2b855be647c39abe984fcf21b',
              type: 'EcdsaSecp256k1RecoveryMethod2020',
            },
          ],
        },
      })
    })

    it('did:ethr:0x26bf14321004e770e7a8b080b7a526d8eed8b388?versionId=0', async () => {
      expect.assertions(2)
      const did = 'did:ethr:0x26bf14321004e770e7a8b080b7a526d8eed8b388?versionId=0'
      const response = await request(app).get(`/1.0/identifiers/${did}`)
      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        didDocumentMetadata: {
          nextVersionId: '12090175',
          nextUpdate: '2021-03-22T18:14:29Z',
        },
        didResolutionMetadata: {
          contentType: 'application/did+ld+json',
        },
        didDocument: {
          '@context': [
            'https://www.w3.org/ns/did/v1',
            'https://w3id.org/security/suites/secp256k1recovery-2020/v2',
            'https://w3id.org/security/v3-unstable',
          ],
          id: 'did:ethr:0x26bf14321004e770e7a8b080b7a526d8eed8b388',
          verificationMethod: [
            {
              id: 'did:ethr:0x26bf14321004e770e7a8b080b7a526d8eed8b388#controller',
              type: 'EcdsaSecp256k1RecoveryMethod2020',
              controller: 'did:ethr:0x26bf14321004e770e7a8b080b7a526d8eed8b388',
              blockchainAccountId: 'eip155:1:0x26bF14321004e770E7A8b080b7a526d8eed8b388',
            },
          ],
          authentication: ['did:ethr:0x26bf14321004e770e7a8b080b7a526d8eed8b388#controller'],
          assertionMethod: ['did:ethr:0x26bf14321004e770e7a8b080b7a526d8eed8b388#controller'],
        },
      })
    })

    it('did:ethr:0x02b97c30de767f084ce3080168ee293053ba33b235d7116a3263d29f1450936b71', async () => {
      expect.assertions(2)
      const did = 'did:ethr:0x02b97c30de767f084ce3080168ee293053ba33b235d7116a3263d29f1450936b71'
      const response = await request(app).get(`/1.0/identifiers/${did}`)
      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        didDocumentMetadata: {},
        didResolutionMetadata: {
          contentType: 'application/did+ld+json',
        },
        didDocument: {
          '@context': [
            'https://www.w3.org/ns/did/v1',
            'https://w3id.org/security/suites/secp256k1recovery-2020/v2',
            'https://w3id.org/security/v3-unstable',
          ],
          authentication: [
            'did:ethr:0x02b97c30de767f084ce3080168ee293053ba33b235d7116a3263d29f1450936b71#controller',
            'did:ethr:0x02b97c30de767f084ce3080168ee293053ba33b235d7116a3263d29f1450936b71#controllerKey',
          ],
          assertionMethod: [
            'did:ethr:0x02b97c30de767f084ce3080168ee293053ba33b235d7116a3263d29f1450936b71#controller',
            'did:ethr:0x02b97c30de767f084ce3080168ee293053ba33b235d7116a3263d29f1450936b71#controllerKey',
          ],
          id: 'did:ethr:0x02b97c30de767f084ce3080168ee293053ba33b235d7116a3263d29f1450936b71',
          verificationMethod: [
            {
              blockchainAccountId: 'eip155:1:0xC662e6c5F91B9FcD22D7FcafC80Cf8b640aed247',
              controller: 'did:ethr:0x02b97c30de767f084ce3080168ee293053ba33b235d7116a3263d29f1450936b71',
              id: 'did:ethr:0x02b97c30de767f084ce3080168ee293053ba33b235d7116a3263d29f1450936b71#controller',
              type: 'EcdsaSecp256k1RecoveryMethod2020',
            },
            {
              controller: 'did:ethr:0x02b97c30de767f084ce3080168ee293053ba33b235d7116a3263d29f1450936b71',
              id: 'did:ethr:0x02b97c30de767f084ce3080168ee293053ba33b235d7116a3263d29f1450936b71#controllerKey',
              publicKeyHex: '02b97c30de767f084ce3080168ee293053ba33b235d7116a3263d29f1450936b71',
              type: 'EcdsaSecp256k1VerificationKey2019',
            },
          ],
        },
      })
    })
  })

  describe('responds with didResolutionResult for', () => {
    const names = providerConfig.networks.map((network) => network.name)
    const chainIds = providerConfig.networks.map((network) => `0x${BigInt(network.chainId).toString(16)}`)

    it.each(names)('did:ethr:%s:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736', async (name) => {
      expect.assertions(1)
      const did = `did:ethr:${name}:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736`
      const response = await request(app).get(`/1.0/identifiers/${did}`)
      expect(response.body.didDocument).toHaveProperty('verificationMethod')
    })

    it.each(chainIds)('did:ethr:%s:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736', async (chainId) => {
      expect.assertions(1)
      const did = `did:ethr:${chainId}:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736`
      const response = await request(app).get(`/1.0/identifiers/${did}`)
      expect(response.body.didDocument).toHaveProperty('verificationMethod')
    })
  })

  describe('responds with error for', () => {
    it('unknown ethr network', async () => {
      expect.assertions(2)
      const did = 'did:ethr:unknown:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736'
      const response = await request(app).get(`/1.0/identifiers/${did}`)
      expect(response.status).toBe(200)
      expect(response.body.didResolutionMetadata).toEqual({
        error: 'unknownNetwork',
        message: 'The DID resolver does not have a configuration for network: unknown',
      })
    })

    it('missing address mainnet ethr DID', async () => {
      expect.assertions(2)
      const did = 'did:ethr:0x1:'
      const response = await request(app).get(`/1.0/identifiers/${did}`)
      expect(response.status).toBe(200)
      expect(response.body.didResolutionMetadata).toEqual({
        error: 'invalidDid',
      })
    })

    it('bad address generic ethr DID', async () => {
      expect.assertions(2)
      const did = 'did:ethr:0x1234'
      const response = await request(app).get(`/1.0/identifiers/${did}`)
      expect(response.status).toBe(200)
      expect(response.body.didResolutionMetadata).toEqual({
        error: 'invalidDid',
        message: 'Not a valid did:ethr: 0x1234',
      })
    })
  })
})

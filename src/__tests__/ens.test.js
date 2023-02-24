import app from '../app.js'
import request from 'supertest'
import { jest } from '@jest/globals'

jest.setTimeout(30000)

describe('did:ens driver', () => {
  it.skip('responds with didResolutionResult', async () => {
    expect.assertions(4)
    const did = 'did:ens:vitalik.eth'
    const response = await request(app).get(`/1.0/identifiers/${did}`)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('didDocument')
    expect(response.body).toHaveProperty('didDocumentMetadata')
    expect(response.body.didResolutionMetadata).toEqual({
      contentType: 'application/did+json',
    })
  })

  describe('responds with known did doc for ', () => {
    it('did:ens:vitalik.eth', async () => {
      expect.assertions(2)
      const did = 'did:ens:vitalik.eth'
      const ethrAddr = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
      const response = await request(app).get(`/1.0/identifiers/${did}`)
      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        didDocument: {
          id: did,
          service: [
            {
              id: `${did}#Web3PublicProfile-${ethrAddr}`,
              type: 'Web3PublicProfile',
              serviceEndpoint: 'vitalik.eth',
            },
          ],
          verificationMethod: [
            {
              id: `${did}#${ethrAddr}`,
              type: 'EcdsaSecp256k1RecoveryMethod2020',
              controller: did,
              blockchainAccountId: `${ethrAddr}@eip155:1`,
            },
          ],
          authentication: [`${did}#${ethrAddr}`],
          capabilityDelegation: [`${did}#${ethrAddr}`],
          capabilityInvocation: [`${did}#${ethrAddr}`],
          assertionMethod: [`${did}#${ethrAddr}`],
        },
        didDocumentMetadata: {},
        didResolutionMetadata: {
          contentType: 'application/did+json',
        },
      })
    })

    it('did:ens:goerli:whatever.eth', async () => {
      expect.assertions(2)
      const did = 'did:ens:goerli:whatever.eth'
      const ethrAddr = '0x4af859d61d07A8c515FE0E3Cc1Ea5e49A260bBa3'
      const response = await request(app).get(`/1.0/identifiers/${did}`)
      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        didDocument: {
          id: did,
          service: [
            {
              id: `${did}#Web3PublicProfile-${ethrAddr}`,
              type: 'Web3PublicProfile',
              serviceEndpoint: 'whatever.eth',
            },
          ],
          verificationMethod: [
            {
              id: `${did}#${ethrAddr}`,
              type: 'EcdsaSecp256k1RecoveryMethod2020',
              controller: did,
              blockchainAccountId: `${ethrAddr}@eip155:5`,
            },
            {
              id: `${did}#my-key`,
              type: 'X25519KeyAgreementKey2019',
              controller: did,
              publicKeyMultibase: 'z9hFgmPVfmBZwRvFEyniQDBkz9LmV7gDEqytWyGZLmDXE',
            },
          ],
          authentication: [`${did}#${ethrAddr}`],
          capabilityDelegation: [`${did}#${ethrAddr}`],
          capabilityInvocation: [`${did}#${ethrAddr}`],
          assertionMethod: [`${did}#${ethrAddr}`],
          keyAgreement: [`${did}#my-key`],
        },
        didDocumentMetadata: {},
        didResolutionMetadata: {
          contentType: 'application/did+json',
        },
      })
    })
  })
})

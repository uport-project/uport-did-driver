var app = require('../src/app')
var request = require('supertest')

describe('did:ethr driver', () => {
  it('responds with didResolutionResult', async () => {
    expect.assertions(4)
    const did = 'did:ethr:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736'
    const response = await request(app).get(`/1.0/identifiers/${did}`)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('didDocument')
    expect(response.body).toHaveProperty('didDocumentMetadata')
    expect(response.body.didResolutionMetadata).toEqual({
      contentType: 'application/did+ld+json'
    })
  })

  describe('responds with known did doc for ', () => {
    //this should fail once the ethr-did-resolver is updated to the latest DID doc format
    it('did:ethr:0xdca7ef03e98e0dc2b855be647c39abe984fcf21b', async () => {
      expect.assertions(2)
      const did = 'did:ethr:0xdca7ef03e98e0dc2b855be647c39abe984fcf21b'
      const response = await request(app).get(`/1.0/identifiers/${did}`)
      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        didDocumentMetadata: {},
        didResolutionMetadata: {
          contentType: 'application/did+ld+json'
        },
        didDocument: {
          '@context': [
            'https://www.w3.org/ns/did/v1',
            'https://identity.foundation/EcdsaSecp256k1RecoverySignature2020/lds-ecdsa-secp256k1-recovery2020-0.0.jsonld'
          ],
          authentication: ['did:ethr:0xdca7ef03e98e0dc2b855be647c39abe984fcf21b#controller'],
          id: 'did:ethr:0xdca7ef03e98e0dc2b855be647c39abe984fcf21b',
          verificationMethod: [
            {
              blockchainAccountId: '0xdCa7EF03e98e0DC2B855bE647C39ABe984fcF21B@eip155:1',
              id: 'did:ethr:0xdca7ef03e98e0dc2b855be647c39abe984fcf21b#controller',
              controller: 'did:ethr:0xdca7ef03e98e0dc2b855be647c39abe984fcf21b',
              type: 'EcdsaSecp256k1RecoveryMethod2020'
            }
          ]
        }
      })
    })
  })

  describe('responds with didResolutionResult for', () => {
    it('did:ethr:mainnet:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736', async () => {
      expect.assertions(1)
      const did = 'did:ethr:mainnet:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736'
      const response = await request(app).get(`/1.0/identifiers/${did}`)
      expect(response.body.didDocument).toHaveProperty('verificationMethod')
    })

    it('did:ethr:0x1:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736', async () => {
      expect.assertions(1)
      const did = 'did:ethr:0x1:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736'
      const response = await request(app).get(`/1.0/identifiers/${did}`)
      expect(response.body.didDocument).toHaveProperty('verificationMethod')
    })

    it('did:ethr:ropsten:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736', async () => {
      expect.assertions(1)
      const did = 'did:ethr:ropsten:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736'
      const response = await request(app).get(`/1.0/identifiers/${did}`)
      expect(response.body.didDocument).toHaveProperty('verificationMethod')
    })

    it('did:ethr:0x3:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736', async () => {
      expect.assertions(1)
      const did = 'did:ethr:0x3:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736'
      const response = await request(app).get(`/1.0/identifiers/${did}`)
      expect(response.body.didDocument).toHaveProperty('verificationMethod')
    })

    it('did:ethr:rinkeby:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736', async () => {
      expect.assertions(1)
      const did = 'did:ethr:rinkeby:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736'
      const response = await request(app).get(`/1.0/identifiers/${did}`)
      expect(response.body.didDocument).toHaveProperty('verificationMethod')
    })

    it('did:ethr:0x4:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736', async () => {
      expect.assertions(1)
      const did = 'did:ethr:0x4:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736'
      const response = await request(app).get(`/1.0/identifiers/${did}`)
      expect(response.body.didDocument).toHaveProperty('verificationMethod')
    })

    it('did:ethr:kovan:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736', async () => {
      expect.assertions(1)
      const did = 'did:ethr:kovan:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736'
      const response = await request(app).get(`/1.0/identifiers/${did}`)
      expect(response.body.didDocument).toHaveProperty('verificationMethod')
    })

    it('0did:ethr:0x2a:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736x2a', async () => {
      expect.assertions(1)
      const did = 'did:ethr:0x2a:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736'
      const response = await request(app).get(`/1.0/identifiers/${did}`)
      expect(response.body.didDocument).toHaveProperty('verificationMethod')
    })

    it('did:ethr:goerli:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736', async () => {
      expect.assertions(1)
      const did = 'did:ethr:goerli:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736'
      const response = await request(app).get(`/1.0/identifiers/${did}`)
      expect(response.body.didDocument).toHaveProperty('verificationMethod')
    })

    it('did:ethr:0x5:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736', async () => {
      expect.assertions(1)
      const did = 'did:ethr:0x5:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736'
      const response = await request(app).get(`/1.0/identifiers/${did}`)
      expect(response.body.didDocument).toHaveProperty('verificationMethod')
    })

    it('did:ethr:rsk:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736', async () => {
      expect.assertions(1)
      const did = 'did:ethr:rsk:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736'
      const response = await request(app).get(`/1.0/identifiers/${did}`)
      expect(response.body.didDocument).toHaveProperty('verificationMethod')
    })

    it('did:ethr:0x1e:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736', async () => {
      expect.assertions(1)
      const did = 'did:ethr:0x1e:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736'
      const response = await request(app).get(`/1.0/identifiers/${did}`)
      expect(response.body.didDocument).toHaveProperty('verificationMethod')
    })

    it('did:ethr:rsk:testnet:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736', async () => {
      expect.assertions(1)
      const did = 'did:ethr:rsk:testnet:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736'
      const response = await request(app).get(`/1.0/identifiers/${did}`)
      expect(response.body.didDocument).toHaveProperty('verificationMethod')
    })

    it('did:ethr:0x1f:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736', async () => {
      expect.assertions(1)
      const did = 'did:ethr:0x1f:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736'
      const response = await request(app).get(`/1.0/identifiers/${did}`)
      expect(response.body.didDocument).toHaveProperty('verificationMethod')
    })
  })
})

import app from '../app.js'
import request from 'supertest'

describe('did:web driver', () => {
  it('responds with didResolutionResult for did:web:did.actor:alice', async () => {
    expect.assertions(5)
    const did = 'did:web:did.actor:alice'
    const response = await request(app).get(`/1.0/identifiers/${did}`)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('didDocument')
    expect(response.body.didDocument).toHaveProperty('authentication')
    expect(response.body).toHaveProperty('didDocumentMetadata')
    expect(response.body.didResolutionMetadata).toEqual({
      contentType: 'application/did+ld+json',
    })
  })

  it('responds with notFound error for unknown DID', async () => {
    // expect.assertions(1)
    const did = 'did:web:this.address.is.not.a.d.i.d.com'
    const response = await request(app).get(`/1.0/identifiers/${did}`)
    expect(response.status).toBe(200)
    expect(response.body.didDocument).toBe(null)
    expect(response.body.didResolutionMetadata).toEqual({
      error: 'notFound',
      message:
        'resolver_error: DID must resolve to a valid https URL containing a JSON document: FetchError: request to https://this.address.is.not.a.d.i.d.com/.well-known/did.json failed, reason: getaddrinfo ENOTFOUND this.address.is.not.a.d.i.d.com',
    })
  })
})

import app from '../app.js'
import request from 'supertest'

describe('did:plc driver', () => {
  it('responds with didResolutionResult for did:plc:wuyiqd25zhsut5a2gc46iqoi', async () => {
    expect.assertions(5)
    const did = 'did:plc:wuyiqd25zhsut5a2gc46iqoi'
    const response = await request(app).get(`/1.0/identifiers/${did}`)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('didDocument')
    expect(response.body.didDocument).toHaveProperty('service')
    expect(response.body).toHaveProperty('didDocumentMetadata')
    expect(response.body.didResolutionMetadata).toEqual({
      contentType: 'application/did+ld+json',
    })
  })

  it('responds with notFound error for unknown DID', async () => {
    // expect.assertions(1)
    const did = 'did:plc:fakefakefake'
    const response = await request(app).get(`/1.0/identifiers/${did}`)
    expect(response.status).toBe(200)
    expect(response.body.didDocument).toBe(null)
    expect(response.body.didResolutionMetadata.error).toEqual('notFound')
  })
})

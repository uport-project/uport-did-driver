import app from '../app.js'
import request from 'supertest'

describe('uport-did-driver responds with did doc for', () => {
  it.skip('responds with didResolutionResult for did:nacl:Md8JiMIwsapml_FtQ2ngnGftNP5UmVCAUuhnLyAsPxI', async () => {
    expect.assertions(5)
    const did = 'did:nacl:Md8JiMIwsapml_FtQ2ngnGftNP5UmVCAUuhnLyAsPxI'
    const response = await request(app).get(`/1.0/identifiers/${did}`)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('didDocument')
    expect(response.body.didDocument).toHaveProperty('authentication')
    expect(response.body).toHaveProperty('didDocumentMetadata')
    expect(response.body.didResolutionMetadata).toEqual({
      contentType: 'application/did+ld+json',
    })
  })

  //  it('responds with didResolutionResult for did:https:uportlandia.uport.me', async () => {
  //    expect.assertions(5)
  //    const did = 'did:https:uportlandia.uport.me'
  //    const response = await request(app).get(`/1.0/identifiers/${did}`)
  //    expect(response.status).toBe(200)
  //    expect(response.body).toHaveProperty('didDocument')
  //    expect(response.body.didDocument).toHaveProperty('publicKey')
  //    expect(response.body).toHaveProperty('didDocumentMetadata')
  //    expect(response.body.didResolutionMetadata).toEqual({
  //      contentType: 'application/did+ld+json'
  //    })
  //  })
})

describe('uport-did-driver responds with error', () => {
  it('unsupportedDidMethod', async () => {
    expect.assertions(2)
    const did = 'did:example:unsupported'
    const response = await request(app).get(`/1.0/identifiers/${did}`)
    expect(response.status).toBe(200)
    expect(response.body.didResolutionMetadata).toEqual({
      error: 'unsupportedDidMethod',
    })
  })

  it('HTTP 404 for root path', (done) => {
    request(app).get('/').expect(404, done)
  })

  it('HTTP 404 for unknown paths', (done) => {
    request(app).get('/random/other').expect(404, done)
  })
})

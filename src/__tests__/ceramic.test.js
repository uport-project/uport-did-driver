import app from '../app.js'
import request from 'supertest'

describe.skip('did:3 driver', () => {
  it('responds with didResolutionResult', async () => {
    expect.assertions(4)
    const did = 'did:3:kjzl6cwe1jw14akzaln614o61ewgfzpmxhrn7zmejvgpuegdpz303uhurlmqjpx'
    const response = await request(app).get(`/1.0/identifiers/${did}`)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('didDocument')
    expect(response.body).toHaveProperty('didDocumentMetadata')
    expect(response.body.didResolutionMetadata).toEqual({
      contentType: 'application/did+json',
    })
  })
})

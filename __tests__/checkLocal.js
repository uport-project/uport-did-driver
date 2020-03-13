var app = require('../expressresolver')
var request = require('supertest')

describe('uport-did-driver responds with did doc for', () => {

  it('did:ethr', (done) => {
    const did = "did:ethr:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736"
    request(app)
      .get(`/1.0/identifiers/${did}`)
      .expect((res) => {
        expect(res.body.id).toEqual(did);
        expect(res.body).toHaveProperty('publicKey')
      })
      .expect(200, done);
  });

  it('did:nacl', (done) => {
    const did = "did:nacl:Md8JiMIwsapml_FtQ2ngnGftNP5UmVCAUuhnLyAsPxI"
    request(app)
      .get(`/1.0/identifiers/${did}`)
      .expect((res) => {
        expect(res.body.id).toEqual(did);
        expect(res.body).toHaveProperty('publicKey')
      })
      .expect(200, done);
  });

  it('did:web', (done) => {
    const did = "did:web:uport.me"
    request(app)
      .get(`/1.0/identifiers/${did}`)
      .expect((res) => {
        expect(res.body.id).toEqual(did);
        expect(res.body).toHaveProperty('publicKey')
      })
      .expect(200, done);
  });

  it('did:https (legacy)', (done) => {
    const did = "did:https:uportlandia.uport.me"
    request(app)
      .get(`/1.0/identifiers/${did}`)
      .expect((res) => {
        expect(res.body.id).toEqual(did);
        expect(res.body).toHaveProperty('publicKey')
      })
      .expect(200, done);
  });
});

describe('uport-did-driver responds with known did doc for', () => {

  //this should fail once the ethr-did-resolver is updated to the latest DID doc format
  it('did:ethr:0xdca7ef03e98e0dc2b855be647c39abe984fcf21b', (done) => {
    const did = "did:ethr:0xdca7ef03e98e0dc2b855be647c39abe984fcf21b"
    request(app)
      .get(`/1.0/identifiers/${did}`)
      .expect((res) => {
        expect(res.body).toEqual({
          "@context": "https://w3id.org/did/v1",
          authentication: [{
              publicKey: "did:ethr:0xdca7ef03e98e0dc2b855be647c39abe984fcf21b#owner",
              type: "Secp256k1SignatureAuthentication2018"
          }],
          id: "did:ethr:0xdca7ef03e98e0dc2b855be647c39abe984fcf21b",
          publicKey: [{
            ethereumAddress: "0xdca7ef03e98e0dc2b855be647c39abe984fcf21b",
            id: "did:ethr:0xdca7ef03e98e0dc2b855be647c39abe984fcf21b#owner",
            owner: "did:ethr:0xdca7ef03e98e0dc2b855be647c39abe984fcf21b",
            type: "Secp256k1VerificationKey2018"
          }]
       });
      })
      .expect(200, done);
  });

});

describe('uport-did-driver responds with HTTP error', () => {

  it('500 for mismatched did method', (done) => {
    const did = "did:web:uportlandia.uport.me"
    request(app)
      .get(`/1.0/identifiers/${did}`)
      .expect(500, done);
  });

  it('400 for unknown did', (done) => {
    const did = "did:example:unsupported"
    request(app)
      .get(`/1.0/identifiers/${did}`)
      .expect(400, done);
  });

  it('500 for unknown ethr network', (done) => {
    const did = "did:ethr:unknown:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736"
    request(app)
      .get(`/1.0/identifiers/${did}`)
      .expect(500, done);
  });

  it('400 for missing address mainnet ethr DID', (done) => {
    const did = "did:ethr:0x1:"
    request(app)
      .get(`/1.0/identifiers/${did}`)
      .expect(400, done);
  });

  it('400 for bad address generic ethr DID', (done) => {
    const did = "did:ethr:0x1234"
    request(app)
      .get(`/1.0/identifiers/${did}`)
      .expect(400, done);
  });

  it('404 for root path', (done) => {
    request(app)
      .get('/')
      .expect(404, done);
  });

  it('404 for unknown paths', (done) => {
    request(app)
      .get('/random/other')
      .expect(404, done);
  });
});

describe('uport-did-driver responds with did doc for', () => {

  it('did:ethr:mainnet', (done) => {
    const did = "did:ethr:mainnet:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736"
    request(app)
      .get(`/1.0/identifiers/${did}`)
      .expect((res) => {
        expect(res.body.id).toEqual(did);
        expect(res.body).toHaveProperty('publicKey')
      })
      .expect(200, done);
  });

  it('did:ethr:ropsten', (done) => {
    const did = "did:ethr:ropsten:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736"
    request(app)
      .get(`/1.0/identifiers/${did}`)
      .expect((res) => {
        expect(res.body.id).toEqual(did);
        expect(res.body).toHaveProperty('publicKey')
      })
      .expect(200, done);
  });

  it('did:ethr:rinkeby', (done) => {
    const did = "did:ethr:rinkeby:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736"
    request(app)
      .get(`/1.0/identifiers/${did}`)
      .expect((res) => {
        expect(res.body.id).toEqual(did);
        expect(res.body).toHaveProperty('publicKey')
      })
      .expect(200, done);
  });

  it('did:ethr:kovan', (done) => {
    const did = "did:ethr:kovan:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736"
    request(app)
      .get(`/1.0/identifiers/${did}`)
      .expect((res) => {
        expect(res.body.id).toEqual(did);
        expect(res.body).toHaveProperty('publicKey')
      })
      .expect(200, done);
  });

  it('did:ethr:goerli', (done) => {
    const did = "did:ethr:goerli:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736"
    request(app)
      .get(`/1.0/identifiers/${did}`)
      .expect((res) => {
        expect(res.body.id).toEqual(did);
        expect(res.body).toHaveProperty('publicKey')
      })
      .expect(200, done);
  });

  it('did:ethr:rsk', (done) => {
    const did = "did:ethr:rsk:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736"
    request(app)
      .get(`/1.0/identifiers/${did}`)
      .expect((res) => {
        expect(res.body.id).toEqual(did);
        expect(res.body).toHaveProperty('publicKey')
      })
      .expect(200, done);
  });

  it('did:ethr:rsk:testnet', (done) => {
    const did = "did:ethr:rsk:testnet:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736"
    request(app)
      .get(`/1.0/identifiers/${did}`)
      .expect((res) => {
        expect(res.body.id).toEqual(did);
        expect(res.body).toHaveProperty('publicKey')
      })
      .expect(200, done);
  });

  it('did:ethr:0x1', (done) => {
    const did = "did:ethr:0x1:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736"
    request(app)
      .get(`/1.0/identifiers/${did}`)
      .expect((res) => {
        expect(res.body.id).toEqual(did);
        expect(res.body).toHaveProperty('publicKey')
      })
      .expect(200, done);
  });

  it('did:ethr:0x3', (done) => {
    const did = "did:ethr:0x3:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736"
    request(app)
      .get(`/1.0/identifiers/${did}`)
      .expect((res) => {
        expect(res.body.id).toEqual(did);
        expect(res.body).toHaveProperty('publicKey')
      })
      .expect(200, done);
  });

  it('did:ethr:0x4', (done) => {
    const did = "did:ethr:0x4:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736"
    request(app)
      .get(`/1.0/identifiers/${did}`)
      .expect((res) => {
        expect(res.body.id).toEqual(did);
        expect(res.body).toHaveProperty('publicKey')
      })
      .expect(200, done);
  });

  it('did:ethr:0x2a', (done) => {
    const did = "did:ethr:0x2a:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736"
    request(app)
      .get(`/1.0/identifiers/${did}`)
      .expect((res) => {
        expect(res.body.id).toEqual(did);
        expect(res.body).toHaveProperty('publicKey')
      })
      .expect(200, done);
  });

  it('did:ethr:0x5', (done) => {
    const did = "did:ethr:0x5:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736"
    request(app)
      .get(`/1.0/identifiers/${did}`)
      .expect((res) => {
        expect(res.body.id).toEqual(did);
        expect(res.body).toHaveProperty('publicKey')
      })
      .expect(200, done);
  });

  it('did:ethr:0x1e', (done) => {
    const did = "did:ethr:0x1e:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736"
    request(app)
      .get(`/1.0/identifiers/${did}`)
      .expect((res) => {
        expect(res.body.id).toEqual(did);
        expect(res.body).toHaveProperty('publicKey')
      })
      .expect(200, done);
  });

  it('did:ethr:0x1f', (done) => {
    const did = "did:ethr:0x1f:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736"
    request(app)
      .get(`/1.0/identifiers/${did}`)
      .expect((res) => {
        expect(res.body.id).toEqual(did);
        expect(res.body).toHaveProperty('publicKey')
      })
      .expect(200, done);
  });

});

afterAll((done) => {
  app.server.close();
  done();
});
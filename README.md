# uport-did-driver

Driver for the uPort DID methods to be used in
the [Universal Resolver](https://github.com/decentralized-identity/universal-resolver). The Docker image is hosted on
Docker Hub here:

<https://hub.docker.com/r/uport/uni-resolver-driver-did-uport/>

The file `src/server.js` is a small Express Node app acting as a thin wrapper around
the [Javascript DID resolver](https://github.com/decentralized-identity/did-resolver). It listens to port 8081.

The following DID methods are supported:

* [ethr](https://github.com/decentralized-identity/ethr-did-resolver)
* [web](https://github.com/decentralized-identity/web-did-resolver)
* [ens](https://github.com/veramolabs/ens-did-resolver)

## Curl Tests

Run service with

```
npm start
```

then run queries

```
curl -X GET http://localhost:8081/1.0/identifiers/did:web:did.actor:alice
curl -X GET http://localhost:8081/1.0/identifiers/did:ethr:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736
```

## Example DIDs

### did:ethr

* `did:ethr:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736`
* `did:ethr:0x02b97c30de767f084ce3080168ee293053ba33b235d7116a3263d29f1450936b71`
* `did:ethr:mainnet:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736`
* `did:ethr:sepolia:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736`
* `did:ethr:gno:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736`
* `did:ethr:holesky:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736`
* `did:ethr:rsk:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736`
* `did:ethr:rsk:testnet:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736`
* `did:ethr:volta:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736`
* `did:ethr:ewc:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736`
* `did:ethr:polygon:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736`
* `did:ethr:aurora:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736`
* `did:ethr:cardona:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736`

### did:web

* `did:web:skounis.github.io`
* `did:web:veramo.io`

### did:ens

* `did:ens:vitalik.eth`

### did:peer

* `did:peer:2.Ez6LSpSrLxbAhg2SHwKk7kwpsH7DM7QjFS5iK6qP87eViohud.Vz6MkqRYqQiSgvZQdnBytw86Qbs2ZWUkGv22od935YF4s8M7V.SeyJ0IjoiZG0iLCJzIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9lbmRwb2ludDEiLCJyIjpbImRpZDpleGFtcGxlOnNvbWVtZWRpYXRvciNzb21la2V5MSJdLCJhIjpbImRpZGNvbW0vdjIiLCJkaWRjb21tL2FpcDI7ZW52PXJmYzU4NyJdfQ`

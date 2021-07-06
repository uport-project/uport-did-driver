# uport-did-driver

Driver for the uPort DID methods to be used in the [Universal Resolver](https://github.com/decentralized-identity/universal-resolver). The Docker image is hosted on Docker Hub here:

<https://hub.docker.com/r/uport/uni-resolver-driver-did-uport/>

The file `src/server.js` is an small Express Node app acting as a thin wrapper around the [Javascript DID resolver](https://github.com/decentralized-identity/did-resolver). It listens to port 8081.

The following DID methods are supported:

* [ethr](https://github.com/decentralized-identity/ethr-did-resolver)
* [web](https://github.com/decentralized-identity/web-did-resolver)
* [nacl](https://github.com/uport-project/nacl-did) (DEPRECATED, please use `did:key` instead)

## Curl Tests

Run service with 
```
npm start
```

then run queries

```
curl -X GET http://localhost:8081/1.0/identifiers/did:web:did.actor:alice
curl -X GET http://localhost:8081/1.0/identifiers/did:ethr:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736
curl -X GET http://localhost:8081/1.0/identifiers/did:nacl:Md8JiMIwsapml_FtQ2ngnGftNP5UmVCAUuhnLyAsPxI
```

## Example DIDs

* `did:ethr:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736`
* `did:ethr:0x02b97c30de767f084ce3080168ee293053ba33b235d7116a3263d29f1450936b71`
* `did:ethr:mainnet:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736`
* `did:ethr:ropsten:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736`
* `did:ethr:rinkeby:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736`
* `did:ethr:goerli:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736`
* `did:ethr:kovan:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736`
* `did:ethr:rsk:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736`
* `did:ethr:0x1:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736`
* `did:ethr:0x3:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736`
* `did:ethr:0x4:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736`
* `did:ethr:0x5:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736`
* `did:ethr:0x2a:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736`
* `did:ethr:0x1e:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736`
* `did:web:pulsar.veramo.io`
* `did:web:did.actor:alice`
* `did:nacl:Md8JiMIwsapml_FtQ2ngnGftNP5UmVCAUuhnLyAsPxI`

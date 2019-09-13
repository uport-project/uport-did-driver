# uport-did-driver

Driver for the uPort DID method to be used in the [Universal Resolver](https://github.com/decentralized-identity/universal-resolver). The Docker image is hosted on Docker Hub here:

<https://hub.docker.com/r/uport/uni-resolver-driver-did-uport/>

The file `expressresolver.js` is an small Express Node app acting as a thin wrapper around the [Javascript DID resolver](https://github.com/decentralized-identity/did-resolver). It listens to port 8081.

The following DID methods are supported:

* [ethr](https://github.com/decentralized-identity/ethr-did-resolver)
* [web](https://github.com/uport-project/web-did-resolver)

The resolver currently uses the default Ethereum nodes hosted by [Infura](https://infura.io).

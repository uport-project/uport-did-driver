
const { Resolver } = require('did-resolver')
const ethr = require('ethr-did-resolver')
const web = require('web-did-resolver')
const nacl = require('nacl-did')

//this project ID is only useful for ethr-did resolution
const infuraId = "ec9c99d75b834bac8dd4bfacad8cfdf7"

const providerConfig = {
  networks: [
    { name: "mainnet", rpcUrl: `https://mainnet.infura.io/v3/${infuraId}` },
    { name: "0x1", rpcUrl: `https://mainnet.infura.io/v3/${infuraId}` },
    { name: "ropsten", rpcUrl: `https://ropsten.infura.io/v3/${infuraId}` },
    { name: "0x3", rpcUrl: `https://ropsten.infura.io/v3/${infuraId}` },
    { name: "rinkeby", rpcUrl: `https://rinkeby.infura.io/v3/${infuraId}` },
    { name: "0x4", rpcUrl: `https://rinkeby.infura.io/v3/${infuraId}` },
    { name: "goerli", rpcUrl: `https://goerli.infura.io/v3/${infuraId}` },
    { name: "0x5", rpcUrl: `https://goerli.infura.io/v3/${infuraId}` },
    { name: "kovan", rpcUrl: `https://kovan.infura.io/v3/${infuraId}` },
    { name: "0x2a", rpcUrl: `https://kovan.infura.io/v3/${infuraId}` },
    { name: "rsk", registry: "0xdca7ef03e98e0dc2b855be647c39abe984fcf21b", rpcUrl: "https://did.rsk.co:4444" },
    { name: "0x1e", registry: "0xdca7ef03e98e0dc2b855be647c39abe984fcf21b", rpcUrl: "https://did.rsk.co:4444" },
    { name: "rsk:testnet", registry: "0xdca7ef03e98e0dc2b855be647c39abe984fcf21b", rpcUrl: "https://did.testnet.rsk.co:4444" },
    { name: "0x1f", registry: "0xdca7ef03e98e0dc2b855be647c39abe984fcf21b", rpcUrl: "https://did.testnet.rsk.co:4444" },
  ]
}

const resolver = new Resolver({
    ...ethr.getResolver(providerConfig),
    ...web.getResolver(),
    https : web.getResolver().web,
    nacl: nacl.resolver
})

const express = require('express')
const app = express()

app.get('/1.0/identifiers/*', function (req, res) {

  const url = req.url
  const regex = /\/1.0\/identifiers\/(did:.*)/
  const did = regex.exec(url)[1]

  console.log("Resolving DID: "+did)

  resolver.resolve(did)
  .then((doc) => {
    res.send(doc);
  }).catch((err) => {
    if ( err.message.match(/(Unsupported DID method:)|(Invalid DID)|(Not a valid ethr DID:)/) ) {
      res.status(400).send(err.message)
    } else {
      console.error(err);
      res.status(500).send(err.message);
    }
  })

})

app.server = app.listen(8081, function () {
  console.log("Resolver app listening on port 8081...")
})

module.exports = app

// Example DIDs
// did:ethr:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736
// did:ethr:0x02b97c30de767f084ce3080168ee293053ba33b235d7116a3263d29f1450936b71
// did:ethr:mainnet:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736
// did:ethr:ropsten:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736
// did:ethr:rinkeby:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736
// did:ethr:goerli:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736
// did:ethr:kovan:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736
// did:ethr:rsk:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736
// did:ethr:rsk:testnet:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736
// did:ethr:0x1:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736
// did:ethr:0x3:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736
// did:ethr:0x4:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736
// did:ethr:0x5:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736
// did:ethr:0x2a:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736
// did:ethr:0x1e:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736
// did:ethr:0x1f:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736
// did:web:uport.me
// did:web:data-vault.eu:u:zi4xgcHtYo7fh_KAURaO1beG2v6WN9ImVnQ30CBDEJjLrw
// did:https:uportlandia.uport.me
// did:nacl:Md8JiMIwsapml_FtQ2ngnGftNP5UmVCAUuhnLyAsPxI

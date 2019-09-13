
const { Resolver } = require('did-resolver')
const ethr = require('ethr-did-resolver')
const web = require('web-did-resolver').default()
const nacl = require('nacl-did')

const resolver = new Resolver({
    ...ethr.getResolver(),
    ...web,
    https : web.web,  // Override a did method type,
    nacl: nacl.resolver
})

const express = require('express')
const app = express()

app.get('/1.0/identifiers/*', function (req, res) {

  const url = req.url
  const regex = /\/1.0\/identifiers\/(did:.*)/
  const did = regex.exec(url)[1]

  console.log("Resolving DID: "+did)

  resolver.resolve(did).then((doc) => {
    res.send(doc)
  }).catch(err=>{console.error(err); res.status(500).send(err.message)})

})

var server = app.listen(8081, function () {
  console.log("Resolver app listening on port 8081...")
})

// Example DIDs
// did:muport:Qmbrpc3gKtapsL5k6nZuzYvoMQZwMup5qWvss1q4XuaRJd
// did:ethr:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736
// did:web:uport.me
// did:https:gbugy.is
// did:nacl:Md8JiMIwsapml/FtQ2ngnGftNP5UmVCAUuhnLyAsPxI=
// did:nacl:PfFss0oSFiwSdJuZXO6EfGK2T37Bz5gPy+Dy8Hv+Izg=



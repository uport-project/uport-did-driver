const { Resolver } = require('did-resolver')
const ethr = require('ethr-did-resolver')
const web = require('web-did-resolver')
const nacl = require('nacl-did')

//this project ID is only useful for ethr-did resolution
const infuraId = 'ec9c99d75b834bac8dd4bfacad8cfdf7'

const providerConfig = {
  infuraProjectId: infuraId,
  networks: [
    { name: 'rsk', chainId: 30, rpcUrl: 'https://did.rsk.co:4444' },
    {
      chainId: '0x03c301',
      rpcUrl: 'https://rpc.sigma1.artis.network'
    },
    {
      chainId: '0x03c401',
      rpcUrl: 'https://rpc.tau1.artis.network'
    },
    {
      name: 'volta',
      chainId: '73799',
      rpcUrl: 'https://volta-rpc.energyweb.org',
      registry: '0xc15d5a57a8eb0e1dcbe5d88b8f9a82017e5cc4af',
    },
    {
      name: 'ewc',
      chainId: '246',
      rpcUrl: 'https://rpc.energyweb.org',
      registry: '0xE29672f34e92b56C9169f9D485fFc8b9A136BCE4',
    },
//    {
//      name: 'matic',
//      chainId: 137,
//      rpcUrl: 'https://rpc-mainnet.matic.network'
//    },
//    {
//      name: 'maticmum',
//      chainId: 80001,
//      rpcUrl: 'https://rpc-mumbai.matic.today'
//    }
  ]
}

const resolver = new Resolver(
  {
    ...ethr.getResolver(providerConfig),
    ...web.getResolver(),
  },
  {
    legacyResolvers: {
      nacl: nacl.resolver
    }
  }
)

const express = require('express')
const app = express()

app.get('/1.0/identifiers/*', function (req, res) {
  const url = req.url
  const regex = /\/1.0\/identifiers\/(did:.*)/
  const did = regex.exec(url)[1]

  console.log('Resolving DID: ' + did)

  resolver
    .resolve(did)
    .then((result) => {
      res.send(result)
    })
    .catch((err) => {
      if (err.message.match(/(Unsupported DID method:)|(Invalid DID)|(Not a valid ethr DID:)/)) {
        res.status(400).send(err.message)
      } else {
        console.error(err)
        res.status(500).send(err.message)
      }
    })
})

module.exports = app

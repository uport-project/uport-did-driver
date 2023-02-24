import { Resolver } from 'did-resolver'
import ethr from 'ethr-did-resolver'
import ens from 'ens-did-resolver'
import { getResolver as getWebResolver } from 'web-did-resolver'
import nacl from 'nacl-did'
import express from 'express'

// import { CeramicClient } from '@ceramicnetwork/http-client'
// import { getResolver as get3IDResolver } from '@ceramicnetwork/3id-did-resolver'
// // This public gateway is currently deprecated. Removing support for did:3 until we can spin up a more stable gateway.
// const ceramic = new CeramicClient('https://gateway.ceramic.network')

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
      chainId: '0x12047',
      rpcUrl: 'https://volta-rpc.energyweb.org',
      registry: '0xc15d5a57a8eb0e1dcbe5d88b8f9a82017e5cc4af',
    },
    {
      name: 'ewc',
      chainId: '0xf6',
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
    ...ens.getResolver({ networks: [
      { name: 'goerli', rpcUrl: 'https://goerli.infura.io/v3/e471b8639c314004ae67ec0078f70102' },
      { rpcUrl: 'https://mainnet.infura.io/v3/e471b8639c314004ae67ec0078f70102' }
    ]}),
    ...getWebResolver(),
    // ...get3IDResolver(ceramic)
  },
  {
    legacyResolvers: {
      nacl: nacl.resolver
    }
  }
)

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

export default app

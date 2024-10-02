import { Resolver } from 'did-resolver'
import ethr from 'ethr-did-resolver'
import ens from 'ens-did-resolver'
import { getResolver as getWebResolver } from 'web-did-resolver'
import { getResolver as getPeerResolver } from 'peer-did-resolver'
import { getResolver as getPlcResolver } from 'plc-did-resolver'
import express from 'express'
import actuator from 'express-actuator'
import { FallbackProvider, JsonRpcProvider } from 'ethers'

// import { CeramicClient } from '@ceramicnetwork/http-client'
// import { getResolver as get3IDResolver } from '@ceramicnetwork/3id-did-resolver'
// // This public gateway is currently deprecated. Removing support for did:3 until we can spin up a more stable gateway.
// const ceramic = new CeramicClient('https://gateway.ceramic.network')

//this project ID is only useful for ethr-did resolution
const infuraId = 'ec9c99d75b834bac8dd4bfacad8cfdf7'

// used for some benchmarking
export const timers = {}

function buildProvider(chainId, rpcUrls) {
  const jsonRpcProviders = rpcUrls.map((rpcUrl) => {
    const provider = new JsonRpcProvider(rpcUrl, chainId, { staticNetwork: true })
    provider.on('debug', (info) => {
      if (info.action === 'sendRpcPayload') {
        // console.log(`RPC call to ${rpcUrl} with id ${info.payload.id}`)
        const startTime = Date.now()
        timers[rpcUrl] = { ...timers[rpcUrl], [info.payload.id]: startTime }
      } else if (info.action === 'receiveRpcResult') {
        // console.log(`RPC response from ${rpcUrl} with id ${info.result[0]?.id}`)
        const id = parseInt(info.result[0]?.id)
        const startTime = timers[rpcUrl]?.[id] ?? Date.now()
        const elapsed = Date.now() - startTime
        timers[rpcUrl] = { ...timers[rpcUrl], [id]: elapsed }
        // console.log(`RPC call to ${rpcUrl} took ${elapsed}ms`)
      }
    })

    return provider
  })
  return new FallbackProvider(jsonRpcProviders, chainId, { quorum: 1 })
}

// configure a bunch of providers using some of the RPC URLs found in https://github.com/ethereum-lists/chains
export const providerConfig = {
  networks: [
    {
      chainId: 1,
      name: 'mainnet',
      registry: '0xdca7ef03e98e0dc2b855be647c39abe984fcf21b',
      legacyNonce: true,
      provider: buildProvider(1, [
        `https://mainnet.infura.io/v3/${infuraId}`,
        'https://eth-pokt.nodies.app',
        'https://ethereum-rpc.publicnode.com',
        'https://eth.meowrpc.com',
        // 'https://eth.drpc.org',
        // 'https://eth.llamarpc.com',
        // 'https://eth.rpc.blxrbdn.com',
        // 'https://rpc.mevblocker.io',
        // 'https://ethereum.blockpi.network/v1/rpc/public',
        // 'https://core.gashawk.io/rpc',
        // 'https://rpc.mevblocker.io/fast',
        // 'https://rpc.mevblocker.io/noreverts',
        // 'https://rpc.mevblocker.io/fullprivacy',
        // 'https://rpc.payload.de',
        // 'https://singapore.rpc.blxrbdn.com',
        // 'https://virginia.rpc.blxrbdn.com',
        // 'https://uk.rpc.blxrbdn.com',
        // 'https://mainnet.gateway.tenderly.co',
        // 'https://ethereum.rpc.subquery.network/public',
        // 'https://eth-mainnet.public.blastapi.io',
        // 'https://rpc.graffiti.farm',
        // 'https://gateway.tenderly.co/public/mainnet',
        // 'https://eth-mainnet.g.alchemy.com/v2/demo',
        // 'https://api.zan.top/node/v1/eth/mainnet/public',
        // 'https://api.securerpc.com/v1',
        // 'https://rpc.lokibuilder.xyz/wallet',
        // 'https://rpc.flashbots.net/fast',
        // 'https://eth.merkle.io',
        // 'https://rpc.flashbots.net',
        // 'https://rpc.ankr.com/eth',
        // 'https://cloudflare-eth.com',
        // 'https://api.stateless.solutions/ethereum/v1/demo',
        // 'https://1rpc.io/eth',
        // 'https://rpc.public.curie.radiumblock.co/ws/ethereum',
        // 'https://rpc.public.curie.radiumblock.co/http/ethereum',
      ]),
    },
    {
      chainId: 11155111,
      name: 'sepolia',
      registry: '0x03d5003bf0e79C5F5223588F347ebA39AfbC3818',
      legacyNonce: false,
      provider: buildProvider(11155111, [
        // `https://sepolia.infura.io/v3/${infuraId}`,
        'https://ethereum-sepolia-rpc.publicnode.com',
        'https://1rpc.io/sepolia',
        // 'https://endpoints.omniatech.io/v1/eth/sepolia/public',
        // 'https://sepolia.drpc.org',
        // 'https://gateway.tenderly.co/public/sepolia',
        // 'https://ethereum-sepolia.rpc.subquery.network/public',
        // 'https://sepolia.gateway.tenderly.co',
        // 'https://eth-sepolia.public.blastapi.io',
        // 'https://ethereum-sepolia.blockpi.network/v1/rpc/public',
        // 'https://eth-sepolia.api.onfinality.io/public',
        // 'https://eth-sepolia-public.unifra.io',
        // 'https://eth-sepolia.g.alchemy.com/v2/demo',
        // 'https://api.zan.top/node/v1/eth/sepolia/public',
        // 'https://rpc.sepolia.org',
        // 'https://rpc.sepolia.ethpandaops.io',
      ]),
    },
    {
      chainId: 100,
      name: 'gno',
      registry: '0x03d5003bf0e79C5F5223588F347ebA39AfbC3818',
      legacyNonce: false,
      provider: buildProvider(100, [
        'https://gnosis-pokt.nodies.app',
        'https://gnosis-rpc.publicnode.com',
        'https://gnosis.drpc.org',
        // 'https://1rpc.io/gnosis',
        // 'https://rpc.gnosis.gateway.fm',
        // 'https://rpc.gnosischain.com',
        // 'https://gnosis.blockpi.network/v1/rpc/public',
        // 'https://endpoints.omniatech.io/v1/gnosis/mainnet/public',
        // 'https://gnosis.oat.farm',
        // 'https://rpc.ankr.com/gnosis',
        // 'https://gnosis-mainnet.public.blastapi.io',
        // 'https://rpc.ap-southeast-1.gateway.fm/v4/gnosis/non-archival/mainnet',
      ]),
    },
    {
      chainId: 17000,
      name: 'holesky',
      registry: '0x03d5003bf0e79C5F5223588F347ebA39AfbC3818',
      legacyNonce: false,
      provider: buildProvider(17000, [
        'https://ethereum-holesky-rpc.publicnode.com',
        'https://holesky.drpc.org',
        // 'https://1rpc.io/holesky',
        // 'https://rpc.holesky.io',
        // 'https://holesky.gateway.tenderly.co',
        // 'https://ethereum-holesky.blockpi.network/v1/rpc/public',
        // 'https://endpoints.omniatech.io/v1/eth/holesky/public',
        // 'https://rpc.holesky.ethpandaops.io',
      ]),
    },
    {
      chainId: 30,
      name: 'rsk',
      registry: '0xdca7ef03e98e0dc2b855be647c39abe984fcf21b',
      legacyNonce: true,
      provider: buildProvider(30, [
        'https://public-node.rsk.co',
        // 'https://rootstock.drpc.org',
        'https://mycrypto.rsk.co',
      ]),
    },
    {
      chainId: 31,
      name: 'rsk:testnet',
      registry: '0xdca7ef03e98e0dc2b855be647c39abe984fcf21b',
      legacyNonce: true,
      provider: buildProvider(31, ['https://public-node.testnet.rsk.co', 'https://mycrypto.testnet.rsk.co']),
    },
    // // no known public RPC URLs known for artis networks
    // {
    //   chainId: '0x03c401',
    //   rpcUrl: 'https://rpc.tau1.artis.network',
    // },
    {
      chainId: 73799,
      name: 'volta',
      registry: '0xc15d5a57a8eb0e1dcbe5d88b8f9a82017e5cc4af',
      legacyNonce: false,
      provider: buildProvider(73799, ['https://volta-rpc.energyweb.org']),
    },
    {
      chainId: 246,
      name: 'ewc',
      registry: '0xE29672f34e92b56C9169f9D485fFc8b9A136BCE4',
      legacyNonce: false,
      provider: buildProvider(246, ['https://rpc.energyweb.org']),
    },
    {
      chainId: 137,
      name: 'polygon',
      registry: '0xdca7ef03e98e0dc2b855be647c39abe984fcf21b',
      legacyNonce: true,
      provider: buildProvider(137, [
        'https://polygon-bor-rpc.publicnode.com',
        'https://polygon-pokt.nodies.app',
        'https://polygon.drpc.org',
        'https://1rpc.io/matic',
        'https://polygon.meowrpc.com',
        // 'https://polygon-rpc.com',
        // 'https://polygon.llamarpc.com',
        // 'https://polygon.gateway.tenderly.co',
        // 'https://gateway.tenderly.co/public/polygon',
        // 'https://rpc.ankr.com/polygon',
        // 'https://polygon.rpc.blxrbdn.com',
        // 'https://polygon.rpc.subquery.network/public',
        // 'https://api.zan.top/node/v1/polygon/mainnet/public',
        // 'https://rpc-mainnet.matic.quiknode.pro',
        // 'https://polygon.api.onfinality.io/public',
        // 'https://polygon-mainnet.public.blastapi.io',
      ]),
    },
    // no working public RPC URLs known for this network
    // {
    //   chainId: 80001,
    //   name: 'polygon:test',
    //   registry: '0xdca7ef03e98e0dc2b855be647c39abe984fcf21b',
    //   legacyNonce: true,
    //   provider: buildProvider(80001, [
    //     'https://public.stackup.sh/api/v1/node/polygon-mumbai',
    //     'https://polygon-mumbai.api.onfinality.io/public',
    //     'https://api.zan.top/node/v1/polygon/mumbai/public',
    //     'https://gateway.tenderly.co/public/polygon-mumbai',
    //     'https://polygon-mumbai.gateway.tenderly.co',
    //     'https://polygon-mumbai-pokt.nodies.app',
    //     'https://polygon-mumbai-bor-rpc.publicnode.com',
    //     'https://polygon-mumbai.g.alchemy.com/v2/demo',
    //     'https://polygon-testnet.public.blastapi.io',
    //     'https://polygontestapi.terminet.io/rpc',
    //     'https://rpc.ankr.com/polygon_mumbai',
    //     'https://endpoints.omniatech.io/v1/matic/mumbai/public',
    //     'https://rpc-mumbai.maticvigil.com',
    //   ]),
    // },
    {
      chainId: 1313161554,
      name: 'aurora',
      registry: '0x63eD58B671EeD12Bc1652845ba5b2CDfBff198e0',
      legacyNonce: true,
      provider: buildProvider(1313161554, [
        // 'https://1rpc.io/aurora',
        'https://aurora.drpc.org',
        'https://mainnet.aurora.dev',
        // 'https://endpoints.omniatech.io/v1/aurora/mainnet/public',
      ]),
    },
    {
      chainId: 2442,
      name: 'cardona',
      registry: '0x03d5003bf0e79C5F5223588F347ebA39AfbC3818',
      legacyNonce: false,
      provider: buildProvider(2442, [
        'https://rpc.cardona.zkevm-rpc.com',
        'https://polygon-zkevm-cardona.blockpi.network/v1/rpc/public',
      ]),
    },
  ],
}

const resolver = new Resolver({
  ...ethr.getResolver(providerConfig),
  ...ens.getResolver({
    networks: providerConfig.networks.filter((network) => network.chainId === 11155111),
    provider: buildProvider(1, [
      'https://eth-pokt.nodies.app',
      'https://ethereum-rpc.publicnode.com',
      'https://eth.meowrpc.com',
    ]), // mainnet provider
  }),
  ...getWebResolver(),
  ...getPeerResolver(),
  ...getPlcResolver(),
  // ...get3IDResolver(ceramic)
})

const app = express()

app.use(actuator())

app.get('/1.0/identifiers/*', function (req, res) {
  const url = req.url
  const regex = new RegExp('/1.0/identifiers/(did:.*)')
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

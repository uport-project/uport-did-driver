import { execSync, spawn } from 'child_process'

const IMAGE = 'uport-did-driver-test:latest'
const CONTAINER = 'uport-did-driver-test'
const PORT = 18081
const BASE_URL = `http://localhost:${PORT}`

async function resolve(did) {
  return fetch(`${BASE_URL}/1.0/identifiers/${encodeURIComponent(did)}`)
}

function waitForReady(url, timeout = 30000) {
  const start = Date.now()
  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const res = await fetch(url)
        if (res.ok) return resolve()
      } catch (_) {}
      if (Date.now() - start > timeout) return reject(new Error(`Timed out waiting for ${url}`))
      setTimeout(poll, 500)
    }
    poll()
  })
}

// These match the Example DIDs listed in README.md
const EXAMPLE_DIDS = [
  'did:ethr:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736',
  'did:ethr:0x02b97c30de767f084ce3080168ee293053ba33b235d7116a3263d29f1450936b71',
  'did:ethr:mainnet:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736',
  'did:ethr:sepolia:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736',
  'did:ethr:gno:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736',
  'did:ethr:holesky:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736',
  'did:ethr:rsk:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736',
  'did:ethr:rsk:testnet:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736',
  'did:ethr:volta:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736',
  'did:ethr:ewc:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736',
  'did:ethr:polygon:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736',
  'did:ethr:aurora:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736',
  'did:ethr:cardona:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736',
  'did:web:skounis.github.io',
  'did:web:veramo.io',
  'did:ens:vitalik.eth',
  'did:peer:2.Ez6LSpSrLxbAhg2SHwKk7kwpsH7DM7QjFS5iK6qP87eViohud.Vz6MkqRYqQiSgvZQdnBytw86Qbs2ZWUkGv22od935YF4s8M7V.SeyJ0IjoiZG0iLCJzIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9lbmRwb2ludDEiLCJyIjpbImRpZDpleGFtcGxlOnNvbWVtZWRpYXRvciNzb21la2V5MSJdLCJhIjpbImRpZGNvbW0vdjIiLCJkaWRjb21tL2FpcDI7ZW52PXJmYzU4NyJdfQ',
]

beforeAll(async () => {
  console.log('\n[docker] Building image...')
  execSync(`docker build -t ${IMAGE} .`, { stdio: 'inherit' })

  try { execSync(`docker rm -f ${CONTAINER}`, { stdio: 'ignore' }) } catch (_) {}

  console.log('[docker] Starting container...')
  spawn('docker', ['run', '--rm', '--name', CONTAINER, '-p', `${PORT}:8081`, IMAGE], { stdio: 'ignore', detach: true })

  console.log('[docker] Waiting for container to be ready...')
  await waitForReady(`${BASE_URL}/health`)
  console.log('[docker] Container ready.')
}, 120000)

afterAll(() => {
  console.log('\n[docker] Stopping container...')
  try { execSync(`docker stop ${CONTAINER}`, { stdio: 'ignore' }) } catch (_) {}
})

describe('docker container', () => {
  describe('example DIDs from README resolve successfully', () => {
    it.each(EXAMPLE_DIDS)('%s', async (did) => {
      const res = await resolve(did)
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.didDocument).not.toBeNull()
      expect(body.didResolutionMetadata.error).toBeUndefined()
    })
  })

  describe('error cases', () => {
    it('returns unsupportedDidMethod for unknown method', async () => {
      const res = await resolve('did:unknown:abc123')
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.didDocument).toBeNull()
      expect(body.didResolutionMetadata.error).toBe('unsupportedDidMethod')
    })

    it('returns unknownNetwork for unconfigured ethr network', async () => {
      const res = await resolve('did:ethr:unknown:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736')
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.didResolutionMetadata.error).toBe('unknownNetwork')
    })

    it('returns invalidDid for bad ethr address', async () => {
      const res = await resolve('did:ethr:0x1234')
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.didResolutionMetadata.error).toBe('invalidDid')
    })
  })

  describe('actuator', () => {
    it('/health returns 200', async () => {
      const res = await fetch(`${BASE_URL}/health`)
      expect(res.status).toBe(200)
    })

    it('/info returns 200', async () => {
      const res = await fetch(`${BASE_URL}/info`)
      expect(res.status).toBe(200)
    })
  })
})

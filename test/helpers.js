import LibraryHop from '../src/index.js'
import { Encryption } from 'hop-crypto/encryption'
import Holepunch from 'holepunch-hop'
const wasm = await import('hop-crypto')
  

/**
 * Helper to start a real LibraryHop instance for testing
 * @returns {Promise<LibraryHop>}
 */
export async function startRealLibraryHop() {
  // In a full integration test, we use the actual Holepunch-hop classes.
  const storeName = 'test-library-hop-' + Math.random().toString(36).substring(7)
  const holepunch = new Holepunch(storeName)
  
  // Mock websocket to avoid ELOCKED/TypeError in activateHypercores
  holepunch.setWebsocket({ send: () => {} })

  // Start the datastores and wait for them to be live
  await holepunch.activateHypercores()

  const contextAgents = {
    crypto: {
      verify_coherence: wasm.verify_coherence,
      Encryption: Encryption 
    },
    network: holepunch
  }

  const libHop = new LibraryHop(contextAgents)
  console.log('hop cyro livlvlvvivli')
  console.log(libHop.hopCryptoLive)
  return libHop
}

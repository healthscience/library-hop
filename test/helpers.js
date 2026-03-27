import LibraryHop from '../src/index.js'
import { Encryption } from 'hop-crypto/encryption'
import Holepunch from 'holepunch-hop'
import HeliLocation from 'heliclock-hop/src/index.js'

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

  let heliLocation = new HeliLocation()
  let HeliClock = {}

  /**
   * initialize HeliClock WASM
   * @method initHeliClock
   *
  */
  let initHeliClock = async function () {
    try {
      await heliLocation.init()
      HeliClock = heliLocation.getEngine()
      // this.anchorDawn.setHeliClock(this.HeliClock)
    } catch (err) {
      console.warn('HeliClock init failed or already initialized', err)
    }
  }

  await initHeliClock()



  const encryption = new Encryption()
  encryption.Encryption = Encryption

  let contextAgents = {
    crypto: encryption,
    network: holepunch,
    heliclock: heliLocation,
    heliLocation: heliLocation,
  }

  const libHop = new LibraryHop(contextAgents)
  return libHop
}

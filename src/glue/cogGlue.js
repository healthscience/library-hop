'use strict'

/**
 * CogGlue class to manage datatype cues generation
 * @class CogGlue
 */
import SeedGlue from './seedGlue.js'

class CogGlue {
  constructor(parent, liveHolepunch, libComposer, hopCryptoLive, cuesUtility) {
    this.parent = parent
    this.liveHolepunch = liveHolepunch
    this.libComposer = libComposer
    this.hopCryptoLive = hopCryptoLive
    this.cuesUtility = cuesUtility
    this.seedCues = new SeedGlue(parent, liveHolepunch, libComposer)
    this.primeStrap = null
  }

  /**
   * 
   * @method seedGlueBegin
   */
  seedGlueBegin = async function () {
    await this.seedCues.onboardFoundingCues()
    return true
  }

}

export default CogGlue

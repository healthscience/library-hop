'use strict'

import Orrery from '../seed/orrery.js'
import Body from '../seed/body.js'
import Earth from '../seed/earth.js'
import Environment from '../seed/environment.js'

/**
 * SeedGlue class to onboard founding seed cues
 * @class SeedGlue
 */
class SeedGlue {
  constructor(parent, liveHolepunch, libComposer) {
    this.parent = parent
    this.liveHolepunch = liveHolepunch
    this.libComposer = libComposer
    this.primeStrap = null

    // Instantiate seed classes
    this.orrery = new Orrery()
    this.body = new Body()
    this.earth = new Earth()
    this.environment = new Environment()
  }

  /**
   * onboard founding seed cues
   * @method onboardFoundingCues
   */
  onboardFoundingCues = async function () {
    // first generate or retrieve the prime-lifestrap
    let primeLS = {}
    primeLS.inquiry = 'prime-lifestrap'
    let messageHOP = {
      type: 'library',
      action: 'lifestrap',
      reftype: 'new',
      privacy: 'private',
      task: 'PUT',
      data: primeLS
    }
    this.primeStrap = await this.parent.liveLifestrapUtil.firstLifeStrap(messageHOP)

    const seedLists = [
      { name: 'gaia', data: this.earth.prepareDTgaiaMessage(), color: '#2ecc71' },
      { name: 'nature', data: this.earth.prepareDTnatureMessage(), color: '#27ae60' },
      { name: 'environment', data: this.environment.prepareDTenvironmentMessage(), color: '#16a085' },
      { name: 'culture', data: this.orrery.prepareDTcultureMessage(), color: '#f1c40f' },
      { name: 'life', data: this.body.prepareDTlifeMessage(), color: '#e67e22' },
      { name: 'aging', data: this.body.prepareDTagingMessage(), color: '#d35400' },
      { name: 'planet', data: this.earth.prepareDTplanetMessage(), color: '#3498db' },
      { name: 'body', data: this.body.prepareDTbodyMessage(), color: '#e74c3c' }
    ]

    console.log('Starting onboarding of founding seed cues...')

    for (const seed of seedLists) {
      console.log(`Processing category: ${seed.name}`)
      for (const mark of seed.data) {
        // Form and save datatype contract
        const contractData = await this.formContract(this.primeStrap.key, 'datatype', 'reference', mark)
        
        if (contractData && contractData.contract) {
          console.log(`Datatype saved: ${seed.name} - ${mark.data.name}`)
          
          // Form and save cue contract
          const cueContract = await this.formContract(this.primeStrap.key, 'cue', 'reference', contractData.contract, seed.color)
          if (cueContract && cueContract.contract) {
            console.log(`Cue saved: ${seed.name} - ${mark.data.name}`)
          }
        }
      }
    }

    // query the cues and datatypes with lifestrap key and return to bentoboxDS
    let datatypeRefList = await this.liveHolepunch.BeeData.getPublicLibraryRefRange(this.primeStrap.key, 'datatype', null)
    
    let libraryData = {
      data: 'contracts',
      type: 'library',
      action: 'peer-library-ref',
      context: 'base-biology',
      referenceContracts: datatypeRefList
    }
    
    this.parent.emit('libmessage', JSON.stringify(libraryData))
    return true
  }

  /**
   * form contract based on category and type
   * @method formContract
   */
  formContract = async function (lifestrapID, category, type, mark, color) {
    let formedContract = {}
    const composer = this.libComposer.liveComposer

    switch (category) {
      case 'datatype':
        formedContract = composer.datatypeComposer(lifestrapID, mark.data)
        break
      case 'cue':
        let buildCueInputs = this.cueBuilder(mark, color)
        formedContract = this.libComposer.liveCues.cueComposer(lifestrapID, buildCueInputs)
        break
      default:
        console.error(`Unknown contract category: ${category}`)
        return null
    }

    let saved = null
    let validContract = {}
    if (category === 'cue') {
      let contractReady = {
        key: formedContract.hash,
        contract: formedContract.contract
      }
      saved = await this.liveHolepunch.BeeData.saveCues(contractReady)
      validContract = await this.liveHolepunch.BeeData.getCues(formedContract.hash)
    } else if (category === 'datatype') {
      let contractReady = {
        key: formedContract.hash,
        contract: formedContract.contract
      }
      saved = await this.liveHolepunch.BeeData.savePubliclibraryRef(contractReady)
      validContract = await this.liveHolepunch.BeeData.getPublicLibraryRef(formedContract.hash)
    }

    return { save: saved, contract: validContract }
  }

  /**
   * form cue contract content
   */
  cueBuilder = function (dataIn, color) {
    let cueInputs = {
      datatype: dataIn.key,
      color: color || this.colorPicker(),
      type: 'cue',
      category: 'cue',
      network: 'cold',
      links: []
    }
    return cueInputs
  }

  /**
   * select color
   */
  colorPicker = function () {
    let color = '#' + Math.floor(Math.random() * 16777215).toString(16)
    return color
  }
}

export default SeedGlue

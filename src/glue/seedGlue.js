'use strict'

import Orrery from '../seed/orrery.js'
import Body from '../seed/body.js'
import Earth from '../seed/earth.js'
import Environment from '../seed/environment.js'
import { cue } from 'librarycomposer/src/validation/validate.js'

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
    // make a common  key for indexing seed cues orgo cues datatype etc.
    let lsPrimekey = 'common' // this.primeStrap.key

    const seedLists = [
      { name: 'hopspeak', data: this.orrery.HOPspeak(), color: '#9b59b6' },
      { name: 'gaia', data: this.earth.prepareDTgaiaMessage(), color: '#2ecc71' },
      { name: 'nature', data: this.earth.prepareDTnatureMessage(), color: '#27ae60' },
      { name: 'environment', data: this.environment.prepareDTenvironmentMessage(), color: '#16a085' },
      { name: 'culture', data: this.orrery.prepareDTcultureMessage(), color: '#f1c40f' },
      { name: 'life', data: this.body.prepareDTlifeMessage(), color: '#e67e22' },
      { name: 'aging', data: this.body.prepareDTagingMessage(), color: '#d35400' },
      { name: 'planet', data: this.earth.prepareDTplanetMessage(), color: '#3498db' },
      { name: 'body', data: this.body.prepareDTbodyMessage(), color: '#e74c3c' }
    ]

    // Calculate total expected cues
    let totalCues = 0
    for (const seed of seedLists) {
      totalCues += seed.data.length
    }

    let currentCount = 0

    for (const seed of seedLists) {
      for (const mark of seed.data) {
        // Form and save datatype contract
        const contractData = await this.formContract(lsPrimekey, 'datatype', 'reference', mark)
        
        if (contractData && contractData.contract) {      
          // Form and save cue contract
          const cueContract = await this.formContract(lsPrimekey, 'cue', 'reference', contractData.contract, seed.color)
          if (cueContract && cueContract.contract) {
            currentCount++

            // Inform BentoBoxDS of progress
            let progressMessage = {
              type: 'library',
              action: 'seed-progress',
              current: currentCount,
              total: totalCues,
              category: seed.name,
              item: mark.data.name
            }
            this.parent.emit('libmessage', JSON.stringify(progressMessage))
          }
        }
      }
    }

    // query the cues and datatypes with lifestrap key and return to bentoboxDS
    let datatypeRefList = []
    try {
      datatypeRefList = await this.liveHolepunch.BeeData.getPublicLibraryRefRange(lsPrimekey, 'datatype', null)
    } catch (err) {
      console.warn('Failed to fetch datatypeRefList', err)
    }
    
    // Count verification
    let formedCues = []
    try {
      formedCues = await this.liveHolepunch.BeeData.getCuesHistory(lsPrimekey, 'cue', null)
    } catch (err) {
      console.warn('Failed to fetch formedCues', err)
    }
    // now integrate datatype contract into the cue contract
    let embCueContracts = this.integrateReferenceContracts(formedCues, datatypeRefList)

    const verificationSuccess = formedCues.length === totalCues

    let libraryData = {
      type: 'library',
      action: 'seed-base-biology',
      privacy: 'public',
      data: {
        cueContracts: embCueContracts,
        referenceContracts: datatypeRefList,
        verification: {
          success: verificationSuccess,
          expected: totalCues,
          actual: formedCues.length
        }
      }
    }
    
    this.parent.emit('libmessage', JSON.stringify(libraryData))
    return verificationSuccess
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
      saved = await this.liveHolepunch.BeeData.saveCues(formedContract)
      validContract = await this.liveHolepunch.BeeData.getCues(formedContract.hash)
    } else if (category === 'datatype') {
      console.log('datatype contract', formedContract)
      saved = await this.liveHolepunch.BeeData.savePubliclibraryRef(formedContract)
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

  /**
  * insert datatype contract into cue contract
  * @method integrateReferenceContracts
  */
  integrateReferenceContracts (cueContracts, datatypeContracts) {
    if (!Array.isArray(cueContracts) || !Array.isArray(datatypeContracts)) return []

    const cuesList = []
    const dtMap = new Map()

    // Helper to ensure we have a hex string for the map key
    const toHex = (key) => {
      if (!key) return null
      if (typeof key === 'string') return key
      if (Buffer.isBuffer(key)) return key.toString('hex')
      // Handle JSON serialized buffers if necessary
      if (key.type === 'Buffer' && Array.isArray(key.data)) return Buffer.from(key.data).toString('hex')
      return key.toString()
    }

    // Create a map for O(1) lookups of datatypes
    for (const dtContract of datatypeContracts) {
      const key = toHex(dtContract.key)
      if (key) {
        dtMap.set(key, dtContract.value || dtContract.contract || dtContract)
      }
    }

    for (const contract of cueContracts) {
      if (!contract.value?.concept?.datatype) continue

      const matchKey = toHex(contract.value.concept.datatype)
      
      if (dtMap.has(matchKey)) {
        // Replace the raw buffer key with the full datatype contract
        contract.value.concept.datatype = dtMap.get(matchKey)
        cuesList.push(contract)
      }
    }
    return cuesList
  }

}

export default SeedGlue

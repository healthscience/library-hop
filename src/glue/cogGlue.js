'use strict'

/**
 * CogGlue class to manage datatype cues generation
 * @class CogGlue
 */
class CogGlue {
  constructor(parent, liveHolepunch, libComposer, hopCryptoLive, cuesUtility) {
    this.parent = parent
    this.liveHolepunch = liveHolepunch
    this.libComposer = libComposer
    this.hopCryptoLive = hopCryptoLive
    this.cuesUtility = cuesUtility
  }

  /**
   * generate datatype cues from gaia list
   * @method generateDatatypeCues
   *
   */
  generateDatatypeCues = async function () {
    const lists = [
      this.cuesUtility.prepareDTgaiaMessage(),
      this.cuesUtility.prepareDTnatureMessage(),
      this.cuesUtility.prepareDTenvironmentMessage(),
      this.cuesUtility.prepareDTcultureMessage(),
      this.cuesUtility.prepareDTlifeMessage(),
      this.cuesUtility.prepareDTagingMessage(),
      this.cuesUtility.prepareDTplanetMessage(),
      this.cuesUtility.prepareDTbodyMessage()
    ]

    let savedContracts = []
    const categoryColors = {
      'gaia': '#2ecc71',
      'nature': '#27ae60',
      'environment': '#16a085',
      'culture': '#f1c40f',
      'life': '#e67e22',
      'aging': '#d35400',
      'planet': '#3498db',
      'body': '#e74c3c'
    }

    for (const list of lists) {
      for (const mark of list) {
        const contract = await this.formContract('datatype', 'reference', mark)
        if (contract) {
          savedContracts.push(contract)
          const cue = await this.cueFormer(mark, contract.data.hash, categoryColors)
          savedContracts.push(cue)
        }
      }
    }
    return savedContracts
  }

  /**
   * form contract based on category and type
   * @method formContract
   * @param {string} category - datatype, packaging, compute, visualisation
   * @param {string} type - reference, module
   * @param {object} mark - data payload
   */
  formContract = async function (category, type, mark) {
    let formedContract = {}
    const composer = this.libComposer.liveComposer

    // select composer based on category
    switch (category) {
      case 'datatype':
        formedContract = composer.datatypeComposer(mark.data)
        break
      case 'packaging':
        formedContract = composer.packagingComposer(mark.data)
        break
      case 'compute':
        formedContract = composer.computeComposer(mark.data)
        break
      case 'visualise':
        formedContract = composer.visualiseComposer(mark.data)
        break
      case 'cue':
        formedContract = composer.cueComposer(mark.data)
        break
      default:
        console.error(`Unknown contract category: ${category}`)
        return null
    }

    const encryption = new this.hopCryptoLive.Encryption()
    const contractHash = encryption.createKey(formedContract)
    const storageKey = encryption.createPrefixedKey(category, contractHash)
    
    const wrappedContract = {
      reftype: category,
      contractType: type, // reference or module
      data: {
        hash: storageKey,
        value: formedContract
      }
    }

    console.log(`formed ${type} contract for ${category}`)
    console.log(wrappedContract)

    let saved = null
    if (category === 'cue') {
      saved = await this.liveHolepunch.BeeData.saveCues(wrappedContract)
    } else {
      saved = await this.liveHolepunch.BeeData.savePubliclibraryRef(wrappedContract)
    }

    return {
      ...wrappedContract,
      saved: saved
    }
  }

  /**
   * form cue from mark and storage key
   * @method cueFormer
   */
  cueFormer = async function (mark, storageKey, categoryColors) {
    const category = mark.data.name.toLowerCase()
    const cueSpaceID = `gaia!${category}!${mark.data.name.toLowerCase()}`
    const color = categoryColors[category] || '#95a5a6'

    const inCue = {
      data: {
        concept: {
          name: mark.data.name,
          cueSpaceID: cueSpaceID,
          appearance: { color: color }
        },
        computational: {
          datatypeRef: storageKey,
          relationships: []
        }
      }
    }

    const formedCue = this.libComposer.liveCues.cuesPrepare(inCue)
    const savedCue = await this.liveHolepunch.BeeData.saveCues(formedCue)
    
    return {
      reftype: 'cue',
      data: savedCue
    }
  }

}

export default CogGlue

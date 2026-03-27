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
          const cue = await this.cueFormer(mark, contract.hash, categoryColors)
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

    let saved = null
    if (category === 'cue') {
      saved = await this.liveHolepunch.BeeData.saveCues(formedContract)
    } else {
      saved = await this.liveHolepunch.BeeData.savePubliclibraryRef(formedContract)
    }

    return { save: saved, contract: formedContract }
  }

  /**
   * form cue from mark and storage key
   * @method cueFormer
   */
  cueFormer = async function (dtContract, categoryColors) {
    console.log(dtContract.key)
    const cueDT = dtContract.value.concept.name.toLowerCase()
    const cueSpaceID = `gaia!${cueDT}!${cueDT}`
    const color = categoryColors.color || '#95a5a6'

    const inCue = {
      data: {
        concept: {
          name: cueDT,
          datatype: dtContract.key,
          appearance: { color: color }
        },
        computational: {
          datatypeRef: dtContract.key,
          relationships: []
        }
      }
    }

    const formedCue = this.libComposer.liveCues.cuesPrepare(inCue)
    const savedCue = await this.liveHolepunch.BeeData.saveCues(formedCue)
    
    return {
      saved:  savedCue,
      contract: formedCue
    }
  }

}

export default CogGlue

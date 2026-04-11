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
    this.primeStrap = null
  }

  /**
   * generate datatype cues from gaia list
   * @method generateDatatypeCues
   *
   */
  generateDatatypeCues = async function () {

    // first generate the prime-lifestrap
    let primeLS = {}
    primeLS.inquiry = 'prime-lifestrap'
    // needs message structure
    let messageHOP = {}
    messageHOP.type = 'library'
    messageHOP.action = 'lifestrap'
    messageHOP.reftype = 'new'
    messageHOP.privacy = 'private'
    messageHOP.task = 'PUT'
    messageHOP.data = primeLS
    this.primeStrap = await this.parent.liveLifestrapUtil.firstLifeStrap(messageHOP)

    const lists = [
      this.cuesUtility.prepareDTgaiaMessage(),
      /*this.cuesUtility.prepareDTnatureMessage(),
      this.cuesUtility.prepareDTenvironmentMessage(),
      this.cuesUtility.prepareDTcultureMessage(),
      this.cuesUtility.prepareDTlifeMessage(),
      this.cuesUtility.prepareDTagingMessage(),
      this.cuesUtility.prepareDTplanetMessage(),
      this.cuesUtility.prepareDTbodyMessage()*/
    ]
    console.log(' list of datattypes')
    // console.log(lists[0])

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
      let count = 0
      for (const mark of list) {
        let contractData = {}
        if(count === 0) {
          contractData = await this.formContract(this.primeStrap.key, 'datatype', 'reference', mark)
          console.log('contract saved dt ================')
          console.log(contractData.contract.key.toString())

          if (contractData) {
            console.log('ssstart of cue formation-------')
            const cueContract = await this.formContract(this.primeStrap.key, 'cue', 'reference', contractData.contract, categoryColors)
            console.log('cue saved ================')
            console.log(cueContract.contract.key.toString())
          }
          count++
        }
      }
    }
    // query the cues and datatypes with lifestrap key  and return to bentoboxDS
    // form the query
    let datatypeRefList = await this.liveHolepunch.BeeData.getPublicLibraryRefRange(this.primeStrap.key, 'datatype', null)
    // return to beebee BentoBoxDS
    let libraryData = {}
    libraryData.data = 'contracts'
    libraryData.type = 'library'
    libraryData.action = 'peer-library-ref'
    libraryData.context = 'base-biology'
    libraryData.referenceContracts = datatypeRefList
    this.parent.emit('libmessage', JSON.stringify(libraryData))
    return true
  }

  /**
   * form contract based on category and type
   * @method formContract
   * @param {string} category - datatype, packaging, compute, visualisation
   * @param {string} type - reference, module
   * @param {object} mark - data payload
   */
  formContract = async function (lifestrapID, category, type, mark, color) {
    console.log('life start prime key=========')
    console.log(lifestrapID)
    let formedContract = {}
    const composer = this.libComposer.liveComposer

    // select composer based on category
    switch (category) {
      case 'datatype':
        formedContract = composer.datatypeComposer(lifestrapID, mark.data)
        break
      case 'packaging':
        formedContract = composer.packagingComposer(lifestrapID, mark.data)
        break
      case 'compute':
        formedContract = composer.computeComposer(lifestrapID, mark.data)
        break
      case 'visualise':
        formedContract = composer.visualiseComposer(lifestrapID, mark.data)
        break
      case 'cue':
        let buildCueInputs = this.cueBuilder(mark, color)
        formedContract = this.libComposer.liveCues.cueComposer(lifestrapID, buildCueInputs)
        break
      default:
        console.error(`Unknown contract category: ${category}`)
        return null
    }
    console.log('formed =============== contract')
    console.log(formedContract)

    let saved = null
    let validContract = {}
    if (category === 'cue') {
      let contractReady = {}
      contractReady.key = formedContract.hash
      contractReady.contract = formedContract.contract
      saved = await this.liveHolepunch.BeeData.saveCues(contractReady)
      // get the contract by key
      validContract = await this.liveHolepunch.BeeData.getCues(formedContract.hash)
    } else if (category === 'datatype') {
      let contractReady = {}
      contractReady.key = formedContract.hash
      contractReady.contract = formedContract.contract
      saved = await this.liveHolepunch.BeeData.savePubliclibraryRef(contractReady)
      // get the contract by key
      validContract = await this.liveHolepunch.BeeData.getPublicLibraryRef(formedContract.hash)
    }

    return { save: saved, contract: validContract }
  }

  /**
   * form cue contract content
  */
  cueBuilder = function (dataIn) {
    let cueInputs = {}
    cueInputs.datatype = dataIn.key
    cueInputs.color = this.colorPicker()
    cueInputs.type = 'cue'
    // concept
    cueInputs.category = 'cue'
    cueInputs.network = 'cold'
    cueInputs.links = []
    // computational

    // space

    // time
    return cueInputs
  }

  /**
  * select color
  * @method colorPicker
  */
  colorPicker = function () {
    let color = '#' + Math.floor(Math.random() * 16777215).toString(16)
    return color
  }

}

export default CogGlue

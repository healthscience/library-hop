import LibraryMemory from './libraryMemory.js'
import RelationshipFascia from "./fascia/relationshipFacia.js"

/**
 * Library Seed
 * Location: library-hop
 * Role: collect contracts for beebee to send to bentoboxds on begin
 */
export default class LibrarySeed {
  constructor(parent) {
    this.parent = parent
    this.beeData = parent.liveHolepunch.BeeData
    this.libMemory = new LibraryMemory()
    this.relFascia = new RelationshipFascia(this.parent)
  }

  /**
   * 
   * 
   * @method getSeedLibrary
  */
  async getSeedLibrary () {

    let lsPrimekey = 'common'
    let cuesLibrary = await this.beeData.getCuesHistory(lsPrimekey, null)
    
    let datatypeRefList = []
    try {
      datatypeRefList = await this.beeData.getPublicLibraryRefRange(lsPrimekey, null)
    } catch (err) {
      console.warn('Failed to fetch datatypeRefList', err)
    }

    let embCueContracts = this.integrateReferenceContracts(cuesLibrary, datatypeRefList)

    // put to library memory
    this.memoryRegister(embCueContracts)

    let seedLib = {}
    seedLib.cueContracts = embCueContracts
    seedLib.datatypeContracts = datatypeRefList
    return seedLib

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
      } else {
        // assume compound cue add
        contract.value.concept.datatype = { key: 'compound', refcontract: 'datatype', concept:  { name: contract.value.concept.name }, computational: {}, space: {}, time: {} }
        cuesList.push(contract)
      }
    }
    return cuesList
  }

  /**
   * get exoCue orgo & gelle reference contract available
   * @method getGraftContracts
  */
  async getGraftContracts () {
      const [exoCue, orgo, gelle, overlay] = await Promise.all([

      this.beeData.getExoCueHistory('exocue', null),
      this.beeData.getOrgoHistory('orgo', null),
      this.beeData.getGelleHistory('gelle', null),
      this.beeData.getOverlayHistory('overlay', null)
    ]);
    // put to library memory
    this.memoryRegister(exoCue)
    this.memoryRegister(orgo)
    this.memoryRegister(gelle)
    this.memoryRegister(overlay)
    
    return { exoCue, orgo, gelle, overlay };

  }

  /**
   * 
   * @method memoryRegiser
  */
  memoryRegister (contractList) {
    for (let contract of contractList) {
      this.libMemory.register(contract.key, contract.value)
    }
  }

}

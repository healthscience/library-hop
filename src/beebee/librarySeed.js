/**
 * Library Seed
 * Location: library-hop
 * Role: collect contracts for beebee to send to bentoboxds on begin
 */
export default class LibrarySeed {
  constructor(parent) {
    this.parent = parent
    this.beeData = parent.liveHolepunch.BeeData
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
      }
    }
    return cuesList
  }

}

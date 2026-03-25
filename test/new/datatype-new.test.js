import { describe, it, expect } from 'vitest'
import { startRealLibraryHop } from '../helpers.js'

describe('New Datatype Contract', () => {
  it('should build and save a new datatype contract for Heart Rate', async () => {
    const libHop = await startRealLibraryHop()
    
    const inputData = {
      primary: 'yes',
      name: 'Heart Rate',
      description: 'Beats per minute',
      wiki: 'https://en.wikipedia.org/wiki/Heart_rate',
      rdf: 'https://dbpedia.org/page/Heart_rate',
      computational: {
        measurement: 'bpm',
        datatypeType: 'integer'
      }
    }

    // 1. Form Datatype Contract using librarycomposer
    const formedContract = libHop.libComposer.liveComposer.datatypeComposer(inputData)
    
    // 2. Form Storage Key using hop-crypto
    const contractHash = libHop.encryption.createKey(formedContract)
    const storageKey = libHop.encryption.createPrefixedKey('datatype', contractHash)
    
    // 3. Save Datatype Reference Contract
    const wrappedContract = {
      reftype: 'datatype',
      data: {
        hash: storageKey,
        contract: formedContract
      }
    }

    const savedContract = await libHop.liveHolepunch.BeeData.savePubliclibraryRef(wrappedContract)
    
    // Verify the saved contract structure
    expect(savedContract).toHaveProperty('key')
    expect(savedContract.key).toEqual(storageKey)
    expect(savedContract.type).toBe('datatype')
    
    // Verify content matches input
    expect(savedContract.contract.data.contract.concept).toHaveProperty('primary', 'yes')
    expect(savedContract.contract.data.contract.concept.name).toBe(inputData.name)
    expect(savedContract.contract.data.contract.concept.description).toBe(inputData.description)
    expect(savedContract.contract.data.contract.computational.measurement).toBe(inputData.computational.measurement)
    
    // Verify we can retrieve it back
    const retrieved = await libHop.liveHolepunch.BeeData.getPublicLibraryRefRange('datatype')
    console.log('save retrieeve all datatypess')
    console.log(retrieved)
    const found = retrieved.find(c => c.key.equals(storageKey))
    expect(found).toBeDefined()
    expect(found.value.data.contract.concept.name).toBe(inputData.name)
  })
})

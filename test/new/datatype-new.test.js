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
    const encryption = new libHop.hopCryptoLive.Encryption()
    const contractHash = encryption.createKey(formedContract)
    const storageKey = encryption.createPrefixedKey('datatype', contractHash)
    
    // 3. Save Datatype Reference Contract
    const wrappedContract = {
      reftype: 'datatype',
      data: {
        hash: storageKey,
        value: formedContract
      }
    }

    const savedContract = await libHop.liveHolepunch.BeeData.savePubliclibraryRef(wrappedContract)
    
    // Verify content matches input
    expect(formedContract.data.contract.concept).toHaveProperty('primary', 'yes')
    expect(formedContract.data.contract.concept.name).toBe(inputData.name)
    expect(formedContract.data.contract.concept.description).toBe(inputData.description)
    expect(formedContract.data.contract.computational.measurement).toBe(inputData.computational.measurement)
    
    // Verify the saved contract structure
    expect(savedContract).toHaveProperty('key')
    expect(savedContract.key).toEqual(storageKey)
    expect(savedContract.type).toBe('datatype')
    
    // Verify we can retrieve it back
    const retrieved = await libHop.liveHolepunch.BeeData.getPublicLibraryRef(storageKey)
    console.log('retrieved contract:', retrieved)
    // If retrieved is an array, find the item. If it's a single object, use it.
    const found = Array.isArray(retrieved) ? retrieved.find(c => c.key.equals(storageKey)) : retrieved
    expect(found).toBeDefined()
    if (found && found.value) {
      expect(found.value.concept.name).toBe(inputData.name)
    }
  })

  it('should upgrade a datatype to a cue contract via formContract and cueFormer', async () => {
    const libHop = await startRealLibraryHop()
    
    const inputData = {
      primary: 'yes',
      name: 'Heart Rate',
      description: 'Beats per minute',
      computational: {
        measurement: 'bpm',
        datatypeType: 'integer'
      }
    }

    const mark = { data: inputData }
    const categoryColors = { 'heart rate': '#e74c3c' }

    // 1. Form Datatype Contract
    const contract = await libHop.cogGlue.formContract('datatype', 'reference', mark)
    expect(contract).toBeDefined()
    expect(contract.reftype).toBe('datatype')

    // 2. Form Cue Contract using the datatype key
    const cue = await libHop.cogGlue.cueFormer(mark, contract.data.hash, categoryColors)
    
    expect(cue.reftype).toBe('cue')
    expect(cue.data.value).toHaveProperty('refcontract', 'cue')
    expect(cue.data.value.concept.name).toBe(inputData.name)
    
    // Verify the datatypeRef matches
    const dtRef = Buffer.from(cue.data.value.computational.datatypeRef)
    expect(dtRef.equals(contract.data.hash)).toBe(true)
  })
})

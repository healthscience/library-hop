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
   
    const savedContract = await libHop.liveHolepunch.BeeData.savePubliclibraryRef(formedContract)
    
    // Verify we can retrieve it back and check its content
    if (savedContract === true) {
      const retrieved = await libHop.liveHolepunch.BeeData.getPublicLibraryRef(formedContract.hash)
      // Hyperbee.get returns a node with { key, value }
      expect(retrieved).toBeDefined()
      expect(retrieved.key).toStrictEqual(formedContract.hash)
      expect(retrieved.value).toBeDefined()
      
      // Verify the content matches what we saved
      expect(retrieved.value.concept.name).toBe(inputData.name)
      expect(retrieved.value.computational.measurement).toBe(inputData.computational.measurement)
      expect(retrieved.value.refcontract).toBe('datatype')
    }
  })

  it('should upgrade a datatype to a cue contract via formContract and cueFormer', async () => {
    const libHop = await startRealLibraryHop()
    
    const inputData = {
      primary: 'yes',
      name: 'heart rate',
      description: 'Beats per minute',
      computational: {
        measurement: 'bpm',
        datatypeType: 'integer'
      }
    }

    const mark = { data: inputData }
    const categoryColors = { 'color': '#e74c3c' }

    // 1. Form Datatype Contract
    const contractBack = await libHop.cogGlue.formContract('datatype', 'reference', mark)

    const retrievedDTC = await libHop.liveHolepunch.BeeData.getPublicLibraryRef(contractBack.contract.hash)
    expect(retrievedDTC).toBeDefined()

    // 2. Form Cue Contract using the datatype key
    const cue = await libHop.cogGlue.cueFormer(retrievedDTC, categoryColors)

    // get the contract and check its properties
    const cueContract = await libHop.liveHolepunch.BeeData.getCues(cue.contract.hash)
    expect(cueContract).toBeDefined()
    expect(cueContract.key).toStrictEqual(cue.contract.hash)
    expect(cueContract.value).toBeDefined()

    expect(cueContract.value.concept.name).toBe(inputData.name)
    const bufferKey = Buffer.from(cueContract.value.computational.datatypeRef);
    expect(bufferKey).toStrictEqual(retrievedDTC.key)
    expect(cueContract.value.refcontract).toBe('cue')
  })
})

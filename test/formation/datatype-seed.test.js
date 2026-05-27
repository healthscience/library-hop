import { describe, it, expect } from 'vitest'
import { startRealLibraryHop } from '../helpers.js'

describe('Datatype Seed Contracts', () => {
  const lsKey = 'common!'

  it('should build and save a new datatype contract for Heart Rate (Stage 1)', async () => {
    const libHop = await startRealLibraryHop()
    
    const inputData = {
      primary: 'yes',
      name: 'Heart Rate',
      description: 'Beats per minute',
      wiki: 'https://en.wikipedia.org/wiki/Heart_rate',
      rdf: 'https://dbpedia.org/page/Heart_rate',
      measurement: 'bpm',
      datatypeType: 'integer'
    }

    // 2. Save to Hyperbee
    const saveMessage = {
      action: 'contracts',
      task: 'PUT',
      privacy: 'public',
      reftype: 'datatype',
      data: inputData // Pass raw input data, saveContractProtocol will form it
    }
    
    const saveResult = await libHop.saveContractProtocol(saveMessage)
    expect(saveResult.task).toBe('save-complete')
    
    const formedContract = saveResult.data
    
    // 3. Verify we can retrieve it back and check its content
    const retrieved = await libHop.liveHolepunch.BeeData.getPublicLibraryRef(formedContract.key)
      // Hyperbee.get returns a node with { key, value }
      expect(retrieved).toBeDefined()
      expect(retrieved.key).toStrictEqual(formedContract.hash)
      expect(retrieved.value).toBeDefined()
      
      // Verify the content matches what we saved
      expect(retrieved.value.concept.name).toBe(inputData.name)
      expect(retrieved.value.computational.measurement).toBe(inputData.measurement)
      expect(retrieved.value.refcontract).toBe('datatype')
  })

  it('should upgrade a datatype to a cue contract via formContract (Stage 2)', async () => {
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
    const categoryColors = '#e74c3c'

    // 1. Form Datatype Contract using seed lsKey
    const contractBack = await libHop.cogGlue.seedCues.formContract(lsKey, 'datatype', 'reference', mark, null)

    const retrievedDTC = await libHop.liveHolepunch.BeeData.getPublicLibraryRef(contractBack.contract.key)
    expect(retrievedDTC).toBeDefined()

    // 2. Form Cue Contract using the datatype contract
    const cueContractRes = await libHop.cogGlue.seedCues.formContract(lsKey, 'cue', 'reference', contractBack.contract, categoryColors)

    // get the contract and check its properties
    const cueContract = await libHop.liveHolepunch.BeeData.getCues(cueContractRes.contract.key)
    expect(cueContract).toBeDefined()
    expect(cueContract.key).toStrictEqual(cueContractRes.contract.key)
    expect(cueContract.value).toBeDefined()

    // verify the datatype ref in cue points to our datatype
    expect(cueContract.value.concept.datatype).toBeDefined()
    expect(cueContract.value.refcontract).toBe('cue')
  })

  it('should create multiple datatypes and cues and fetch via range query (Stage 3)', async () => {
    const libHop = await startRealLibraryHop()

    const lsKeyStage3 = Buffer.from('stage3-ls')
    const datatypes = [
      { name: 'Blood Pressure', desc: 'mmHg' },
      { name: 'Oxygen Saturation', desc: 'Percentage' },
      { name: 'Body Temperature', desc: 'Celsius' }
    ]

    for (let i = 0; i < datatypes.length; i++) {
      const mark = {
        data: {
          primary: 'yes',
          name: datatypes[i].name,
          description: datatypes[i].desc,
          computational: { measurement: 'val', datatypeType: 'integer' }
        }
      }
      
      const dtRes = await libHop.cogGlue.seedCues.formContract(lsKeyStage3, 'datatype', 'reference', mark, null)
      await libHop.cogGlue.seedCues.formContract(lsKeyStage3, 'cue', 'reference', dtRes.contract, '#3498db')
    }

    // Verify Range Query
    const dtRange = await libHop.liveHolepunch.BeeData.getPublicLibraryRefRange(lsKeyStage3, 'datatype', null)
    expect(dtRange.length).toBeGreaterThanOrEqual(3)

    const cueRange = await libHop.liveHolepunch.BeeData.getCuesHistory(lsKeyStage3, 'cue', null)
    expect(cueRange.length).toBeGreaterThanOrEqual(3)
  })
})

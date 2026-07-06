import { describe, it, expect } from 'vitest'
import { startRealLibraryHop } from '../helpers.js'

describe('Datatype Seed Contracts', () => {
  const lsKey = 'common'
  let dataTypeContract = {}
  let dataTypeKey = ''

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

    // 2. Save to datatype Hyperbee
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
    dataTypeContract = retrieved
    dataTypeKey = retrieved.key.toString('hex')
      // Hyperbee.get returns a node with { key, value }
      expect(retrieved).toBeDefined()
      expect(retrieved.key).toStrictEqual(formedContract.key)
      expect(retrieved.value).toBeDefined()
      
      // Verify the content matches what we saved
      expect(retrieved.value.concept.name).toBe(inputData.name)
      // expect(retrieved.value.computational.measurement).toBe(inputData.measurement)
      expect(retrieved.value.refcontract).toBe('datatype')
  })

  it('should upgrade a datatype to a cue contract via formContract (Stage 2)', async () => {
    const libHop = await startRealLibraryHop()

    const categoryColors = '#e74c3c'

    // 2. Form Cue Contract using the datatype contract
    const cueContractRes = await libHop.cogGlue.seedCues.formContract(lsKey, 'cue', 'reference', dataTypeContract, categoryColors)
 
    const cueContract = await libHop.liveHolepunch.BeeData.getCues(cueContractRes.contract.key)
    // get the contract and check its properties
    expect(cueContract).toBeDefined()
    expect(cueContract.key).toStrictEqual(cueContractRes.contract.key)
    expect(cueContract.value).toBeDefined()

    // verify the datatype ref in cue points to our datatype
    expect(cueContract.value.concept.datatype).toBeDefined()
    expect(cueContract.value.refcontract).toBe('cue')
    // turn key to hex
    let orginalDTkey = cueContract.value.concept.datatype
    expect(orginalDTkey).toBe(dataTypeKey)
  })
})

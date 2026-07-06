import { describe, it, expect } from 'vitest'
import { startRealLibraryHop } from '../helpers.js'

describe('Datatype Range Retrieval', () => {
  const lsKey = 'datatype'

  it('should save multiple datatypes and retrieve them via range query', async () => {
    const libHop = await startRealLibraryHop()
    
    // 1. Define multiple inputs to test the range
    const inputs = [
      {
        primary: 'yes',
        name: 'Heart Rate',
        description: 'Beats per minute',
        measurement: 'bpm',
        datatypeType: 'integer'
      },
      {
        primary: 'yes',
        name: 'Blood Pressure',
        description: 'mmHg',
        measurement: 'val',
        datatypeType: 'integer'
      }
    ]

    // 2. Save them sequentially using the proven saveContractProtocol
    for (const inputData of inputs) {
      const saveMessage = {
        action: 'contracts',
        task: 'PUT',
        privacy: 'public',
        reftype: 'datatype',
        data: inputData 
      }
      
      const saveResult = await libHop.saveContractProtocol(saveMessage)
      expect(saveResult.task).toBe('save-complete')
    }
    
    // 3. Execute the range query using the same lsKey string
    const retrievedRange = await libHop.liveHolepunch.BeeData.getPublicLibraryRefRange(lsKey, null, null)
    // 4. Verify the array and stream output
    expect(retrievedRange).toBeDefined()
    expect(Array.isArray(retrievedRange)).toBe(true)
    
    // We expect at least the 2 contracts we just seeded
    expect(retrievedRange.length).toBeGreaterThanOrEqual(2)
      
    // 5. Verify the stream unpacked the JSON accurately
    const firstItem = retrievedRange[0]
    expect(firstItem.key).toBeDefined()
    expect(firstItem.value).toBeDefined()
    expect(firstItem.value.refcontract).toBe('datatype')
    
    // Ensure the data inside the value is intact
    expect(firstItem.value.concept.name).toBeDefined()
    expect(['Heart Rate', 'Blood Pressure']).toContain(firstItem.value.concept.name)
  })
})
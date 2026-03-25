import { describe, it, expect } from 'vitest'
import { startRealLibraryHop } from '../helpers.js'

describe('Datatype Public Contracts', () => {
  it('should generate and save the first 3 datatype contracts from gaia list', async () => {
    const libHop = await startRealLibraryHop()
    
    const savedContracts = await libHop.generateDatatypeCues()
    
    console.log(savedContracts)
    // Check if contracts were processed
    expect(savedContracts.length).toBeGreaterThan(0)

    // Verify structure of one of the saved contracts
    const firstSaved = savedContracts[0]
    expect(firstSaved).toHaveProperty('key')
    expect(firstSaved.contract).toHaveProperty('reftype', 'datatype')
  })
})

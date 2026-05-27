import { describe, it, expect } from 'vitest'
import { startRealLibraryHop } from '../helpers.js'

describe('Lifestrap Contract Lifecycle', () => {
  it('should form, save and retrieve a genesis lifestrap contract', async () => {
    const libHop = await startRealLibraryHop()
    
    const lifestrapData = {
      task: 'PUT',
      privacy: 'public',
      action: 'lifestrap',
      reftype: 'genesis',
      data: {
        name: 'Test Lifestrap',
        description: 'Initial genesis strap for testing',
        inquiry: 'The beginning of a new journey'
      }
    }

    // 1. Save Lifestrap (uses saveLifestrapProtocol internally)
    const checkContract = await libHop.liveLifestrapUtil.firstLifeStrap(lifestrapData)
    
    expect(checkContract).toBeDefined()
    expect(checkContract.value.concept.story).toBe('The beginning of a new journey')
    expect(checkContract.value.refcontract).toBe('lifestrap')

    // 2. Retrieve via GET logic
    const history = await libHop.liveHolepunch.BeeData.getLifestrapHistory('lsempty', 'lifestrap')
    expect(history.length).toBeGreaterThan(0)
    expect(history[0].value.concept.story).toBe('The beginning of a new journey')
  })

  it('should update a lifestrap contract', async () => {
    const libHop = await startRealLibraryHop()
    
    const genesisData = {
      task: 'PUT',
      privacy: 'public',
      action: 'lifestrap',
      reftype: 'genesis',
      data: { 
        name: 'Original Strap',
        inquiry: 'Original story'
      }
    }
    const genesis = await libHop.liveLifestrapUtil.firstLifeStrap(genesisData)

    const updateData = {
      task: 'UPDATE',
      privacy: 'public',
      action: 'lifestrap',
      reftype: 'update-lifestrap',
      data: {
        contract: genesis, // Hyperbee node { key, value }
        relationships: [{ target: 'something', type: 'systemic' }]
      }
    }

    const updated = await libHop.liveLifestrapUtil.updateLifestrapProtocol(updateData)
    expect(updated).toBeDefined()
    
    const retrieved = await libHop.liveHolepunch.BeeData.getLifestrap(genesis.key)
    expect(retrieved.value.computational.relationships).toBeDefined()
  })
})

import { describe, it, expect } from 'vitest'
import { startRealLibraryHop } from '../helpers.js'
import HopLearn from 'hop-learn'

describe('Lensglue Contract Lifecycle', () => {
  it('should form, save and retrieve a lensglue contract', async () => {
    const libHop = await startRealLibraryHop()
    const hopLearn = new HopLearn()
    
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

    // 1. Save Lifestrap first
    const lifestrapContract = await libHop.liveLifestrapUtil.seedLifeStrap(lifestrapData)
    expect(lifestrapContract).toBeDefined()
    expect(lifestrapContract.value.concept.story).toBe('The beginning of a new journey')

    // call hop-learn to extract texture that will be save
    let patternMatch = await hopLearn.lifeFlow(lifestrapContract.value.concept.story, 'HomeoRange')
    expect(patternMatch).toBeDefined()

    /**
     * 
     * @method prepareLifestrapLens
    */
    let prepareLifestrapLens = async function (lsKey, pattern) {
      // save lensglue to hyperbee
      let Lens = {}
      Lens.capacity = [],
      Lens.context = pattern,
      Lens.coherence = []
      Lens.key = lsKey
      let lensglueContract =  await libHop.lensGlue.saveLensglueProtocol(lsKey, Lens)
      return lensglueContract
    }

    let lensglueContract = await prepareLifestrapLens(lifestrapContract.key, patternMatch)

    // 1. Cleanly slice the 10-byte 'lifestrap!' prefix to get the raw 32-byte ID buffer
    const rawLifestrapId = lifestrapContract.key.subarray(10)
    const checkContract = await libHop.liveHolepunch.BeeData.getLensglueHistory(rawLifestrapId)

    expect(checkContract[0]).toBeDefined()
    expect(checkContract[0].value.refcontract).toBe('lensglue')
  })
})

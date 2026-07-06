import { describe, it, expect } from 'vitest'
import { startRealLibraryHop } from '../helpers.js'

describe('Cues Contract Lifecycle', () => {
  it('should form and save a cue contract via CuesUtil', async () => {
    const libHop = await startRealLibraryHop()
    
    const saveMessage = {
      task: 'PUT',
      privacy: 'public',
      action: 'cues',
      data: {
        lsKey: '12345678912345678912345678912345',
        name: 'Daily Activity',
        description: 'Tracking daily movement',
        concept: {
          datatypeRef: 'some-hash'
        }
      }
    }

    const saveMessage2 = {
      task: 'PUT',
      privacy: 'public',
      action: 'cues',
      data: {
        lsKey: '92345678912345678912345678912345',
        name: 'Daily Swimming',
        description: 'Tracking swimming movement',
        concept: {
          datatypeRef: 'some-hash2'
        }
      }
    }
    // different lifestrap key should not be return by range query
    const saveCueFilterNo = await libHop.liveCuesUtil.saveCuesProtocol(saveMessage2)
    // returns the saved cue reference contract
    const saveCueProtocol = await libHop.liveCuesUtil.saveCuesProtocol(saveMessage)
    expect(saveCueProtocol).toBeDefined()
    expect(saveCueProtocol.value.refcontract).toBe('cue')

    // form lifestrap key in binary buffer
    const lsKey = Buffer.from(saveMessage.data.lsKey)
    const retrievedRange = await libHop.liveHolepunch.BeeData.getCuesHistory(lsKey, '', null)

    expect(retrievedRange.length).toBe(1)

    const firstItem = retrievedRange[0]
    expect(firstItem.key).toBeDefined()
    expect(firstItem.value).toBeDefined()
    expect(firstItem.value.refcontract).toBe('cue')
    
    // Ensure the data inside the value is intact
    expect(firstItem.value.concept.name).toBeDefined()
    expect(['Daily Activity']).toContain(firstItem.value.concept.name)

  })
})
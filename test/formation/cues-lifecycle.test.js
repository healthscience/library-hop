import { describe, it, expect } from 'vitest'
import { startRealLibraryHop } from '../helpers.js'

describe('Cues Contract Lifecycle', () => {
  it('should form and save a cue contract via CuesUtil', async () => {
    const libHop = await startRealLibraryHop()
    
    const cueData = {
      task: 'PUT',
      privacy: 'public',
      action: 'cues',
      data: {
        name: 'Daily Activity',
        description: 'Tracking daily movement',
        computational: {
          datatypeRef: 'some-hash'
        }
      }
    }

    const savedCue = await libHop.liveCuesUtil.saveCuesProtocol(cueData)
    expect(savedCue).toBeDefined()
    expect(savedCue.key).toBeDefined()

    const retrieved = await libHop.liveHolepunch.BeeData.getCues(savedCue.key)
    expect(retrieved).toBeDefined()
    // A cue points to a datatype, it doesn't store the name directly in concept usually
    // But it should have a refcontract property
    expect(retrieved.value.refcontract).toBe('cue')
  })
})

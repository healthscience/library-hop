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
    // returns the saved cue reference contract
    const saveCueProtocol = await libHop.liveCuesUtil.saveCuesProtocol(saveMessage)
      expect(saveCueProtocol).toBeDefined()
      expect(saveCueProtocol.value.refcontract).toBe('cue')
      // A cue points to a datatype, it doesn't store the name directly in concept usually
      // But it should have a refcontract property
      expect(saveCueProtocol.value.refcontract).toBe('cue')
      expect(saveCueProtocol).toBeDefined()
      // expect(saveCueProtocol.key).toStrictEqual(cueContractRes.contract.key)
      expect(saveCueProtocol.value).toBeDefined()

      // verify the datatype ref in cue points to our datatype
      expect(saveCueProtocol.value.concept.datatype).toBe(saveMessage.data.concept.datatypeRef)

  })
})

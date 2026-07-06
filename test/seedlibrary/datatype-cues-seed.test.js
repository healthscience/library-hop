import { describe, it, expect } from 'vitest'
import { startRealLibraryHop } from '../helpers.js'

describe('Many Datatype and cue contracts formed for Seed Library', () => {
  const lsKey = 'common'
  let dataTypeContract = {}
  let dataTypeKey = ''


  it('should create multiple datatypes and cues and fetch via range query  (Stage 3)', async () => {
    const libHop = await startRealLibraryHop()

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
      
      const dtRes = await libHop.cogGlue.seedCues.formContract(lsKey, 'datatype', 'reference', mark, null)
      await libHop.cogGlue.seedCues.formContract(lsKey, 'cue', 'reference', dtRes.contract, '#3498db')
    }

    // Verify Range Query
    const dtRange = await libHop.liveHolepunch.BeeData.getPublicLibraryRefRange(lsKey, null, null)

    expect(dtRange.length).toBeGreaterThanOrEqual(3)

    const cueRange = await libHop.liveHolepunch.BeeData.getCuesHistory(lsKey, null, null)

    expect(cueRange.length).toBeGreaterThanOrEqual(3)
  })
})

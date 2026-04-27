import { describe, it, expect } from 'vitest'
import b4a from 'b4a'
import BesearchComposer from '../node_modules/librarycomposer/src/composers/besearchComposer.js'

describe('Besearch 3-Stage Contract Formation', () => {
  const mockContext = {
    crypto: {
      createKey: () => b4a.from('mock-hash'),
      createPrefixedKey: (prefix, hash) => `${prefix}!${hash.toString('hex')}`
    },
    heliclock: {},
    heliLocation: {
      helistamp: () => 1713884522000 // Mocked timestamp
    }
  }

  const composer = new BesearchComposer(mockContext)

  it('Stage 1: Should correctly form a Cycle contract and key', () => {
    const cycleId = '400im-project'
    const cycleData = {
      stage: 'cycle',
      cycleId: cycleId,
      data: {
        capacity: 100,
        author: 'aboynejames',
        permissions: { read: true, write: false }
      }
    }

    const result = composer.besearchPrepare(cycleData)
    
    // Key: 0x01 + CycleID
    const expectedKey = b4a.concat([b4a.from([0x01]), b4a.from(cycleId)])
    
    expect(b4a.equals(result.cueid, expectedKey)).toBe(true)
    expect(result.data.concept.stage).toBe('cycle')
    expect(result.data.concept.author).toBe('aboynejames')
    expect(result.data.refcontract).toBe('besearch')
  })

  it('Stage 2: Should correctly form a Strand contract and key', () => {
    const cycleId = '400im-project'
    const strandId = 'eye-health'
    const strandData = {
      stage: 'strand',
      cycleId: cycleId,
      strandId: strandId,
      data: {
        context: 'longevity-repair',
        plan: { target: 'retina' }
      }
    }

    const result = composer.besearchPrepare(strandData)
    
    // Key: 0x02 + CycleID + \x00 + StrandID
    const expectedKey = b4a.concat([
      b4a.from([0x02]), 
      b4a.from(cycleId), 
      b4a.from([0x00]), 
      b4a.from(strandId)
    ])
    
    expect(b4a.equals(result.cueid, expectedKey)).toBe(true)
    expect(result.data.concept.stage).toBe('strand')
    expect(result.data.concept.context).toBe('longevity-repair')
  })

  it('Stage 3: Should correctly form a Braid contract and key', () => {
    const cycleId = '400im-project'
    const strandId = 'eye-health'
    const braidId = 'red-light-pulse'
    const braidData = {
      stage: 'braid',
      cycleId: cycleId,
      strandId: strandId,
      braidId: braidId,
      data: {
        orgoRefs: ['orgo-001'],
        heliPulse: { frequency: '60hz' }
      }
    }

    const result = composer.besearchPrepare(braidData)
    
    // Key: 0x03 + CycleID + \x00 + StrandID + \x00 + BraidID
    const expectedKey = b4a.concat([
      b4a.from([0x03]), 
      b4a.from(cycleId), 
      b4a.from([0x00]), 
      b4a.from(strandId),
      b4a.from([0x00]),
      b4a.from(braidId)
    ])
    
    expect(b4a.equals(result.cueid, expectedKey)).toBe(true)
    expect(result.data.concept.stage).toBe('braid')
    expect(result.data.concept.heliPulse.frequency).toBe('60hz')
  })
})

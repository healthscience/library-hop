import { describe, it, expect, vi } from 'vitest'
import { startRealLibraryHop } from '../helpers.js'

describe('LibraryHop High-level Routing', () => {
  it('should route lifestrap messages to LifestrapUtil', async () => {
    const libHop = await startRealLibraryHop()
    const emitSpy = vi.spyOn(libHop, 'emit')

    const message = {
      action: 'lifestrap',
      task: 'PUT',
      privacy: 'private',
      data: {
        name: 'Private Genesis',
        description: 'Testing routing',
        inquiry: 'Routed story'
      }
    }

    await libHop.libraryManage(message)

    // libraryManage for private lifestrap PUT emits 'lifestrap-genesis'
    expect(emitSpy).toHaveBeenCalledWith('lifestrap-genesis', expect.objectContaining({
      task: 'save-complete'
    }))

    // Verify it actually saved to Hyperbee
    const history = await libHop.liveHolepunch.BeeData.getLifestrapHistory('lsempty', 'lifestrap')
    expect(history.some(h => h.value.concept.story === 'Routed story')).toBe(true)
  })

  it('should route cues messages to CuesUtil', async () => {
    const libHop = await startRealLibraryHop()
    const emitSpy = vi.spyOn(libHop, 'emit')

    const message = {
      action: 'cues',
      task: 'PUT',
      privacy: 'public',
      data: {
        name: 'Routed Cue',
        description: 'Testing high-level routing'
      }
    }

    await libHop.libraryManage(message)

    expect(emitSpy).toHaveBeenCalledWith('libmessage', expect.any(String))
    const lastCall = JSON.parse(emitSpy.mock.calls.find(c => c[0] === 'libmessage')[1])
    expect(lastCall.action).toBe('cue-contract')
    expect(lastCall.task).toBe('save-complete')
  })
})

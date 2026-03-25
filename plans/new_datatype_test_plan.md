# Plan: New Datatype Test Implementation

The goal is to create a new test file [`test/datatype-new.test.js`](test/datatype-new.test.js) that builds and saves a new datatype contract for "Heart Rate" and verifies the content matches the input.

## Proposed Test Structure

The test will follow these steps:
1. Initialize a real `LibraryHop` instance using the helper.
2. Define the `inputData` for the "Heart Rate" datatype.
3. Use `libHop.libComposer.liveComposer.datatypeComposer(inputData)` to form the contract.
4. Use `libHop.hopCryptoLive` to generate the storage key.
5. Wrap the contract and save it using `libHop.liveHolepunch.BeeData.savePubliclibrary(wrappedContract)`.
6. Assert that the saved contract has the correct properties and matches the input data.
7. Verify retrieval from the public library.

## Implementation Details

```javascript
import { describe, it, expect } from 'vitest'
import { startRealLibraryHop } from './helpers.js'

describe('New Datatype Contract', () => {
  it('should build and save a new datatype contract for Heart Rate', async () => {
    const libHop = await startRealLibraryHop()
    
    const inputData = {
      primary: 'yes',
      name: 'Heart Rate',
      description: 'Beats per minute',
      wiki: 'https://en.wikipedia.org/wiki/Heart_rate',
      rdf: 'https://dbpedia.org/page/Heart_rate',
      computational: {
        measurement: 'bpm',
        datatypeType: 'integer'
      }
    }

    // 1. Form Datatype Contract using librarycomposer
    const formedContract = libHop.libComposer.liveComposer.datatypeComposer(inputData)
    
    // 2. Form Storage Key using hop-crypto
    const contractHash = libHop.hopCryptoLive.createKey(formedContract)
    const storageKey = libHop.hopCryptoLive.createPrefixedKey('datatype', contractHash)
    
    // 3. Save Datatype Reference Contract
    const wrappedContract = {
      reftype: 'datatype',
      data: {
        hash: storageKey,
        contract: formedContract
      }
    }
    
    const savedContract = await libHop.liveHolepunch.BeeData.savePubliclibrary(wrappedContract)
    
    // Verify the saved contract structure
    expect(savedContract).toHaveProperty('key')
    expect(savedContract.key).toBe(storageKey)
    expect(savedContract.type).toBe('datatype')
    
    // Verify content matches input
    expect(savedContract.contract).toHaveProperty('reftype', 'datatype')
    expect(savedContract.contract.data.name).toBe(inputData.name)
    expect(savedContract.contract.data.description).toBe(inputData.description)
    expect(savedContract.contract.data.computational.measurement).toBe(inputData.computational.measurement)
    
    // Verify we can retrieve it back
    const retrieved = await libHop.liveHolepunch.BeeData.getPublicLibraryRefRange()
    const found = retrieved.find(c => c.key === storageKey)
    expect(found).toBeDefined()
    expect(found.value.contract.data.name).toBe(inputData.name)
  })
})
```

## Next Steps
1. Switch to **Code** mode.
2. Write the content to [`test/datatype-new.test.js`](test/datatype-new.test.js).
3. Run the test using `npm test test/datatype-new.test.js`.

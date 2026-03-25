# Consolidated Plan: Datatype and Cue Contracts

## Objective
Implement `generateDatatypeCues` to process datatype lists from `src/seed/cuesUtility.js`, form contracts, generate storage keys, and eventually upgrade them to cue contracts with biomarkers, colors, and relationships.

## Current Status
- `generateDatatypeCues` is implemented in `src/index.js` (lines 1205-1229).
- It currently processes the first 3 items from `biomarkerUtil.prepareContractbiomarkersMessage()`.
- It uses `libComposer.liveComposer.datatypeComposer` and `hopCryptoLive.Encryption`.
- A test exists at `test/batch/datatype-public.test.js`.

## Phase 1: Datatype Contracts (In Progress)
1. [x] Implement `generateDatatypeCues` in `src/index.js`.
2. [x] Create initial test `test/batch/datatype-public.test.js`.
3. [ ] Fix `generateDatatypeCues` in `src/index.js`:
   - It currently uses `biomarkerUtil.prepareContractbiomarkersMessage()`, but it should likely use `CuesUtility` methods for the high-level datatypes (gaia, nature, etc.) as originally planned.
   - The current implementation in `src/index.js` uses `this.hopCryptoLive.Encryption.createKey`, but `Encryption` might be an instance or a static class depending on how `hop-crypto` is exported.
4. [ ] Expand `generateDatatypeCues` to process all lists from `CuesUtility`:
   - `prepareDTgaiaMessage`
   - `prepareDTnatureMessage`
   - `prepareDTenvironmentMessage`
   - `prepareDTcultureMessage`
   - `prepareDTlifeMessage`
   - `prepareDTagingMessage`
   - `prepareDTplanetMessage`
   - `prepareDTbodyMessage`

## Phase 2: Cue Contracts Upgrade
1. [ ] Upgrade datatype reference contracts to cue contracts.
2. [ ] Map cue contracts to biomarkers (e.g., heart cue -> cholesterol biomarker).
3. [ ] Assign colors based on type (e.g., red for heart).
4. [ ] Assign relationships (`up`, `down`, `equal`, `measure`, `compute`, `unknown`).
   - Biomarkers always use `measure`.

## Phase 3: Verification
1. [ ] Run `test/batch/datatype-public.test.js` to ensure current implementation works.
2. [ ] Add new tests for the cue contract upgrade logic.

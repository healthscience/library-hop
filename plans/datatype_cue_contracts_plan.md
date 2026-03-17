# Datatype and Cue Contracts Implementation Plan

## Objective
Make datatype contracts from the lists in `src/seed/cuesUtility.js`, form storage keys using `hop-crypto`, and create cue contracts mapped to biomarkers with specific colors and relationships.

## Steps

1. **Update Dependencies**
   - Add a color library (e.g., `color` or `chalk`) to `package.json` dependencies.

2. **Import Required Modules**
   - In `src/index.js`, import `CuesUtility` from `src/seed/cuesUtility.js`.
   - Import the chosen color library.
   - (Note: `hop-crypto` is already available in the environment/passed in).

3. **Create Processing Method**
   - Create a new method in `src/index.js` (e.g., `generateDatatypeCues()`) to handle the processing of datatype lists.

4. **Retrieve Datatype Lists (Initial Test)**
   - Instantiate `CuesUtility`.
   - Call the first function `prepareDTgaiaMessage` and extract only the first 3 items from its returned list for initial testing.
   - (The rest of the items and the other functions will be processed after testing: `prepareDTnatureMessage`, `prepareDTenvironmentMessage`, `prepareDTcultureMessage`, `prepareDTlifeMessage`, `prepareDTagingMessage`, `prepareDTplanetMessage`, `prepareDTbodyMessage`)

5. **Form Datatype Contracts**
   - Iterate through the retrieved lists.
   - Use `this.libComposer.liveComposer.datatypeComposer()` to form the datatype contracts from the list data.

6. **Generate Storage Keys**
   - Instantiate the `Encryption` class from `hop-crypto`.
   - Use `Encryption.createKey(instance)` to form the storage key for each contract.

7. **Test Datatype Contracts**
   - Verify the structure of the 3 saved datatype reference contracts is as expected.

8. **Create Cue Contracts (Upgrade)**
   - Once the 3 datatype reference contracts are confirmed, upgrade them to cue contracts.
   - Map these cue contracts to their respective biomarkers (e.g., mapping a heart cue to a cholesterol biomarker).

9. **Assign Colors and Relationships**
   - Assign specific colors to the cue contracts based on their type (e.g., red for heart, shades of pink for other related organs/biomarkers).
   - Define and assign the appropriate relationships for each cue contract.
     - Note: The types of relationships are limited to `up`, `down`, `equal`, `measure`, `compute`, `unknown`.
     - For a biomarker, the relationship is always `measure`.

10. **Process Remaining Datatypes**
    - After successful testing of the first 3, repeat the process for the remaining datatypes (`prepareDTcultureMessage`, `prepareDTlifeMessage`, `prepareDTagingMessage`, `prepareDTplanetMessage`, `prepareDTbodyMessage`).

export const torsoEmulationContract = {
  refcontract: 'emulation-world',
  name: 'torso emulation world',
  description: 'Spatial envelope and coordinate frame for torso-level rendering',

  // 1. CONCEPT
  concept: {
    domain: 'torso',
    scaleDomain: 'body'
  },

  // 2. COMPUTATIONAL
  computational: {
    outputFormat: 'morphicStateVector',
    projectionType: 'orthographic'
  },

  // 3. SPACE
  space: {
    coordinateFrame: {
      origin: [0, 0, 0],
      scaleUnit: 'radia',
      scaleValue: 1.0
    }
  },

  // 4. TIME
  time: {
    targetPulse: 'solar-day-pulse-primary'
  }
}
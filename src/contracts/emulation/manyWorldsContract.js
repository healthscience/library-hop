export const multiScalarHopStory = {
  storyId: 'story:torso-organ-bioregion-graft-v1',
  name: 'Multi-Scalar Torso Graft Story',

  // 1. INGREDIENTS
  ingredients: {
    overlayContractHash: 'overlay:a9f4c328e...',
    orgoPath: 'hyperdrive://peer-node/geometry/torso-orgo-v1.json',
    gellePath: 'hyperdrive://peer-node/compute/torso-transform.gelle.js'
  },

  // 2. THREE COMBINED EMULATION WORLDS
  emulationWorlds: [
    {
      contractHash: 'emulation:torso-world-hash',
      slot: 'primary-torso',
      viewport: { pixelWidth: 800, pixelHeight: 1000, aspectRatio: 0.8 }
    },
    {
      contractHash: 'emulation:organ-heart-hash',
      slot: 'inset-organ',
      viewport: { pixelWidth: 300, pixelHeight: 300, aspectRatio: 1.0 }
    },
    {
      contractHash: 'emulation:bioregion-hash',
      slot: 'background-bioregion',
      viewport: { pixelWidth: 1920, pixelHeight: 1080, aspectRatio: 1.77 }
    }
  ],

  // 3. GRAFT BINDING
  graftMap: {
    sourceOverlayHash: 'overlay:a9f4c328e...',
    targetOrgoPath: 'hyperdrive://peer-node/geometry/torso-orgo-v1.json',
    activeGellePath: 'hyperdrive://peer-node/compute/torso-transform.gelle.js'
  }
}
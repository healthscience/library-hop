/**
 * relationshipFascia.js
 * Location: library-hop
 * Role: form relationship between cues and other reference contract hypberbees
 */
export default class RelationshipFascia {
  constructor(parent) {
    this.parent = parent
    this.beeData = parent.liveHolepunch.BeeData
  }

  /**
   * Retrieves the immediate downstream neighboring tissue layers from a single focal cue.
   * @param {Hyperbee} cues - The local binary cues database instance.
   * @param {Uint8Array} sourceBuffer - The binary hash of the active starting cue.
   * @param {string} flowType - The directional flow to pull (e.g., 'downstream', 'gauge')
   * @returns {Promise<Array<Uint8Array>>} - Array of target binary hashes.
  */
  async retrieveImmediateFlows(cues, sourceBuffer, flowType = 'downstream') {
    const targetHashes = [];

    // Compose the exact lexicographical range prefix
    const prefix = Buffer.concat([
      new TextEncoder().encode('edge!'),
      sourceBuffer,
      new Uint8Array([0x21]), // '!' separator
      new TextEncoder().encode(`${flowType}!`)
    ]);

    // Stream everything within the exact boundaries of this flow
    const stream = cues.createReadStream({
      gt: prefix,
      lt: Buffer.concat([prefix, new Uint8Array([0xff])])
    });

    for await (const node of stream) {
      // Extract the final 32 bytes representing the terminal connected cue hash
      targetHashes.push(node.key.slice(-32));
    }

    return targetHashes;
  }


  /**
   * Recursively descends down the structural fascia to build a multi-tiered topology map.
   * @param {Hyperbee} cues - The local cues database.
   * @param {Uint8Array} anchorBuffer - The binary hash to start cascading from.
   * @param {number} maxDepth - Safety guardrail against circular reference loops.
  */
  async cascadeStructuralTree(cues, anchorBuffer, maxDepth = 3, currentDepth = 0) {
    const nodeHex = anchorBuffer.toString('hex');
    
    const structureNode = {
      id: nodeHex,
      branches: []
    };

    if (currentDepth >= maxDepth) return structureNode;

    // 1. Retrieve all immediate downstream branches for the current structural layer
    const immediateBranches = await retrieveImmediateFlows(cues, anchorBuffer, 'downstream');

    // 2. Parallelize the recursive descent to populate the lower sub-systems
    structureNode.branches = await Promise.all(
      immediateBranches.map(branchBuffer => 
        cascadeStructuralTree(cues, branchBuffer, maxDepth, currentDepth + 1)
      )
    );

    return structureNode;
  }

  /**
   * Resolves a full biological telemetry profile by traversing 
   * across the cues, markers, and telemetry Hyperbees.
   */
  async getHeartBiomarkerProfile(heartUuidBuffer) {
    const profile = {
      organ: "Heart",
      calibrated_markers: []
    };

    // Step 1: Scan the Master Index (cues) to find connected marker UUIDs
    const prefix = Buffer.concat([
      new TextEncoder().encode('edge!'),
      heartUuidBuffer,
      new Uint8Array([0x21]), // '!' delimiter
      new TextEncoder().encode('gauge!')
    ]);

    const edgeStream = this.cues.createReadStream({
      gt: prefix,
      lt: Buffer.concat([prefix, new Uint8Array([0xff])])
    });

    const discoveredMarkerUuids = [];
    for await (const node of edgeStream) {
      // Extract the final 32 bytes representing the target marker
      discoveredMarkerUuids.push(node.key.slice(-32));
    }

    // Step 2 & 3: Hydrate definitions and grab scores via parallelized direct lookups
    profile.calibrated_markers = await Promise.all(
      discoveredMarkerUuids.map(async (markerUuid) => {
        // Direct point lookup into the structural definitions database
        const markerNode = await this.markers.get(markerUuid);
        if (!markerNode) return null;
        
        const markerContract = JSON.parse(markerNode.value.toString());

        // Stream the raw historical values from the time-series telemetry database
        const telemetryPrefix = Buffer.concat([markerUuid, new TextEncoder().encode('!ticks!')]);
        const tickStream = this.telemetry.createReadStream({
          gt: telemetryPrefix,
          lt: Buffer.concat([telemetryPrefix, new Uint8Array([0xff])]),
          limit: 5 // Grab the last 5 solar entries to save memory
        });

        const historicalScores = [];
        for await (const tick of tickStream) {
          historicalScores.push(JSON.parse(tick.value.toString()));
        }

        // Return the unified metabolic context package
        return {
          id: markerUuid.toString('hex'),
          name: markerContract.type,
          details: markerContract,
          history: historicalScores
        };
      })
    );

    // Clean out any null entries caused by missing definitions
    profile.calibrated_markers = profile.calibrated_markers.filter(Boolean);
    return profile;
  }

  /**
   * Compiles a localized body part subset for an interplay view (e.g., Hayfever context).
   * @param {Hyperbee} cues - The local binary cues database instance.
   * @param {Uint8Array} focalCueBuffer - The binary hash of the target context anchor.
   * @param {Array<Object>} fullContractsArray - The global raw array of all available cue contracts.
   * @returns {Promise<Array<Object>>} - The targeted, hydrated subset for the UI.
   */
  async compileInterplayContext(cues, focalCueBuffer, fullContractsArray) {
    const connectedHashes = new Set();

    // 1. Stream the structural fascia from the B-tree
    // Target prefix: edge!{focalCueBuffer}!downstream!
    const prefixBytes = Buffer.concat([
      new TextEncoder().encode('edge!'),
      focalCueBuffer,
      new Uint8Array([0x21]), // ASCII '!'
      new TextEncoder().encode('downstream!')
    ]);

    const fascialStream = cues.createReadStream({
      gt: prefixBytes,
      lt: Buffer.concat([prefixBytes, new Uint8Array([0xff])])
    });

    for await (const node of fascialStream) {
      // Slice the final 32 bytes to extract the absolute target binary hash
      const targetHash = node.key.slice(-32);
      
      // Convert to hex string *only* for the temporary in-memory Set lookup
      connectedHashes.add(targetHash.toString('hex'));
    }

    // 2. Optimize the full contracts lookup table into a high-speed Map
    // This turns search time from slow O(N) into instant O(1)
    const contractsMap = new Map(
      fullContractsArray.map(contract => [contract.id, contract])
    );

    // 3. Intersect and Hydrate the final subset array for the UI view
    const hydratedBodyCues = [];

    for (const hexHash of connectedHashes) {
      const matchingContract = contractsMap.get(hexHash);
      
      if (matchingContract) {
        // Pull only the explicit properties your view layout requires
        hydratedBodyCues.push({
          id: matchingContract.id,
          name: matchingContract.value.concept.name,
          datatype: matchingContract.value.concept.datatype,
          // Any other structural details the UI needs to display the cue card
        });
      }
    }

    return hydratedBodyCues;
  }

  /**
   * Resolves a full biological telemetry profile by traversing 
   * across the cues, markers, and telemetry Hyperbees.
   */
  async getHeartBiomarkerProfile(heartUuidBuffer) {
    const profile = {
      organ: "Heart",
      calibrated_markers: []
    };

    // Step 1: Scan the Master Index (cues) to find connected marker UUIDs
    const prefix = Buffer.concat([
      new TextEncoder().encode('edge!'),
      heartUuidBuffer,
      new Uint8Array([0x21]), // '!' delimiter
      new TextEncoder().encode('gauge!')
    ]);

    const edgeStream = this.cues.createReadStream({
      gt: prefix,
      lt: Buffer.concat([prefix, new Uint8Array([0xff])])
    });

    const discoveredMarkerUuids = [];
    for await (const node of edgeStream) {
      // Extract the final 32 bytes representing the target marker
      discoveredMarkerUuids.push(node.key.slice(-32));
    }

    // Step 2 & 3: Hydrate definitions and grab scores via parallelized direct lookups
    profile.calibrated_markers = await Promise.all(
      discoveredMarkerUuids.map(async (markerUuid) => {
        // Direct point lookup into the structural definitions database
        const markerNode = await this.markers.get(markerUuid);
        if (!markerNode) return null;
        
        const markerContract = JSON.parse(markerNode.value.toString());

        // Stream the raw historical values from the time-series telemetry database
        const telemetryPrefix = Buffer.concat([markerUuid, new TextEncoder().encode('!ticks!')]);
        const tickStream = this.telemetry.createReadStream({
          gt: telemetryPrefix,
          lt: Buffer.concat([telemetryPrefix, new Uint8Array([0xff])]),
          limit: 5 // Grab the last 5 solar entries to save memory
        });

        const historicalScores = [];
        for await (const tick of tickStream) {
          historicalScores.push(JSON.parse(tick.value.toString()));
        }

        // Return the unified metabolic context package
        return {
          id: markerUuid.toString('hex'),
          name: markerContract.type,
          details: markerContract,
          history: historicalScores
        };
      })
    );

    // Clean out any null entries caused by missing definitions
    profile.calibrated_markers = profile.calibrated_markers.filter(Boolean);
    return profile;
  }

}
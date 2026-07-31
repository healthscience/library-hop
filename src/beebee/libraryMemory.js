
class ContractRegistry {
  constructor() {
    // this.bee = bee;
    // this.drive = drive;
    
    // Key: Hex string or raw Buffer key -> Value: Decoded contract JSON metadata
    this.contracts = new Map();
  }

  // Called on HOP startup during seed/graft hydration
  register(contractHash, contractData) {
    const key = Buffer.isBuffer(contractHash) ? contractHash.toString('hex') : contractHash;
    this.contracts.set(key, contractData);
  }

  // Instant O(1) synchronous lookup for SafeFlow-ECS
  get(contractHash) {
    console.log('get memeor form hash')
    console.log(contractHash)
    const key = Buffer.isBuffer(contractHash) ? contractHash.toString('hex') : contractHash;
    return this.contracts.get(key);
  }

  // Fallback if a contract arrives out-of-band
  async resolve(contractHash) {
    const cached = this.get(contractHash);
    if (cached) return cached;

    // On-demand fetch if missing from seed/graft pool
    /*const record = await fetchContractFromBee(this.bee, contractHash);
    if (record) this.register(contractHash, record);
    return record; */
  }
}

export default ContractRegistry
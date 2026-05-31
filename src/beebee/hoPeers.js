/**
 * Warm peers
 * Location: library-hop
 * Role: collect contracts for beebee to send to bentoboxds on begin
 */
export default class HopeerWarm {
  constructor(parent) {
    this.parent = parent
    this.beeData = parent.liveHolepunch.BeeData
  }

  /**
   * 
   * @method getWarmHopeers
  */
  async getWarmHopeers () {

    let warmpeerList = await this.beeData.getPeersHistory('hopeer')
    console.log('warm peer beging')
    console.log(warmpeerList)
    return warmpeerList
  }

}
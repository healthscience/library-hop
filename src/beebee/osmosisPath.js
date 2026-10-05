/**
 * osmosisPath.js
 * Location: library-hop
 * Role: path to osmosis between peers
 */
export default class OsmosisReplication {
  constructor(parent, wiring) {
    this.parent = parent
    this.beeData = parent.liveHolepunch.BeeData
  }

  /**
  * set osmosis in wiring
  * @method setOsmosis
  *
  */
  setOsmosis = function (osmosis) {
    this.osmosis = osmosis
  }

  /*
  *
  * @method
  * */
  async startOsmosis(discoveryKey) {
    const storeOsmosis = await this.beeData.Ingest(discoveryKey.store);
    return storeOsmosis
  }

}

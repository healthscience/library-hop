'use strict'
/**
* BentoBox Operations
* @class BentoBoxOperations
* @package    library-interface
* @copyright  Copyright (c) 2024 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
*/

class BentoBoxOperations {
  constructor(parent) {
    this.parent = parent
  }

  /**
  * bentobox info gathering
  * @method bentoPath
  */
  bentoPath = async function (o) {
    if (o.action === 'lifestrap-start') {
      let peerLifestaps = await this.parent.liveHolepunch.BeeData.getLifestrapHistory('lsempty', 'lifestrap')
      this.parent.callbackLifestrapStart(peerLifestaps)
    } else if (o.action === 'chat-start') {
      // self verified get Account Info, cues, markers, bentoboxes etc.  Get most used (all for now)
      // account peer relationships
      let bbPeers = await this.parent.liveHolepunch.BeeData.getPeersHistory('lsempty', 'peer', 100)
      this.parent.callbackPeerHistory(bbPeers)        
      // besearch active
      let besearchStart = await this.parent.liveHolepunch.BeeData.getBesearchHistory('lsempty', 'besearch')
      this.parent.callbackBesearchhistory(besearchStart)
      // default agents
      let bbAgents = await this.parent.liveHolepunch.BeeData.getModelHistory('lsempty', 'model')
      this.parent.callbackAgents(bbAgents)
      // spaces location of bentoboxes per cue space
      let bbspace = await this.parent.liveHolepunch.BeeData.getAllBentospaces('lsempty', 'space')
      this.parent.callbackAllBentospace(bbspace)
      // chats
      let bentoChatstart = await this.parent.liveHolepunch.BeeData.getBentochatHistory('lsempty', 'chat')
      this.parent.callbackBentochathistory(bentoChatstart)
      // get the Cues
      let bentoCuesLive = await this.parent.liveHolepunch.BeeData.getCuesHistory('lsempty', 'cue')
      this.parent.callbackBentoCueshistory(bentoCuesLive)
      // get the media
      let bentoMediaLive = await this.parent.liveHolepunch.BeeData.getMediaHistory('lsempty', 'media')
      this.parent.callbackBentoMediahistory(bentoMediaLive)        
      // get the research
      let bentoResearchLive = await this.parent.liveHolepunch.BeeData.getResearchHistory('lsempty', 'research')
      this.parent.callbackBentoResearchhistory(bentoResearchLive)
      // get the markers
      let bentoMarkerLive = await this.parent.liveHolepunch.BeeData.getMarkerHistory('lsempty', 'marker')
      this.parent.callbackBentoMarkerhistory(bentoMarkerLive)
      // get the products
      let bentoProductLive = await this.parent.liveHolepunch.BeeData.getProductHistory('lsempty', 'product')
      this.parent.callbackBentoProducthistory(bentoProductLive)
      // get the bentobox
      let bBoxes = await this.parent.liveHolepunch.BeeData.getBentoBoxHistory('lsempty', 'box')
      this.parent.callbackBentoBoxes(bBoxes)
      // get the @teach history
      console.log('teach history called')
      let beebeeTeachHistory = await this.parent.liveHolepunch.BeeData.getBeeBeeLearnHistory('lsempty', 'learn')
      this.parent.callbackBeeBeeLearn(beebeeTeachHistory)
    } else if (o.task.trim() === 'get') {
    } else if (o.task.trim() === 'delete') {
      let bentoDelete = await this.parent.liveHolepunch.BeeData.deleteBentochat(o.data)
      this.parent.callbackDeleteBentochat(bentoDelete)
    }
  /* } else if (o.reftype.trim() === 'space-history') {
    if (o.action.trim() === 'save') {
      let bentoSpace = await this.parent.liveHolepunch.BeeData.saveSpaceHistory(o.data)
      this.parent.callbackHistoryspace(bentoSpace)
    } else if (o.action.trim() === 'delete') {
      let bentoDelete = await this.parent.liveHolepunch.BeeData.deleteBentospace(o.data)
      this.parent.callbackDeleteBentospace(bentoDelete)
    } else if (o.action.trim() === 'save-position') {
      let bentospace = await this.parent.liveHolepunch.BeeData.saveBentospace(o.data)
      this.parent.callbackBentospace(bentospace)
    } else if (o.action.trim() === 'list-position') {
      let bbspace = await this.parent.liveHolepunch.BeeData.getBentospace()
      this.parent.callbackListBentospace(bbspace)
    } else {
      console.log('no action bentospace')
    }
    } else if (o.reftype.trim() === 'solospace') {
    if (o.action.trim() === 'save-position') {
      let solospace = await this.parent.parent.liveHolepunch.BeeData.saveSolospace(o.data)
      this.parent.callbacSolospace(solospace)
      } else if (o.action.trim() === 'list-position') {
      let ssspace = await this.parent.liveHolepunch.BeeData.getSolospace(o.data)
        this.parent.callbackListSolospace(ssspace)
      } else {
        console.log('no action solospace')
      }
    } */
  }
}

export default BentoBoxOperations

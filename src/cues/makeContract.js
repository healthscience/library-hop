'use strict'
/**
*  new, update, delete cues contracts
*
*
* @class CuesContracts
* @package    network-library
* @copyright  Copyright (c) 2024 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import util from 'util'
import EventEmitter from 'events'

class CuesContracts extends EventEmitter {

  constructor(Lib, Holepunch, Composer) {
    super()
    this.liveLib = Lib
    this.liveHolepunch = Holepunch
    this.libComposer = Composer
  }

  /**
  * 
  * @method 
  *
  */
  getCues = function (path, action, data) {

  }

  /**
  * mange cues from bentoboxDS
  * @method cueManage
  *
  */
  cueManage = async function (message) {
    if (message.task.trim() === 'GET') {
      // public or private library?
      if (message.privacy === 'private') {
        let cuesLib = await this.liveHolepunch.BeeData.getCues(100)
        // this.callbackCuesLib(message.data, cuesLib)
      } else if (message.privacy === 'public') {
        if (message.reftype === 'start-cues') {
          let cuesHistory = await this.liveHolepunch.BeeData.getCuesHistory('')
          this.callbackCuesStart(cuesHistory)
        } else {
          let publibCues = await this.liveHolepunch.BeeData.saveCues(message.data)
          this.callbackcues(publibCues)
        }
      }
    } else if (message.task.trim() === 'PUT') {
      if (message.privacy === 'private') { 
        // pass to save manager, file details extract, prep contract
        // let saveFeedback = await this.saveCueManager(message)
        // this.emit('libmessage', JSON.stringify(saveFeedback))
      } else if (message.privacy === 'public') {
        // need check if composer needed to form contract and then save
        let saveContract = await this.saveCuesProtocol(message)
        let saveMessage = {}
        saveMessage.type = 'library'
        saveMessage.action = 'cue-contract'
        saveMessage.task = 'save-complete'
        saveMessage.data = saveContract
        this.liveLib.emit('libmessage', JSON.stringify(saveMessage))
      }
    } else if (message.task.trim() === 'UPDATE') {
      if (message.privacy === 'private') {
      } else if (message.privacy === 'public') {
        let saveContract = await this.updateCuesProtocol(message)
        let saveMessage = {}
        saveMessage.type = 'library'
        saveMessage.action = 'cue-contract'
        saveMessage.task = 'update-complete'
        saveMessage.data = saveContract
        this.liveLib.emit('libmessage', JSON.stringify(saveMessage))
      }
    } else if (message.task.trim() === 'DEL') {
      if (message.privacy === 'private') {
        // private
        let delFeedback = this.liveHolepunch.BeeData.deleteBentocue(message.data)
      } else if (message.privacy === 'public') {
        // public
        let delFeedback = this.liveHolepunch.BeeData.deleteBentocue(message.data)
      }
    } else if (message.task.trim() === 'SYNC') {
      if (message.reftype === 'cues-gaia') {
        this.syncGAIA()
      } else if (message.reftype === 'cues-custom') {

      }

    }
  }  

  /**
  * save a cues wheel
  * @method saveCuesProtocol
  *
  */
  saveCuesProtocol = async function (saveData) {
    let formedContract = this.libComposer.liveCues.cuesPrepare(saveData)
    // console.log(util.inspect(formedContract, {showHidden: false, depth: null}))
    let saveContract = await this.liveHolepunch.BeeData.saveCues(formedContract)
    return saveContract
  }

  /**
  * update cues relationship
  * @method updateCuesProtocol
  *
  */
  updateCuesProtocol = async function (updateData) {
    let formedContract = this.libComposer.liveCues.cuesRelationships(updateData)
    // console.log(util.inspect(formedContract, {showHidden: false, depth: null}))
    let saveContract = await this.liveHolepunch.BeeData.saveCues(formedContract)
    return saveContract
  }

  /**
  * default gaia cues
  * @method syncGAIA
  *
  */
  syncGAIA = async function () {
  
  }

  /**
  * call back
  * @method callbackCuesStart
  */
  callbackCuesStart = function (data) {
    // pass to sort data into ref contract types
    let cuesReturn = {}
    cuesReturn.type = 'bentobox'
    cuesReturn.reftype = 'cues-history'
    cuesReturn.action = 'start'
    cuesReturn.data = data
    this.liveLib.emit('libmessage', JSON.stringify(cuesReturn))
  }

  /**
  * call back
  * @method callbackcues
  */
  callbackcues = function (data) {
    let cueData = {}
    cueData.type = 'peerlibrary'
    cueData.refcontract = 'cue-new'
    cueData.data = data
    this.liveLib.emit('libmessage', JSON.stringify(cueData))
  }

}

export default CuesContracts
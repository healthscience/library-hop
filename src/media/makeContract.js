'use strict'
/**
*  new, update, delete cues contracts
*
*
* @class MediaContracts
* @package    network-library
* @copyright  Copyright (c) 2024 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import util from 'util'
import EventEmitter from 'events'

class MediaContracts extends EventEmitter {

  constructor(Holepunch, Composer) {
    super()
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
          // this.startCues()
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
        this.emit('libmessage', JSON.stringify(saveFeedback))
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
    // format message for return
    let saveMessage = {}
    saveMessage.type = 'library'
    saveMessage.action = 'reference-contract'
    saveMessage.task = 'save-complete'
    saveMessage.data = saveContract
    return saveMessage
  }

}

export default MediaContracts
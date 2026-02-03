'use strict'
/**
*  new, update, delete training beebee
*
*
* @class BeeBeeLearnContracts
* @package    network-library
* @copyright  Copyright (c) 2024 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import util from 'util'
import EventEmitter from 'events'
import hashObject from 'object-hash'

class BeeBeeLearnContracts extends EventEmitter {

  constructor(Lib, Holepunch, Composer) {
    super()
    this.liveHolepunch = Holepunch
    this.liveLib = Lib
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
  * mange research
  * @method researchManage
  *
  */
  trainingManage = async function (message) {
    if (message.task.trim() === 'GET') {
      // public or private library?
      if (message.privacy === 'private') {
        let cuesLib = await this.liveHolepunch.BeeData.getBeeBeeLearn(100)
        // this.callbackCuesLib(message.data, cuesLib)
      } else if (message.privacy === 'public') {
        if (message.reftype === 'start-teach') {
          // this.startTeach()
        } else {
          let publibCues = await this.liveHolepunch.BeeData.saveBeeBeeLearn(message.data)
          this.callbackresearch(publibCues)
        }
      }
    } else if (message.task.trim() === 'PUT') {
      if (message.privacy === 'private') { 
        // pass to save manager, file details extract, prep contract
        // let saveFeedback = await this.saveCueManager(message)
        // this.emit('libmessage', JSON.stringify(saveFeedback))
      } else if (message.privacy === 'public') {
        // need check if composer needed to form contract and then save
        let saveContract = await this.saveBeeBeeLearnProtocol(message)
        let saveMessage = {}
        saveMessage.type = 'library'
        saveMessage.action = 'beebeelearn-contract'
        saveMessage.task = 'save-complete'
        saveMessage.data = saveContract
        this.liveLib.emit('libmessage', JSON.stringify(saveMessage))
      }
    } else if (message.task.trim() === 'DEL') {
      if (message.privacy === 'private') {
        // private
        let delFeedback = this.liveHolepunch.BeeData.deleteBeeBeeLearn(message.data.key)
      } else if (message.privacy === 'public') {
        // public
        let delFeedback = this.liveHolepunch.BeeData.deleteBeeBeeLearn(message.data.key)
      }
    }
  } 

  /**
  * save a research
  * @method saveResearchProtocol
  *
  */
  saveBeeBeeLearnProtocol = async function (saveData) {
    console.log('saveBeeBeeLearnProtocol')
    console.log(saveData)
    let formedContract = {}
    formedContract.id = hashObject(saveData.data)
    formedContract.session = saveData.data
    // verified already // this.libComposer.liveTeach.teachPrepare(saveData)
    // console.log(util.inspect(formedContract, {showHidden: false, depth: null}))
    let saveContract = await this.liveHolepunch.BeeData.saveBeeBeeLearn(formedContract)
    // format message for return
    let saveMessage = {}
    saveMessage.type = 'library'
    saveMessage.action = 'beebeelearn-contract'
    saveMessage.task = 'save-complete'
    saveMessage.data = saveContract
    return saveMessage
  }

}

export default BeeBeeLearnContracts
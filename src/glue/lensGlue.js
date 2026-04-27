'use strict'
/**
*  new, update, delete lifestrap contracts
*
*
* @class LensGlue
* @package    network-library
* @copyright  Copyright (c) 2024 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import util from 'util'
import EventEmitter from 'events'

class LensGlue extends EventEmitter {

  constructor(Lib, Holepunch, Composer) {
    super()
    this.liveLib = Lib
    this.liveHolepunch = Holepunch
    this.libComposer = Composer
  }

  /**
  * mange lifestrap from bentoboxDS
  * @method lensGlueManage
  *
  */
  lensglueManage = async function (message) {
    if (message.task.trim() === 'GET') {
      // public or private library?
      if (message.privacy === 'private') {
        let lensGlueLib = await this.liveHolepunch.BeeData.getLensglue(100)
        // 
      } else if (message.privacy === 'public') {
        if (message.reftype === 'start-lensglue') {
          let lensglueHistory = await this.liveHolepunch.BeeData.getLensglueHistory('lensglue')
          this.callbackLensglueStart(lensglueHistory)
        } else {
          let publibLensglue = await this.liveHolepunch.BeeData.saveLensglue(message.data)
          this.callbackLensglue(publibLensglue)
        }
      }
    } else if (message.task.trim() === 'PUT') {
      if (message.privacy === 'private') {
        // need to form contract and save to hypberbee
        let saveContract = await this.saveLensglueProtocol(message)
        let saveMessage = {}
        saveMessage.type = 'library'
        saveMessage.action = 'lensglue-genesis'
        saveMessage.task = 'save-complete'
        saveMessage.data = saveContract
        this.liveLib.emit('lensglue-genesis', saveMessage)
        // pass to save manager, file details extract, prep contract
      } else if (message.privacy === 'public') {
        // need check if composer needed to form contract and then save
        let saveContract = await this.saveLensglueProtocol(message)
        let saveMessage = {}
        saveMessage.type = 'library'
        saveMessage.action = 'lensglue-contract'
        saveMessage.task = 'save-complete'
        saveMessage.data = saveContract
        this.liveLib.emit('libmessage', JSON.stringify(saveMessage))
      }
    } else if (message.task.trim() === 'UPDATE') {
      if (message.privacy === 'private') {
      } else if (message.privacy === 'public') {
        if (message.reftype === 'update-lensglue') {
          let saveContract = await this.updateLensglueProtocol(message)
          let saveMessage = {}
          saveMessage.type = 'library'
          saveMessage.action = 'lensglue-contract'
          saveMessage.task = 'update-complete'
          saveMessage.data = saveContract
          this.liveLib.emit('libmessage', JSON.stringify(saveMessage))
        }
      }
    } else if (message.task.trim() === 'DEL') {
      if (message.privacy === 'private') {
        // convert hex key to binary
        let binKey = this.liveLib.convertHexToBinary(message.data)
        console.log(binKey)
        // private
        this.liveHolepunch.BeeData.deleteLensglue(binKey)
      } else if (message.privacy === 'public') {
        // public
        this.liveHolepunch.BeeData.deleteLensglue(binKey)
      }
    }
  }

  /**
   * first time formation of prime lifestory for bring to be biology contract
   * @method firstLensglue
  */
  firstLensglue = async function (message) {
    console.log('firstLensglue firs ever ever evet', message)
    let saveContract = await this.saveLensglueProtocol(message)
    let checkContract = await this.liveHolepunch.BeeData.getLensglue(saveContract.key)
    return checkContract
  }

  /**
  * save a lensglue contract
  * @method saveLensglueProtocol
  *
  */
  saveLensglueProtocol = async function (lsKey, saveData) {
    let formedContract = this.libComposer.liveLensglue.lensgluePrepare(lsKey, saveData)
    console.log('lensglue----------')
    console.log('formedContract', formedContract)
    await this.liveHolepunch.BeeData.saveLensglue(formedContract)
    let checkContract = await this.liveHolepunch.BeeData.getLensglue(formedContract.key)
    return checkContract
  }

  /**
  * update lensglue contract
  * @method updateLensglueProtocol
  *
  */
  updateLensglueProtocol = async function (updateData) {
    let formedContract = this.libComposer.liveLensglue.lensglueRelationships(updateData)
    let saveContract = await this.liveHolepunch.BeeData.saveLensglue(formedContract)
    return saveContract
  }

  /**
  * call back
  * @method callbackLensglueStart
  */
  callbackLensglueStart = function (data) {
    let lensglueData = {}
    lensglueData.type = 'library'
    lensglueData.action = 'life-strap'
    lensglueData.task = 'bringtobe-start'
    lensglueData.data = data
    this.emit('lifestrap-awaken', lensglueData)
  }

  /**
  * call back
  * @method callbackLensglue
  */
  callbackLensglue = function (data) {
    let lensglueData = {}
    lensglueData.type = 'peerlibrary'
    lensglueData.refcontract = 'lifestrap-new'
    lensglueData.data = data
    this.liveLib.emit('libmessage', JSON.stringify(lensglueData))
  }

}

export default LensGlue
'use strict'
/**
*  new, update, delete models contracts
*
*
* @class ModelContracts
* @package    network-library
* @copyright  Copyright (c) 2025 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import util from 'util'
import EventEmitter from 'events'

class ModelContracts extends EventEmitter {

  constructor(Lib, Holepunch, Composer) {
    super()
    this.liveHolepunch = Holepunch
    this.liveLib = Lib
    this.libComposer = Composer
  }

  /**
  * mange Model
  * @method modelManage
  *
  */
  modelManage = async function (message) {
    if (message.task.trim() === 'GET') {
      // public or private library?
      if (message.privacy === 'private') {
        let cuesLib = await this.liveHolepunch.BeeData.getModel(100)
        // this.callbackCuesLib(message.data, cuesLib)
      } else if (message.privacy === 'public') {
        if (message.reftype === 'start-Model') {
          // this.startCues()
        } else {
          let publibCues = await this.liveHolepunch.BeeData.saveModel(message.data)
          this.callbackModel(publibCues)
        }
      }
    } else if (message.task.trim() === 'PUT') {
      if (message.privacy === 'private') { 
        // pass to save manager, file details extract, prep contract
        // let saveFeedback = await this.saveCueManager(message)
        // this.emit('libmessage', JSON.stringify(saveFeedback))
      } else if (message.privacy === 'public') {
        // need check if composer needed to form contract and then save
        let saveContract = await this.saveModelProtocol(message)
        let saveMessage = {}
        saveMessage.type = 'library'
        saveMessage.action = 'model-contract'
        saveMessage.task = 'save-complete'
        saveMessage.data = saveContract
        this.liveLib.emit('libmessage', JSON.stringify(saveMessage))
      }
    } else if (message.task.trim() === 'UPDATE') {
      if (message.privacy === 'private') {
      } else if (message.privacy === 'public') {
        let saveContract = await this.updateModelProtocol(message)
        let saveMessage = {}
        saveMessage.type = 'library'
        saveMessage.action = 'model-contract'
        saveMessage.task = 'update-complete'
        saveMessage.data = saveContract
        this.liveLib.emit('libmessage', JSON.stringify(saveMessage))
      }
    } else if (message.task.trim() === 'DEL') {
      if (message.privacy === 'private') {
        // private
        let delFeedback = this.liveHolepunch.BeeData.deleteBentoModel(message.data)
      } else if (message.privacy === 'public') {
        // public
        let delFeedback = this.liveHolepunch.BeeData.deleteBentoModel(message.data)
      }
    }
  } 

  /**
  * save a Model
  * @method saveModelProtocol
  *
  */
  saveModelProtocol = async function (saveData) {
    let formedContract = this.libComposer.liveModel.modelPrepare(saveData)
    console.log('save contract model')
    console.log(formedContract)
    // console.log(util.inspect(formedContract, {showHidden: false, depth: null}))
    let saveContract = await this.liveHolepunch.BeeData.saveModel(formedContract)
    console.log('save contract model')
    console.log(saveContract)
    // format message for return
    let saveMessage = {}
    saveMessage.type = 'library'
    saveMessage.action = 'model-contract'
    saveMessage.task = 'save-complete'
    saveMessage.data = saveContract
    return saveMessage
  }

  /**
  * update cues relationship
  * @method updateCuesProtocol
  *
  */
  updateModelProtocol = async function (updateData) {
    console.log('right update structure ie contract')
    console.log(updateData)
    let contractUPdates = {}
    contractUPdates.id = updateData.data.key
    contractUPdates.data = updateData.data.value
    // console.log(util.inspect(formedContract, {showHidden: false, depth: null}))
    let saveContract = await this.liveHolepunch.BeeData.saveModel(contractUPdates)
    return saveContract
  }

}

export default ModelContracts
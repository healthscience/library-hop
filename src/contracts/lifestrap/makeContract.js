'use strict'
/**
*  new, update, delete lifestrap contracts
*
*
* @class LifestrapContracts
* @package    network-library
* @copyright  Copyright (c) 2024 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import util from 'util'
import EventEmitter from 'events'

class LifestrapContracts extends EventEmitter {

  constructor(Lib, Holepunch, Composer) {
    super()
    this.liveLib = Lib
    this.liveHolepunch = Holepunch
    this.libComposer = Composer
  }

  /**
  * mange lifestrap from bentoboxDS
  * @method lifestrapManage
  *
  */
  lifestrapManage = async function (message) {
    if (message.task.trim() === 'GET') {
      // public or private library?
      if (message.privacy === 'private') {
        let key = message.key || (message.data && message.data.key)
        // handle Buffer JSON representation
        if (key && key.type === 'Buffer' && Array.isArray(key.data)) {
          key = Buffer.from(key.data)
        }
        if (!key) {
          console.error('lifestrapManage: GET private lifestrap missing key in message', message)
          return
        }
        let lifestrapLib = await this.liveHolepunch.BeeData.getLifestrap(key)
        // this.callbackLifestrapLib(message.data, lifestrapLib)
      } else if (message.privacy === 'public') {
        if (message.reftype === 'start-lifestrap') {
          let lifestrapHistory = await this.liveHolepunch.BeeData.getLifestrapHistory('lifestrap')
          this.callbackLifestrapStart(lifestrapHistory)
        } else {
          let publibLifestrap = await this.liveHolepunch.BeeData.saveLifestrap(message.data)
          this.callbackLifestrap(publibLifestrap)
        }
      }
    } else if (message.task.trim() === 'PUT') {
      if (message.privacy === 'private') {
        // need to form contract and save to hypberbee
        let saveContract = await this.saveLifestrapProtocol(message)
        let saveMessage = {}
        saveMessage.type = 'library'
        saveMessage.action = 'lifestrap-genesis'
        saveMessage.task = 'save-complete'
        saveMessage.data = saveContract
        this.liveLib.emit('lifestrap-genesis', saveMessage)
        // pass to save manager, file details extract, prep contract
      } else if (message.privacy === 'public') {
        // need check if composer needed to form contract and then save
        let saveContract = await this.saveLifestrapProtocol(message)
        let saveMessage = {}
        saveMessage.type = 'library'
        saveMessage.action = 'lifestrap-contract'
        saveMessage.task = 'save-complete'
        saveMessage.data = saveContract
        this.liveLib.emit('libmessage', JSON.stringify(saveMessage))
      }
    } else if (message.task.trim() === 'UPDATE') {
      if (message.privacy === 'private') {
      } else if (message.privacy === 'public') {
        if (message.reftype === 'update-lifestrap') {
          let saveContract = await this.updateLifestrapProtocol(message)
          let saveMessage = {}
          saveMessage.type = 'library'
          saveMessage.action = 'lifestrap-contract'
          saveMessage.task = 'update-complete'
          saveMessage.data = saveContract
          this.liveLib.emit('libmessage', JSON.stringify(saveMessage))
        }
      }
    } else if (message.task.trim() === 'DEL') {
      if (message.privacy === 'private') {
        // convert hex key to binary
        let binKey = this.liveLib.convertHexToBinary(message.data)
        // private
        this.liveHolepunch.BeeData.deleteLifestrap(binKey)
      } else if (message.privacy === 'public') {
        // public
        this.liveHolepunch.BeeData.deleteLifestrap(binKey)
      }
    }
  }

  /**
   * first time formation of prime lifestory for bring to be biology contract
   * @method firstLifeStrap
  */
  seedLifeStrap = async function (message) {
    let saveContract = await this.saveLifestrapProtocol(message)
    let checkContract = await this.liveHolepunch.BeeData.getLifestrap(saveContract.key)
    return checkContract
  }

  /**
  * save a lifestrap contract
  * @method saveLifestrapProtocol
  *
  */
  saveLifestrapProtocol = async function (saveData) {
    let formedContract = this.libComposer.liveLifestrap.lifestrapPrepare(saveData)
    await this.liveHolepunch.BeeData.saveLifestrap(formedContract)
    
    let checkContract = await this.liveHolepunch.BeeData.getLifestrap(formedContract.hash)
    return checkContract
  }

  /**
  * update lifestrap contract
  * @method updateLifestrapProtocol
  *
  */
  updateLifestrapProtocol = async function (updateData) {
    let formedContract = this.libComposer.liveLifestrap.lifestrapRelationships(updateData)
    // formedContract is { lifestrapid, data }
    const wrapped = {
      key: formedContract.lifestrapid,
      contract: formedContract.data
    }
    let saveContract = await this.liveHolepunch.BeeData.saveLifestrap(wrapped)
    return saveContract
  }

  /**
  * call back
  * @method callbackLifestrapStart
  */
  callbackLifestrapStart = function (data) {
    let lifestrapData = {}
    lifestrapData.type = 'library'
    lifestrapData.action = 'life-strap'
    lifestrapData.task = 'bringtobe-start'
    lifestrapData.data = data
    this.emit('lifestrap-awaken', lifestrapData)
  }

  /**
  * call back
  * @method callbackLifestrap
  */
  callbackLifestrap = function (data) {
    let lifestrapData = {}
    lifestrapData.type = 'peerlibrary'
    lifestrapData.refcontract = 'lifestrap-new'
    lifestrapData.data = data
    this.liveLib.emit('libmessage', JSON.stringify(lifestrapData))
  }

}

export default LifestrapContracts

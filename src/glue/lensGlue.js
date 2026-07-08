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
        const key = message.key || (message.data && message.data.key)
        if (!key) {
          console.error('lensglueManage: GET private lensglue missing key in message', message)
          return
        }
        let lensGlueLib = await this.liveHolepunch.BeeData.getLensglue(key)
        // 
      } else if (message.privacy === 'public') {
        if (message.reftype === 'start-lensglue') {
          const lsKey = 'lensglue'
          let lensglueHistory = await this.liveHolepunch.BeeData.getLensglueHistory(lsKey)
          this.callbackLensglueStart(lensglueHistory)
        } else {
          let publibLensglue = await this.liveHolepunch.BeeData.saveLensglue(message.data)
          this.callbackLensglue(publibLensglue)
        }
      }
    } else if (message.task.trim() === 'PUT') {
      if (message.privacy === 'private') {
        // need to form contract and save to hypberbee
        const lsKey = message.lskey || (message.data && message.data.lskey)
        let saveContract = await this.saveLensglueProtocol(lsKey, message)
        let saveMessage = {}
        saveMessage.type = 'library'
        saveMessage.action = 'lensglue-genesis'
        saveMessage.task = 'save-complete'
        saveMessage.data = saveContract
        this.liveLib.emit('lensglue-genesis', saveMessage)
        // pass to save manager, file details extract, prep contract
      } else if (message.privacy === 'public') {
        // need check if composer needed to form contract and then save
        const lsKey = message.lskey || (message.data && message.data.lskey)
        let saveContract = await this.saveLensglueProtocol(lsKey, message)
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
    const lsKey = message.lskey || (message.data && message.data.lskey)
    let saveContract = await this.saveLensglueProtocol(lsKey, message)
    let checkContract = await this.liveHolepunch.BeeData.getLensglue(saveContract.contract.key)
    return checkContract
  }

  /**
  * save a lensglue contract
  * @method saveLensglueProtocol
  *
  */
  saveLensglueProtocol = async function (lsKey, saveData) {
    // 1. Prepare the contract and keys
    let formedContract = this.libComposer.liveLensglue.lensgluePrepare(lsKey, saveData)
    
    // 2. Save the Content (The Dictionary Entry)
    let saveContract = {
      hash: formedContract.contentKey,
      contract: formedContract.contract
    }
    await this.liveHolepunch.BeeData.saveLensglue(saveContract)
    let checkContract = await this.liveHolepunch.BeeData.getLensglue(saveContract.hash)
     
    // 3. Save the Stitch (The Relationship)
    // FIX: Use 'stitchHash' to match the return object
    let saveLSIndex = {
      hash: formedContract.stitchHash, 
      contract: formedContract.contract
    }
    
    // This was failing because saveLSIndex.key was undefined
    await this.liveHolepunch.BeeData.saveLensglue(saveLSIndex)
     let checkContractIndex = await this.liveHolepunch.BeeData.getLensglue(saveLSIndex.hash)
    
    return { index: checkContractIndex, contract: checkContract }
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
    lensglueData.type = 'bentobox'
    lensglueData.reftype = 'lensglue-history'
    lensglueData.action = 'start'
    lensglueData.data = data
    this.liveLib.emit('libmessage', JSON.stringify(lensglueData))
  }

  /**
  * call back
  * @method callbackLensglue
  */
  callbackLensglue = function (data) {
    let lensglueData = {}
    lensglueData.type = 'peerlibrary'
    lensglueData.refcontract = 'lensglue-new'
    lensglueData.data = data
    this.liveLib.emit('libmessage', JSON.stringify(lensglueData))
  }

}

export default LensGlue
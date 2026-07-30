'use strict'
/**
*  new, update, delete Overlay contracts
*
*
* @class OverlayContracts
* @package    network-library
* @copyright  Copyright (c) 2026 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import util from 'util'
import EventEmitter from 'events'

class OverlayContracts extends EventEmitter {

  constructor(Lib, Holepunch, Composer) {
    super()
    this.liveLib = Lib
    this.liveHolepunch = Holepunch
    this.libComposer = Composer
  }

  /**
  * mange Overlay from bentoboxDS
  * @method OverlayManage
  *
  */
  overlayManage = async function (message) {
    if (message.task.trim() === 'GET') {
      // public or private library?
      if (message.privacy === 'private') {
        const key = message.key || (message.data && message.data.key)
        if (!key) {
          console.error('OverlayManage: GET private Overlay missing key in message', message)
          return
        }
        let OverlayLib = await this.liveHolepunch.BeeData.getOverlay(key)
        // this.callbackOverlayLib(message.data, OverlayLib)
      } else if (message.privacy === 'public') {
        if (message.reftype === 'start-Overlay') {
          const lsKey = message.lskey || (message.data && message.data.lskey) || ''
          let OverlayHistory = await this.liveHolepunch.BeeData.getOverlayHistory(lsKey)
          this.callbackOverlayStart(OverlayHistory)
        } else {
          let publibOverlay = await this.liveHolepunch.BeeData.saveOverlay(message.data)
          this.callbackOverlay(publibOverlay)
        }
      }
    } else if (message.task.trim() === 'PUT') {
      if (message.privacy === 'private') { 
      } else if (message.privacy === 'public') {
        let saveContract = await this.saveOverlayProtocol(message)
        let saveMessage = {}
        saveMessage.type = 'library'
        saveMessage.action = 'overlay-contract'
        saveMessage.task = 'save-complete'
        saveMessage.data = saveContract
        this.liveLib.emit('libmessage', JSON.stringify(saveMessage))
      }
    } else if (message.task.trim() === 'DEL') {
      if (message.privacy === 'private') {
        let delFeedback = this.liveHolepunch.BeeData.deleteOverlay(message.data)
      } else if (message.privacy === 'public') {
        let delFeedback = this.liveHolepunch.BeeData.deleteOverlay(message.data)
      }
    }
  }  

  /**
  * save an Overlay contract
  * @method saveOverlayProtocol
  *
  */
  saveOverlayProtocol = async function (saveData) {
    let formedContract = this.libComposer.liveOverlay.overlayPrepare(saveData.data)
    let saveContract = await this.liveHolepunch.BeeData.saveOverlay(formedContract)
    let checkContract = await this.liveHolepunch.BeeData.getOverlay(formedContract.hash)
    return checkContract
  }

  /**
  * call back
  * @method callbackOverlayStart
  */
  callbackOverlayStart = function (data) {
    let OverlayReturn = {}
    OverlayReturn.type = 'bentobox'
    OverlayReturn.reftype = 'Overlay-history'
    OverlayReturn.action = 'start'
    OverlayReturn.data = data
    this.liveLib.emit('libmessage', JSON.stringify(OverlayReturn))
  }

  /**
  * call back
  * @method callbackOverlay
  */
  callbackOverlay = function (data) {
    let OverlayData = {}
    OverlayData.type = 'peerlibrary'
    OverlayData.refcontract = 'Overlay-new'
    OverlayData.data = data
    this.liveLib.emit('libmessage', JSON.stringify(OverlayData))
  }

}

export default OverlayContracts

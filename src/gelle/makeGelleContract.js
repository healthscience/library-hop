'use strict'
/**
*  new, update, delete gelle contracts
*
*
* @class GelleContracts
* @package    network-library
* @copyright  Copyright (c) 2024 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import util from 'util'
import EventEmitter from 'events'

class GelleContracts extends EventEmitter {

  constructor(Lib, Holepunch, Composer) {
    super()
    this.liveLib = Lib
    this.liveHolepunch = Holepunch
    this.libComposer = Composer
  }

  /**
  * mange gelle from bentoboxDS
  * @method gelleManage
  *
  */
  gelleManage = async function (message) {
    if (message.task.trim() === 'GET') {
      // public or private library?
      if (message.privacy === 'private') {
        let gelleLib = await this.liveHolepunch.BeeData.getGelle(100)
      } else if (message.privacy === 'public') {
        if (message.reftype === 'start-gelle') {
          let gelleHistory = await this.liveHolepunch.BeeData.getGelleHistory('')
          this.callbackGelleStart(gelleHistory)
        } else {
          let publibGelle = await this.liveHolepunch.BeeData.saveGelle(message.data)
          this.callbackgelle(publibGelle)
        }
      }
    } else if (message.task.trim() === 'PUT') {
      if (message.privacy === 'private') { 
      } else if (message.privacy === 'public') {
        let saveContract = await this.saveGelleProtocol(message)
        let saveMessage = {}
        saveMessage.type = 'library'
        saveMessage.action = 'gelle-contract'
        saveMessage.task = 'save-complete'
        saveMessage.data = saveContract
        this.liveLib.emit('libmessage', JSON.stringify(saveMessage))
      }
    } else if (message.task.trim() === 'DEL') {
      if (message.privacy === 'private') {
        let delFeedback = this.liveHolepunch.BeeData.deleteBentoGelle(message.data)
      } else if (message.privacy === 'public') {
        let delFeedback = this.liveHolepunch.BeeData.deleteBentoGelle(message.data)
      }
    }
  }  

  /**
  * save a gelle contract
  * @method saveGelleProtocol
  *
  */
  saveGelleProtocol = async function (saveData) {
    let formedContract = this.libComposer.liveGelle.gellePrepare(saveData)
    let saveContract = await this.liveHolepunch.BeeData.saveGelle(formedContract)
    return saveContract
  }

  /**
  * call back
  * @method callbackGelleStart
  */
  callbackGelleStart = function (data) {
    let gelleReturn = {}
    gelleReturn.type = 'bentobox'
    gelleReturn.reftype = 'gelle-history'
    gelleReturn.action = 'start'
    gelleReturn.data = data
    this.liveLib.emit('libmessage', JSON.stringify(gelleReturn))
  }

  /**
  * call back
  * @method callbackgelle
  */
  callbackgelle = function (data) {
    let gelleData = {}
    gelleData.type = 'peerlibrary'
    gelleData.refcontract = 'gelle-new'
    gelleData.data = data
    this.liveLib.emit('libmessage', JSON.stringify(gelleData))
  }

}

export default GelleContracts

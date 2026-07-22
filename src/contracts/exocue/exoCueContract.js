'use strict'
/**
*  new, update, delete ExoCue contracts
*
*
* @class ExoCueContracts
* @package    network-library
* @copyright  Copyright (c) 2024 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import util from 'util'
import EventEmitter from 'events'

class ExoCueContracts extends EventEmitter {

  constructor(Lib, Holepunch, Composer) {
    super()
    this.liveLib = Lib
    this.liveHolepunch = Holepunch
    this.libComposer = Composer
  }

  /**
  * mange ExoCue from bentoboxDS
  * @method ExoCueManage
  *
  */
  ExoCueManage = async function (message) {
    if (message.task.trim() === 'GET') {
      // public or private library?
      if (message.privacy === 'private') {
        const key = message.key || (message.data && message.data.key)
        if (!key) {
          console.error('ExoCueManage: GET private ExoCue missing key in message', message)
          return
        }
        let ExoCueLib = await this.liveHolepunch.BeeData.getExoCue(key)
        // this.callbackExoCueLib(message.data, ExoCueLib)
      } else if (message.privacy === 'public') {
        if (message.reftype === 'start-ExoCue') {
          const lsKey = message.lskey || (message.data && message.data.lskey) || ''
          let ExoCueHistory = await this.liveHolepunch.BeeData.getExoCueHistory(lsKey)
          this.callbackExoCueStart(ExoCueHistory)
        } else {
          let publibExoCue = await this.liveHolepunch.BeeData.saveExoCue(message.data)
          this.callbackExoCue(publibExoCue)
        }
      }
    } else if (message.task.trim() === 'PUT') {
      if (message.privacy === 'private') { 
      } else if (message.privacy === 'public') {
        let saveContract = await this.saveExoCueProtocol(message)
        let saveMessage = {}
        saveMessage.type = 'library'
        saveMessage.action = 'ExoCue-contract'
        saveMessage.task = 'save-complete'
        saveMessage.data = saveContract
        this.liveLib.emit('libmessage', JSON.stringify(saveMessage))
      }
    } else if (message.task.trim() === 'DEL') {
      if (message.privacy === 'private') {
        let delFeedback = this.liveHolepunch.BeeData.deleteExoCue(message.data)
      } else if (message.privacy === 'public') {
        let delFeedback = this.liveHolepunch.BeeData.deleteExoCue(message.data)
      }
    }
  }  

  /**
  * save an ExoCue contract
  * @method saveExoCueProtocol
  *
  */
  saveExoCueProtocol = async function (saveData) {
    let formedContract = this.libComposer.liveExoCue.ExoCuePrepare(saveData)
    let saveContract = await this.liveHolepunch.BeeData.saveExoCue(formedContract)
    return saveContract
  }

  /**
  * call back
  * @method callbackExoCueStart
  */
  callbackExoCueStart = function (data) {
    let ExoCueReturn = {}
    ExoCueReturn.type = 'bentobox'
    ExoCueReturn.reftype = 'ExoCue-history'
    ExoCueReturn.action = 'start'
    ExoCueReturn.data = data
    this.liveLib.emit('libmessage', JSON.stringify(ExoCueReturn))
  }

  /**
  * call back
  * @method callbackExoCue
  */
  callbackExoCue = function (data) {
    let ExoCueData = {}
    ExoCueData.type = 'peerlibrary'
    ExoCueData.refcontract = 'ExoCue-new'
    ExoCueData.data = data
    this.liveLib.emit('libmessage', JSON.stringify(ExoCueData))
  }

}

export default ExoCueContracts

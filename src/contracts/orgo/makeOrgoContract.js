'use strict'
/**
*  new, update, delete orgo contracts
*
*
* @class OrgoContracts
* @package    network-library
* @copyright  Copyright (c) 2024 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import util from 'util'
import EventEmitter from 'events'

class OrgoContracts extends EventEmitter {

  constructor(Lib, Holepunch, Composer) {
    super()
    this.liveLib = Lib
    this.liveHolepunch = Holepunch
    this.libComposer = Composer
  }

  /**
  * mange orgo from bentoboxDS
  * @method orgoManage
  *
  */
  orgoManage = async function (message) {
    if (message.task.trim() === 'GET') {
      // public or private library?
      if (message.privacy === 'private') {
        const key = message.key || (message.data && message.data.key)
        if (!key) {
          console.error('orgoManage: GET private orgo missing key in message', message)
          return
        }
        let orgoLib = await this.liveHolepunch.BeeData.getOrgo(key)
        // this.callbackOrgoLib(message.data, orgoLib)
      } else if (message.privacy === 'public') {
        if (message.reftype === 'start-orgo') {
          const lsKey = message.lskey || (message.data && message.data.lskey) || ''
          let orgoHistory = await this.liveHolepunch.BeeData.getOrgoHistory(lsKey)
          this.callbackOrgoStart(orgoHistory)
        } else {
          let publibOrgo = await this.liveHolepunch.BeeData.saveOrgo(message.data)
          this.callbackorgo(publibOrgo)
        }
      }
    } else if (message.task.trim() === 'PUT') {
      if (message.privacy === 'private') { 
      } else if (message.privacy === 'public') {
        let saveContract = await this.saveOrgoProtocol(message)
        let saveMessage = {}
        saveMessage.type = 'library'
        saveMessage.action = 'orgo-contract'
        saveMessage.task = 'save-complete'
        saveMessage.data = saveContract
        this.liveLib.emit('libmessage', JSON.stringify(saveMessage))
      }
    } else if (message.task.trim() === 'DEL') {
      if (message.privacy === 'private') {
        let delFeedback = this.liveHolepunch.BeeData.deleteOrgo(message.data)
      } else if (message.privacy === 'public') {
        let delFeedback = this.liveHolepunch.BeeData.deleteOrgo(message.data)
      }
    }
  }  

  /**
  * save an orgo contract
  * @method saveOrgoProtocol
  *
  */
  saveOrgoProtocol = async function (saveData) {
    let formedContract = this.libComposer.liveOrgo.orgoComposer(saveData.data)
    console.log('formed orgo contract')
    console.log(formedContract)
    await this.liveHolepunch.BeeData.saveOrgo(formedContract)
    let checkContract = await this.liveHolepunch.BeeData.getOrgo(formedContract.hash)
    console.log(checkContract)
    return checkContract
  }

  /**
  * call back
  * @method callbackOrgoStart
  */
  callbackOrgoStart = function (data) {
    let orgoReturn = {}
    orgoReturn.type = 'bentobox'
    orgoReturn.reftype = 'orgo-history'
    orgoReturn.action = 'start'
    orgoReturn.data = data
    this.liveLib.emit('libmessage', JSON.stringify(orgoReturn))
  }

  /**
  * call back
  * @method callbackorgo
  */
  callbackorgo = function (data) {
    let orgoData = {}
    orgoData.type = 'peerlibrary'
    orgoData.refcontract = 'orgo-new'
    orgoData.data = data
    this.liveLib.emit('libmessage', JSON.stringify(orgoData))
  }

}

export default OrgoContracts

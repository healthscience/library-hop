'use strict'
/**
*  new, update, delete besearch cycle
*
*
* @class BesearchContracts
* @package    network-library
* @copyright  Copyright (c) 2025 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import util from 'util'
import EventEmitter from 'events'
import hashObject from 'object-hash'

class BesearchContracts extends EventEmitter {

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
  * mange besearch
  * @method besearchManage
  *
  */
  besearchManage = async function (message) {
    if (message.task.trim() === 'GET') {
      // public or private library?
      if (message.privacy === 'private') {
        let cuesLib = await this.liveHolepunch.BeeData.getBesearch(100)
        // this.callbackCuesLib(message.data, cuesLib)
      } else if (message.privacy === 'public') {
        if (message.reftype === 'start-besearch') {
          // this.startCues()
        } else {
          let publibCues = await this.liveHolepunch.BeeData.saveBesearch(message.data)
          // this.callbackresearch(publibCues)
        }
      }
    } else if (message.task.trim() === 'PUT') {
      console.log('besearch put')
      console.log(message)
      if (message.privacy === 'private') { 
        // pass to save manager, file details extract, prep contract
        let saveContract = await this.saveBesearchProtocol(message)
        let saveMessage = {}
        saveMessage.type = 'library'
        saveMessage.action = 'besearch-contract'
        saveMessage.task = 'save-complete'
        saveMessage.data = saveContract
        this.liveLib.emit('libmessage', JSON.stringify(saveMessage))
      } else if (message.privacy === 'public') {
        // need check if composer needed to form contract and then save

      }
    } else if (message.task.trim() === 'DEL') {
      if (message.privacy === 'private') {
        // private
        this.liveHolepunch.BeeData.deleteBentoBesearch(message.data)
      } else if (message.privacy === 'public') {
        // public
        this.liveHolepunch.BeeData.deleteBentoBesearch(message.data)
      }
    }
  } 

  /**
  * save a research
  * @method saveBesearchProtocol
  *
  */
  saveBesearchProtocol = async function (saveData) {
    let formedContract = {}
    formedContract.id = hashObject(saveData.data)
    formedContract.data = saveData.data // verified at source? //this.libComposer.liveResearch.besearchPrepare(saveData)
    // console.log(util.inspect(formedContract, {showHidden: false, depth: null}))
    let saveContract = await this.liveHolepunch.BeeData.saveBesearch(formedContract)
    // format message for return
    let saveMessage = {}
    saveMessage.type = 'library'
    saveMessage.action = 'besearch-contract'
    saveMessage.task = 'save-complete'
    saveMessage.data = saveContract
    return saveMessage
  }
}

export default BesearchContracts
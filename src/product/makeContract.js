'use strict'
/**
*  new, update, delete cues contracts
*
*
* @class ProductContracts
* @package    network-library
* @copyright  Copyright (c) 2024 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import util from 'util'
import EventEmitter from 'events'

class ProductContracts extends EventEmitter {

  constructor(Holepunch, Composer) {
    super()
    this.liveHolepunch = Holepunch
    this.libComposer = Composer
  }


  /**
  * 
  * @method 
  *
  */
  getProduct = function (path, action, data) {

  }

  /**
  * mange product
  * @method productManage
  *
  */
  productManage = async function (message) {
    console.log('roduct managee  coalllel')
    // this.liveHolepunch.BeeData.deleteBentoProduct( { id: 'c41cc35667b178a6a1d3c16c902f82d5eb4f0156' }) // 0123456543210 fae3af569da1ab45d90aa52f383103464a401d1e 6ca66cf745bbb8bce3092991b1e184428b6d7a8b c41cc35667b178a6a1d3c16c902f82d5eb4f0156
    if (message.task.trim() === 'GET') {
      // public or private library?
      if (message.privacy === 'private') {
        let cuesLib = await this.liveHolepunch.BeeData.getProduct(100)
        // this.callbackCuesLib(message.data, cuesLib)
      } else if (message.privacy === 'public') {
        if (message.reftype === 'start-produt') {
          // this.startCues()
        } else {
          let publibCues = await this.liveHolepunch.BeeData.saveProduct(message.data)
          this.callbackmedia(publibCues)
        }
      }
    } else if (message.task.trim() === 'PUT') {
      if (message.privacy === 'private') { 
        // pass to save manager, file details extract, prep contract
        // let saveFeedback = await this.saver(message)
        // this.emit('libmessage', JSON.stringify(saveFeedback))
      } else if (message.privacy === 'public') {
        // need check if composer needed to form contract and then save
        let saveContract = await this.saveProductProtocol(message)
        let saveMessage = {}
        saveMessage.type = 'library'
        saveMessage.action = 'product-contract'
        saveMessage.task = 'save-complete'
        saveMessage.data = saveContract
        this.emit('libmessage', JSON.stringify(saveMessage))
      }
    } else if (message.task.trim() === 'DEL') {
      if (message.privacy === 'private') {
        // private
        let delFeedback = this.liveHolepunch.BeeData.deleteBentoProduct(message.data)
      } else if (message.privacy === 'public') {
        // public
        let delFeedback = this.liveHolepunch.BeeData.deleteBentoProduct(message.data)
      }
    }
  }

  /**
  * save a cues wheel
  * @method saveProductProtocol
  *
  */
  saveProductProtocol = async function (saveData) {
    let formedContract = this.libComposer.liveProduct.productPrepare(saveData)
    // console.log(util.inspect(formedContract, {showHidden: false, depth: null}))
    let saveContract = await this.liveHolepunch.BeeData.saveProduct(formedContract)
    // format message for return
    let saveMessage = {}
    saveMessage.type = 'library'
    saveMessage.action = 'product-contract'
    saveMessage.task = 'save-complete'
    saveMessage.data = saveContract
    return saveMessage
  }

}

export default ProductContracts
'use strict'
/**
*  new, update, delete peers account network
*
*
* @class PeerNetwork
* @package    network-library
* @copyright  Copyright (c) 2025 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import util from 'util'
import EventEmitter from 'events'

class PeerNetwork extends EventEmitter {

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
  getPeers = function (path, action, data) {

  }

  /**
  * mange account queries
  * @method accountManage
  *
  */
  accountManage = async function (message) {
    if (message.task.trim() === 'GET') {
      // public or private library?
      if (message.privacy === 'private') {
        let cuesLib = await this.liveHolepunch.BeeData.getPeer(100)
        // this.callbackCuesLib(message.data, cuesLib)
      } else if (message.privacy === 'public') {
        if (message.reftype === 'start-marker') {
          // this.startCues()
        } else {
          // let publibCues = await this.+++(message.data)
          // this.callback+++(publibCues)
        }
      }
    } else if (message.task.trim() === 'PUT') {
      if (message.privacy === 'private') { 
        // save relationship
        let saveContract = await this.savePeerProtocol(message.data)
        let saveMessage = {}
        saveMessage.type = 'account'
        saveMessage.action = 'peer-new-relationship'
        saveMessage.task = 'save-complete'
        saveMessage.data = saveContract
        // emits back to HOP library level - inform beebee saved
        this.liveLib.emit('libmessage', JSON.stringify(saveMessage))
        // if first time warm peer then complete that connection flow
        this.liveLib.emit('complete-warmpeer', saveContract.data.key)
      } else if (message.privacy === 'public') {
        // need check if composer needed to form contract and then save

      }
    } else if (message.task.trim() === 'DEL') {
      if (message.privacy === 'private') {
        // private
        let delFeedback = this.liveHolepunch.BeeData.deletePeer(message.data.key)
      } else if (message.privacy === 'public') {
        // public
        let delFeedback = this.liveHolepunch.BeeData.deletePeer(message.data.key)
      }
    } else if (message.task.trim() === 'UPDATE') {
      if (message.privacy === 'private') {
        if (message.reftype === "new-peer-topic") {
          // look up existing peer contract and add topic and make settop to true
          let publickey = ''
          let setTopic = false
          if (message.data.prime === true) {
            publickey = message.data.codename.data.publickey
            setTopic = true
          } else {
            publickey = message.data.publickey
          }
          let peerContract = await this.liveHolepunch.BeeData.getPeer(publickey)
          let peerPair = {}
          peerPair.publickey = peerContract.key
          peerPair.name = peerContract.value.name
          peerPair.longterm = peerContract.value.longterm
          peerPair.topic = message.data.topic
          peerPair.settopic = setTopic
          peerPair.live = false
          peerPair.livePeerkey = ''
          let updatePeer = await this.liveHolepunch.BeeData.savePeer(peerPair)
          // need to inform beebee
          updatePeer.value.live = true
          this.liveLib.emit('complete-topic-save', updatePeer)
          // need to infom, peer setting topic is live?
        } else if (message.reftype === "update-peer-name") {
          let publicKey = message.data.peerkey
          let peerContract = await this.liveHolepunch.BeeData.getPeer(publicKey)
          let peerPair = {}
          peerPair.publickey = peerContract.key
          peerPair.name = message.data.name
          peerPair.longterm = peerContract.value.longterm
          peerPair.topic = peerContract.value.topic
          peerPair.settopic = peerContract.value.settopic
          peerPair.live = false
          peerPair.livePeerkey = ''
          let updatePeer = await this.liveHolepunch.BeeData.savePeer(peerPair)
          this.liveLib.emit('complete-name-updatesave', updatePeer)
        }
      }
    }
  }

  /**
  * save a new peer to network
  * @method savePeerProtocol
  *
  */
  savePeerProtocol = async function (saveData) {
    // let formedContract = this.libComposer.livePeer.peerPrepare(saveData)
    // console.log(util.inspect(formedContract, {showHidden: false, depth: null}))
    let saveContract = await this.liveHolepunch.BeeData.savePeer(saveData)
    // format message for return
    let saveMessage = {}
    saveMessage.type = 'library'
    saveMessage.action = 'peer-relationship'
    saveMessage.task = 'save-complete'
    saveMessage.data = saveContract
    return saveMessage
  }

}

export default PeerNetwork
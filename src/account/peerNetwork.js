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
import { settings } from 'cluster'

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
      console.log('PUT Peer contract FIRST----------FIRST')
      if (message.privacy === 'private') { 
        // save relationship
        let saveContract = await this.savePeerProtocol(message.data)
        console.log('FIRT SAVE COMPLETE-------')
        // set warm peers list to keep track
        this.liveLib.emit('set-warmpeer', saveContract)
        let saveMessage = {}
        saveMessage.type = 'account'
        saveMessage.action = 'peer-new-relationship'
        saveMessage.task = 'save-complete'
        saveMessage.data = saveContract.data
        // emits back to HOP library level - inform beebee saved
        this.liveLib.emit('libmessage', JSON.stringify(saveMessage))
        // if first time warm peer then complete that connection flow
        this.liveLib.emit('complete-warmpeer', saveContract.data.key)
      } else if (message.privacy === 'public') {
        // need check if composer needed to form contract and then save

      }
    } else if (message.task.trim() === 'DEL') {
      let buffKey = Buffer.from(message.data.key, 'hex')
      if (message.privacy === 'private') {
        // private
        let delFeedback = this.liveHolepunch.BeeData.deletePeer(buffKey)
      } else if (message.privacy === 'public') {
        // public
        let delFeedback = this.liveHolepunch.BeeData.deletePeer(buffKey)
      }
    } else if (message.task.trim() === 'UPDATE') {
      console.log('=======UPDATE----UPDATE---- SAVE of peerContract===========')
      if (message.privacy === 'private') {
        if (message.reftype === "new-peer-topic") {
          console.log('UPDATE------NEW TOPIC===================')
          console.log(message)
          // look up existing peer contract and add topic and make settop to true
          let publickey = ''
          let setTopic = false
          if (message.data.prime === true) {
            publickey = message.data.peercontract
            setTopic = true
          } else {
            publickey = message.data.publickey
          }
          console.log('public key=======')
          console.log(publickey)
          let peerContract = {}
          if (setTopic === true) {
            // need to look at warm peer and match to live public key to get  peer contract key
            let peerMatchUp = Buffer.from(publickey, 'hex')
            peerContract = await this.liveHolepunch.BeeData.getPeer(peerMatchUp)
          } else {
            let peerMatchUp = this.liveHolepunch.matchWarmSaveLiveKey(publickey)
            peerContract = peerMatchUp
          }
          console.log('peer contract')
          console.log(peerContract)
          let peerPair = {}
          peerPair.publickey = peerContract.key
          peerPair.name = peerContract.value.concept.name
          peerPair.longterm = peerContract.value.concept.longterm
          peerPair.topic = message.data.topic
          peerPair.settopic = setTopic
          peerPair.live = false
          peerPair.livePeerkey = ''
          let updatePeer = await this.updatePeerProtocol(peerPair, peerContract)
          // new get the peer to check
          // turn key to buffer
          let keyBuff =  Buffer.from(peerContract.key, 'hex')
          let checkUpdatePeer = await this.liveHolepunch.BeeData.getPeer(keyBuff)
          console.log('NEW TOPIC ___SAVE___OVER')
          // need to inform beebee peer is live and topic is set.
          checkUpdatePeer.value.concept.live = true
          this.liveLib.emit('complete-topic-save', checkUpdatePeer)
          // need to infom, peer setting topic is live?
        } else if (message.reftype === "update-peer-name") {
          console.log('UPDATE-------PEER NAME----')
          const publicKey = Buffer.from(message.data.contractKey, 'hex')
          let peerContract = await this.liveHolepunch.BeeData.getPeer(publicKey)
          let peerPair = {}
          peerPair.publickey = peerContract.key.toString('hex')
          peerPair.name = message.data.name
          peerPair.longterm = peerContract.value.concept.longterm
          peerPair.topic = peerContract.value.concept.topic
          peerPair.settopic = peerContract.value.concept.settopic
          peerPair.live = false
          peerPair.livePeerkey = ''
          // need to go through formal update protocol
          let updatePeer = await this.updatePeerNameProtocol(peerPair, peerContract) // await this.liveHolepunch.BeeData.savePeer(peerPair)
          let checkUpdatePeer = await this.liveHolepunch.BeeData.getPeer(updatePeer.hash)
          console.log('UPATE NAME------- SAVED ------ COMPLETE')
          // complete peer contract save with topic already generated
          this.liveLib.emit('complete-peer-contract', checkUpdatePeer)
          // inform beebee bentoboxds
          this.liveLib.emit('complete-name-updatesave', checkUpdatePeer)

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
    let formedContract = this.libComposer.livePeer.peerPrepare('hopeer', saveData)
    // console.log(util.inspect(formedContract, {showHidden: false, depth: null}))
    await this.liveHolepunch.BeeData.savePeer(formedContract)
    let checkContract = await this.liveHolepunch.BeeData.getPeer(formedContract.hash)
    // change key from buffer to hex
    let hexKey = checkContract.key.toString('hex')
    checkContract.key = hexKey
    // format message for return
    let saveMessage = {}
    saveMessage.type = 'library'
    saveMessage.action = 'peer-relationship'
    saveMessage.task = 'save-complete'
    saveMessage.data = checkContract
    return saveMessage
  }

  /**
   * 
   * @method updatePeerProtocol
  */
  updatePeerProtocol = async function (peerUpate, peerContract) {
    let updateContract = this.libComposer.livePeer.updatePreparePeer(peerUpate, peerContract)
    console.log('topic contract prepared  TOPIC ready?????')
    console.log(updateContract)
    await this.liveHolepunch.BeeData.savePeer(updateContract)
    return true
  }

  /**
   * 
   * @method updatePeerNameProtocol
  */
  updatePeerNameProtocol = async function (peerUpate, peerContract) {
    console.log('peer update PROTOCOL')
    console.log(peerUpate)
    console.log(peerContract)
    let updateContract = this.libComposer.livePeer.updatePrepareNamePeer(peerUpate, peerContract)
    await this.liveHolepunch.BeeData.savePeer(updateContract)
    return updateContract
  }

}

export default PeerNetwork

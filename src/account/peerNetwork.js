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
  * manage account queries
  * @method accountManage
  *
  */
  accountManage = async function (message) {
    if (message.task.trim() === 'GET') {
      // public or private library?
      if (message.privacy === 'private') {
        let cuesLib = await this.liveHolepunch.BeeData.getPeer(100)
      } else if (message.privacy === 'public') {
        if (message.reftype === 'start-marker') {
          // this.startCues()
        } else {
          // let publibCues = await this.+++(message.data)
        }
      }
    } else if (message.task.trim() === 'PUT') {
      if (message.privacy === 'private') {
        // save relationship
        let saveContract = await this.savePeerProtocol(message.data)
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
        this.liveLib.emit('complete-warmpeer', saveContract)
      } else if (message.privacy === 'public') {
        // need check if composer needed to form contract and then save
      }
    } else if (message.task.trim() === 'DEL') {
      let buffKey = Buffer.isBuffer(message.data.key) ? message.data.key : Buffer.from(message.data.key, 'hex')
      if (message.privacy === 'private') {
        let delFeedback = this.liveHolepunch.BeeData.deletePeer(buffKey)
      } else if (message.privacy === 'public') {
        let delFeedback = this.liveHolepunch.BeeData.deletePeer(buffKey)
      }
} else if (message.task.trim() === 'UPDATE') {

      if (message.privacy === 'private') {
        if (message.reftype === "new-peer-topic") {
          let publickey = ''
          let setTopic = false
          if (message.data.prime === true) {
            publickey = message.data.peercontract
            setTopic = true
          } else {
            publickey = message.data.publickey
          }

          let peerContract = null
          if (setTopic === true) {
            let peerMatchUp = Buffer.isBuffer(publickey) ? publickey : Buffer.from(publickey, 'hex')
            peerContract = await this.liveHolepunch.BeeData.getPeer(peerMatchUp)
          } else {
            peerContract = this.liveHolepunch.matchWarmSaveLiveKey(publickey)
          }

          if (!peerContract || !peerContract.value || !peerContract.value.concept) {
            return
          }

          const existingConcept = peerContract.value.concept

          // STATE GUARD: Exit immediately if contract already has matching topic, settopic, and live state
          if (
            existingConcept.topic === message.data.topic &&
            existingConcept.settopic === setTopic &&
            existingConcept.live === true
          ) {
            return
          }

          let peerPair = {
            publickey: Buffer.isBuffer(peerContract.key) ? peerContract.key.toString('hex') : peerContract.key,
            name: existingConcept.name,
            longterm: existingConcept.longterm,
            topic: message.data.topic,
            settopic: setTopic,
            live: false,
            livePeerkey: ''
          }

          await this.updatePeerProtocol(peerPair, peerContract)

          let keyBuff = Buffer.isBuffer(peerContract.key) ? peerContract.key : Buffer.from(peerContract.key, 'hex')
          let checkUpdatePeer = await this.liveHolepunch.BeeData.getPeer(keyBuff)

          checkUpdatePeer.value.concept.live = true
          this.liveLib.emit('complete-topic-save', checkUpdatePeer)

        } else if (message.reftype === "update-peer-name") {
          const rawContractKey = message.data.contractKey

          let updatePeer = await this.updatePeerNameProtocol(peerPair, peerContract)
          let checkUpdatePeer = await this.liveHolepunch.BeeData.getPeer(updatePeer.hash)

          this.liveLib.emit('complete-peer-contract', checkUpdatePeer || updatePeer)
          this.liveLib.emit('complete-name-updatesave', checkUpdatePeer || updatePeer)
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
    console.log('LIB-HOP  save PPER PROTOCOL')
    let formedContract = this.libComposer.livePeer.peerPrepare('hopeer', saveData.data)
    await this.liveHolepunch.BeeData.savePeer(formedContract)
    let checkContract = await this.liveHolepunch.BeeData.getPeer(formedContract.hash)

    let hexKey = Buffer.isBuffer(checkContract.key) ? checkContract.key.toString('hex') : checkContract.key
    checkContract.key = hexKey

    let saveMessage = {
      type: 'library',
      action: 'peer-relationship',
      task: 'save-complete',
      data: checkContract
    }
    return saveMessage
  }

  /**
   * 
   * @method updatePeerProtocol
  */
  updatePeerProtocol = async function (peerUpdate, peerContract) {
    let updateContract = this.libComposer.livePeer.updatePreparePeer(peerUpdate, peerContract)
    await this.liveHolepunch.BeeData.savePeer(updateContract)

    // Sync in-memory warmPeers array
    const targetKey = Buffer.isBuffer(updateContract.hash) ? updateContract.hash.toString('hex') : updateContract.hash
    const existing = this.liveHolepunch.matchWarmSaveKey(targetKey)
    
    if (existing) {
      existing.value.concept.topic = peerUpdate.topic
      existing.value.concept.settopic = peerUpdate.settopic
      existing.value.concept.name = peerUpdate.name
    }
    return true
  }

/**
   * 
   * @method updatePeerNameProtocol
  */
  updatePeerNameProtocol = async function (peerUpate, peerContract) {
    let updateContract = this.libComposer.livePeer.updatePrepareNamePeer(peerUpate, peerContract)
    await this.liveHolepunch.BeeData.savePeer(updateContract)

    // Keep RAM warmPeers map in sync with updated contract name
    const targetKey = Buffer.isBuffer(updateContract.hash) ? updateContract.hash.toString('hex') : updateContract.hash
    const existingHash = this.liveHolepunch.matchWarmSaveKey(targetKey)
    if (existingHash && existingHash.value && existingHash.value.concept) {
      existingHash.value.concept.name = peerUpate.name
    }

    const existingPubKey = this.liveHolepunch.matchWarmSaveKey(peerUpate.publickey)
    if (existingPubKey && existingPubKey.value && existingPubKey.value.concept) {
      existingPubKey.value.concept.name = peerUpate.name
    }

    return updateContract
  }

}

export default PeerNetwork
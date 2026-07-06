'use strict'
/**
*  new, update, delete cues contracts
*
*
* @class ChatContracts
* @package    network-library
* @copyright  Copyright (c) 2024 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import util from 'util'
import EventEmitter from 'events'

class ChatContracts extends EventEmitter {

  constructor(Lib, Holepunch, Composer, HOPcrypto) {
    super()
    this.liveLib = Lib
    this.liveHolepunch = Holepunch
    this.libComposer = Composer
    this.cryptoLive = HOPcrypto
  }

  /**
  * mange chat dialogue from bentoboxDS
  * @method dialogueManage
  *
  */
  dialogueManage = async function (message) {
    if (message.task.trim() === 'GET') {
      // public or private library?
      if (message.privacy === 'private') {
        let dialogueLib = await this.liveHolepunch.BeeData.getDialogueChat(100)
        // this.callbackDialogueLib(message.data, dialogueLib)
      } else if (message.privacy === 'public') {
        if (message.reftype === 'start-dialogue') {
          let dialogueHistory = await this.liveHolepunch.BeeData.getDialoguechatHistory('')
          this.callbackDialogueStart(dialogueHistory)
        } else {
          let publibDialogue = await this.liveHolepunch.BeeData.saveDialoguechat(message.data)
          this.callbackDialoguechat(publibDialogue)
        }
      }
    } else if (message.task.trim() === 'PUT') {
      if (message.privacy === 'private') { 
        let saveContract = await this.saveDialogueProtocol(message.data)
        let saveMessage = {}
        saveMessage.type = 'library'
        saveMessage.action = 'dialogue-contract'
        saveMessage.task = 'save-complete'
        saveMessage.data = saveContract
        this.liveLib.emit('libmessage', JSON.stringify(saveMessage))
      } else if (message.privacy === 'public') {
        // need check if composer needed to form contract and then save
        let saveContract = await this.saveDialogueProtocol(message.data)
        let saveMessage = {}
        saveMessage.type = 'library'
        saveMessage.action = 'dialogue-contract'
        saveMessage.task = 'save-complete'
        saveMessage.data = saveContract
        this.liveLib.emit('libmessage', JSON.stringify(saveMessage))
      }
    } else if (message.task.trim() === 'UPDATE') {
      if (message.privacy === 'private') {
      } else if (message.privacy === 'public') {
        if (message.reftype === 'update-dialogue') {
          let saveContract = await this.updateDialogueTimestamp(message)
          let saveMessage = {}
          saveMessage.type = 'library'
          saveMessage.action = 'dialogue-contract'
          saveMessage.task = 'update-complete-timestamp'
          saveMessage.data = saveContract
          this.liveLib.emit('libmessage', JSON.stringify(saveMessage))          
        } else {
          let saveContract = await this.updateDialogueProtocol(message)
          let saveMessage = {}
          saveMessage.type = 'library'
          saveMessage.action = 'dialogue-contract'
          saveMessage.task = 'update-complete'
          saveMessage.data = saveContract
          this.liveLib.emit('libmessage', JSON.stringify(saveMessage))
        }
      }
    } else if (message.task.trim() === 'DEL') {
      if (message.privacy === 'private') {
        // private
        let delFeedback = this.liveHolepunch.BeeData.deleteBentoDialogue(message.data)
      } else if (message.privacy === 'public') {
        // public
        let delFeedback = this.liveHolepunch.BeeData.deleteBentoDialogue(message.data)
      }
    } else if (message.task.trim() === 'SYNC') {
      if (message.reftype === 'dialogue-gaia') {
        this.syncGAIA()
      } else if (message.reftype === 'dialogue-custom') {

      }

    }
  }  

  /**
  * save a dialogue wheel
  * @method saveDialogueProtocol
  *
  */
  saveDialogueProtocol = async function (saveData) {
    const lsKey = 'chat'
    let formedContract = this.prepareChat(saveData) // this.libComposer.dialogueComposer(lsKey, saveData.data)
    // let saveContract = await this.liveHolepunch.BeeData.saveDialoguechat(formedContract)

    // let checkContract = await this.liveHolepunch.BeeData.getDialoguechat(formedContract.hash)
    // return checkContract
    return formedContract
  }
  
  /**
  * update Dialogue relationship
  * @method updateDialogueProtocol
  *
  */
  updateDialogueProtocol = async function (updateData) {
    let formedContract = this.libComposer.liveCues.dialogueRelationships(updateData)
    // console.log(util.inspect(formedContract, {showHidden: false, depth: null}))
    let saveContract = await this.liveHolepunch.BeeData.saveDialoguechat(formedContract)

    let checkContract = await this.liveHolepunch.BeeData.getDialoguechat(formedContract.hash)
    return checkContract
  }

  /**
  *
  * @method prepareChat
  */
  prepareChat = async function (chatItem) {
    // form key for storage
    // lifestrap id and cueID in first time is the chat hash of the message
    // 1. Content Hash (The 'What')
    const contentHash = '#' // hopCrypto.hash(chatItem);
    let heliStamp = 0

    // key will be lifestrap story or cue id
    const pureHashBuffer = Buffer.from(chatItem.chatid, 'hex').subarray(10);
    // 2. The Storage Address (lifestrap!HASH)
    const storageKey = this.cryptoLive.createPrefixedKey('chat', pureHashBuffer);

    // form save structure
    let saveChatItem = {}
    saveChatItem.hash = storageKey
    saveChatItem.contract = chatItem.dialogue
    await this.liveHolepunch.BeeData.saveDialoguechat(saveChatItem)
    // retrieve the chat item and return to beebee
    let chatItemCheck = await this.liveHolepunch.BeeData.getDialoguechat(storageKey)


    let keyIndex =
    {
      id: storageKey, // USE THIS FOR STITCHING
      hash: storageKey,   // USE THIS FOR SAVING THE ROOT
      contract: chatItemCheck
    };

    this.callbackDialoguechat(chatItemCheck)
  }

  /**
  * call back
  * @method callbackDialoguechat
  */
  callbackDialoguechat = function (data) {
    // pass to sort data into ref contract types
    let bentoboxReturn = {}
    bentoboxReturn.type = 'chat'
    bentoboxReturn.action = 'save'
    bentoboxReturn.reftype = 'chat-history-item'
    bentoboxReturn.data = data
    this.liveLib.emit('libmessage', JSON.stringify(bentoboxReturn))
  }


}

export default ChatContracts
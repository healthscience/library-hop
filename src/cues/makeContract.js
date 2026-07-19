'use strict'
/**
*  new, update, delete cues contracts
*
*
* @class CuesContracts
* @package    network-library
* @copyright  Copyright (c) 2024 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
// import util from 'util'
import EventEmitter from 'events'

class CuesContracts extends EventEmitter {

  constructor(Lib, Holepunch, Composer) {
    super()
    this.liveLib = Lib
    this.liveHolepunch = Holepunch
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
  * mange cues from bentoboxDS
  * @method cueManage
  *
  */
  cueManage = async function (message) {
    if (message.task.trim() === 'GET') {
      // public or private library?
      if (message.privacy === 'private') {
        let cuesLib = await this.liveHolepunch.BeeData.getCues(100)
        // this.callbackCuesLib(message.data, cuesLib)
      } else if (message.privacy === 'public') {
        if (message.reftype === 'start-cues') {
          let cuesHistory = await this.liveHolepunch.BeeData.getCuesHistory('')
          this.callbackCuesStart(cuesHistory)
        } else {
          let publibCues = await this.liveHolepunch.BeeData.saveCues(message.data)
          this.callbackcues(publibCues)
        }
      }
    } else if (message.task.trim() === 'RELATIONSHIP') {
      let relSet = await this.relationshipProtocol(message)
    } else if (message.task.trim() === 'PUT') {
      if (message.privacy === 'private') { 
        // pass to save manager, file details extract, prep contract
        // let saveFeedback = await this.saveCueManager(message)
        // this.emit('libmessage', JSON.stringify(saveFeedback))
      } else if (message.privacy === 'public') {
        // need check if composer needed to form contract and then save
        let saveContract = await this.saveCuesProtocol(message)
        let saveMessage = {}
        saveMessage.type = 'library'
        saveMessage.action = 'cue-contract'
        saveMessage.task = 'save-complete'
        saveMessage.data = saveContract
        this.liveLib.emit('libmessage', JSON.stringify(saveMessage))
      }
    } else if (message.task.trim() === 'UPDATE') {
      if (message.privacy === 'private') {
      } else if (message.privacy === 'public') {
        if (message.reftype === 'update-cues') {
          let saveContract = await this.updateCuesTimestamp(message)
          let saveMessage = {}
          saveMessage.type = 'library'
          saveMessage.action = 'cue-contract'
          saveMessage.task = 'update-complete-timestamp'
          saveMessage.data = saveContract
          this.liveLib.emit('libmessage', JSON.stringify(saveMessage))          
        } else {
          let saveContract = await this.updateCuesProtocol(message)
          let saveMessage = {}
          saveMessage.type = 'library'
          saveMessage.action = 'cue-contract'
          saveMessage.task = 'update-complete'
          saveMessage.data = saveContract
          this.liveLib.emit('libmessage', JSON.stringify(saveMessage))
        }
      }
    } else if (message.task.trim() === 'DEL') {
      if (message.privacy === 'private') {
        // private
        let delFeedback = this.liveHolepunch.BeeData.deleteBentocue(message.data)
      } else if (message.privacy === 'public') {
        // public
        let delFeedback = this.liveHolepunch.BeeData.deleteBentocue(message.data)
      }
    } else if (message.task.trim() === 'SYNC') {
      if (message.reftype === 'cues-gaia') {
        this.syncGAIA()
      } else if (message.reftype === 'cues-custom') {

      }

    }
  }  

  /**
  * save a cues wheel
  * @method saveCuesProtocol
  *
  */
  saveCuesProtocol = async function (saveData) {
    const lsKey = Buffer.from(saveData.data.lsKey)
    let formedContract = this.libComposer.liveCues.cueComposer(lsKey, saveData.data)
    // save with lifestrap index key only
    let saveContract = await this.liveHolepunch.BeeData.saveCues(formedContract)
    let checkContract = await this.liveHolepunch.BeeData.getCues(formedContract.hash)

    return checkContract
  }

  /**
  * 
  * @method updateCuesTimestamp
  *
  */
  updateCuesTimestamp = async function (updateData) {
    let formedContract = this.libComposer.liveCues.cuesTimestamp(updateData.data)
    let saveContract = await this.liveHolepunch.BeeData.saveCues(formedContract)
    return saveContract
  }
  
  /**
  * update cues relationship
  * @method updateCuesProtocol
  *
  */
  updateCuesProtocol = async function (updateData) {
    let formedContract = this.libComposer.liveCues.cuesRelationships(updateData)
    // console.log(util.inspect(formedContract, {showHidden: false, depth: null}))
    let saveContract = await this.liveHolepunch.BeeData.saveCues(formedContract)

    let checkContract = await this.liveHolepunch.BeeData.getCues(formedContract.hash)
    return checkContract
  }

  /**
   * 
   * build relatship index keys between peers
   * @method  
  */
  relationshipProtocol = async function (message) {
    let saveContract = {}
    if (message.reftype === 'new') {
      let saveContract = this.savePureEdge(message.data.sourceContract, message.data.targetContract, message.data.relationship )
    } else if (message.reftype === 'del') {
      let saveContract = this.severEdge(message.data)
    } else if (message.reftype === 'graft') {
     let saveContract = this.graftFascialLayer(message.data)
    } else if (message.reftype === 'evolve') {
      let saveContract = this.evolveEdge(message.data)
    } else if (message.reftype === 'compound') {
      let saveContract = await this.synthesizeCompoundCue(message.data)
      // inform bee bentoboxds
      let saveMessage = {}
      saveMessage.type = 'library'
      saveMessage.action = 'cue-contract'
      saveMessage.task = 'save-complete'
      saveMessage.data = saveContract
      this.liveLib.emit('libmessage', JSON.stringify(saveMessage))
    }

    return true
  }

  /**
   * Forges an immutable, key-only biological edge between two cues.
   * The value remains totally empty for maximum synchronization efficiency.
  */
  async savePureEdge(sourceContract, targetList, relationshipType) {
    const reciprocals = this.reciprocalRelationship()
    const metabolicBatch = this.liveHolepunch.BeeData.Cues
    // loop over target(s)
    for (let target of targetList) {

      const forwardKey = this.composeBinaryEdgeKey(sourceContract.key, relationshipType, target) // `edge!${sourceHash}!${relationshipType}!${target}`;
      const reverseKey = this.composeBinaryEdgeKey(target.key, relationshipType, sourceContract.key) // `edge!${target}!${reciprocals[relationshipType] || 'flux'}!${sourceHash}`;
      // Pass an empty string or Buffer.alloc(0). Hyperbee handles this perfectly.
      await metabolicBatch.saveCues({ hash: forwardKey, contract: '' });
      await metabolicBatch.saveCues({ hash: reverseKey, contract: '' })
      // check index key formed
      let checkIndex = await metabolicBatch.getCues(forwardKey)
    }
  }

  /**
   * Completely severs an existing relationship boundary.
  */
  async severEdge(sourceHash, targetHash, relationshipType) {
    const reciprocals = this.reciprocalRelationship()

    const forwardKey = `edge!${sourceHash}!${relationshipType}!${targetHash}`;
    const reverseKey = `edge!${targetHash}!${reciprocals[relationshipType] || 'flux'}!${sourceHash}`;

    const metabolicBatch = this.liveHolepunch.BeeData.Cues.batch()
    // Execute as a clean, atomic batch operation
    await metabolicBatch.deleteBentocue(forwardKey);
    await metabolicBatch.deleteBentocue(reverseKey);
    await metabolicBatch.flush();
  }

  /**
   * Evolves a relationship from an old type to a new type atomically.
  */
  async evolveEdge(sourceHash, targetHash, oldType, newType) {
    const reciprocals = this.reciprocalRelationship()

    // Generate old keys
    const oldForward = `edge!${sourceHash}!${oldType}!${targetHash}`;
    const oldReverse = `edge!${targetHash}!${reciprocals[oldType] || 'flux'}!${sourceHash}`;

    // Generate upgraded keys
    const newForward = `edge!${sourceHash}!${newType}!${targetHash}`;
    const newReverse = `edge!${targetHash}!${reciprocals[newType] || 'flux'}!${sourceHash}`;

    // Commit everything together so the graph is never in an invalid midway state
    const metabolicBatch = await this.liveHolepunch.BeeData.batch()
    await metabolicBatch.deleteBentocue(oldForward);
    await metabolicBatch.deleteBentocue(oldReverse);
    await metabolicBatch.saveCues(newForward, '');
    await metabolicBatch.saveCues(newReverse, '');
    await metabolicBatch.flush();
  }

  /**
   * Grafts a new intermediate structural layer smoothly into the fascial matrix 
   * between two existing symbiotically paired cues.
   * * Example: Inserting 'Inner Ear' into the fascia between 'Ear' and 'Cochlea'.
  */
  async graftFascialLayer(sourceHash, targetHash, currentFlow, intermediateHash) {
    // Opening an atomic metabolic transaction window on the cues Hyperbee
    const metabolicBatch = await this.liveHolepunch.BeeData
    
    // Symmetrical flows running through the connective tissue
    const reciprocals = this.reciprocalRelationship()

    const reverseFlow = reciprocals[currentFlow] || 'flux';

    // Step 1: Sever the direct historic path to make space for the new tissue layer
    metabolicBatch.del(`edge!${sourceHash}!${currentFlow}!${targetHash}`);
    metabolicBatch.del(`edge!${targetHash}!${reverseFlow}!${sourceHash}`);

    // Step 2: Form an anastomosis from the source substrate to the new intermediate layer
    metabolicBatch.put(`edge!${sourceHash}!${currentFlow}!${intermediateHash}`, '');
    metabolicBatch.put(`edge!${intermediateHash}!${reverseFlow}!${sourceHash}`, '');

    // Step 3: Form an anastomosis from the new intermediate layer to the terminal target
    metabolicBatch.put(`edge!${intermediateHash}!${currentFlow}!${targetHash}`, '');
    metabolicBatch.put(`edge!${targetHash}!${reverseFlow}!${intermediateHash}`, '');

    // Step 4: Flush the atomic synthesis directly into the local persistent B-tree
    await metabolicBatch.flush();
  }

  /**
   * what is opposite relationship
   * @method  reciprocalRelationship
   * 
  */
  reciprocalRelationship = function () {
    const fascialReciprocals = {
      // 1. Structural Containment Boundaries
      upstream: 'downstream',        // Escalating up to macro systems
      downstream: 'upstream',        // Descending into micro components

      // 2. Trans-Peer Alignment
      resonance: 'resonance',        // Horizontal, non-hierarchical peer synchronization

      // 3. Dynamic Instrument Tracking
      gauge: 'calibrated_by',        // Binds a physical concept node to an active telemetry channel
      calibrated_by: 'gauge',

      // 4. Inward Sensory Input
      afferent: 'efferent',          // Inward-receiving impulse from a hardware device
      efferent: 'afferent',          // Outward-sending command path

      // 5. Synthesis Execution
      metabolize: 'ingredient_of',    // Node acts as a driver for a computational knowledge function
      ingredient_of: 'metabolize',

      // 6. Fluid/Unsettled State
      flux: 'flux'                   // Speculative, non-stabilized connection
    };
    return fascialReciprocals
  }

  /**
  * A simple local utility to bind binary segments together with a delimiter (0x21)
  * @method composeBinaryEdgeKey 
  */
  composeBinaryEdgeKey = function (sourceBuffer, flowString, targetBuffer) {
    const prefixBytes = new TextEncoder().encode('edge!');
    const flowBytes = new TextEncoder().encode(flowString);
    const delimiter = new Uint8Array([0x21]); // ASCII for '!'

    // Calculate the absolute combined layout size
    const totalLength = 
      prefixBytes.length + 
      sourceBuffer.length + 
      delimiter.length + 
      flowBytes.length + 
      delimiter.length + 
      targetBuffer.length;

    const edgeKeyBuffer = new Uint8Array(totalLength);

    // Structural Stacking of the bytes
    let offset = 0;
    edgeKeyBuffer.set(prefixBytes, offset); offset += prefixBytes.length;
    edgeKeyBuffer.set(sourceBuffer, offset); offset += sourceBuffer.length;
    edgeKeyBuffer.set(delimiter, offset); offset += delimiter.length;
    edgeKeyBuffer.set(flowBytes, offset); offset += flowBytes.length;
    edgeKeyBuffer.set(delimiter, offset); offset += delimiter.length;
    edgeKeyBuffer.set(targetBuffer, offset);
    return Buffer.from(edgeKeyBuffer.buffer, edgeKeyBuffer.byteOffset, edgeKeyBuffer.byteLength);
  }

  /**
   * 
   * @method combineCueKeys 
  */
  synthesizeCompoundCue = async function (data) {
    let compoundData = {}
    compoundData.concept = {}
    compoundData.name = this.compoundName(data.sourceContract.value.concept.datatype.concept.name, data.targetContract)
    compoundData.concept.datatypeRef = { key: 'compound', refcontract: 'datatype', concept:  { name: compoundData.name }, computational: {}, space: {}, time: {} }
    compoundData.compoundKeys = data
    // form new datatype and cue contracts
    // this.seedCues.couplingDTcueFormation('common', data)
    const lsKey = Buffer.from('common')
    let formedContract = this.libComposer.liveCues.cueCompoundComposer(lsKey, compoundData)
    // save with lifestrap index key only
    await this.liveHolepunch.BeeData.saveCues(formedContract)
    let checkContract = await this.liveHolepunch.BeeData.getCues(formedContract.hash)
    return checkContract
  }

  /**
   * 
   * method @compoundName
  */
  compoundName = function (source, targetList) {
    let compoundName = ''
    compoundName += source
    for (let cue of targetList) {
      compoundName += ' ' + cue.value.concept.datatype.concept.name
    }
    return compoundName
  }

  /**
  * call back
  * @method callbackCuesStart
  */
  callbackCuesStart = function (data) {
    // pass to sort data into ref contract types
    let cuesReturn = {}
    cuesReturn.type = 'bentobox'
    cuesReturn.reftype = 'cues-history'
    cuesReturn.action = 'start'
    cuesReturn.data = data
    this.liveLib.emit('libmessage', JSON.stringify(cuesReturn))
  }

  /**
  * call back
  * @method callbackcues
  */
  callbackcues = function (data) {
    let cueData = {}
    cueData.type = 'peerlibrary'
    cueData.refcontract = 'cue-new'
    cueData.data = data
    this.liveLib.emit('libmessage', JSON.stringify(cueData))
  }

}

export default CuesContracts
'use strict'
/**
*  Library Interface to network library
*
*
* @class LibraryHop
* @package    library-interface
* @copyright  Copyright (c) 2024 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import util from 'util'
import EventEmitter from 'events'
import LibComposer from 'librarycomposer'
import ContractsUtil from './tools/contracts.js'

class LibraryHop extends EventEmitter {

  constructor(Holepunch) {
    super()
    this.liveHolepunch = Holepunch
    this.libComposer = new LibComposer()
    this.liveContractsUtil = new ContractsUtil(this.liveHolepunch, this.libComposer)
    this.publicLibrary = {} // public library modules and reference contracts
    this.peerLibdata = {}  // peers private library store
  }

  /**
  * start library 
  * @method startLibrary
  *
  */
  startLibrary = async function () {
    await this.libraryRefContracts()
  }

  /**
  * start library 
  * @method systemsContracts
  *
  */
  systemsContracts = async function () {
    let publibData = await this.liveHolepunch.BeeData.getPublicLibraryRange(100)
    this.callbackSFsystems(publibData)
  }
  

  /**
  * library manage message
  * @method libraryManage
  *
  */
  libraryManage = async function (message) {
    // need break this up  each action should have sub type
    // nxp, contracts modules and reference
    if (message.action.trim() === 'contracts') {
      // pass on to function to manage
      this.contractsManage(message)
    } else if (message.action.trim() === 'source') {
      this.sourcedataMange(message)
    } else if (message.action.trim() === 'account') {
      this.accountManage(message)
    } else if (message.action.trim() === 'results') {
      this.resultsManage(message)
    } else if (message.action.trim() === 'ledger') {
      this.ledgerManage(message)
    } else if (message.action.trim() === 'models') {
      this.modelsManage(message)
    } else if (message.action.trim() === 'start') {
      this.peerLibdata = await this.liveHolepunch.BeeData.getPeerLibraryRange(100)
      let returnPeerData = this.liveContractsUtil.libraryQuerypath('query', 'peerlibrary', this.peerLibdata)
      let outFlow = {}
      outFlow.type = 'peer-library'
      outFlow.text = message.text
      outFlow.query = false
      outFlow.data = returnPeerData
      if (message.origin !== 'beebee') {
        this.emit('libmessage', JSON.stringify(outFlow))
      } else {
        return outFlow
      }
    }
  }

  /**
  * get starting ref contracts from public library
  * @method libraryRefContracts
  *
  */
  libraryRefContracts = async function () {
    // load all the public library but need to select what is needed TODO
    this.publicLibrary = await this.liveHolepunch.BeeData.getPublicLibraryRange()
    await this.systemsContracts()
  }

  /**
  * options for contracts
  * @method contractsManage
  *
  */
  contractsManage = async function (message) {
    if (message.task.trim() === 'GET') {
      // public or private library?
      if (message.privacy === 'private') {
        let peerLib = await this.liveHolepunch.BeeData.getPeerLibraryRange(100)
        // this.callbackPeerLibAllBoard(message.data, privateALL)
        this.callbackPeerLib(message.data, peerLib)
      } else if (message.privacy === 'public') {
        let publibData = await this.liveHolepunch.BeeData.getPublicLibraryRange(100)
        this.callbacklibrary(publibData)
      }
    } else if (message.task.trim() === 'PUT') {
      // public or private library?
      if (message.privacy === 'private') { 
        // pass to save manager, file details extract, prep contract
        let saveFeedback = await this.saveFileManager(message)
        // this.emit('libmessage', JSON.stringify(saveFeedback))
      } else if (message.privacy === 'public') {
        // need check if composer needed to form contract and then save
        let saveFeedback = await this.saveContractProtocol(message)
        this.emit('libmessage', JSON.stringify(saveFeedback))
      }
    } else if (message.task.trim() === 'DEL') {
      if (message.privacy === 'private') {
        // private
        let delFeedback = this.liveHolepunch.BeeData.deleteRefcontPeerlibrary(message.data)
      } else if (message.privacy === 'public') {
        // public
        let delFeedback = this.liveHolepunch.BeeData.deleteRefcontPubliclibrary(message.data)
      }
  
    } else if (message.task.trim() === 'safeflow-systems') {
      let publibData = await this.liveHolepunch.BeeData.getPublicLibraryRange(100)
      this.callbackSFsystems(publibData)
    } else if (message.task.trim() === 'replicate') {
    } else if (message.task.trim() === 'assemble') {
      this.assembleExperiment(message.bbid, message.data)
    } else if (message.task.trim() === 'join') {
      // make or expand update settings
      let updateSettings = this.liveContractsUtil.prepareUpdatesNXP(message.data)
      let joinExperiment = await this.liveContractsUtil.prepareJoinNXP(updateSettings)
      let joinComplete = {}
      joinComplete.type = 'library'
      joinComplete.action = 'join-experiment'
      joinComplete.data = joinExperiment
      this.emit('libmessage', JSON.stringify(joinComplete))
    } else if (message.task.trim() === 'remove') {
    } else if (message.task.trim() === 'modules-genesis') {
      let nxpContract = this.liveContractsUtil.moduleTempContractGenesis(message, this.publicLibrary)
      let libraryPublicStart = {}
      libraryPublicStart.type = 'library'
      libraryPublicStart.action = 'new-modules'
      libraryPublicStart.privacy = 'public'
      libraryPublicStart.data = nxpContract
      this.emit('libmessage', JSON.stringify(libraryPublicStart))
    } else if (message.task.trim() === 'experiment-genesis') {
      let nxpContract = await this.liveContractsUtil.experimentContractGenesis(message)
      let libraryPublicStart = {}
      libraryPublicStart.type = 'library'
      libraryPublicStart.action = 'new-experiment'
      libraryPublicStart.privacy = 'public'
      libraryPublicStart.data = nxpContract
      this.emit('libmessage', JSON.stringify(libraryPublicStart))
    } else if (message.task.trim() === 'update-hopquery') {
      console.log('LIB_HOP--------update to exisign ENITTY----')
     this.updateQueryContracts(message.bbid, message)
    }
  }

  /**
  * gain access to file source data
  * @method sourcedataMange
  *
  */
  sourcedataMange = async function (message) {
    if (message.task === 'GET') {
      if (message.reftype === 'sqlite') {
        if (message.data.query === 'tables') {
          let columnData = await this.liveHolepunch.DriveFiles.SQLiteSourceSetup(message.data)
          // return columns
          this.callbackColumns(columnData, message.reftype)
        } else if (message.data.query === 'devices') {
          let deviceData = await this.liveHolepunch.DriveFiles.SQLiteDeviceSetup(message.data)
          this.callbackColumns(deviceData, message.reftype)
        }
      }
    }

  }

  /**
  * options for account
  * @method accountManage
  *
  */
  accountManage = async function (message) {
    if (message.reftype.trim() === 'GET') {

    } else if (message.task.trim() === 'PUT') {

    } else if (message.task.trim() === 'replicate') {
      let replicatePubLib = await this.liveHolepunch.BeeData.replicatePubliclibrary(message.data.discoverykey)
      this.emit('libmessage', JSON.stringify(replicatePubLib))
    } else if (message.task.trim() === 'sample') {

    } else if (message.task.trim() === 'remove') {

    }
  }

  /**
  * options for results
  * @method resultsManage
  *
  */
  resultsManage = async function (message) {
    if (message.task.trim() === 'GET') {
      const dataResults = await this.liveHolepunch.BeeData.peerResults(100)
      this.callbackPeerResultsAll(dataResults)
    } else if (message.reftype.trim() === 'PUT') {

    } else if (message.reftype.trim() === 'challenge') {

    } else if (message.reftype.trim() === 'remove') {

    }
  }

  /**
  * options for ledger
  * @method ledgerManage
  *
  */
  ledgerManage = async function (message) {
    if (message.task.trim() === 'GET') {
      const dataLedger = await this.liveHolepunch.BeeData.KBLentries(100)
      this.callbackPeerKBL(dataLedger)
    } else if (message.reftype.trim() === 'PUT') {

    } else if (message.reftype.trim() === 'sample') {

    } else if (message.reftype.trim() === 'remove') {

    }
  }

  /**
  * manage forming of contract and saving
  * @method saveContractProtocol
  *
  */
  saveContractProtocol = async function (saveData) {
    // pass through library composer
    let formedContract = {}
    if (saveData.reftype === 'question') {
      formedContract = this.libComposer.liveComposer.questionComposer(saveData.data)
    } else if (saveData.reftype === 'datatype') {
      formedContract = this.libComposer.liveComposer.datatypeComposer(saveData.data)
    } else if (saveData.reftype === 'compute') {
      formedContract = this.libComposer.liveComposer.computeComposer(saveData.data) 
    } else if (saveData.reftype === 'packaging') {
       formedContract = this.libComposer.liveComposer.packagingComposer(saveData.data)
    } else if (saveData.reftype === 'visualise') {
       formedContract = this.libComposer.liveComposer.visualiseComposer(saveData.data)
    } else if (saveData.reftype === 'experiment') {
      // formedContract = this.libComposer. 
    } else if (saveData.reftype === 'module') {
    }
    // console.log(util.inspect(formedContract, {showHidden: false, depth: null}))
    let saveContract = await this.liveHolepunch.BeeData.savePubliclibrary(formedContract)
    // format message for return
    let saveMessage = {}
    saveMessage.type = 'library'
    saveMessage.action = 'referenc-contract'
    saveMessage.task = 'save-complete'
    saveMessage.data = saveContract
    return saveMessage
  }

  /**
  * take nxp contract and expand its reference contract ids
  * @method assembleExperiment
  *
  */
  assembleExperiment = async function (bbid, libData) {
    let libraryData = {}
    libraryData.data = 'contracts'
    libraryData.type = 'peerprivate'
    // get public library and set
    // await this.publicLibraryGet()
    // extract out reference contracts
    let contractsPublic = this.splitMCfromRC()
    let expandedRefContsSF = this.prepareSafeFlowStucture(libData, contractsPublic.reference)
    let dataNXP = {}
    dataNXP.type = 'nxp-contract'
    dataNXP.action = 'safeflow'
    dataNXP.data = expandedRefContsSF
    dataNXP.bbid = bbid
    this.emit('libsafeflow', dataNXP)
    // return expandedRefContsSF
  }

  /**
  * assess update to query and prepare HOP query module contracts
  * @method updateQueryContracts
  *
  */
  updateQueryContracts = async function (bbid, queryUpdate) {
    console.log('LIB-hop---update preop')
    console.log(queryUpdate)
    let modulesUpdate = queryUpdate.data.update.modules
    // need to source latest compute module contract from library as need latest contract
    let latestComputeModule = {}
    for (let mod of modulesUpdate) {
      if (mod.value.style === 'compute') {
        // latestComputeModule = await this.liveContractsUtil.latestModuleContract('compute', mod)
      }
    }
    // update controls selected and settings all options for toolbars
    let changes = queryUpdate.data.update.changes
    console.log('changes from last compute')
    console.log(changes)
    console.log(changes.compute.controls.rangedate)
    let changeItems = Object.keys(queryUpdate.data.update.changes.compute.controls)
    // console.log(changes)
    // console.log(changeItems)
    let cloneControls = {}
    for (let mod of modulesUpdate) {
      if (mod.value.style === 'compute') {
        // update controls
        console.log('================  update contract  ========')
        // console.log(latestComputeModule)
        // what are exsting controls set?  keep and update
        console.log(mod.value.info.controls)
        let controlKeys = Object.keys(mod.value.info.controls)
        if (controlKeys.length > 0) {
          // item already set and need updating?
          for (let ck of changeItems) {
            let checkSetck = controlKeys.includes(ck)
            if (checkSetck === true) {
              mod.value.info.controls[ck] = changes.compute.controls[ck]
            } else {
              mod.value.info.controls[ck] = changes.compute.controls[ck] // queryUpdate.data.update.changes.compute.controls[ck]
            }
          }
        } else {
          mod.value.info.controls = changes.compute.controls
        }
        cloneControls = mod.value.info.controls
        console.log('__________updateged controls-----------------')
        console.log(mod.value.info.controls)
      } else if (mod.value.style === 'visualise') {
        mod.value.info.controls = cloneControls
      }
    }
    let dataNXP = {}
    dataNXP.type = 'update-hopquery'
    dataNXP.action = 'safeflow'
    dataNXP.data = queryUpdate.data
    dataNXP.bbid = bbid
    this.emit('libsafeflow-update', dataNXP)
  }

  /**
  * take in query and update accordingly
  * @method updateQueryExperiment
  *
  */
  updateQueryExperiment = async function (bbid, libData) {
    let contractsPublic = this.splitMCfromRC()
    let updateQuery = {} // this.(libData, contractsPublic.reference)
    let dataNXP = {}
    dataNXP.type = 'safeflow'
    dataNXP.action = 'updatenetworkexperiment'
    dataNXP.data = updateQuery
    dataNXP.bbid = bbid
    this.emit('libsafeflow', dataNXP)
  }


  /**
  * split public library into modules and reference contracts
  * @method splitMCfromRC
  *
  */
  splitMCfromRC = function () {
    // split into Module Contracts and Reference Contracts
    let modContracts = []
    let refContracts = []
    for (let pubLib of this.publicLibrary) {
      if (pubLib?.value.refcontract === 'module') {
        modContracts.push(pubLib)
      } else {
        refContracts.push(pubLib)
      }
    }
    let contractList = {}
    contractList.modules = modContracts
    contractList.reference = refContracts
    /* for (let ref of refContracts) {
      if (ref.value.refcontract === 'datatype') {
        console.log('split')
        console.log(ref)
      }
    } */
    return contractList
  }

  /**
  * prepare for NXP (network experiment already joined) query for SafeFlow
  * @method prepareSafeFlowStucture
  *
  */
  prepareSafeFlowStucture = function (moduleContracts, refContracts) {
    // console.log(util.inspect(refContracts, {showHidden: false, depth: null}))
    // console.log(util.inspect(moduleContracts, {showHidden: false, depth: null}))
    let safeFlowQuery = {}
    let modKeys = []
    safeFlowQuery = moduleContracts
    // info structure
    // let info = {}
    // e.g. info.data = { key  value }  change data for name of contracts (is this good decision???)
    // info.type = 'data
    // need to form joined modle contract with expaneded to include reference contract
    // structure needs to be modIn.type  modIn.data = temMC with refcontract embedded
    let expandedModules = []
    for (let tmc of moduleContracts.modules) {
      let expandMod = tmc
      if(tmc.value.type === 'question') {
        expandedModules.push(expandMod)
      } else if(tmc.value.style === 'packaging') {
        // need a better filter. match to contract ID coming in not the first TODO      
        let extractRC = refContracts.filter(e => e.key === tmc.value.info.key)
        expandMod.value.info.packaging = extractRC[0]
        expandedModules.push(expandMod)
      } else if (tmc.value.style === 'compute') {
        let extractRC = refContracts.filter(e => e.value.refcontract === 'compute')
        expandMod.value.info.compute = extractRC[0]
        expandedModules.push(expandMod)
      } else if (tmc.value.style === 'visualise') {
        let extractRC = refContracts.filter(e => e.value.refcontract === 'visualise')
        expandMod.value.info.visualise = extractRC
        expandedModules.push(expandMod)
      }
    }
    safeFlowQuery.exp.value.modules = expandedModules
    // console.log(util.inspect(modContracts, {showHidden: false, depth: null}))
    // SafeFow Structure
    //safeFlowQuery.modules = modKeys
    safeFlowQuery.reftype = 'ignore'
    safeFlowQuery.type = 'safeflow'
    return safeFlowQuery
  }


  /**
  * expand reference contracts ids with NXP module contract
  * @method rextractRefContractsPublicLib
  *
  */
  extractRefContractsPublicLib = function (refContracts, fileName) {
    let refBuilds = []

    return refBuilds
  }

  /**
  * save file manager
  * @method saveFileManager
  */
  saveFileManager = async function (save) {
    let fileList = []
    fileList.push(save.data)
    save.data = fileList
    // route for different type of processing before save, add PandasAI (via beebee?)
    // how many files coming in?
    let fileCount = save.data.length
    for (let i = 0; i < fileCount; i++) {
      if (save.data[i].type === 'sqlite') {
        let fileInfo = await this.liveHolepunch.DriveFiles.saveSqliteFirst(save.data[i].type, save.data[i].name, save.data[i].content)
        let fileFeedback = {}
        fileFeedback.success = true
        fileFeedback.path = fileInfo.filename
        fileFeedback.columns = fileInfo.header
        fileFeedback.tables = fileInfo.tables
        let storeFeedback = {}
        storeFeedback.type = 'library'
        storeFeedback.action = 'save-file'
        storeFeedback.task = 'sqlite'
        storeFeedback.data = fileFeedback
        this.emit('libmessage', JSON.stringify(storeFeedback))
        // next load sqlite db and ask for table names
        // then pass on to BeeBee
      } else if (save.data[i].type === 'application/json') {
        if (save.data[i].source === 'local') {
          // await liveParser.localJSONfile(o, ws)
        } else if (save.data[i].source === 'web') {
          // liveParser.webJSONfile(o, ws)
        }
      } else if (save.data[i].type === 'text/csv' || save.data[i].type === 'csv') {
        // save protocol original file save and JSON for HOP
        if (save.data[i].info.location === 'local') {
          let fileInfo = await this.liveHolepunch.DriveFiles.hyperdriveCSVmanager(save)
          let fileFeedback = {}
          fileFeedback.success = true
          fileFeedback.path = fileInfo.filename
          fileFeedback.columns = fileInfo.header.splitwords
          fileFeedback.file = save.data[i]
          let storeFeedback = {}
          storeFeedback.type = 'library'
          storeFeedback.action = 'save-file'
          storeFeedback.task = 'sqlite'
          storeFeedback.data = fileFeedback
          this.emit('libmessage', JSON.stringify(storeFeedback))
          // now inform SafeFlow that data needs charting
          this.emit('library-data', fileFeedback)
        } else if (save.data[i].info.location === 'web') {
          let saveFeedback = await this.liveHolepunch.DriveFiles.saveCSVfilecontent(save)
          let fileFeedback = {}
          fileFeedback.success = true
          fileFeedback.data = saveFeedback
          let storeFeedback = {}
          storeFeedback.type = 'library'
          storeFeedback.action = 'save-file'
          storeFeedback.data = fileFeedback
          this.emit('libmessage', JSON.stringify(storeFeedback))
          // this.emit('library-data', fileFeedback)
        }
      } else if (save.data[i].type === 'spreadsheet') {
        // need to pass to pandasAI
      }
    }
  }

  /**
  * bentobox info gathering
  * @method bentoPath
  */
   bentoPath = async function (o) {
    if (o.reftype.trim() === 'chat-history') {
      if (o.task.trim() === 'save') {
        let bentoChat = await this.liveHolepunch.BeeData.saveBentochat(o.data)
        this.callbackBentochat(bentoChat)
      } else if (o.task.trim() === 'start') {
        let bentoChatstart = await this.liveHolepunch.BeeData.getBentochatHistory()
        this.callbackBentochathistory(bentoChatstart)
      } else if (o.task.trim() === 'get') {
      } else if (o.task.trim() === 'delete') {
        let bentoDelete = await this.liveHolepunch.BeeData.deleteBentochat(o.data)
        this.callbackDeleteBentochat(bentoDelete)
      }
    } else if (o.reftype.trim() === 'space-history') {
      if (o.action.trim() === 'save') {
        let bentoSpace = await this.liveHolepunch.BeeData.saveSpaceHistory(o.data)
        this.callbackHistoryspace(bentoSpace)
      } else if (o.action.trim() === 'delete') {
        let bentoDelete = await this.liveHolepunch.BeeData.deleteBentospace(o.data)
        this.callbackDeleteBentospace(bentoDelete)
      } else if (o.action.trim() === 'save-position') {
        let bentospace = await this.liveHolepunch.BeeData.saveBentospace(o.data)
        this.callbackBentospace(bentospace)
      } else if (o.action.trim() === 'list-position') {
        let bbspace = await this.liveHolepunch.BeeData.getBentospace()
        this.callbackListBentospace(bbspace)
      } else {
        console.log('no action bentospace')
      }
    } else if (o.reftype.trim() === 'solospace') {
      if (o.action.trim() === 'save-position') {
        let solospace = await this.liveHolepunch.BeeData.saveSolospace(o.data)
        this.callbacSolospace(solospace)
       } else if (o.action.trim() === 'list-position') {
        let ssspace = await this.liveHolepunch.BeeData.getSolospace(o.data)
         this.callbackListSolospace(ssspace)
       } else {
         console.log('no action solospace')
       }
    }
  }

  /**
  * call back for data calls
  * @method callbackKey
  */
  callbackKey = async function () {
    let pubkeyData = {}
    pubkeyData.type = 'publickey'
    pubkeyData.pubkey = data
    this.emit('libmessage', JSON.stringify(pubkeyData))
    // this.wsocket.send(JSON.stringify(pubkeyData))
  }

  /**
  * call back for data calls
  * @method callbackOpenLibrary
  */
  callbackOpenLibrary = function (data) {
    let pubkeyData = {}
    pubkeyData.type = 'open-library'
    pubkeyData.data = data
    this.emit('libmessage', JSON.stringify(pubkeyData))
    // this.wsocket.send(JSON.stringify(pubkeyData))
  }

  /**
  * call back
  * @method 
  */
  callbackPeerNetwork = function (data) {
    let peerNData = {}
    peerNData.type = 'new-peer'
    peerNData.data = data
    this.emit('libmessage', JSON.stringify(peerNData))
    // this.wsocket.send(JSON.stringify(peerNData))
  }

  /**
  * call back
  * @method 
  */
   callbackWarmPeers = function (data) {
    let peerNData = {}
    peerNData.type = 'warm-peers'
    peerNData.data = data
    this.emit('libmessage', JSON.stringify(peerNData))
    // this.wsocket.send(JSON.stringify(peerNData))
  }


  /**
  * return an individual ref contract datatype
  * @method 
  */
  callbackDatatype = function (data) {
    let libraryData = {}
    libraryData.type = 'datatype-rc'
    libraryData.data = data
    this.emit('libmessage', JSON.stringify(libraryData))
  }

  /**
  * call back
  * @method callbacklibrary
  */
  callbacklibrary = function (data) {
    // pass to sort data into ref contract types
    let libraryData = {}
    libraryData.data = 'contracts'
    libraryData.type = 'publiclibrary'
    const segmentedRefContracts = this.libComposer.liveRefcontUtility.refcontractSperate(data)
    libraryData.referenceContracts = segmentedRefContracts
    // need to split for genesis and peer joined NXPs
    const nxpSplit = this.libComposer.liveRefcontUtility.experimentSplit(segmentedRefContracts.experiment)
    libraryData.splitExperiments = nxpSplit
    // look up modules for this experiments
    libraryData.networkExpModules = this.libComposer.liveRefcontUtility.expMatchModuleGenesis(libraryData.referenceContracts.module, nxpSplit.genesis)
    libraryData.networkPeerExpModules = this.libComposer.liveRefcontUtility.expMatchModuleJoined(libraryData.referenceContracts.module, nxpSplit.joined)
    this.emit('libmessage', JSON.stringify(libraryData))
    // this.wsocket.send(JSON.stringify(libraryData))
  }

  /**
  * call back
  * @method callbackSFsystems
  */
  callbackSFsystems = function (data) {
    this.emit('systemssafeflow', JSON.stringify(data))
  }

  /**
  * call back
  * @method callbackPeerlibrary
  */
  callbackPeerlibrary = function (data) {
    // format raw data
    let libraryData = {}
    const segmentedRefContracts = this.libComposer.liveRefcontUtility.refcontractSperate(data)
    libraryData.referenceContracts = segmentedRefContracts
    // need to split for genesis and peer joined NXPs
    const nxpSplit = this.libComposer.liveRefcontUtility.experimentSplit(segmentedRefContracts.experiment)
    libraryData.splitExperiments = nxpSplit
    // look up modules for this experiments
    libraryData.networkExpModules = this.libComposer.liveRefcontUtility.expMatchModuleGenesis(libraryData.referenceContracts.module, nxpSplit.genesis)
    libraryData.networkPeerExpModules = this.libComposer.liveRefcontUtility.expMatchModuleJoined(libraryData.referenceContracts.module, nxpSplit.joined)
    libraryData.type = 'peerlibrary'
    libraryData.refcontract = 'experiment-new'
    libraryData.data = data
    this.emit('libmessage', JSON.stringify(libraryData))
  }

  /**
  * call back
  * @method 
  */
   callbackPlibraryAdd = function (data) {
    let libraryData = {}
    libraryData.data = data
    libraryData.type = 'publiclibraryaddcomplete'
    this.emit('libmessage', JSON.stringify(libraryData))
    // this.wsocket.send(JSON.stringify(libraryData))
  }

  /**
  * call back
  * @method 
  */
  callbackReplicatelibrary = function (data) {

    // pass to sort data into ref contract types
    libraryData = {}
    libraryData.data = 'contracts'
    libraryData.type = 'replicatedata-publiclibrary'
    const segmentedRefContracts = this.libComposer.liveRefcontUtility.refcontractSperate(data)
    libraryData.referenceContracts = segmentedRefContracts
    // need to split for genesis and peer joined NXPs
    const nxpSplit = this.libComposer.liveRefcontUtility.experimentSplit(segmentedRefContracts.experiment)
    libraryData.splitExperiments = nxpSplit
    // look up modules for this experiments
    libraryData.networkExpModules = this.libComposer.liveRefcontUtility.expMatchModuleGenesis(libraryData.referenceContracts.module, nxpSplit.genesis)
    libraryData.networkPeerExpModules = this.libComposer.liveRefcontUtility.expMatchModuleJoined(libraryData.referenceContracts.module, nxpSplit.joined)
    this.emit('libmessage', JSON.stringify(libraryData))
    // this.wsocket.send(JSON.stringify(libraryData))
  }

  /**
  * call back
  * @method 
  */
  callbackReplicatereceive = function (data) {
    let peerRdata = {}
    peerRdata.type = 'replicate-publiclibrary'
    peerRdata.data = data
    this.emit('libmessage', JSON.stringify(peerRdata))
    // this.wsocket.send(JSON.stringify(peerRdata))
  }

  /**
  * call back
  * @method 
  */
  callbackLifeboard = function (data) {
    // pass to sort data into ref contract types
    let libraryData = {}
    libraryData.data = 'contracts'
    libraryData.type = 'peerlifeboard'
    libraryData.lifeboard = data
    this.emit('libmessage', JSON.stringify(libraryData))
    // this.wsocket.send(JSON.stringify(libraryData))
  }

  /**
  * call back
  * @method callbackBentochat
  */
  callbackBentochat = function (data) {
    // pass to sort data into ref contract types
    let bentoboxReturn = {}
    bentoboxReturn.type = 'bentobox'
    bentoboxReturn.reftype = 'chat-history'
    bentoboxReturn.action = 'save'
    bentoboxReturn.data = data
    this.emit('libmessage', JSON.stringify(bentoboxReturn))
  }

  /**
  * call back
  * @method callbackDeleteBentochat
  */
  callbackDeleteBentochat = function (data) {
    // pass to sort data into ref contract types
    let bentoboxReturn = {}
    bentoboxReturn.type = 'bentobox'
    bentoboxReturn.reftype = 'chat-history'
    bentoboxReturn.action = 'delete'
    bentoboxReturn.data = data
    this.emit('libmessage', JSON.stringify(bentoboxReturn))
  }

  /**
  * call back
  * @method callbackDeleteBentospace
  */
  callbackDeleteBentospace = function (data) {
    // pass to sort data into ref contract types
    let bentoboxReturn = {}
    bentoboxReturn.type = 'bentobox'
    bentoboxReturn.reftype = 'space-history'
    bentoboxReturn.action = 'delete'
    bentoboxReturn.data = data
    this.emit('libmessage', JSON.stringify(bentoboxReturn))
  }

  /**
  * call back
  * @method callbackBentochathistory
  */
  callbackBentochathistory = function (data) {
    // pass to sort data into ref contract types
    let bentoboxReturn = {}
    bentoboxReturn.type = 'bentobox'
    bentoboxReturn.reftype = 'chat-history'
    bentoboxReturn.action = 'start'
    bentoboxReturn.data = data
    this.emit('libmessage', JSON.stringify(bentoboxReturn))
  }

  /**
  * call back
  * @method 
  */
  callbackHistoryspace = function (data) {
    let bentoboxReturn = {}
    bentoboxReturn.type = 'bentobox'
    bentoboxReturn.reftype = 'space-history'
    bentoboxReturn.action = 'save'
    bentoboxReturn.data = data
    this.emit('libmessage', JSON.stringify(bentoboxReturn))
  }

  /**
  * call back
  * @method 
  */
  callbackBentospace = function (data) {
    let bentoboxReturn = {}
    bentoboxReturn.type = 'bentobox'
    bentoboxReturn.reftype = 'space-history'
    bentoboxReturn.action = 'location-save'
    bentoboxReturn.data = data
    this.emit('libmessage', JSON.stringify(bentoboxReturn))
  }

  /**
  * call back
  * @method callbackListBentospace
  */
  callbackListBentospace = function (data) {
    // pass to sort data into ref contract types
    let blibraryData = {}
    blibraryData.type = 'bentospaces-list'
    blibraryData.data = data
    this.emit('libmessage', JSON.stringify(blibraryData))
    // this.wsocket.send(JSON.stringify(blibraryData))
  }

  /**
  * call back
  * @method callbacSolospace
  */
    callbacSolospace = function (data) {
      // pass to sort data into ref contract types
      let blibraryData = {}
      blibraryData.stored = true
      blibraryData.type = 'solospaces'
      blibraryData.data = data
      this.emit('libmessage', JSON.stringify(blibraryData))
      // this.wsocket.send(JSON.stringify(blibraryData))
    }
  
    /**
    * call back
    * @method callbackListSolospace
    */
    callbackListSolospace = function (data) {
      // pass to sort data into ref contract types
      let blibraryData = {}
      blibraryData.type = 'solospaces-list'
      blibraryData.data = data
      this.emit('libmessage', JSON.stringify(blibraryData))
      // this.wsocket.send(JSON.stringify(blibraryData))
    }
  
    /**
    * call back
    * @method 
    */
    callbackNXPDelete  = function (data) {
      // pass to sort data into ref contract types
      let libraryData = {}
      libraryData.data = data
      libraryData.type = 'peerprivatedelete'
      this.emit('libmessage', JSON.stringify(libraryData))
      // this.wsocket.send(JSON.stringify(libraryData))
    }

    /**
    * new join
    * @method callbackNewJoinPeerLibBoard
    */
    callbackNewJoinPeerLibBoard = function (board, data) {
    // pass to sort data into ref contract types
    let libraryData = {}

    libraryData.stored = true
    libraryData.type = 'new-joinboard'
    libraryData.key = board
    libraryData.contract = 'new-joinboard'
    libraryData.data = data
    this.emit('libmessage', JSON.stringify(libraryData))
    // this.wsocket.send(JSON.stringify(libraryData))
  }

  /**
  * call back peer library data start
  * @method 
  */
  callbackStartPeerLibBoard = function (board, data) {
    // pass to sort data into ref contract types
    let libraryData = {}
    libraryData.board = board
    libraryData.data = data
    libraryData.type = 'peerprivate-start'
    this.emit('libmessage', JSON.stringify(libraryData))
    // this.wsocket.send(JSON.stringify(libraryData))
  }


  /**
  * call back peer library data all for peer private library
  * @method 
  */
  callbackPeerLibAllBoard = function (board, data) {
    // pass to sort data into ref contract types
    let libraryData = {}
    libraryData.board = board
    libraryData.data = data
    libraryData.type = 'library'
    libraryData.action = 'peer-library'
    this.emit('libmessage', JSON.stringify(libraryData))
  }



  /**
  * call back peer library data
  * @method 
  */
  callbackPeerLibBoard = function (board, data) {
    // pass to sort data into ref contract types
    let libraryData = {}
    libraryData.board = board
    libraryData.data = data
    libraryData.type = 'peerprivate'
    this.emit('libmessage', JSON.stringify(libraryData))
    // this.wsocket.send(JSON.stringify(libraryData))
  }

  /**
  * call back peer results
  * @method callbackPeerResultsAll
  */
  callbackPeerResultsAll = function (data) {
    // pass to sort data into ref contract types
    let libraryData = {}
    libraryData.type = 'library'
    libraryData.action = 'results'
    libraryData.privacy = 'private'
    libraryData.data = data
    this.emit('libmessage', JSON.stringify(libraryData))
    // this.wsocket.send(JSON.stringify(libraryData))
  }

  /**
  * call back kb ledger
  * @method 
  */
  callbackPeerKBL = function (data) {
    // pass to sort data into ref contract types
    let libraryData = {}
    libraryData.type = 'library'
    libraryData.action = 'ledger'
    libraryData.privacy = 'private'
    libraryData.data = data
    this.emit('libmessage', JSON.stringify(libraryData))
    // this.wsocket.send(JSON.stringify(libraryData))
  }
  

  /**
  * call back peer library data
  * @method 
  */
  callbackPeerLib = function (context, data) {
    // pass to sort data into ref contract types
    let libraryData = {}
    libraryData.data = 'contracts'
    libraryData.type = 'library'
    libraryData.action = 'peer-library'
    libraryData.context = context
    const segmentedRefContracts = this.libComposer.liveRefcontUtility.refcontractSperate(data)
    libraryData.referenceContracts = segmentedRefContracts
    // need to split for genesis and peer joined NXPs
    const nxpSplit = this.libComposer.liveRefcontUtility.experimentSplit(segmentedRefContracts.experiment)
    libraryData.splitExperiments = nxpSplit
    // look up modules for this experiments
    libraryData.networkExpModules = this.libComposer.liveRefcontUtility.expMatchModuleGenesis(libraryData.referenceContracts.module, nxpSplit.genesis)
    libraryData.networkPeerExpModules = this.libComposer.liveRefcontUtility.expMatchModuleJoined(libraryData.referenceContracts.module, nxpSplit.joined)
    this.emit('libmessage', JSON.stringify(libraryData))
  }

  /**
  * call back kb ledger
  * @method 
  */
  callbackColumns = function (data,fileType) {
    // pass to sort data into ref contract types
    let libraryData = {}
    libraryData.type = 'library'
    libraryData.action = 'source'
    libraryData.privacy = 'private'
    libraryData.reftype =  fileType
    libraryData.data = data
    this.emit('libmessage', JSON.stringify(libraryData))
  }
    

}

export default LibraryHop
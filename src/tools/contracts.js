'use strict'
/**
*  new, update, delete contracts modules and reference
*
*
* @class LibContracts
* @package    network-library
* @copyright  Copyright (c) 2023 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import util from 'util'
import EventEmitter from 'events'
import fs from 'fs'
import os from 'os'
import crypto from 'crypto'

class LibContracts extends EventEmitter {

  constructor(Composer) {
    super()
    this.liveComposer = Composer
    this.modulesStart = this.modulesGenesis()
  }


  /**
  * library query builder
  * @method libraryQuerypath
  *
  */
  libraryQuerypath = function (path, action, data) {
    let libraryData = {}
    libraryData.data = 'contracts'
    libraryData.type = 'peerprivate'
    const segmentedRefContracts = this.liveComposer.liveRefcontUtility.refcontractSperate(data)
    libraryData.referenceContracts = segmentedRefContracts
    // need to split for genesis and peer joined NXPs
    const nxpSplit = this.liveComposer.liveRefcontUtility.experimentSplit(segmentedRefContracts.experiment)
    libraryData.splitExperiments = nxpSplit
    // look up modules for this experiments
    libraryData.networkExpModules = this.liveComposer.liveRefcontUtility.expMatchModuleGenesis(libraryData.referenceContracts.module, nxpSplit.genesis)
    libraryData.networkPeerExpModules = this.liveComposer.liveRefcontUtility.expMatchModuleJoined(libraryData.referenceContracts.module, nxpSplit.joined)
    return libraryData
  }

  /**
  * form new network experiment structure
  * @method experimentContractGenesis
  *
  */
  experimentContractGenesis = function (inputSpec, publicLib) {
    console.log('prepare genesis network experiment contract structure')
    let minStartlist = this.minModulesetup()
    // take the genesis and make new instances of the Module Contracts i.e. unique keys
    let tempModContracts = this.tempModuleContractsCreate(minStartlist, inputSpec)
    // console.log('temp modules')
    // console.log(tempModContracts)
    // extract data, compute and visualisation ref contracts
    let contractsPublic = this.splitMCfromRC(publicLib)
    // extract out observaation compute and charting ref contracts,  data more work required, need save data and then create new data packaging contract
    let experimentStructure = this.extractRefContractsPublicLib(contractsPublic.reference, inputSpec)
    // let buildNewExperiment = this.buildNewExperimentContract(tempModContracts)
    let genesisContracts = {}
    genesisContracts.experiment = experimentStructure
    genesisContracts.modules = tempModContracts
    return genesisContracts
  }

    /**
  * four min modules required to start NXP with
  * @method minModulesetup
  *
  */
  minModulesetup = function (beebeeIN, publicLib, fileInfo) {
    let ModulesMinrequired = ['question', 'data', 'compute', 'visualise']
    let minStartlist = []
    for (const mtype of ModulesMinrequired) {
      let match = this.modulesStart.data.filter(e => e.type === mtype)
      minStartlist.push(match[0])
    }
    return minStartlist
  }

  /**
  * Module Contract Available to network
  * @method tempModuleContractsCreate
  *
  */
  tempModuleContractsCreate = function (gMods, file) { 
    // create new temp modules for new experiment
    let modCount = 1
    let moduleHolder = []
    for (const mc of gMods) {
      // make question unique
      if (mc.type === 'question') {
        mc.description = mc.description + file
      }
      const prepareModule = this.liveComposer.liveComposer.moduleComposer(mc, '')
      let moduleContainer = {}
      moduleContainer.name = prepareModule.data.contract.concept.type
      moduleContainer.id = modCount
      moduleContainer.refcont = prepareModule.data.hash
      moduleHolder.push(moduleContainer)
      modCount++
    }
    return moduleHolder
  }

    /**
  * Module Contract Available to network
  * @method splitMCfromRC
  *
  */
  splitMCfromRC = function (publicLib) {
    // split into Module Contracts and Reference Contracts
    let modContracts = []
    let refContracts = []
    for (let pubLib of publicLib) {
      if (pubLib?.value?.refcontract === 'module') {
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
  * Build blind reference contracts
  * @method rextractRefContractsPublicLib
  *
  */
  extractRefContractsPublicLib = function (refContracts, fileName) {
    let refBuilds = []
    for (let rc of refContracts) {
      if (rc?.value?.refcontract === 'compute' && rc?.value?.computational?.name === 'observation') {
        refBuilds.push(rc)
      } else if (rc?.value?.refcontract === 'visualise' && rc?.value?.computational?.name === 'chart.js library') {
        refBuilds.push(rc)
      }
      /* else if (rc.value.refcontract === 'packaging') {
        console.log('reccc')
        console.log(rc)
        console.log(rc.value)
        refBuilds.push(rc)
      } */
    }
    // need to build a custom data packaging ref contract
    const newPackagingMap = {}
    newPackagingMap.name = fileName
    newPackagingMap.description = fileName
    newPackagingMap.primary = 'true'
    newPackagingMap.api = 'json'
    newPackagingMap.apibase = ''
    newPackagingMap.apipath = ''
    newPackagingMap.filename = fileName + '.json'
    newPackagingMap.sqlitetablename = ''
    newPackagingMap.tablestructure = []
    newPackagingMap.tidy = {}
    newPackagingMap.category = {}
    let deviceInfo = {}
    deviceInfo.id = fileName
    deviceInfo.device_name = fileName
    deviceInfo.device_manufacturer = ''
    deviceInfo.device_mac = fileName
    deviceInfo.device_type = 'blind'
    deviceInfo.device_model = '' 
    deviceInfo.query = ''
    deviceInfo.location_lat = 0
    deviceInfo.location_long = 0
    deviceInfo.firmware = ''
    deviceInfo.mobileapp = ''
    newPackagingMap.device = deviceInfo
    // need to match info to reference data types
    newPackagingMap.apicolumns = {}
    newPackagingMap.apicolHolder = {}
    let packagingRef = this.liveComposer.liveComposer.packagingRefLive.packagingPrepare(newPackagingMap)
    refBuilds.push(packagingRef.data)
    // need to create question as blind  done via module?
    let questionBlind = {}
    questionBlind.forum = ''
    questionBlind.text = fileName
    // refBuilds.push(questionBlind)
    return refBuilds
  }

  /**
  * prepare new network experiment contract structure
  * @method buildNewExperimentContract
  *
  */
  buildNewExperimentContract = function (moduleContracts) {
    let safeFlowQuery = {}
    let modKeys = []
    for (let mc of moduleContracts) {
      modKeys.push(mc.refcont)
    }
    // form a joined contract, pass in module key only
    let formExpmoduleContract = this.liveComposer.liveComposer.experimentComposerJoin(modKeys)
    safeFlowQuery.exp = {}
    safeFlowQuery.exp.key = formExpmoduleContract.data.hash
    safeFlowQuery.exp.value = formExpmoduleContract.data.contract
    return safeFlowQuery
  }

  /**
  * prepare blind query for SafeFlow
  * @method prepareSafeFlowStucture
  *
  */
  prepareSafeFlowStucture = function (moduleContracts, refContracts, fileInfo, LLMdata) {
    // console.log(util.inspect(refContracts, {showHidden: false, depth: null}))
    let safeFlowQuery = {}
    let modContracts = []
    let modKeys = []
    for (let mc of moduleContracts) {
      modKeys.push(mc.refcont)
    }
    // which settings from LLM?
    let visStyle = LLMdata.data.data.visstyle[0].vis
    // form a joined contract, pass in module key only
    let formExpmoduleContract = this.liveComposer.liveComposer.experimentComposerJoin(modKeys)
    safeFlowQuery.exp = {}
    safeFlowQuery.exp.key = formExpmoduleContract.data.hash
    safeFlowQuery.exp.value = formExpmoduleContract.data.contract
    // this needs to be save in Holepunch to update structure to keys
    // next need to add reference Contracts to Module Contracts in correct format
    let joinStructureMC = {}
    joinStructureMC.key = ''
    joinStructureMC.value = {info: {}, refcontract: 'module', type: 'data'}
    // info structure
    // let info = {}
    // e.g. info.data = { key  value }  change data for name of contracts (is this good decision???)
    // info.type = 'data
    // need to form joined modle contract with expaneded to include reference contract
    // structure needs to be modIn.type  modIn.data = temMC with refcontract embedded
    for (let tmc of moduleContracts) {
      let inputStructure = {}
      if(tmc.name === 'question') {
        inputStructure.type = 'question'
        let dataMCRC = {}
        dataMCRC.question = { forum: '', text: fileInfo }
        inputStructure.type = 'question'
        inputStructure.data = dataMCRC
        } else if(tmc.name === 'data') {
          let dataMCRC = {}
          let extractRC = refContracts.filter(e => e.value.refcontract === 'packaging')
          dataMCRC = extractRC[0] // data packaging contract
          inputStructure.type = 'data'
          inputStructure.data = dataMCRC
      } else if (tmc.name === 'compute') {
        let dataMCRC = {}
        let extractRC = refContracts.filter(e => e.value.refcontract === 'compute')
        dataMCRC.compute = extractRC  // compute ref. contract plus setttings controls
        // add settings and controls default
        // set time to current in ms
        let currentQtime = new Date()
        const blindDate = currentQtime.getTime()
        let controls = { date: blindDate, rangedate: [ blindDate ] }
        let settings = {
          devices: [],
          data: null,
          compute: '',
          visualise: visStyle,
          category: [ 'none' ],
          timeperiod: '',
          xaxis: '',
          yaxis: [ 'blind1234555554321' ],
          resolution: '',
          setTimeFormat: ''
        }
        dataMCRC.controls = controls
        dataMCRC.settings = settings
        inputStructure = dataMCRC
        inputStructure.type = 'compute'
      } else if (tmc.name === 'visualise') {
        let dataMCRC = {}
        let extractRC = refContracts.filter(e => e.value.refcontract === 'visualise')
        dataMCRC.visualise = extractRC[0] // vis ref contract
        // add default settings
        let settings = {
          devices: [],
          data: null,
          compute: '',
          visualise: visStyle,
          category: [ 'none' ],
          timeperiod: '',
          xaxis: '',
          yaxis: [ 'blind1234555554321' ],
          resolution: '',
          setTimeFormat: '',
          single: true,
          multidata: false
        }
        dataMCRC.settings = settings
        inputStructure = dataMCRC
        inputStructure.type = 'visualise'
      }
      const prepareModule = this.liveComposer.liveComposer.moduleComposer(inputStructure, 'join')
      // need to format key value from hash and contract format
      let keyStructure = {}
      keyStructure.key = prepareModule.data.hash
      keyStructure.value = prepareModule.data.contract
      modContracts.push(keyStructure)
    }
    for (let modC of modContracts) {
      modKeys.push(modC.key)
    }
    // console.log(util.inspect(modContracts, {showHidden: false, depth: null}))
    // SafeFow Structure
    safeFlowQuery.modules = modContracts
    safeFlowQuery.reftype = 'ignore'
    safeFlowQuery.type = 'safeflow'
    return safeFlowQuery
  }

  /**
  * Module Contract Available to network
  * @method modulesGenesis
  *
  */
  modulesGenesis = function () {  
    const moduleContracts = []
    const dataCNRLbundle = {}
    // CNRL implementation contract e.g. from mobile phone sqlite table structure
    dataCNRLbundle.reftype = 'module'
    dataCNRLbundle.type = 'question'
    dataCNRLbundle.primary = 'genesis'
    dataCNRLbundle.description = 'Question for network experiment'
    dataCNRLbundle.concept = ''
    dataCNRLbundle.grid = []
    moduleContracts.push(dataCNRLbundle)
    // CNRL implementation contract e.g. from mobile phone sqlite table structure
    const dataCNRLbundle2 = {}
    dataCNRLbundle2.reftype = 'module'
    dataCNRLbundle2.type = 'data'
    dataCNRLbundle2.primary = 'genesis'
    dataCNRLbundle2.description = 'data source(s) for network experiment'
    dataCNRLbundle2.grid = []
    moduleContracts.push(dataCNRLbundle2)
    // CNRL implementation contract e.g. from mobile phone sqlite table structure
    /* const dataCNRLbundle3 = {}
    dataCNRLbundle3.reftype = 'module'
    dataCNRLbundle3.type = 'device'
    dataCNRLbundle3.primary = 'genesis'
    dataCNRLbundle3.concept = ''
    dataCNRLbundle3.grid = []
    moduleContracts.push(dataCNRLbundle3) */
    // CNRL implementation contract e.g. from mobile phone sqlite table structure
    /* const dataCNRLbundle4 = {}
    dataCNRLbundle4.reftype = 'module'
    dataCNRLbundle4.type = 'mobile'
    dataCNRLbundle4.primary = 'genesis'
    dataCNRLbundle4.concept = ''
    dataCNRLbundle4.grid = []
    moduleContracts.push(dataCNRLbundle4) */
    // module ref contract utility type
    const dataCNRLbundle6 = {}
    dataCNRLbundle6.reftype = 'module'
    dataCNRLbundle6.type = 'compute'
    dataCNRLbundle6.primary = 'genesis'
    dataCNRLbundle6.concept = ''
    dataCNRLbundle6.grid = []
    dataCNRLbundle6.dtcompute = []
    dataCNRLbundle6.dtresult = []
    dataCNRLbundle6.category = []
    dataCNRLbundle6.compute = ''
    dataCNRLbundle6.controlpanel = []
    dataCNRLbundle6.automation = false
    dataCNRLbundle6.time = { realtime: 0, timeseg: [], startperiod: '' }
    moduleContracts.push(dataCNRLbundle6)
    // CNRL implementation contract e.g. from mobile phone sqlite table structure
    const dataCNRLbundle5 = {}
    dataCNRLbundle5.reftype = 'module'
    dataCNRLbundle5.type = 'visualise'
    dataCNRLbundle5.primary = 'genesis'
    dataCNRLbundle5.grid = []
    moduleContracts.push(dataCNRLbundle5)
    // CNRL implementation contract e.g. from mobile phone sqlite table structure
    const dataCNRLbundle7 = {}
    dataCNRLbundle7.reftype = 'module'
    dataCNRLbundle7.type = 'education'
    dataCNRLbundle7.primary = 'genesis'
    dataCNRLbundle7.concept = ''
    dataCNRLbundle7.grid = []
    moduleContracts.push(dataCNRLbundle7)
    /* const dataCNRLbundle8 = {}
    dataCNRLbundle8.reftype = 'module'
    dataCNRLbundle8.type = 'lifestyle'
    dataCNRLbundle8.primary = 'genesis'
    dataCNRLbundle8.concet = ''
    dataCNRLbundle8.grid = []
    moduleContracts.push(dataCNRLbundle8) */
    /* const dataCNRLbundle9 = {}
    dataCNRLbundle9.reftype = 'module'
    dataCNRLbundle9.type = 'error'
    dataCNRLbundle9.primary = 'genesis'
    dataCNRLbundle9.concept = ''
    dataCNRLbundle9.grid = []
    moduleContracts.push(dataCNRLbundle9) */
    /* const dataCNRLbundle10 = {}
    dataCNRLbundle10.reftype = 'module'
    dataCNRLbundle10.type = 'control'
    dataCNRLbundle10.primary = 'genesis'
    dataCNRLbundle10.concept = ''
    dataCNRLbundle10.grid = []
    moduleContracts.push(dataCNRLbundle10) */
    const dataCNRLbundle11 = {}
    dataCNRLbundle11.reftype = 'module'
    dataCNRLbundle11.type = 'prescription'
    dataCNRLbundle11.primary = 'genesis'
    dataCNRLbundle11.concept = ''
    dataCNRLbundle11.grid = []
    moduleContracts.push(dataCNRLbundle11)
    /* const dataCNRLbundle12 = {}
    dataCNRLbundle12.reftype = 'module'
    dataCNRLbundle12.type = 'communication'
    dataCNRLbundle12.primary = 'genesis'
    dataCNRLbundle12.concept = ''
    dataCNRLbundle12.grid = []
    moduleContracts.push(dataCNRLbundle12) */
    // CNRL implementation contract e.g. from mobile phone sqlite table structure
    /* const dataCNRLbundle13 = {}
    dataCNRLbundle13.reftype = 'module'
    dataCNRLbundle13.type = 'idea'
    dataCNRLbundle13.primary = 'genesis'
    dataCNRLbundle13.concept = ''
    dataCNRLbundle13.grid = []
    moduleContracts.push(dataCNRLbundle13) */
    const dataCNRLbundle14 = {}
    dataCNRLbundle14.reftype = 'module'
    dataCNRLbundle14.type = 'rhino'
    dataCNRLbundle14.primary = 'genesis'
    dataCNRLbundle14.concept = ''
    dataCNRLbundle14.grid = []
    moduleContracts.push(dataCNRLbundle14)
    const dataCNRLbundle15 = {}
    dataCNRLbundle15.reftype = 'module'
    dataCNRLbundle15.type = 'pricing'
    dataCNRLbundle15.primary = 'genesis'
    dataCNRLbundle15.concept = ''
    dataCNRLbundle15.grid = []
    moduleContracts.push(dataCNRLbundle15)

    let genesisModules = {}
    genesisModules.action = 'tempmodule'
    genesisModules.data = moduleContracts
    return genesisModules
  }

}

export default LibContracts
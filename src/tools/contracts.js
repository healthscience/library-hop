'use strict'
/**
*  new, update, delete contracts modules and reference
*
*
* @class LibContracts
* @package    network-library
* @copyright  Copyright (c) 2024 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import util from 'util'
import EventEmitter from 'events'

class LibContracts extends EventEmitter {

  constructor(Holepunch, Composer) {
    super()
    this.liveHolepunch = Holepunch
    this.libComposer = Composer
    this.modulesStart = this.modulesGenesis()
  }


  /**
  * library put into categorises of contracts, module, reference, genesis etc.
  * @method libraryQuerypath
  *
  */
  libraryQuerypath = function (path, action, data) {
    let libraryData = {}
    libraryData.data = 'contracts'
    libraryData.type = 'peerprivate'
    const segmentedRefContracts = this.libComposer.liveRefcontUtility.refcontractSperate(data)
    libraryData.referenceContracts = segmentedRefContracts
    // need to split for genesis and peer joined NXPs
    const nxpSplit = this.libComposer.liveRefcontUtility.experimentSplit(segmentedRefContracts.experiment)
    libraryData.splitExperiments = nxpSplit
    // look up modules for this experiments
    libraryData.networkExpModules = this.libComposer.liveRefcontUtility.expMatchModuleGenesis(libraryData.referenceContracts.module, nxpSplit.genesis)
    libraryData.networkPeerExpModules = this.libComposer.liveRefcontUtility.expMatchModuleJoined(libraryData.referenceContracts.module, nxpSplit.joined)
    return libraryData
  }


  /**
  * new module contracts (temporary for creation of new )
  * @method latestModuleContract
  *
  */
  latestModuleContract = async function (modStyle, module) {
    if (modStyle === 'compute') {
      const getModulesComputeLINK = await this.liveHolepunch.BeeData.getPeerLibComputeModules(module.key)
      for await (const { seq, value } of getModulesComputeLINK) {
      }
      let allComputesperKey = []
      for await (const { key, value } of getModulesComputeLINK) {
        if (value.link === module.key) {
          allComputesperKey.push({ key: key, value: value})
        }
      }
      return allComputesperKey[0]
    } else if (modStyle === 'visualisation') {
    }
  }


  /**
  * new module contracts (temporary for creation of new )
  * @method moduleContractGenesis
  *
  */
  moduleTempContractGenesis = function (inputSpec, publicLib) {
    let minStartlist = this.minModulesetup()
    // take the genesis and make new instances of the Module Contracts i.e. unique keys
    let tempModContracts = this.tempModuleContractsCreate(minStartlist, inputSpec)
    // extract data, compute and visualisation ref contracts
    let contractsPublic = this.splitMCfromRC(publicLib)
    // extract out observaation compute and charting ref contracts,  packaging more work required, need save data and then create new data packaging contract, add settings controls to compute ref and settings to vis ref. contract
    let experimentStructure = this.extractRefContractsPublicLib(contractsPublic.reference, inputSpec)
    // let buildNewExperiment = this.buildNewExperimentContract(tempModContracts)
    let genesisContracts = {}
    genesisContracts.experiment = experimentStructure
    genesisContracts.modules = tempModContracts
    return genesisContracts
  }

  /**
  * new network work experiment module (special genesis holds other moduless)
  * @method experimentContractGenesis
  *
  */
  experimentContractGenesis = async function (newMods) {
    // a new genesis network experiment to store to network library
    let moduleGenesisList = []
    let moduleGenesisExpanded = []
    let modKeys = Object.keys(newMods.data)
    let newModCount = modKeys.length
    for (let mh of modKeys) {
      if (newMods.data[mh][0].value.refcontract === 'compute') {
        let controlOptions = this.defautComputeRefOptions()
        newMods.data[mh][0].value['controls'] = controlOptions.controls
        newMods.data[mh][0].value['settings'] = controlOptions.settings
      } else if (newMods.data[mh][0].value.refcontract === 'visualise') {
        newMods.data[mh][0].value['settings'] = this.defautVisualiseRefOptions()
      }
      const moduleNewContract = this.libComposer.liveComposer.moduleComposer(newMods.data[mh][0], '')
      const savedFeedback = await this.liveHolepunch.BeeData.savePubliclibrary(moduleNewContract)
      moduleGenesisList.push(savedFeedback.key)
      // stand key value format or query and get back ref contract double check TODO
      let moduleContract = {}
      moduleContract.key = savedFeedback.key
      moduleContract.value = savedFeedback.contract
      moduleGenesisExpanded.push(moduleContract)
      newModCount--
    }
    if (newModCount === 0) {
      // aggregate all modules into exeriment contract
      let genesisRefContract = this.libComposer.liveComposer.experimentComposerGenesis(moduleGenesisList)
      // double check they are created
      const savedFeedback = await this.liveHolepunch.BeeData.savePubliclibrary(genesisRefContract)
      savedFeedback.expanded = moduleGenesisExpanded
      return savedFeedback
    }
  }

  /**
  * prepare the update to the module contracts
  * @method prepareUpdatesNXP
  *
  */
  prepareUpdatesNXP = function (updateMods) {
    // loop over modules and make updates
    let updateGen = updateMods.updates
    let moduleUpdate = []
    for (let mod of updateMods.genesisnxp.modules) {
      if (mod.value.style === 'compute') {
        let currentContract = mod
        currentContract.value.info.controls.devices = updateGen.devices
        currentContract.value.info.controls.xaxis = updateGen.xaxis
        currentContract.value.info.controls.yaxis = updateGen.yaxis
        currentContract.value.info.controls.category = updateGen.category
        currentContract.value.info.controls.date = updateGen.time
        currentContract.value.info.controls.rangedate = []
        currentContract.value.info.controls.rangedate.push(updateGen.time)
        currentContract.value.info.controls.tidy = updateGen.tidy
        currentContract.value.info.controls.category = updateGen.category
        currentContract.value.info.controls.resolution = updateGen.resolution
        currentContract.value.info.controls.timeformat = updateGen.timeformat
        currentContract.value.info.controls.chartstyle = updateGen.chartstyle
        // settings all available options
        currentContract.value.info.settings.devices.push(updateGen.devices)
        currentContract.value.info.settings.deviceOptions = updateGen.opendata.devices
        currentContract.value.info.settings.xaxis = updateGen.xaxis
        currentContract.value.info.settings.yaxis = updateGen.yaxis
        currentContract.value.info.settings.category = updateGen.category
        currentContract.value.info.settings.timeformat = updateGen.timeformat
        moduleUpdate.push(currentContract)
        // set compute controls and settings
      } else if (mod.value.style === 'visualise') {
        let currentContract = mod
        currentContract.value.info.settings.devices.push(updateGen.devices)
        currentContract.value.info.settings.axis = updateGen.xaxis
        currentContract.value.info.settings.yaxis = updateGen.yaxis
        currentContract.value.info.settings.category = updateGen.category
        currentContract.value.info.settings.timeformat = updateGen.selectedTimeFormat
        moduleUpdate.push(currentContract)
      } else {
        moduleUpdate.push(mod)
      }
    }
    let currentNXP = updateMods.genesisnxp
    currentNXP.modules = moduleUpdate
    return currentNXP
  }

  /**
  * join network experiment NXP
  * @method prepareJoinNXP
  *
  */
  prepareJoinNXP = async function (genesisNXP) {
    let modulePrivateList = []
    let newModCount = genesisNXP.modules.length
    let moduleJoinedList = []
    for (let mh of genesisNXP.modules) {
      let prepModContract = this.libComposer.liveComposer.moduleComposer(mh, 'join')
      const savedFeedback = await this.liveHolepunch.BeeData.savePeerLibrary(prepModContract)
      modulePrivateList.push(savedFeedback.key)
      let moduleContract = {}
      moduleContract.key = savedFeedback.key
      moduleContract.value = savedFeedback.contract
      moduleJoinedList.push(moduleContract)
      newModCount--
    }
    // check all modules are present and create peers network refcont joined
    if (newModCount === 0) {
      // aggregate all modules into exeriment contract
      // double check they are created
      let joinRefContract = this.libComposer.liveComposer.experimentComposerJoin(genesisNXP.exp.key, modulePrivateList)
      const savedFeedback = await this.liveHolepunch.BeeData.savePeerLibrary(joinRefContract)
      // make safeflow format of network experiment
      let networkExperimentForm = {}
      networkExperimentForm.exp = {}
      networkExperimentForm.exp = { key: savedFeedback.key, values: savedFeedback.contract }
      networkExperimentForm.modules = moduleJoinedList
      return networkExperimentForm
    }
  }

  /**
  * four min modules required to start NXP with
  * @method minModulesetup
  *
  */
  minModulesetup = function () {
    let ModulesMinrequired = ['question', 'packaging', 'compute', 'visualise']
    let minStartlist = []
    for (const mtype of ModulesMinrequired) {
      let match = this.modulesStart.data.filter(e => e.style === mtype)
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
      if (mc.style === 'question') {
        mc.description = mc.description + file
      }
      const prepareModule = this.libComposer.liveComposer.moduleComposer(mc, 'temp')
      let moduleContainer = {}
      moduleContainer.name = prepareModule.data.contract.concept.style
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
      } else if (rc?.value?.refcontract === 'visualise' && rc?.value?.computational?.name === 'chartjs') {
        refBuilds.push(rc)
      }
    }
    // need to build a custom data packaging ref contract
    const newPackagingMap = this.defautPackagingOptions(fileName)
    let deviceInfo = {}
    deviceInfo.id = this.defautDeviceOptions(fileName)
    newPackagingMap.device = deviceInfo
    // blind prepare
    let packagingRef = this.libComposer.liveComposer.packagingRefLive.packagingBlindPrepare(newPackagingMap)
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
    let formExpmoduleContract = this.libComposer.liveComposer.experimentComposerJoin(modKeys)
    safeFlowQuery.exp = {}
    safeFlowQuery.exp.key = formExpmoduleContract.data.hash
    safeFlowQuery.exp.value = formExpmoduleContract.data.contract
    return safeFlowQuery
  }

  /**
  * prepare blind query for SafeFlow
  * @method prepareBlindSafeFlowStucture
  *
  */
  prepareBlindSafeFlowStucture = function (moduleContracts, refContracts, fileInfo, LLMdata) {
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
    let formExpmoduleContract = this.libComposer.liveComposer.experimentComposerJoin(modKeys)
    safeFlowQuery.exp = {}
    safeFlowQuery.exp.key = formExpmoduleContract.data.hash
    safeFlowQuery.exp.value = formExpmoduleContract.data.contract
    // this needs to be save in Holepunch to update structure to keys
    // next need to add reference Contracts to Module Contracts in correct format
    let joinStructureMC = {}
    joinStructureMC.key = ''
    joinStructureMC.value = {info: {}, refcontract: 'module', style: 'packaging'}
    // info structure
    // let info = {}
    // e.g. info.data = { key  value }  change data for name of contracts (is this good decision???)
    // info.type = 'data
    // need to form joined modle contract with expaneded to include reference contract
    // structure needs to be modIn.type  modIn.data = temMC with refcontract embedded
    for (let tmc of moduleContracts) {
      let inputStructure = {}
      if(tmc.name === 'question') {
        inputStructure.style = 'question'
        let dataMCRC = {}
        dataMCRC.question = { forum: '', text: fileInfo }
        inputStructure.style = 'question'
        inputStructure.data = dataMCRC
        } else if(tmc.name === 'packaging') {
          let dataMCRC = {}
          let extractRC = refContracts.filter(e => e.value.refcontract === 'packaging')
          dataMCRC = extractRC[0] // data packaging contract
          inputStructure.style = 'packaging'
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
          timeformat: ''
        }
        dataMCRC.controls = controls
        dataMCRC.settings = settings
        inputStructure = dataMCRC
        inputStructure.style = 'compute'
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
          yaxis: [ '' ],
          resolution: '',
          timeformat: '',
          single: true,
          multidata: false
        }
        dataMCRC.settings = settings
        inputStructure = dataMCRC
        inputStructure.style = 'visualise'
      }
      const prepareModule = this.libComposer.liveComposer.moduleComposer(inputStructure, 'join')
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
    // Module holder to contain reference contracts
    const modCueBundle = {}
    modCueBundle.reftype = 'module'
    modCueBundle.style = 'cue'
    modCueBundle.primary = 'genesis'
    modCueBundle.description = 'attends to intelligence signals'
    modCueBundle.concept = ''
    modCueBundle.relationship = []
    modCueBundle.grid = []
    moduleContracts.push(modCueBundle)
    // Module holder to contains stages cues, prompts, order
    const modPathsBundle = {}
    modPathsBundle.reftype = 'module'
    modPathsBundle.style = 'paths'
    modPathsBundle.primary = 'genesis'
    modPathsBundle.description = 'flow through cues & data'
    modPathsBundle.concept = ''
    modPathsBundle.stages = []
    modPathsBundle.relationship = []
    modPathsBundle.grid = []
    moduleContracts.push(modPathsBundle)
    // Module holder for decision making
    const modDecisionBundle = {}
    modDecisionBundle.reftype = 'module'
    modDecisionBundle.style = 'paths'
    modDecisionBundle.primary = 'genesis'
    modDecisionBundle.description = 'flow through cues & data'
    modDecisionBundle.concept = ''
    modDecisionBundle.oracle = []
    modDecisionBundle.balance = []
    modDecisionBundle.relationship = []
    modDecisionBundle.grid = []
    moduleContracts.push(modDecisionBundle)
    // Module holder to contain reference contracts
    const dataCNRLbundle = {}
    dataCNRLbundle.reftype = 'module'
    dataCNRLbundle.style = 'question'
    dataCNRLbundle.primary = 'genesis'
    dataCNRLbundle.description = 'Question for network experiment'
    dataCNRLbundle.concept = ''
    dataCNRLbundle.grid = []
    moduleContracts.push(dataCNRLbundle)
    // Module holder to contain reference contracts
    const dataCNRLbundle2 = {}
    dataCNRLbundle2.reftype = 'module'
    dataCNRLbundle2.style = 'packaging'
    dataCNRLbundle2.primary = 'genesis'
    dataCNRLbundle2.description = 'data source(s) for network experiment'
    dataCNRLbundle2.grid = []
    moduleContracts.push(dataCNRLbundle2)
    // CNRL implementation contract e.g. from mobile phone sqlite table structure
    /* const dataCNRLbundle3 = {}
    dataCNRLbundle3.reftype = 'module'
    dataCNRLbundle3.style = 'device'
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
    dataCNRLbundle6.style = 'compute'
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
    // Module holder to contain reference contracts
    const dataCNRLbundle5 = {}
    dataCNRLbundle5.reftype = 'module'
    dataCNRLbundle5.style = 'visualise'
    dataCNRLbundle5.primary = 'genesis'
    dataCNRLbundle5.grid = []
    moduleContracts.push(dataCNRLbundle5)
    // Module holder to contain reference contracts
    const dataCNRLbundle7 = {}
    dataCNRLbundle7.reftype = 'module'
    dataCNRLbundle7.style = 'education'
    dataCNRLbundle7.primary = 'genesis'
    dataCNRLbundle7.concept = ''
    dataCNRLbundle7.grid = []
    moduleContracts.push(dataCNRLbundle7)
    /* const dataCNRLbundle8 = {}
    dataCNRLbundle8.reftype = 'module'
    dataCNRLbundle8.style = 'lifestyle'
    dataCNRLbundle8.primary = 'genesis'
    dataCNRLbundle8.concet = ''
    dataCNRLbundle8.grid = []
    moduleContracts.push(dataCNRLbundle8) */
    /* const dataCNRLbundle9 = {}
    dataCNRLbundle9.reftype = 'module'
    dataCNRLbundle9.style = 'error'
    dataCNRLbundle9.primary = 'genesis'
    dataCNRLbundle9.concept = ''
    dataCNRLbundle9.grid = []
    moduleContracts.push(dataCNRLbundle9) */
    /* const dataCNRLbundle10 = {}
    dataCNRLbundle10.reftype = 'module'
    dataCNRLbundle10.style = 'control'
    dataCNRLbundle10.primary = 'genesis'
    dataCNRLbundle10.concept = ''
    dataCNRLbundle10.grid = []
    moduleContracts.push(dataCNRLbundle10) */
    const dataCNRLbundle11 = {}
    dataCNRLbundle11.reftype = 'module'
    dataCNRLbundle11.style = 'prescription'
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
    dataCNRLbundle14.style = 'rhino'
    dataCNRLbundle14.primary = 'genesis'
    dataCNRLbundle14.concept = ''
    dataCNRLbundle14.grid = []
    moduleContracts.push(dataCNRLbundle14)
    const dataCNRLbundle15 = {}
    dataCNRLbundle15.reftype = 'module'
    dataCNRLbundle15.style = 'pricing'
    dataCNRLbundle15.primary = 'genesis'
    dataCNRLbundle15.concept = ''
    dataCNRLbundle15.grid = []
    moduleContracts.push(dataCNRLbundle15)

    let genesisModules = {}
    genesisModules.action = 'tempmodule'
    genesisModules.data = moduleContracts
    return genesisModules
  }

  /**
  * default device info options
  * @method defautDeviceOptions
  *
  */
  defautDeviceOptions = function (fileName) {
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

    return deviceInfo
  }

  /**
  * default controls and settings for referenc compute contracts
  * @method defautPackagingOptions
  *
  */
  defautPackagingOptions = function (fileName) {
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
    // need to match info to reference data types
    newPackagingMap.apicolumns = {}
    newPackagingMap.apicolHolder = {}
    return newPackagingMap
  }

  /**
  * default controls and settings for referenc compute contracts
  * @method defautComputeRefOptions
  *
  */
  defautComputeRefOptions = function () {
    let cOptions = {}
    let currentQtime = new Date()
    const blindDate = currentQtime.getTime()
    let controls = { date: blindDate, rangedate: [ blindDate ] }
    let settings = {
      devices: [],
      data: null,
      compute: '',
      visualise: 'line',
      category: [ 'none' ],
      timeperiod: '',
      xaxis: '',
      yaxis: [ 'blind1234555554321' ],
      resolution: '',
      timeformat: '',
      single: true,
      multidata: false
    }
    cOptions.controls =  controls
    cOptions.settings = settings
    return cOptions
  }

    /**
  * default controls and settings for referenc compute contracts
  * @method defautVisualiseRefOptions
  *
  */
  defautVisualiseRefOptions = function () {  
    let settings = {
      devices: [],
      data: null,
      compute: '',
      visualise: 'line',
      category: [ 'none' ],
      timeperiod: '',
      xaxis: '',
      yaxis: [],
      resolution: '',
      timeformat: ''
    }
    return settings
  }

}

export default LibContracts
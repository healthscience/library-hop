'use strict'

import hopSpeak from './hopSpeak.json' with { type: 'json' }

/**
 * Orrery class to manage key HOP terminology and culture seed data
 * @class Orrery
 */
class Orrery {
  constructor() {}

  /**
   * turn key HOP terminology in to a cue
   * @method HOPspeak 
   * @returns {Array} List of cue contracts
   */
  HOPspeak = function () {
    let cues = []
    
    for (const [key, value] of Object.entries(hopSpeak.properties)) {
      const refContract = {}
      refContract.type = 'library'
      refContract.action = 'contracts'
      refContract.reftype = 'cue'
      refContract.task = 'PUT'
      refContract.privacy = 'public'
      
      let cueSettings = {}
      cueSettings.primary = true
      cueSettings.name = key
      cueSettings.description = value.definition
      cueSettings.domain = value.domain
      cueSettings.type = value.type
      
      refContract.data = cueSettings
      cues.push(refContract)
    }

    return cues
  }

  /**
   * prepare save contract message for culture
   * @method prepareDTcultureMessage
   * @returns {Array} List of culture datatype contracts
   */
  prepareDTcultureMessage = function () {
    let gaiaJack = []
    // economy
    const refContract = {}
    refContract.type = 'library'
    refContract.action = 'contracts'
    refContract.reftype = 'datatype'
    refContract.task = 'PUT'
    refContract.privacy = 'public'
    let dtSettings = {}
    dtSettings.primary = true
    dtSettings.name = 'economy'
    dtSettings.description = 'human sytem to allocate resources'
    dtSettings.wiki = 'https://en.wikipedia.org/wiki/Economy'
    dtSettings.rdf = 'https://dbpedia.org/page/Economy'
    dtSettings.measurement = 'Integer'
    dtSettings.datatypeType = 'datatype'
    refContract.data = dtSettings
    gaiaJack.push(refContract)

    // work
    const refContract1 = {}
    refContract1.type = 'library'
    refContract1.action = 'contracts'
    refContract1.reftype = 'datatype'
    refContract1.task = 'PUT'
    refContract1.privacy = 'public'
    let dtSettings1 = {}
    dtSettings1.primary = true
    dtSettings1.name = 'work'
    dtSettings1.description = 'human activity to produce goods and services'
    dtSettings1.wiki = 'https://en.wikipedia.org/wiki/Work_(human_activity)'
    dtSettings1.rdf = 'https://dbpedia.org/page/Work_(human_activity)'
    dtSettings1.measurement = 'Integer'
    dtSettings1.datatypeType = 'datatype'
    refContract1.data = dtSettings1
    gaiaJack.push(refContract1)

    // arts
    const refContract2 = {}
    refContract2.type = 'library'
    refContract2.action = 'contracts'
    refContract2.reftype = 'datatype'
    refContract2.task = 'PUT'
    refContract2.privacy = 'public'
    let dtSettings2 = {}
    dtSettings2.primary = true
    dtSettings2.name = 'arts'
    dtSettings2.description = 'human expression of creativity'
    dtSettings2.wiki = 'https://en.wikipedia.org/wiki/The_arts'
    dtSettings2.rdf = 'https://dbpedia.org/page/The_arts'
    dtSettings2.measurement = 'Integer'
    dtSettings2.datatypeType = 'datatype'
    refContract2.data = dtSettings2
    gaiaJack.push(refContract2)

    return gaiaJack
  }
}

export default Orrery

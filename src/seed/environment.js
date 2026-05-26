'use strict'

/**
 * Environment class to manage environment seed data
 * @class Environment
 */
class Environment {
  constructor() {}

  /**
   * prepare save contract message for environment
   * @method prepareDTenvironmentMessage
   * @returns {Array} List of environment datatype contracts
   */
  prepareDTenvironmentMessage = function () {
    let gaiaJack = []
    // agriculture
    const refContract = {}
    refContract.type = 'library'
    refContract.action = 'contracts'
    refContract.reftype = 'datatype'
    refContract.task = 'PUT'
    refContract.privacy = 'public'
    let dtSettings = {}
    dtSettings.primary = true
    dtSettings.name = 'agriculture'
    dtSettings.description = 'farming and gardening'
    dtSettings.wiki = 'https://en.wikipedia.org/wiki/Agriculture'
    dtSettings.rdf = 'https://dbpedia.org/page/Agriculture'
    dtSettings.measurement = 'Integer'
    dtSettings.datatypeType = 'datatype'
    refContract.data = dtSettings
    gaiaJack.push(refContract)

    // building
    const refContract1 = {}
    refContract1.type = 'library'
    refContract1.action = 'contracts'
    refContract1.reftype = 'datatype'
    refContract1.task = 'PUT'
    refContract1.privacy = 'public'
    let dtSettings1 = {}
    dtSettings1.primary = true
    dtSettings1.name = 'building'
    dtSettings1.description = 'shelter to living accommodation to factories'
    dtSettings1.wiki = 'https://en.wikipedia.org/wiki/Building'
    dtSettings1.rdf = 'https://dbpedia.org/page/Building'
    dtSettings1.measurement = 'Integer'
    dtSettings1.datatypeType = 'datatype'
    refContract1.data = dtSettings1
    gaiaJack.push(refContract1)

    // travel
    const refContract2 = {}
    refContract2.type = 'library'
    refContract2.action = 'contracts'
    refContract2.reftype = 'datatype'
    refContract2.task = 'PUT'
    refContract2.privacy = 'public'
    let dtSettings2 = {}
    dtSettings2.primary = true
    dtSettings2.name = 'travel'
    dtSettings2.description = 'moving around'
    dtSettings2.wiki = 'https://en.wikipedia.org/wiki/Travel'
    dtSettings2.rdf = 'https://dbpedia.org/page/Travel'
    dtSettings2.measurement = 'Integer'
    dtSettings2.datatypeType = 'datatype'
    refContract2.data = dtSettings2
    gaiaJack.push(refContract2)

    return gaiaJack
  }
}

export default Environment

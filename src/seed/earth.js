'use strict'

/**
 * Earth class to manage planet boundaries, nature, and gaia seed data
 * @class Earth
 */
class Earth {
  constructor() {}

  /**
   * prepare datatypes planet boundaries
   * @method prepareDTplanetMessage
   * @returns {Array} List of planet boundary datatype contracts
   */
  prepareDTplanetMessage = function () {
    let planetBoundaries = []
    planetBoundaries.push({ name: 'Earth planet boundaries', description: 'gaia', wikipedia: 'Planetary_boundaries' })
    planetBoundaries.push({ name: 'Ozone depletion', description: '', wikipedia: 'Ozone_depletion' })
    planetBoundaries.push({ name: 'Aresol loading', description: '', wikipedia: 'Aerosol' })
    planetBoundaries.push({ name: 'Ocean acidification', description: '', wikipedia: 'Ocean_acidification' })
    planetBoundaries.push({ name: 'Bio geochemical flows', description: '', wikipedia: 'Biogeochemistry' })
    planetBoundaries.push({ name: 'Freshwater change', description: '', wikipedia: 'Water_scarcity' })
    planetBoundaries.push({ name: 'Landsystem change', description: '', wikipedia: 'Land_use' })
    planetBoundaries.push({ name: 'Biosphere integrity', description: '', wikipedia: 'Biodiversity_loss' })
    planetBoundaries.push({ name: 'Climate change', description: '', wikipedia: 'Climate_change' })
    planetBoundaries.push({ name: 'Novel entities', description: '', wikipedia: 'Pollution' })

    let gaiaJack = []
    for (let wiki of planetBoundaries) {
      const refContract = {}
      refContract.type = 'library'
      refContract.action = 'contracts'
      refContract.reftype = 'datatype'
      refContract.task = 'PUT'
      refContract.privacy = 'public'
      let dtSettings = {}
      dtSettings.primary = true
      dtSettings.name = wiki.name
      dtSettings.description = wiki.description
      dtSettings.wiki = 'https://en.wikipedia.org/wiki/' + wiki.wikipedia
      dtSettings.rdf = 'https://dbpedia.org/page/' + wiki.wikipedia
      dtSettings.measurement = 'Integer'
      dtSettings.datatypeType = 'datatype'
      refContract.data = dtSettings
      gaiaJack.push(refContract)
    }
    return gaiaJack
  }

  /**
   * prepare save contract message for nature
   * @method prepareDTnatureMessage
   * @returns {Array} List of nature datatype contracts
   */
  prepareDTnatureMessage = function () {
    let gaiaJack = []
    // universe
    const refContract = {}
    refContract.type = 'library'
    refContract.action = 'contracts'
    refContract.reftype = 'datatype'
    refContract.task = 'PUT'
    refContract.privacy = 'public'
    let dtSettings = {}
    dtSettings.primary = true
    dtSettings.name = 'universe'
    dtSettings.description = 'stuff and everything'
    dtSettings.wiki = 'https://en.wikipedia.org/wiki/Universe'
    dtSettings.rdf = 'https://dbpedia.org/page/Universe'
    dtSettings.measurement = 'Integer'
    dtSettings.datatypeType = 'datatype'
    refContract.data = dtSettings
    gaiaJack.push(refContract)

    // climate
    const refContract1 = {}
    refContract1.type = 'library'
    refContract1.action = 'contracts'
    refContract1.reftype = 'datatype'
    refContract1.task = 'PUT'
    refContract1.privacy = 'public'
    let dtSettings1 = {}
    dtSettings1.primary = true
    dtSettings1.name = 'climate'
    dtSettings1.description = 'weather over time'
    dtSettings1.wiki = 'https://en.wikipedia.org/wiki/Climate'
    dtSettings1.rdf = 'https://dbpedia.org/page/Climate'
    dtSettings1.measurement = 'Integer'
    dtSettings1.datatypeType = 'datatype'
    refContract1.data = dtSettings1
    gaiaJack.push(refContract1)

    // biodiversity
    const refContract2 = {}
    refContract2.type = 'library'
    refContract2.action = 'contracts'
    refContract2.reftype = 'datatype'
    refContract2.task = 'PUT'
    refContract2.privacy = 'public'
    let dtSettings2 = {}
    dtSettings2.primary = true
    dtSettings2.name = 'biodiversity'
    dtSettings2.description = 'life on earth'
    dtSettings2.wiki = 'https://en.wikipedia.org/wiki/Biodiversity'
    dtSettings2.rdf = 'https://dbpedia.org/page/Biodiversity'
    dtSettings2.measurement = 'Integer'
    dtSettings2.datatypeType = 'datatype'
    refContract2.data = dtSettings2
    gaiaJack.push(refContract2)

    return gaiaJack
  }

  /**
   * prepare save contract message for gaia
   * @method prepareDTgaiaMessage
   * @returns {Array} List of gaia datatype contracts
   */
  prepareDTgaiaMessage = function () {
    let gaiaJack = []
    // gaia
    const refContract = {}
    refContract.type = 'library'
    refContract.action = 'contracts'
    refContract.reftype = 'datatype'
    refContract.task = 'PUT'
    refContract.privacy = 'public'
    let dtSettings = {}
    dtSettings.primary = true
    dtSettings.name = 'gaia'
    dtSettings.description = 'sovereign intelligence'
    dtSettings.wiki = 'https://en.wikipedia.org/wiki/Gaia_hypothesis'
    dtSettings.rdf = 'https://dbpedia.org/page/Gaia_hypothesis'
    dtSettings.measurement = 'Integer'
    dtSettings.datatypeType = 'datatype'
    refContract.data = dtSettings
    gaiaJack.push(refContract)

    // nature
    const refContract1 = {}
    refContract1.type = 'library'
    refContract1.action = 'contracts'
    refContract1.reftype = 'datatype'
    refContract1.task = 'PUT'
    refContract1.privacy = 'public'
    let dtSettings1 = {}
    dtSettings1.primary = true
    dtSettings1.name = 'nature'
    dtSettings1.description = 'rolling out of universe'
    dtSettings1.wiki = 'https://en.wikipedia.org/wiki/Nature'
    dtSettings1.rdf = 'https://dbpedia.org/page/Nature'
    dtSettings1.measurement = 'Integer'
    dtSettings1.datatypeType = 'datatype'
    refContract1.data = dtSettings1
    gaiaJack.push(refContract1)

    // environment
    const refContract2 = {}
    refContract2.type = 'library'
    refContract2.action = 'contracts'
    refContract2.reftype = 'datatype'
    refContract2.task = 'PUT'
    refContract2.privacy = 'public'
    let dtSettings2 = {}
    dtSettings2.primary = true
    dtSettings2.name = 'environment'
    dtSettings2.description = ''
    dtSettings2.wiki = 'https://en.wikipedia.org/wiki/Built_environment'
    dtSettings2.rdf = 'https://dbpedia.org/page/Built_environment'
    dtSettings2.measurement = 'Integer'
    dtSettings2.datatypeType = 'datatype'
    refContract2.data = dtSettings2
    gaiaJack.push(refContract2)

    // culture
    const refContract3 = {}
    refContract3.type = 'library'
    refContract3.action = 'contracts'
    refContract3.reftype = 'datatype'
    refContract3.task = 'PUT'
    refContract3.privacy = 'public'
    let dtSettings3 = {}
    dtSettings3.primary = true
    dtSettings3.name = 'culture'
    dtSettings3.description = 'humanity invention'
    dtSettings3.wiki = 'https://en.wikipedia.org/wiki/Culture'
    dtSettings3.rdf = 'https://dbpedia.org/page/Culture'
    dtSettings3.measurement = 'Integer'
    dtSettings3.datatypeType = 'datatype'
    refContract3.data = dtSettings3
    gaiaJack.push(refContract3)

    // life
    const refContract4 = {}
    refContract4.type = 'library'
    refContract4.action = 'contracts'
    refContract4.reftype = 'datatype'
    refContract4.task = 'PUT'
    refContract4.privacy = 'public'
    let dtSettings4 = {}
    dtSettings4.primary = true
    dtSettings4.name = 'life'
    dtSettings4.description = 'be alive'
    dtSettings4.wiki = 'https://en.wikipedia.org/wiki/Life'
    dtSettings4.rdf = 'https://dbpedia.org/page/Life'
    dtSettings4.measurement = 'Integer'
    dtSettings4.datatypeType = 'datatype'
    refContract4.data = dtSettings4
    gaiaJack.push(refContract4)

    return gaiaJack
  }

  /**
   * prepare all types of contracts to make cues
   * @method prepareFirstCues
   * @param {string} contract - Contract type key
   * @returns {object} Formed reference contract
   */
  prepareFirstCues = function (contract) {
    const refContract = {}
    refContract.type = 'library'
    refContract.action = 'contracts'
    refContract.reftype = contract
    refContract.task = 'PUT'
    refContract.privacy = 'public'
    if (contract === 'cue') {
      refContract.data = {}
    } else if (contract === 'datatype-gaia') {
      let dtSettings = {}
      dtSettings.primary = true
      dtSettings.name = 'gaia'
      dtSettings.description = 'rolling out of universe'
      dtSettings.wiki = 'https://en.wikipedia.org/wiki/Gaia_hypothesis'
      dtSettings.rdf = 'https://dbpedia.org/page/Gaia_hypothesis'
      dtSettings.measurement = 'Integer'
      dtSettings.datatypeType = 'datatype'
      refContract.data = dtSettings
    } else if (contract === 'datatype-nature') {
      let dtSettings = {}
      dtSettings.primary = true
      dtSettings.name = 'Earth'
      dtSettings.description = 'home planet'
      dtSettings.wiki = 'https://en.wikipedia.org/wiki/Earth'
      dtSettings.rdf = 'https://dbpedia.org/page/Earth'
      dtSettings.measurement = 'Integer'
      dtSettings.datatypeType = 'datatype'
      refContract.data = dtSettings
    } else if (contract === 'datatype-nature') {
      let dtSettings = {}
      dtSettings.primary = true
      dtSettings.name = 'Sun'
      dtSettings.description = 'home star'
      dtSettings.wiki = 'https://en.wikipedia.org/wiki/Sun'
      dtSettings.rdf = 'https://dbpedia.org/page/Sun'
      dtSettings.measurement = 'Integer'
      dtSettings.datatypeType = 'datatype'
      refContract.data = dtSettings
    } else if (contract === 'datatype-nature') {
      let dtSettings = {}
      dtSettings.primary = true
      dtSettings.name = 'Solar system'
      dtSettings.description = 'place in milky way'
      dtSettings.wiki = 'https://en.wikipedia.org/wiki/Solar_System'
      dtSettings.rdf = 'https://dbpedia.org/page/Solar_System'
      dtSettings.measurement = 'Integer'
      dtSettings.datatypeType = 'datatype'
      refContract.data = dtSettings
    } else if (contract === 'datatype-nature') {
      let dtSettings = {}
      dtSettings.primary = true
      dtSettings.name = 'gaia'
      dtSettings.description = 'rolling out of universe'
      dtSettings.wiki = 'https://en.wikipedia.org/wiki/Nature'
      dtSettings.rdf = 'https://dbpedia.org/page/Nature'
      dtSettings.measurement = 'Integer'
      dtSettings.datatypeType = 'datatype'
      refContract.data = dtSettings
    } else if (contract === 'datatype-environment') {
      let dtSettings = {}
      dtSettings.primary = true
      dtSettings.name = 'environment'
      dtSettings.description = 'man molding of nature'
      dtSettings.wiki = 'https://en.wikipedia.org/wiki/Built_environment'
      dtSettings.rdf = 'https://dbpedia.org/page/Built_environment'
      dtSettings.measurement = 'Integer'
      dtSettings.datatypeType = 'datatype'
      refContract.data = dtSettings
    } else if (contract === 'datatype-culture') {
      let dtSettings = {}
      dtSettings.primary = true
      dtSettings.name = 'culture'
      dtSettings.description = 'human innovation arts to tech'
      dtSettings.wiki = 'https://en.wikipedia.org/wiki/Culture'
      dtSettings.rdf = 'https://dbpedia.org/page/Culture'
      dtSettings.measurement = 'Integer'
      dtSettings.datatypeType = 'datatype'
      refContract.data = dtSettings
    } else if (contract === 'datatype-life') {
      let dtSettings = {}
      dtSettings.primary = true
      dtSettings.name = 'life'
      dtSettings.description = 'the game of life'
      dtSettings.wiki = 'https://en.wikipedia.org/wiki/Life'
      dtSettings.rdf = 'https://dbpedia.org/page/Life'
      dtSettings.measurement = 'Integer'
      dtSettings.datatypeType = 'datatype'
      refContract.data = dtSettings
    }
    return refContract
  }
}

export default Earth

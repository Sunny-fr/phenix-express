const Collection = require('../../../../src').MariaCollection
const ConceptModel = require('../models/ConceptModel')
const config = require('../config.json')

class ConceptCollection extends Collection {
    constructor(items) {
        super(items)
        this.ModelConstructor = ConceptModel
        this.setConfig(config)
    }
}

module.exports = ConceptCollection
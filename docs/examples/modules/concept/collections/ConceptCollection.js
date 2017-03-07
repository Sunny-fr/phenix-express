const Collection = require('../../../framework/Collection')
const ConceptModel = require('../models/ConceptModel')

class ConceptCollection extends Collection {
    constructor(items) {
        super(items)
        //this.Schema = ConceptSchema
        this.ModelConstructor = ConceptModel
    }
}

module.exports = ConceptCollection
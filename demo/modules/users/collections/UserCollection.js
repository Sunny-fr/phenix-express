const Collection = require('../../../../src').MariaCollection
const ConceptModel = require('../models/UserModel')
const config = require('../config')

class UserCollection extends Collection {
    constructor(items) {
        super(items)
        this.ModelConstructor = ConceptModel
        this.setConfig(config)
    }
}

module.exports = UserCollection
const MariaModel = require('../../../../src').MariaModel
const config = require('../config.json')
const defaults = {
    name: '',
    description: '',
    type:'',
    namespace: '',
    links: [],
    symbols: []
}

class ConceptModel extends MariaModel {
    constructor(attr) {
        super(attr, defaults)
        this.setConfig(config)
    }
}

module.exports = ConceptModel
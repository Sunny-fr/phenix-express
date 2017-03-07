const MariaModel = require('../../../framework/model/MariaModel')

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
    }
}

module.exports = ConceptModel
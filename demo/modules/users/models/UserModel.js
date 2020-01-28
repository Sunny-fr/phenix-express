const MariaModel = require('../../../../src').MariaModel
const config = require('../config')
const defaults = {
    firstName: '',
    lastName: '',
}

class UserModel extends MariaModel {
    constructor(attr) {
        super(attr, defaults)
        this.setConfig(config)
    }
}

module.exports = UserModel
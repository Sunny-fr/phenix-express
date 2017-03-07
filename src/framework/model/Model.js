const chalk = require('chalk')
const defaults = {}
class Model {

    constructor(attr, _defaults) {
        this.attributes = Object.assign({}, _defaults || defaults, attr)
    }

    log() {
        const green = chalk.green
        console.log(green.apply(green, arguments))
    }

    error(e) {
        throw new Error(e)
    }

    set(prop, value) {
        let data = {}
        if (typeof prop !== 'undefined' && typeof value !== 'undefined') {
            data[prop] = value
        } else {
            data = prop
        }
        this.attributes = Object.assign({}, this.attributes, data)
    }

    get(prop) {
        return prop ? this.attributes[prop] : this.attributes
    }

    toJSON() {
        return Object.assign({}, this.attributes)
    }

    serialize() {
        return Object.assign({}, this.attributes)
    }

}


module.exports = Model
const Model = require('../model/Model')

class Collection {

    constructor(items) {
        const list = items || [
                {a: 12, b: 13, c: 4},
                {a: 12, b: 11, c: 4},
                {a: 12, b: 11, c: 7}
            ]
        this.ModelConstructor = Model
        this.reset(list)
    }

    get (params) {
        const result = this.find(params)
        return result.length > 0 ? result[0] : null
    }

    reset(items) {
        const Model = this.ModelConstructor
        this.items = items.map(item => new Model(item))
        return this.items
    }

    fetch () {
        return new Promise((resolve, reject) => {
            resolve(this.reset(this.items, true))
        })
    }

    find (params) {
        return Object.keys(params).reduce((state, prop) => {
            return state.filter(item => item.get(prop) === params[prop])
        }, this.items)
    }

    toJSON() {
        return this.items.map(item => item.toJSON())
    }
}

module.exports = Collection
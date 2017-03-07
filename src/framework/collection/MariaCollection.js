const QueryBuilder = require('../query/MariaQueryBuilder')
const Client = require('mariasql')
const chalk = require('chalk')


class Collection {

    constructor(items) {
        this.items = items || []
        //this.Schema = null
        this.ModelConstructor = null
        const defaultConfig = {
            prop_id: ['id'],
            keyPicker: '*',
            table: 'concepts',
            limit: 50,
            maria: {
                host: 'localhost',
                user: 'root',
                db: 'somedb',
                password: 'sompass'
            }
        }
        this.setConfig(defaultConfig)
    }

    setConfig(config) {
        const c = Object.assign({}, config)
        this._id_props = c.prop_id
        this._keys = c.keyPicker
        this._table = c.table
        this._limit = c.limit
        this._maria = c.maria
    }

    // get (prop) {
    //   return prop ? this.attributes[prop] : this.attributes
    // }

    reset(items) {
        const Model = this.ModelConstructor
        this.items = items.map(item => new Model(item))
        return this.items
    }

    fetch() {
        //TODO MERGE A
        const client = new Client(this._maria)
        return new Promise((resolve, reject) => {
            const qb = new QueryBuilder({client})
            qb.query('SELECT ' + this._keys + ' FROM ' + this._table + ' LIMIT 0, ' + this._limit  , {useArray: false})
                .then((response) => {
                    client.end()
                    resolve(this.reset(response, true))
                })
                .catch(e => {
                    client.end()
                    reject(e)
                })
        })
    }

    toJSON() {
        return this.items.map(item => item.toJSON())
    }
}


module.exports = Collection
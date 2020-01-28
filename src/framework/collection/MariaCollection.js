const QueryBuilder = require('../query/MariaQueryBuilder')
const mariadb = require('mariadb')
const chalk = require('chalk')


class Collection {

    constructor(items) {
        this.items = items || []
        //this.Schema = null
        this.ModelConstructor = null
        const defaultConfig = {
            prop_id: ['id'],
            keyPicker: '*',
            table: 'someTable',
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


    createConnection = () => {
        return this.connection = mariadb.createConnection(
            {
                host: this._maria.host,
                port: this._maria.port,
                user: this._maria.user,
                password: this._maria.password,
                database: this._maria.db,
                charset: this._maria.charset,
                connectionLimit: 5
            }
        )
    }
    endConnection = () => {
        return this.getConnection().then(conn => conn.end())
    }

    endConnectionSilently = () => {
        this.endConnection().catch(e => {
            console.log('error while disconnecting')
            console.log(e)
        })
    }

    getConnection = () => {
        return this.connection
    }

    _findArguments(params) {
        return Object.keys(params).reduce((state, key) => {
            if (!params[key]) return state;
            return state.concat(key + ' LIKE \'%' + params[key] + '%\' ')
        }, ['1']).join(' AND ')
    }

    find = (params) => {
        //TODO MERGE A
        return this.createConnection()
            .then(this.getConnection)
            .then(conn => {
                const query = 'SELECT ' +
                    this._keys +
                    ' FROM ' +
                    this._table +
                    ' WHERE ' + this._findArguments(params) +
                    '  LIMIT 0, ' + this._limit


                return conn.query(query, {useArray: false})
                    .then((response) => {
                        this.endConnectionSilently()
                        return this.reset(response, true)
                    })
                    .catch(e => {
                        this.endConnectionSilently()
                        return Promise.reject(e)
                    })
            })
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
        return this.createConnection()
            .then(this.getConnection)
            .then(conn => {
                return conn.query(`SELECT ${this._keys} FROM ${this._table}  LIMIT 0, ${this._limit}`  , {useArray: false})
                    .then((response) => {
                        this.endConnectionSilently()
                        return this.reset(response, true)
                    })
                    .catch(e => {
                        this.endConnectionSilently()
                        return Promise.reject(e)
                    })
            })

    }

    toJSON() {
        return this.items.map(item => item.toJSON())
    }
}


module.exports = Collection
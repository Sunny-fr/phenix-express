const Model = require('./Model')
const Client = require('mariasql')
const MariaQueryBuilder = require('../query/MariaQueryBuilder')
const chalk = require('chalk')
const defaults = {}


const genParams = (str, argList, joinstr) => {
    const params = argList.reduce((state, prop) => {
        return state.concat(prop + ' = :' + prop)
    }, [])
    return str.replace('{gen}', params.join(joinstr))
}

class MariaModel extends Model {
    constructor(attr, defaults) {
        super(attr, defaults)
        const defaultConfig = {
            prop_id: ['id'],
            keyPicker: '*',
            table: 'someTable',
            maria: {
                host: 'localhost',
                user: 'root',
                db: 'somedb',
                password: 'somepass'
            }
        }
        this.setConfig(defaultConfig)
    }

    setupClient (){
        this.client = new Client(this._maria)
        this.qb = new MariaQueryBuilder({client: this.client})
    }

    setConfig (config) {
        const c = Object.assign({}, config)
        this._id_props = c.prop_id
        this._keys = c.keyPicker
        this._table = c.table
        this._maria = c.maria
        this.setupClient()
    }

    _genParams () {
        return this._id_props.reduce((state, prop) => {
            return {...state, [prop]: this.get(prop)}
        }, {})
    }

    fetch() {
        const prep = this.qb.prepare(genParams('SELECT ' + this._keys + ' FROM ' + this._table + ' WHERE {gen}', this._id_props, ' AND '))
        return new Promise((resolve, reject) => {
            this.qb.query(prep(this._genParams()), {useArray: false})
                .then((response) => {
                    this.client.end()
                    if (response.length < 1) {
                        reject('not found');
                        return;
                    }

                    this.set(response[0])
                    resolve(this)
                })
                .catch(e => {
                    this.client.end()
                    reject(e)
                })
        })
    }

    isNew() {
        const prep = this.qb.prepare(genParams('SELECT ' + this._keys + ' FROM ' + this._table + ' WHERE {gen}', this._id_props, ' AND '))
        return new Promise((resolve, reject) => {
            this.qb.query(prep(this.toJSON()), {useArray: false})
                .then((response) => {
                    resolve(response)
                })
                .catch(e => {
                    reject(e)
                })
        })
    }

    _update() {
        const part_1 = genParams('UPDATE ' + this._table + ' SET {gen}', Object.keys(this.attributes), ' , ')
        const part_2 = genParams(' WHERE {gen}', this._id_props, ' , ')
        const prep = this.qb.prepare(part_1 + part_2)
        return this.qb.query(prep(this.toJSON()), {useArray: false})
    }

    _save() {
        const part_1 = 'INSERT INTO ' + this._table + ' (' + Object.keys(this.toJSON()).join(', ') + ') '
        const part_2 = ' VALUES ('+ Object.keys(this.toJSON()).map(item => ':' + item ).join(',') +')'
        const prep = this.qb.prepare(part_1 + part_2)
        return this.qb.query(prep(this.toJSON()), {useArray: false})
    }

    save() {
        return new Promise((resolve, reject) => {
            this.isNew().then(response => {
                const promise = !response[0] ? this._save() : this._update()
                promise
                    .then((response) => {
                        this.client.end()
                        resolve(/*this.reset(response, true)*/)
                    })
                    .catch(e => {
                        this.client.end()
                        reject(e)
                    })
            }).catch(e => {
                console.log(chalk.yellow('cant tells if it is new'))
                throw new Error(e)

            })
        })
    }

    destroy() {

        const prep = this.qb.prepare(genParams('DELETE FROM ' + this._table + ' WHERE {gen}', this._id_props, ' AND '))
        return new Promise((resolve, reject) => {
            this.qb.query(prep(this.toJSON()), {useArray: false})
                .then((response) => {
                    this.client.end()
                    resolve(/*this.reset(response, true)*/)
                })
                .catch(e => {
                    this.client.end()
                    reject(e)
                })
        })
    }
}

module.exports = MariaModel
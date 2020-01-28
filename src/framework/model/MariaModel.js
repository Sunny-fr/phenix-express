const Model = require('./Model')
const mariadb = require('mariadb')


const genParams = (str, argList, joinstr) => {
    const params = argList.reduce((state, prop) => {
        return state.concat(prop + ' = :' + prop)
    }, [])
    return str.replace('{gen}', params.join(joinstr))
}

class MariaDBModel extends Model {
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

    setConfig(config) {
        const c = Object.assign({}, config)
        this._id_props = c.prop_id
        this._keys = c.keyPicker
        this._table = c.table
        this._maria = c.maria
    }

    _genParams() {
        return this._id_props.reduce((state, prop) => {
            return { ...state, [prop]: this.get(prop) }
        }, {})
    }

    doQuery(sql, values) {
        return this.createConnection()
            .then(this.getConnection)
            .then(conn => {
                return conn.query({
                    namedPlaceholders: true,
                    sql: sql
                }, values)
            })
            .then(response => {
                this.endConnectionSilently()
                return response
            })
    }

    fetch() {
        const sql = genParams('SELECT ' + this._keys + ' FROM ' + this._table + ' WHERE {gen}', this._id_props, ' AND ')
        return this.doQuery(sql, this._genParams())
    }

    isNew() {
        const sql = genParams('SELECT ' + this._keys + ' FROM ' + this._table + ' WHERE {gen}', this._id_props, ' AND ')
        return this.doQuery(sql, this.toJSON())
    }

    _update() {
        const part_1 = genParams('UPDATE ' + this._table + ' SET {gen}', Object.keys(this.attributes), ' , ')
        const part_2 = genParams(' WHERE {gen}', this._id_props, ' AND ')
        const sql = part_1 + part_2
        return this.doQuery(sql, this.toJSON())
    }

    _save() {
        const part_1 = 'INSERT INTO ' + this._table + ' (' + Object.keys(this.toJSON()).join(', ') + ') '
        const part_2 = ' VALUES (' + Object.keys(this.toJSON()).map(item => ':' + item).join(',') + ')'
        const sql = part_1 + part_2
        return this.doQuery(sql, this.toJSON())
    }

    save() {
        return new Promise((resolve, reject) => {
            this.isNew().then(response => {
                const promise = !response[0] ? this._save() : this._update()
                promise
                    .then((response) => {
                        resolve(/*this.reset(response, true)*/)
                    })
                    .catch(e => {
                        reject(e)
                    })
            }).catch(e => {
                console.log('cant tells if it is new')
                throw new Error(e)

            })
        })
    }

    destroy() {
        const sql = genParams('DELETE FROM ' + this._table + ' WHERE {gen}', this._id_props, ' AND ')
        return this.doQuery(sql, this.toJSON())
    }
}

module.exports = MariaDBModel
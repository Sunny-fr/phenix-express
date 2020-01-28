const mariadb = require('mariadb')
const chalk = require('chalk')
const tables = require('./tables')
//const QueryBuilder = require('../../src').MariaQueryBuilder
const config = require('./config.json')

const omit = (originalObject, propsToOmit) => {
    const omitted = typeof propsToOmit === 'string' ? [propsToOmit] : propsToOmit
    return Object.keys(originalObject).reduce((state, current) => omitted.includes(current) ? state : Object.assign({},
        state,
        {
            [current]: originalObject[current]
        }
    ), {});
};

const init = () => {
    class DatabaseCreator {
        constructor(options = {}) {
            this.createConnection()
            this.databaseExists()
                .then((status) => {
                    if (status === false) {
                        this.createDatabase()
                            .then(() => {
                                return this.createTables()
                            })
                            .catch(e => {
                                return Promise.reject(e)
                            })
                    } else {

                        /** COMMENNNNNT THIS **/
                        return this.createTables()
                        // this.getConnection()
                        //     .then(conn => {
                        //         return conn.query('DROP DATABASE `' + config.db + '`')
                        //             .then(this.createDatabase)
                        //             .then(this.endConnection)
                        //             .then(this.createConnection)
                        //             .then(this.createTables)
                        //             .catch(e => {
                        //                 console.log(e)
                        //                 return Promise.reject(e)
                        //             })
                        // })
                    }
                })
                .then(() => {
                    return this.endConnection()
                })
                .catch(e => {
                    console.log(chalk.red('can\'t check if database exists'))
                    console.log(e)
                })
        }

        createConnection = () => {

            this.connection = mariadb.createConnection(
                {
                    ...omit(config, ['db']),
                    database: config.db
                }
            )
        }
        endConnection = () => {
            return this.getConnection().then(conn => conn.end())
        }

        getConnection = () => {
            return this.connection
        }

        databaseExists = () => {

            return this.getConnection()
                // .then(conn => {
                //
                //     return conn.changeUser({
                //         ...omit(config, ['db']),
                //         database: config.db
                //     })
                // })
                .then((result) => {
                    console.log(chalk.green('Database exists'))
                    return true
                })
                .catch((err) => {
                    console.log(chalk.yellow('Database does not exists...'))
                    return Promise.reject(err)
                })
            // return new Promise((resolve, reject) => {
            //     this.getConnection()
            //         .then(conn => {
            //             return conn.query(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${config.db}'`)
            //         })
            //         .then((result) => {
            //             if (result && result.length > 0) {
            //                 console.log(chalk.green('Database exists'))
            //                 //this.initClient()
            //                 resolve(true)
            //             } else {
            //                 console.log(chalk.yellow('Database do not exists...'))
            //                 resolve(false)
            //             }
            //         })
            //         .catch((err) => {
            //             console.log(chalk.red('can\'t check if database exists'))
            //             console.log(err)
            //             resolve(false)
            //             //reject()
            //         })
            //
            // })
        }

        createDatabase = () => {
            console.log('creating database ' + config.db)
            const q = 'CREATE DATABASE `' + config.db + '` DEFAULT CHARACTER SET = `utf8` DEFAULT COLLATE = `utf8_bin`'
            return this.getConnection()
                .then(conn => {
                    return conn.query(q)
                })
                .then(() => {
                    console.log(chalk.green('Database was created'))
                    return Promise.resolve()
                })
                .catch(e => {
                    console.log(chalk.red('Couldnt create a database'))
                    console.log(e)
                    return Promise.reject(e)
                })
        }

        createTables = () => {

            return this.getConnection()
                .then(conn => {
                    const promises = []
                    console.log('creating tables...')
                    Object.keys(tables).map(table => {
                        const promise = conn.query(tables[table])
                        promises.push(promise)
                        promise.then(() => {
                            console.log(chalk.green(table + ' was created'))
                        }).catch(e => {
                            console.log(chalk.red('Error while creating ' + table + ' table'))
                        })
                    })

                    return Promise.all(promises)
                })


        }
    }
    const databaseCreator = new DatabaseCreator({})
}

module.exports = init

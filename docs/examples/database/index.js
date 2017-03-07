const Client = require('mariasql')
const chalk = require('chalk')
const tables = require('./tables')
const QueryBuilder = require('../framework/query/QueryBuilder')
const config = require('../config/config')


const DATABASE_NAME = config.maria.db

const DATABASE_CLIENT = config.maria


const client = new Client(DATABASE_CLIENT)



class DatabaseCreator {
    constructor(options = {}) {
        this.initClient(true)
        this.databaseExists()
            .then((status)=> {
                if (status === false) {
                    this.createDatabase()
                        .then(()=>{
                            return this.createTables()
                        })
                        .catch(e=> {
                            console.log(e)
                        })
                }else {
                    // this.qb.query('DROP DATABASE `seline`').then(()=>{
                    //     this.createDatabase()
                    //         .then(()=>{
                    //             return this.createTables()
                    //         })
                    //         .catch(e=> {
                    //
                    //             console.log(e)
                    //         })
                    // })
                }
            }).catch(e=> {
            console.log(chalk.red("can't check if database exists"))
            console.log(e)
        })
    }

    initClient(temp){
        if (this.client) this.client.end()
        this.client = new Client(this.clientParams(temp))
        this.qb = new QueryBuilder({client: this.client})
    }

    clientParams(temp){
        const options = Object.assign({},DATABASE_CLIENT)
        if (temp) delete options.db
        return options
    }

    databaseExists() {

        return new Promise((resolve, reject)=> {
            const dbExists = this.qb.query(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${DATABASE_NAME}'`)
            dbExists.then((result)=> {
                if (result && result.length > 0) {
                    console.log(chalk.green('Database exists'))
                    this.initClient()
                    resolve(true)
                } else {
                    console.log(chalk.yellow('Database do not exists...'))
                    resolve(false)
                }

            }).catch((err)=> {
                console.log(chalk.red("can't check if database exists"))
                console.log(err)
                reject()
            })
            client.end()
        })
    }

    createDatabase() {
        console.log('create database')
        const q = "CREATE DATABASE `" + DATABASE_NAME + "` DEFAULT CHARACTER SET = `utf8` DEFAULT COLLATE = `utf8_bin`"
        return new Promise((resolve, reject)=>{
            this.qb.query(q).then(()=>{
                console.log(chalk.green("Database was created"))
                this.initClient()
                resolve()
            }).catch(e => {
                console.log(chalk.red("Couldnt create a database"))
                console.log(e)
                reject(e)
            })
        })
    }

    createTables() {
        const promises = []
        console.log("creating tables...")
        Object.keys(tables).map(table => {
            const promise = this.qb.query(tables[table])
            promises.push(promise)
            promise.then(()=>{
                console.log(chalk.green(table + ' was created'))
            }).catch(e=>{
                console.log(chalk.red('Error while creating ' + table + ' table'))
            })
        })

        return Promise.all(promises)
    }
}

const databaseCreator = new DatabaseCreator({client})


//const qb = new QueryBuilder({client})


client.end();
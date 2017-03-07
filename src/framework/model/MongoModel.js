const Model = require('./Model')
const chalk = require('chalk')

const defaults = {}

class MongoModel extends Model {
    constructor(attr, defaults, SchemaConstructor) {
        super(attr, defaults)
        this.SchemaConstructor = SchemaConstructor
        this.schema = new (this.SchemaConstructor)(this.attributes)
    }

    set(prop, value) {
        super.set(prop, value)
        this.sync()
    }

    sync() {
        Object.keys(this.attributes).map(key => {
            this.schema[key] = this.get(key)
        })
    }

    getArgs() {
        return {id: this.id}
    }

    fetch() {
        return new Promise((resolve, reject) => {
            this.SchemaConstructor
                .findOne(this.getArgs()).exec()
                .then((result)=> {
                    this.set(result.toJSON())
                    resolve(this)
                })
                .catch(err => {
                    this.log(err)
                    reject('no record found')
                })
        })
    }

    save() {
        const schema = this.schema
        //const promise = this.attributes._id ? schema.update(schema.toJSON()) : schema.save()
        //DEBUG PUPOSE
        // promise.then((a)=>{
        // }).catch(e => {
        //   this.log('err')
        //   this.log(e)
        // })
        return this.attributes._id ? schema.update(schema.toJSON()) : schema.save()
    }


    destroy() {
        return this.schema.remove()
    }
}

module.exports = MongoModel
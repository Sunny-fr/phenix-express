class QueryBuilder {
    constructor(options) {
        this.client = options.client
    }

    query(string, extrargs) {
        const options = extrargs || {useArray: true}
        return new Promise((resolve, reject) => {
            this.client.query(string, null, options, (err, result) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve(result)
            })
        })
    }
}

module.exports = QueryBuilder
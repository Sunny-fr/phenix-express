const server = require('../lib').server
const path = require('path')
const userModule = require('./modules/users/router')

const config = {
    name:'demo app',
    publicPath: '/demo-app',
    publicDirectoryPath: path.resolve('./public'),
    app: {
        host: 'localhost',
        port: '4040'
    },
    addCors: true
}




server(config, {
    registerModules: function(app, router, config) {
        userModule.register(app, router, config)
    },
    onStart: function(app /*, router, config*/) {
        const database = require('./database/index')
        database()
    },
})
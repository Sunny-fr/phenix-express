const server = require('../lib').server
const path = require('path')

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

const options = {
    /** REGISTER MODULES **/
    registerModules: function(app, router, config) {

        // Module Example
        // const MyModule = require('./modules/my-module/router');
        // MyModule.register(app, router);

    },
    onStart: function(){

        //const database = require('./database')

    }
}


server(config, options)
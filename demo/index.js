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




server(config)
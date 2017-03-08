'use strict';

// BASE SETUP
// =============================================================================


// call the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
var router = require('./router');

function start(config, _options) {

    var options = _options || {};

    // configure app
    app.use(morgan('dev')); // log requests to the console

    // configure body parser
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    var host = config.app.host;
    var port = process.env.PORT || config.app.port; // set our port


    /**=============================================================================
     * DATABASE
     *
     =============================================================================*/

    //TODO FIND A WAY TO EXPORT THIS
    //const database = require('./database')

    if (options.onStart) options.onStart(app, router, config);

    /**=============================================================================
     * ROUTES FOR OUR API
     *
     =============================================================================*/
    // create our router

    // CORS
    if (config.addCors) {
        var allowCrossDomain = function allowCrossDomain(req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            next();
        };
        router.use(allowCrossDomain);
    }

    // middleware to use for all requests
    router.use(function (req, res, next) {
        // do logging
        next();
    });

    // default route
    router.get('/', function (req, res) {
        res.json({ message: ' ¯\_(ツ)_/¯ Yay !! ' });
    });

    /**=============================================================================
     * MODULES
     *
     =============================================================================*/

    // Module Example
    // const ModuleConcept = require('./modules/concept/router');
    // ModuleConcept.register(app, router);

    if (options.registerModules) options.registerModules(app, router, config);

    // REGISTER OUR ROUTES -------------------------------
    //app.use('/seline/api', router);

    console.log('');
    console.log(__dirname, config.publicDirectoryPath);
    console.log('');

    app.use(config.publicPath, express.static(config.publicDirectoryPath));

    /**=============================================================================
     * INIT
     * starting server
     =============================================================================*/
    app.listen(port, host);
    console.log(config.name + ' phenix  express listening on ', host + ':' + port);
    console.log(config.name + ' public path ', host + ':' + port + config.publicPath);
}

module.exports = start;
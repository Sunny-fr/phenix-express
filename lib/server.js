'use strict';

// BASE SETUP
// =============================================================================


// call the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
var router = require('./router');

var maxPayloadSize = '10mb';

function start(config, _options) {

    var options = _options || {};

    // configure app
    app.use(morgan(options.morgan || 'dev')); // log requests to the console

    // configure body parser
    app.use(bodyParser.urlencoded({
        limit: maxPayloadSize,
        extended: true
    }));
    app.use(bodyParser.json({
        type: '*/*',
        limit: maxPayloadSize
    }));

    var host = config.app.host || process.env.HOST;
    var port = config.app.port || process.env.PORT; // set our port


    /**=============================================================================
     * DATABASE
     *
     =============================================================================*/

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
    // router.use(function (req, res, next) {
    //     // do logging
    //     next();
    // });


    /**=============================================================================
     * MODULES
     *
     =============================================================================*/

    // Module Example
    // const ModuleConcept = require('./modules/concept/router');
    // ModuleConcept.register(app, router);

    if (options.registerModules) options.registerModules(app, router, config);

    app.use(config.publicPath, router);
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
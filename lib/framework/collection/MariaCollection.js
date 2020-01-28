'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var QueryBuilder = require('../query/MariaQueryBuilder');
var mariadb = require('mariadb');
var chalk = require('chalk');

var Collection = function () {
    function Collection(items) {
        var _this = this;

        _classCallCheck(this, Collection);

        this.createConnection = function () {
            return _this.connection = mariadb.createConnection({
                host: _this._maria.host,
                port: _this._maria.port,
                user: _this._maria.user,
                password: _this._maria.password,
                database: _this._maria.db,
                charset: _this._maria.charset,
                connectionLimit: 5
            });
        };

        this.endConnection = function () {
            return _this.getConnection().then(function (conn) {
                return conn.end();
            });
        };

        this.endConnectionSilently = function () {
            _this.endConnection().catch(function (e) {
                console.log('error while disconnecting');
                console.log(e);
            });
        };

        this.getConnection = function () {
            return _this.connection;
        };

        this.find = function (params) {
            //TODO MERGE A
            return _this.createConnection().then(_this.getConnection).then(function (conn) {
                var query = 'SELECT ' + _this._keys + ' FROM ' + _this._table + ' WHERE ' + _this._findArguments(params) + '  LIMIT 0, ' + _this._limit;

                return conn.query(query, { useArray: false }).then(function (response) {
                    _this.endConnectionSilently();
                    return _this.reset(response, true);
                }).catch(function (e) {
                    _this.endConnectionSilently();
                    return Promise.reject(e);
                });
            });
        };

        this.items = items || [];
        //this.Schema = null
        this.ModelConstructor = null;
        var defaultConfig = {
            prop_id: ['id'],
            keyPicker: '*',
            table: 'someTable',
            limit: 50,
            maria: {
                host: 'localhost',
                user: 'root',
                db: 'somedb',
                password: 'sompass'
            }
        };
        this.setConfig(defaultConfig);
    }

    _createClass(Collection, [{
        key: 'setConfig',
        value: function setConfig(config) {
            var c = Object.assign({}, config);
            this._id_props = c.prop_id;
            this._keys = c.keyPicker;
            this._table = c.table;
            this._limit = c.limit;
            this._maria = c.maria;
        }
    }, {
        key: '_findArguments',
        value: function _findArguments(params) {
            return Object.keys(params).reduce(function (state, key) {
                if (!params[key]) return state;
                return state.concat(key + ' LIKE \'%' + params[key] + '%\' ');
            }, ['1']).join(' AND ');
        }
    }, {
        key: 'reset',


        // get (prop) {
        //   return prop ? this.attributes[prop] : this.attributes
        // }

        value: function reset(items) {
            var Model = this.ModelConstructor;
            this.items = items.map(function (item) {
                return new Model(item);
            });
            return this.items;
        }
    }, {
        key: 'fetch',
        value: function fetch() {
            var _this2 = this;

            //TODO MERGE A
            return this.createConnection().then(this.getConnection).then(function (conn) {
                return conn.query('SELECT ' + _this2._keys + ' FROM ' + _this2._table + '  LIMIT 0, ' + _this2._limit, { useArray: false }).then(function (response) {
                    _this2.endConnectionSilently();
                    return _this2.reset(response, true);
                }).catch(function (e) {
                    _this2.endConnectionSilently();
                    return Promise.reject(e);
                });
            });
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            return this.items.map(function (item) {
                return item.toJSON();
            });
        }
    }]);

    return Collection;
}();

module.exports = Collection;
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Model = require('./Model');
var mariadb = require('mariadb');

var genParams = function genParams(str, argList, joinstr) {
    var params = argList.reduce(function (state, prop) {
        return state.concat(prop + ' = :' + prop);
    }, []);
    return str.replace('{gen}', params.join(joinstr));
};

var MariaDBModel = function (_Model) {
    _inherits(MariaDBModel, _Model);

    function MariaDBModel(attr, defaults) {
        _classCallCheck(this, MariaDBModel);

        var _this = _possibleConstructorReturn(this, (MariaDBModel.__proto__ || Object.getPrototypeOf(MariaDBModel)).call(this, attr, defaults));

        _this.createConnection = function () {
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

        _this.endConnection = function () {
            return _this.getConnection().then(function (conn) {
                return conn.end();
            });
        };

        _this.endConnectionSilently = function () {
            _this.endConnection().catch(function (e) {
                console.log('error while disconnecting');
                console.log(e);
            });
        };

        _this.getConnection = function () {
            return _this.connection;
        };

        var defaultConfig = {
            prop_id: ['id'],
            keyPicker: '*',
            table: 'someTable',
            maria: {
                host: 'localhost',
                user: 'root',
                db: 'somedb',
                password: 'somepass'
            }
        };
        _this.setConfig(defaultConfig);
        return _this;
    }

    _createClass(MariaDBModel, [{
        key: 'setConfig',
        value: function setConfig(config) {
            var c = Object.assign({}, config);
            this._id_props = c.prop_id;
            this._keys = c.keyPicker;
            this._table = c.table;
            this._maria = c.maria;
        }
    }, {
        key: '_genParams',
        value: function _genParams() {
            var _this2 = this;

            return this._id_props.reduce(function (state, prop) {
                return _extends({}, state, _defineProperty({}, prop, _this2.get(prop)));
            }, {});
        }
    }, {
        key: 'doQuery',
        value: function doQuery(sql, values) {
            var _this3 = this;

            return this.createConnection().then(this.getConnection).then(function (conn) {
                return conn.query({
                    namedPlaceholders: true,
                    sql: sql
                }, values);
            }).then(function (response) {
                _this3.endConnectionSilently();
                return response;
            });
        }
    }, {
        key: 'fetch',
        value: function fetch() {
            var sql = genParams('SELECT ' + this._keys + ' FROM ' + this._table + ' WHERE {gen}', this._id_props, ' AND ');
            return this.doQuery(sql, this._genParams());
        }
    }, {
        key: 'isNew',
        value: function isNew() {
            var sql = genParams('SELECT ' + this._keys + ' FROM ' + this._table + ' WHERE {gen}', this._id_props, ' AND ');
            return this.doQuery(sql, this.toJSON());
        }
    }, {
        key: '_update',
        value: function _update() {
            var part_1 = genParams('UPDATE ' + this._table + ' SET {gen}', Object.keys(this.attributes), ' , ');
            var part_2 = genParams(' WHERE {gen}', this._id_props, ' AND ');
            var sql = part_1 + part_2;
            return this.doQuery(sql, this.toJSON());
        }
    }, {
        key: '_save',
        value: function _save() {
            var part_1 = 'INSERT INTO ' + this._table + ' (' + Object.keys(this.toJSON()).join(', ') + ') ';
            var part_2 = ' VALUES (' + Object.keys(this.toJSON()).map(function (item) {
                return ':' + item;
            }).join(',') + ')';
            var sql = part_1 + part_2;
            return this.doQuery(sql, this.toJSON());
        }
    }, {
        key: 'save',
        value: function save() {
            var _this4 = this;

            return new Promise(function (resolve, reject) {
                _this4.isNew().then(function (response) {
                    var promise = !response[0] ? _this4._save() : _this4._update();
                    promise.then(function (response) {
                        resolve();
                    } /*this.reset(response, true)*/).catch(function (e) {
                        reject(e);
                    });
                }).catch(function (e) {
                    console.log('cant tells if it is new');
                    throw new Error(e);
                });
            });
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            var sql = genParams('DELETE FROM ' + this._table + ' WHERE {gen}', this._id_props, ' AND ');
            return this.doQuery(sql, this.toJSON());
        }
    }]);

    return MariaDBModel;
}(Model);

module.exports = MariaDBModel;
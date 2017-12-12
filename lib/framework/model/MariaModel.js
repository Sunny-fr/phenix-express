'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Model = require('./Model');
var Client = require('mariasql');
var MariaQueryBuilder = require('../query/MariaQueryBuilder');
var chalk = require('chalk');
var defaults = {};

var genParams = function genParams(str, argList, joinstr) {
    var params = argList.reduce(function (state, prop) {
        return state.concat(prop + ' = :' + prop);
    }, []);
    return str.replace('{gen}', params.join(joinstr));
};

var MariaModel = function (_Model) {
    _inherits(MariaModel, _Model);

    function MariaModel(attr, defaults) {
        _classCallCheck(this, MariaModel);

        var _this = _possibleConstructorReturn(this, (MariaModel.__proto__ || Object.getPrototypeOf(MariaModel)).call(this, attr, defaults));

        var defaultConfig = {
            prop_id: ['id'],
            keyPicker: '*',
            table: 'concepts',
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

    _createClass(MariaModel, [{
        key: 'setupClient',
        value: function setupClient() {
            this.client = new Client(this._maria);
            this.qb = new MariaQueryBuilder({ client: this.client });
        }
    }, {
        key: 'setConfig',
        value: function setConfig(config) {
            var c = Object.assign({}, config);
            this._id_props = c.prop_id;
            this._keys = c.keyPicker;
            this._table = c.table;
            this._maria = c.maria;
            this.setupClient();
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
        key: 'fetch',
        value: function fetch() {
            var _this3 = this;

            var prep = this.qb.prepare(genParams('SELECT ' + this._keys + ' FROM ' + this._table + ' WHERE {gen}', this._id_props, ' AND '));
            return new Promise(function (resolve, reject) {
                _this3.qb.query(prep(_this3._genParams()), { useArray: false }).then(function (response) {
                    _this3.client.end();
                    _this3.set(response[0]);
                    resolve(_this3);
                }).catch(function (e) {
                    _this3.client.end();
                    reject(e);
                });
            });
        }
    }, {
        key: 'isNew',
        value: function isNew() {
            var _this4 = this;

            var prep = this.qb.prepare(genParams('SELECT ' + this._keys + ' FROM ' + this._table + ' WHERE {gen}', this._id_props, ' AND '));
            return new Promise(function (resolve, reject) {
                _this4.qb.query(prep(_this4.toJSON()), { useArray: false }).then(function (response) {
                    resolve(response);
                }).catch(function (e) {
                    reject(e);
                });
            });
        }
    }, {
        key: '_update',
        value: function _update() {
            var part_1 = genParams('UPDATE ' + this._table + ' SET {gen}', Object.keys(this.attributes), ' , ');
            var part_2 = genParams(' WHERE {gen}', this._id_props, ' , ');
            var prep = this.qb.prepare(part_1 + part_2);
            return this.qb.query(prep(this.toJSON()), { useArray: false });
        }
    }, {
        key: '_save',
        value: function _save() {
            var part_1 = 'INSERT INTO ' + this._table + ' (' + Object.keys(this.toJSON()).join(', ') + ') ';
            var part_2 = ' VALUES (' + Object.keys(this.toJSON()).map(function (item) {
                return ':' + item;
            }).join(',') + ')';
            var prep = this.qb.prepare(part_1 + part_2);
            return this.qb.query(prep(this.toJSON()), { useArray: false });
        }
    }, {
        key: 'save',
        value: function save() {
            var _this5 = this;

            return new Promise(function (resolve, reject) {
                _this5.isNew().then(function (response) {
                    var promise = !response[0] ? _this5._save() : _this5._update();
                    promise.then(function (response) {
                        _this5.client.end();
                        resolve();
                    } /*this.reset(response, true)*/).catch(function (e) {
                        _this5.client.end();
                        reject(e);
                    });
                }).catch(function (e) {
                    console.log(chalk.yellow('cant tells if it is new'));
                    throw new Error(e);
                });
            });
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            var _this6 = this;

            var prep = this.qb.prepare(genParams('DELETE FROM ' + this._table + ' WHERE {gen}', this._id_props, ' AND '));
            return new Promise(function (resolve, reject) {
                _this6.qb.query(prep(_this6.toJSON()), { useArray: false }).then(function (response) {
                    _this6.client.end();
                    resolve();
                } /*this.reset(response, true)*/).catch(function (e) {
                    _this6.client.end();
                    reject(e);
                });
            });
        }
    }]);

    return MariaModel;
}(Model);

module.exports = MariaModel;
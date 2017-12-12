'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var QueryBuilder = require('../query/MariaQueryBuilder');
var Client = require('mariasql');
var chalk = require('chalk');

var Collection = function () {
    function Collection(items) {
        _classCallCheck(this, Collection);

        this.items = items || [];
        //this.Schema = null
        this.ModelConstructor = null;
        var defaultConfig = {
            prop_id: ['id'],
            keyPicker: '*',
            table: 'concepts',
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

        // get (prop) {
        //   return prop ? this.attributes[prop] : this.attributes
        // }

    }, {
        key: 'reset',
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
            var _this = this;

            //TODO MERGE A
            var client = new Client(this._maria);
            return new Promise(function (resolve, reject) {
                var qb = new QueryBuilder({ client: client });
                qb.query('SELECT ' + _this._keys + ' FROM ' + _this._table + ' LIMIT 0, ' + _this._limit, { useArray: false }).then(function (response) {
                    client.end();
                    resolve(_this.reset(response, true));
                }).catch(function (e) {
                    client.end();
                    reject(e);
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
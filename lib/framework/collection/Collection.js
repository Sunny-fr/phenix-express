'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Model = require('../model/Model');

var Collection = function () {
    function Collection(items) {
        _classCallCheck(this, Collection);

        var list = items || [];
        this.ModelConstructor = Model;
        this.reset(list);
    }

    _createClass(Collection, [{
        key: 'get',
        value: function get(params) {
            var result = this.find(params);
            return result.length > 0 ? result[0] : null;
        }
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

            return new Promise(function (resolve, reject) {
                resolve(_this.reset(_this.items, true));
            });
        }
    }, {
        key: 'find',
        value: function find(params) {
            return Object.keys(params).reduce(function (state, prop) {
                return state.filter(function (item) {
                    return item.get(prop) === params[prop];
                });
            }, this.items);
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
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var chalk = require('chalk');
var defaults = {};

var Model = function () {
    function Model(attr, _defaults) {
        _classCallCheck(this, Model);

        this.attributes = Object.assign({}, _defaults || defaults, attr);
    }

    _createClass(Model, [{
        key: 'log',
        value: function log() {
            var green = chalk.green;
            console.log(green.apply(green, arguments));
        }
    }, {
        key: 'error',
        value: function error(e) {
            throw new Error(e);
        }
    }, {
        key: 'set',
        value: function set(prop, value) {
            var data = {};
            if (typeof prop !== 'undefined' && typeof value !== 'undefined') {
                data[prop] = value;
            } else {
                data = prop;
            }
            this.attributes = Object.assign({}, this.attributes, data);
        }
    }, {
        key: 'get',
        value: function get(prop) {
            return prop ? this.attributes[prop] : this.attributes;
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            return Object.assign({}, this.attributes);
        }
    }, {
        key: 'serialize',
        value: function serialize() {
            return Object.assign({}, this.attributes);
        }
    }]);

    return Model;
}();

module.exports = Model;
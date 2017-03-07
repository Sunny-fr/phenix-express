'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Model = require('./Model');
var chalk = require('chalk');

var defaults = {};

var MongoModel = function (_Model) {
    _inherits(MongoModel, _Model);

    function MongoModel(attr, defaults, SchemaConstructor) {
        _classCallCheck(this, MongoModel);

        var _this = _possibleConstructorReturn(this, (MongoModel.__proto__ || Object.getPrototypeOf(MongoModel)).call(this, attr, defaults));

        _this.SchemaConstructor = SchemaConstructor;
        _this.schema = new _this.SchemaConstructor(_this.attributes);
        return _this;
    }

    _createClass(MongoModel, [{
        key: 'set',
        value: function set(prop, value) {
            _get(MongoModel.prototype.__proto__ || Object.getPrototypeOf(MongoModel.prototype), 'set', this).call(this, prop, value);
            this.sync();
        }
    }, {
        key: 'sync',
        value: function sync() {
            var _this2 = this;

            Object.keys(this.attributes).map(function (key) {
                _this2.schema[key] = _this2.get(key);
            });
        }
    }, {
        key: 'getArgs',
        value: function getArgs() {
            return { id: this.id };
        }
    }, {
        key: 'fetch',
        value: function fetch() {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                _this3.SchemaConstructor.findOne(_this3.getArgs()).exec().then(function (result) {
                    _this3.set(result.toJSON());
                    resolve(_this3);
                }).catch(function (err) {
                    _this3.log(err);
                    reject('no record found');
                });
            });
        }
    }, {
        key: 'save',
        value: function save() {
            var schema = this.schema;
            //const promise = this.attributes._id ? schema.update(schema.toJSON()) : schema.save()
            //DEBUG PUPOSE
            // promise.then((a)=>{
            // }).catch(e => {
            //   this.log('err')
            //   this.log(e)
            // })
            return this.attributes._id ? schema.update(schema.toJSON()) : schema.save();
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            return this.schema.remove();
        }
    }]);

    return MongoModel;
}(Model);

module.exports = MongoModel;
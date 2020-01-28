"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var QueryBuilder = function () {
    function QueryBuilder(options) {
        _classCallCheck(this, QueryBuilder);

        this.client = options.client;
    }

    _createClass(QueryBuilder, [{
        key: "query",
        value: function query(string, extrargs) {
            var _this = this;

            var options = extrargs || { useArray: true };
            return new Promise(function (resolve, reject) {
                _this.client.query(string, null, options, function (err, result) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(result);
                });
            });
        }
    }]);

    return QueryBuilder;
}();

module.exports = QueryBuilder;
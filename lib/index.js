'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('./utils');

var _handler = require('./handler');

var _jsep = require('jsep');

var _jsep2 = _interopRequireDefault(_jsep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_jsep2.default.removeBinaryOp("|");

var parseTree = function parseTree(target, scope) {
    var cache = {
        iterationObj: scope
    };
    function parseNode(node) {
        var result = null;

        (0, _utils.each)(_handler.ExpressionTypes, function (type) {
            if (node.type == type) {
                result = _handler.EXP_HANDLER[type](parseNode, cache)(node, scope);
                return false;
            }
        });
        return result;
    }
    return parseNode((0, _jsep2.default)(target));
};

var ExpressionParser = (function () {
    function ExpressionParser(globalScope, globalFilter) {
        _classCallCheck(this, ExpressionParser);

        this.globalScope = globalScope;
        this.globalFilter = globalFilter;
    }

    _createClass(ExpressionParser, [{
        key: 'filter',
        value: function filter(_filter) {
            (0, _utils.extend)(this.globalFilter, _filter);
            return this;
        }
    }, {
        key: 'scope',
        value: function scope(_scope) {
            (0, _utils.extend)(this.globalScope, _scope);
            return this;
        }
    }, {
        key: 'parse',
        value: function parse(str, scope, filter) {
            if ((0, _utils.isStr)(str)) {
                scope = (0, _utils.extend)(scope, this.globalScope);
                filter = (0, _utils.extend)(filter, this.globalFilter);

                var _parseStr2 = this._parseStr(str);

                var target = _parseStr2.target;
                var filterArr = _parseStr2.filterArr;

                return this._resolveFilter(filterArr, filter)(parseTree(target, scope), scope);
            }
        }
    }, {
        key: '_resolveFilter',
        value: function _resolveFilter(filterArr, filter) {
            return function (target, scope) {
                if (filterArr.length) {
                    (0, _utils.each)(filterArr, function (filterStr) {
                        filterStr = filterStr.split(":");
                        var name = filterStr[0],
                            args = undefined,
                            filterFunc = undefined;
                        if (filter && filter[name]) {
                            args = filterStr.slice(1).map(function (arg) {
                                return parseTree(arg, scope);
                            });
                            filterFunc = filter[name].apply(scope, args);
                            if ((0, _utils.isFunc)(filterFunc)) {
                                target = filterFunc(target);
                            } else {
                                //报错
                            }
                        } else {
                                //报错
                            }
                    });
                    return target;
                } else {
                    return target;
                }
            };
        }
    }, {
        key: '_parseStr',
        value: function _parseStr(str) {
            str = str.replace(/\s*/g, "").split("|");
            if (str.length > 1) {
                return {
                    target: str[0],
                    filterArr: str.slice(1)
                };
            } else {
                return {
                    target: str[0],
                    filterArr: []
                };
            }
        }
    }]);

    return ExpressionParser;
})();

ExpressionParser.injectExpHandler = function () {};

ExpressionParser.ExpressionTypes = _handler.ExpressionTypes;

(0, _utils.extend)(ExpressionParser, _jsep2.default);

exports.default = ExpressionParser;
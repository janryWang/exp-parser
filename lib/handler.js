'use strict';

var _EXP_HANDLER;

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EXP_HANDLER = exports.ExpressionTypes = undefined;

var _constants = require('./constants');

var constants = _interopRequireWildcard(_constants);

var _utils = require('./utils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _constants$Expression = constants.ExpressionTypes;
var COMPOUND = _constants$Expression.COMPOUND;
var IDENTIFIER = _constants$Expression.IDENTIFIER;
var MEMBER_EXP = _constants$Expression.MEMBER_EXP;
var LITERAL = _constants$Expression.LITERAL;
var THIS_EXP = _constants$Expression.THIS_EXP;
var CALL_EXP = _constants$Expression.CALL_EXP;
var UNARY_EXP = _constants$Expression.UNARY_EXP;
var BINARY_EXP = _constants$Expression.BINARY_EXP;
var LOGICAL_EXP = _constants$Expression.LOGICAL_EXP;
var CONDITIONAL_EXP = _constants$Expression.CONDITIONAL_EXP;
var ARRAY_EXP = _constants$Expression.ARRAY_EXP;
var ExpressionTypes = exports.ExpressionTypes = constants.ExpressionTypes;

var EXP_HANDLER = exports.EXP_HANDLER = (_EXP_HANDLER = {}, _defineProperty(_EXP_HANDLER, COMPOUND, function () {
    return function () {};
}), _defineProperty(_EXP_HANDLER, IDENTIFIER, function () {
    return function (node, scope) {
        return scope[node.name];
    };
}), _defineProperty(_EXP_HANDLER, MEMBER_EXP, function (parseNode, cache) {
    return function (node) {
        var object = node.object;
        var property = node.property;
        var iterationObj = cache.iterationObj;

        switch (node.object.type) {
            case MEMBER_EXP:
                cache.iterationObj = parseNode(object)[property.name];
                break;
            case THIS_EXP:
                cache.iterationObj = iterationObj[property.name];
                break;
            case IDENTIFIER:
                cache.iterationObj = iterationObj[object.name][property.name];
        }
        return cache.iterationObj;
    };
}), _defineProperty(_EXP_HANDLER, LITERAL, function () {
    return function (node) {
        return node.value;
    };
}), _defineProperty(_EXP_HANDLER, CALL_EXP, function (parseNode) {
    return function (node, scope) {
        var callee = node.callee;

        var args = (0, _utils.toArray)(node.arguments).map(function (arg) {
            return parseNode(arg, scope);
        });
        if (callee.type == IDENTIFIER) {
            var method = scope[callee.name];
            if (method) {
                if ((0, _utils.isFunc)(method)) {
                    return method.apply(scope, args);
                } else if ((0, _utils.isObj)(method)) {
                    if ((0, _utils.isFunc)(method.func)) {
                        return method.func.apply(method.context, args);
                    } else {
                        //报错
                    }
                } else {
                        //报错
                    }
            } else {
                    //报错
                }
        }
    };
}), _defineProperty(_EXP_HANDLER, UNARY_EXP, function (parseNode) {
    return function (node) {
        if (node.argument.type !== UNARY_EXP) {
            return (0, _utils.calculator)(node.operator).unary(parseNode(node.argument))();
        } else {
            //报错,不能在表达式内赋值
        }
    };
}), _defineProperty(_EXP_HANDLER, BINARY_EXP, function (parseNode) {
    return function (node) {
        return (0, _utils.calculator)(node.operator).binary(parseNode(node.left), parseNode(node.right))();
    };
}), _defineProperty(_EXP_HANDLER, LOGICAL_EXP, function (parseNode) {
    return function (node) {
        return (0, _utils.calculator)(node.operator).binary(parseNode(node.left), parseNode(node.right))();
    };
}), _defineProperty(_EXP_HANDLER, CONDITIONAL_EXP, function (parseNode) {
    return function (node) {
        if (parseNode(node.test)) {
            return parseNode(node.consequent);
        } else {
            return parseNode(node.alternate);
        }
    };
}), _defineProperty(_EXP_HANDLER, ARRAY_EXP, function (parseNode) {
    return function (node) {
        var res = [];
        (0, _utils.each)(node.elements, function (el) {
            res.push(parseNode(el));
        });
        return res;
    };
}), _EXP_HANDLER);
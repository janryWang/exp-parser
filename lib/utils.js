'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var is = function is(type) {
    return function (val) {
        return Object.prototype.toString.call(val) == '[object ' + type + ']';
    };
};

var isFunc = exports.isFunc = is('Function');

var isStr = exports.isStr = is('String');

var isArr = exports.isArr = is('Array');

var isObj = exports.isObj = is('Object');

var each = exports.each = function each(obj, func) {
    if (!obj || !isFunc(func)) return;
    var keys = Object.keys(obj),
        i = undefined,
        val = undefined,
        key = undefined;
    for (i = 0; i < keys.length; i++) {
        key = keys[i];
        val = obj[key];
        if (obj.hasOwnProperty(key)) {
            if (func(val, key) === false) break;
        }
    }
};

var extend = exports.extend = function extend(obj1, obj2) {
    if (isObj(obj1) || isArr(obj1)) {
        each(obj2, function (val, key) {
            obj1[key] = val;
        });
        return obj1;
    } else {
        return obj1;
    }
};

var calculator = exports.calculator = function calculator(operator) {
    return {
        unary: function unary(x) {
            return new Function('return ' + operator + x);
        },
        binary: function binary(x, y) {
            return new Function('return ' + x + operator + y);
        }
    };
};

var toArray = exports.toArray = function toArray(obj) {
    return Array.prototype.slice.call(obj);
};
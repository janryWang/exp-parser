(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ExpressionParser"] = factory();
	else
		root["ExpressionParser"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _utils = __webpack_require__(1);

	var _handler = __webpack_require__(3);

	var _jsep = __webpack_require__(4);

	var _jsep2 = _interopRequireDefault(_jsep);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	_jsep2.default.removeBinaryOp("|");

	/**
	 * 暂时还没注入处理器的功能,还有一个就是表达式内使用new操作符的功能,
	 * 这个比较麻烦,要修改jsep的源码,后面打算给jsep提个pr吧
	 **/

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

/***/ },
/* 1 */
/***/ function(module, exports) {

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

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var ExpressionTypes = exports.ExpressionTypes = {
	    COMPOUND: 'Compound',
	    IDENTIFIER: 'Identifier',
	    MEMBER_EXP: 'MemberExpression',
	    LITERAL: 'Literal',
	    THIS_EXP: 'ThisExpression',
	    CALL_EXP: 'CallExpression',
	    UNARY_EXP: 'UnaryExpression',
	    BINARY_EXP: 'BinaryExpression',
	    LOGICAL_EXP: 'LogicalExpression',
	    CONDITIONAL_EXP: 'ConditionalExpression',
	    ARRAY_EXP: 'ArrayExpression'
	};

	var ExpressionKeywords = exports.ExpressionKeywords = {
	    NEW: 'new'
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _EXP_HANDLER;

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.EXP_HANDLER = exports.ExpressionTypes = undefined;

	var _constants = __webpack_require__(2);

	var constants = _interopRequireWildcard(_constants);

	var _utils = __webpack_require__(1);

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

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	//     JavaScript Expression Parser (JSEP) 0.3.0
	//     JSEP may be freely distributed under the MIT License
	//     http://jsep.from.so/

	/*global module: true, exports: true, console: true */
	(function (root) {
		'use strict';
		// Node Types
		// ----------
		
		// This is the full set of types that any JSEP node can be.
		// Store them here to save space when minified
		var COMPOUND = 'Compound',
			IDENTIFIER = 'Identifier',
			MEMBER_EXP = 'MemberExpression',
			LITERAL = 'Literal',
			THIS_EXP = 'ThisExpression',
			CALL_EXP = 'CallExpression',
			UNARY_EXP = 'UnaryExpression',
			BINARY_EXP = 'BinaryExpression',
			LOGICAL_EXP = 'LogicalExpression',
			CONDITIONAL_EXP = 'ConditionalExpression',
			ARRAY_EXP = 'ArrayExpression',

			PERIOD_CODE = 46, // '.'
			COMMA_CODE  = 44, // ','
			SQUOTE_CODE = 39, // single quote
			DQUOTE_CODE = 34, // double quotes
			OPAREN_CODE = 40, // (
			CPAREN_CODE = 41, // )
			OBRACK_CODE = 91, // [
			CBRACK_CODE = 93, // ]
			QUMARK_CODE = 63, // ?
			SEMCOL_CODE = 59, // ;
			COLON_CODE  = 58, // :

			throwError = function(message, index) {
				var error = new Error(message + ' at character ' + index);
				error.index = index;
				error.description = message;
				throw error;
			},

		// Operations
		// ----------
		
		// Set `t` to `true` to save space (when minified, not gzipped)
			t = true,
		// Use a quickly-accessible map to store all of the unary operators
		// Values are set to `true` (it really doesn't matter)
			unary_ops = {'-': t, '!': t, '~': t, '+': t},
		// Also use a map for the binary operations but set their values to their
		// binary precedence for quick reference:
		// see [Order of operations](http://en.wikipedia.org/wiki/Order_of_operations#Programming_language)
			binary_ops = {
				'||': 1, '&&': 2, '|': 3,  '^': 4,  '&': 5,
				'==': 6, '!=': 6, '===': 6, '!==': 6,
				'<': 7,  '>': 7,  '<=': 7,  '>=': 7, 
				'<<':8,  '>>': 8, '>>>': 8,
				'+': 9, '-': 9,
				'*': 10, '/': 10, '%': 10
			},
		// Get return the longest key length of any object
			getMaxKeyLen = function(obj) {
				var max_len = 0, len;
				for(var key in obj) {
					if((len = key.length) > max_len && obj.hasOwnProperty(key)) {
						max_len = len;
					}
				}
				return max_len;
			},
			max_unop_len = getMaxKeyLen(unary_ops),
			max_binop_len = getMaxKeyLen(binary_ops),
		// Literals
		// ----------
		// Store the values to return for the various literals we may encounter
			literals = {
				'true': true,
				'false': false,
				'null': null
			},
		// Except for `this`, which is special. This could be changed to something like `'self'` as well
			this_str = 'this',
		// Returns the precedence of a binary operator or `0` if it isn't a binary operator
			binaryPrecedence = function(op_val) {
				return binary_ops[op_val] || 0;
			},
		// Utility function (gets called from multiple places)
		// Also note that `a && b` and `a || b` are *logical* expressions, not binary expressions
			createBinaryExpression = function (operator, left, right) {
				var type = (operator === '||' || operator === '&&') ? LOGICAL_EXP : BINARY_EXP;
				return {
					type: type,
					operator: operator,
					left: left,
					right: right
				};
			},
			// `ch` is a character code in the next three functions
			isDecimalDigit = function(ch) {
				return (ch >= 48 && ch <= 57); // 0...9
			},
			isIdentifierStart = function(ch) {
				return (ch === 36) || (ch === 95) || // `$` and `_`
						(ch >= 65 && ch <= 90) || // A...Z
						(ch >= 97 && ch <= 122); // a...z
			},
			isIdentifierPart = function(ch) {
				return (ch === 36) || (ch === 95) || // `$` and `_`
						(ch >= 65 && ch <= 90) || // A...Z
						(ch >= 97 && ch <= 122) || // a...z
						(ch >= 48 && ch <= 57); // 0...9
			},

			// Parsing
			// -------
			// `expr` is a string with the passed in expression
			jsep = function(expr) {
				// `index` stores the character number we are currently at while `length` is a constant
				// All of the gobbles below will modify `index` as we move along
				var index = 0,
					charAtFunc = expr.charAt,
					charCodeAtFunc = expr.charCodeAt,
					exprI = function(i) { return charAtFunc.call(expr, i); },
					exprICode = function(i) { return charCodeAtFunc.call(expr, i); },
					length = expr.length,

					// Push `index` up to the next non-space character
					gobbleSpaces = function() {
						var ch = exprICode(index);
						// space or tab
						while(ch === 32 || ch === 9) {
							ch = exprICode(++index);
						}
					},
					
					// The main parsing function. Much of this code is dedicated to ternary expressions
					gobbleExpression = function() {
						var test = gobbleBinaryExpression(),
							consequent, alternate;
						gobbleSpaces();
						if(exprICode(index) === QUMARK_CODE) {
							// Ternary expression: test ? consequent : alternate
							index++;
							consequent = gobbleExpression();
							if(!consequent) {
								throwError('Expected expression', index);
							}
							gobbleSpaces();
							if(exprICode(index) === COLON_CODE) {
								index++;
								alternate = gobbleExpression();
								if(!alternate) {
									throwError('Expected expression', index);
								}
								return {
									type: CONDITIONAL_EXP,
									test: test,
									consequent: consequent,
									alternate: alternate
								};
							} else {
								throwError('Expected :', index);
							}
						} else {
							return test;
						}
					},

					// Search for the operation portion of the string (e.g. `+`, `===`)
					// Start by taking the longest possible binary operations (3 characters: `===`, `!==`, `>>>`)
					// and move down from 3 to 2 to 1 character until a matching binary operation is found
					// then, return that binary operation
					gobbleBinaryOp = function() {
						gobbleSpaces();
						var biop, to_check = expr.substr(index, max_binop_len), tc_len = to_check.length;
						while(tc_len > 0) {
							if(binary_ops.hasOwnProperty(to_check)) {
								index += tc_len;
								return to_check;
							}
							to_check = to_check.substr(0, --tc_len);
						}
						return false;
					},

					// This function is responsible for gobbling an individual expression,
					// e.g. `1`, `1+2`, `a+(b*2)-Math.sqrt(2)`
					gobbleBinaryExpression = function() {
						var ch_i, node, biop, prec, stack, biop_info, left, right, i;

						// First, try to get the leftmost thing
						// Then, check to see if there's a binary operator operating on that leftmost thing
						left = gobbleToken();
						biop = gobbleBinaryOp();

						// If there wasn't a binary operator, just return the leftmost node
						if(!biop) {
							return left;
						}

						// Otherwise, we need to start a stack to properly place the binary operations in their
						// precedence structure
						biop_info = { value: biop, prec: binaryPrecedence(biop)};

						right = gobbleToken();
						if(!right) {
							throwError("Expected expression after " + biop, index);
						}
						stack = [left, biop_info, right];

						// Properly deal with precedence using [recursive descent](http://www.engr.mun.ca/~theo/Misc/exp_parsing.htm)
						while((biop = gobbleBinaryOp())) {
							prec = binaryPrecedence(biop);

							if(prec === 0) {
								break;
							}
							biop_info = { value: biop, prec: prec };

							// Reduce: make a binary expression from the three topmost entries.
							while ((stack.length > 2) && (prec <= stack[stack.length - 2].prec)) {
								right = stack.pop();
								biop = stack.pop().value;
								left = stack.pop();
								node = createBinaryExpression(biop, left, right);
								stack.push(node);
							}

							node = gobbleToken();
							if(!node) {
								throwError("Expected expression after " + biop, index);
							}
							stack.push(biop_info, node);
						}

						i = stack.length - 1;
						node = stack[i];
						while(i > 1) {
							node = createBinaryExpression(stack[i - 1].value, stack[i - 2], node); 
							i -= 2;
						}
						return node;
					},

					// An individual part of a binary expression:
					// e.g. `foo.bar(baz)`, `1`, `"abc"`, `(a % 2)` (because it's in parenthesis)
					gobbleToken = function() {
						var ch, to_check, tc_len;
						
						gobbleSpaces();
						ch = exprICode(index);

						if(isDecimalDigit(ch) || ch === PERIOD_CODE) {
							// Char code 46 is a dot `.` which can start off a numeric literal
							return gobbleNumericLiteral();
						} else if(ch === SQUOTE_CODE || ch === DQUOTE_CODE) {
							// Single or double quotes
							return gobbleStringLiteral();
						} else if(isIdentifierStart(ch) || ch === OPAREN_CODE) { // open parenthesis
							// `foo`, `bar.baz`
							return gobbleVariable();
						} else if (ch === OBRACK_CODE) {
							return gobbleArray();
						} else {
							to_check = expr.substr(index, max_unop_len);
							tc_len = to_check.length;
							while(tc_len > 0) {
								if(unary_ops.hasOwnProperty(to_check)) {
									index += tc_len;
									return {
										type: UNARY_EXP,
										operator: to_check,
										argument: gobbleToken(),
										prefix: true
									};
								}
								to_check = to_check.substr(0, --tc_len);
							}
							
							return false;
						}
					},
					// Parse simple numeric literals: `12`, `3.4`, `.5`. Do this by using a string to
					// keep track of everything in the numeric literal and then calling `parseFloat` on that string
					gobbleNumericLiteral = function() {
						var number = '', ch, chCode;
						while(isDecimalDigit(exprICode(index))) {
							number += exprI(index++);
						}

						if(exprICode(index) === PERIOD_CODE) { // can start with a decimal marker
							number += exprI(index++);

							while(isDecimalDigit(exprICode(index))) {
								number += exprI(index++);
							}
						}
						
						ch = exprI(index);
						if(ch === 'e' || ch === 'E') { // exponent marker
							number += exprI(index++);
							ch = exprI(index);
							if(ch === '+' || ch === '-') { // exponent sign
								number += exprI(index++);
							}
							while(isDecimalDigit(exprICode(index))) { //exponent itself
								number += exprI(index++);
							}
							if(!isDecimalDigit(exprICode(index-1)) ) {
								throwError('Expected exponent (' + number + exprI(index) + ')', index);
							}
						}
						

						chCode = exprICode(index);
						// Check to make sure this isn't a variable name that start with a number (123abc)
						if(isIdentifierStart(chCode)) {
							throwError('Variable names cannot start with a number (' +
										number + exprI(index) + ')', index);
						} else if(chCode === PERIOD_CODE) {
							throwError('Unexpected period', index);
						}

						return {
							type: LITERAL,
							value: parseFloat(number),
							raw: number
						};
					},

					// Parses a string literal, staring with single or double quotes with basic support for escape codes
					// e.g. `"hello world"`, `'this is\nJSEP'`
					gobbleStringLiteral = function() {
						var str = '', quote = exprI(index++), closed = false, ch;

						while(index < length) {
							ch = exprI(index++);
							if(ch === quote) {
								closed = true;
								break;
							} else if(ch === '\\') {
								// Check for all of the common escape codes
								ch = exprI(index++);
								switch(ch) {
									case 'n': str += '\n'; break;
									case 'r': str += '\r'; break;
									case 't': str += '\t'; break;
									case 'b': str += '\b'; break;
									case 'f': str += '\f'; break;
									case 'v': str += '\x0B'; break;
								}
							} else {
								str += ch;
							}
						}

						if(!closed) {
							throwError('Unclosed quote after "'+str+'"', index);
						}

						return {
							type: LITERAL,
							value: str,
							raw: quote + str + quote
						};
					},
					
					// Gobbles only identifiers
					// e.g.: `foo`, `_value`, `$x1`
					// Also, this function checks if that identifier is a literal:
					// (e.g. `true`, `false`, `null`) or `this`
					gobbleIdentifier = function() {
						var ch = exprICode(index), start = index, identifier;

						if(isIdentifierStart(ch)) {
							index++;
						} else {
							throwError('Unexpected ' + exprI(index), index);
						}

						while(index < length) {
							ch = exprICode(index);
							if(isIdentifierPart(ch)) {
								index++;
							} else {
								break;
							}
						}
						identifier = expr.slice(start, index);

						if(literals.hasOwnProperty(identifier)) {
							return {
								type: LITERAL,
								value: literals[identifier],
								raw: identifier
							};
						} else if(identifier === this_str) {
							return { type: THIS_EXP };
						} else {
							return {
								type: IDENTIFIER,
								name: identifier
							};
						}
					},

					// Gobbles a list of arguments within the context of a function call
					// or array literal. This function also assumes that the opening character
					// `(` or `[` has already been gobbled, and gobbles expressions and commas
					// until the terminator character `)` or `]` is encountered.
					// e.g. `foo(bar, baz)`, `my_func()`, or `[bar, baz]`
					gobbleArguments = function(termination) {
						var ch_i, args = [], node;
						while(index < length) {
							gobbleSpaces();
							ch_i = exprICode(index);
							if(ch_i === termination) { // done parsing
								index++;
								break;
							} else if (ch_i === COMMA_CODE) { // between expressions
								index++;
							} else {
								node = gobbleExpression();
								if(!node || node.type === COMPOUND) {
									throwError('Expected comma', index);
								}
								args.push(node);
							}
						}
						return args;
					},

					// Gobble a non-literal variable name. This variable name may include properties
					// e.g. `foo`, `bar.baz`, `foo['bar'].baz`
					// It also gobbles function calls:
					// e.g. `Math.acos(obj.angle)`
					gobbleVariable = function() {
						var ch_i, node;
						ch_i = exprICode(index);
							
						if(ch_i === OPAREN_CODE) {
							node = gobbleGroup();
						} else {
							node = gobbleIdentifier();
						}
						gobbleSpaces();
						ch_i = exprICode(index);
						while(ch_i === PERIOD_CODE || ch_i === OBRACK_CODE || ch_i === OPAREN_CODE) {
							index++;
							if(ch_i === PERIOD_CODE) {
								gobbleSpaces();
								node = {
									type: MEMBER_EXP,
									computed: false,
									object: node,
									property: gobbleIdentifier()
								};
							} else if(ch_i === OBRACK_CODE) {
								node = {
									type: MEMBER_EXP,
									computed: true,
									object: node,
									property: gobbleExpression()
								};
								gobbleSpaces();
								ch_i = exprICode(index);
								if(ch_i !== CBRACK_CODE) {
									throwError('Unclosed [', index);
								}
								index++;
							} else if(ch_i === OPAREN_CODE) {
								// A function call is being made; gobble all the arguments
								node = {
									type: CALL_EXP,
									'arguments': gobbleArguments(CPAREN_CODE),
									callee: node
								};
							}
							gobbleSpaces();
							ch_i = exprICode(index);
						}
						return node;
					},

					// Responsible for parsing a group of things within parentheses `()`
					// This function assumes that it needs to gobble the opening parenthesis
					// and then tries to gobble everything within that parenthesis, assuming
					// that the next thing it should see is the close parenthesis. If not,
					// then the expression probably doesn't have a `)`
					gobbleGroup = function() {
						index++;
						var node = gobbleExpression();
						gobbleSpaces();
						if(exprICode(index) === CPAREN_CODE) {
							index++;
							return node;
						} else {
							throwError('Unclosed (', index);
						}
					},

					// Responsible for parsing Array literals `[1, 2, 3]`
					// This function assumes that it needs to gobble the opening bracket
					// and then tries to gobble the expressions as arguments.
					gobbleArray = function() {
						index++;
						return {
							type: ARRAY_EXP,
							elements: gobbleArguments(CBRACK_CODE)
						};
					},

					nodes = [], ch_i, node;
					
				while(index < length) {
					ch_i = exprICode(index);

					// Expressions can be separated by semicolons, commas, or just inferred without any
					// separators
					if(ch_i === SEMCOL_CODE || ch_i === COMMA_CODE) {
						index++; // ignore separators
					} else {
						// Try to gobble each expression individually
						if((node = gobbleExpression())) {
							nodes.push(node);
						// If we weren't able to find a binary expression and are out of room, then
						// the expression passed in probably has too much
						} else if(index < length) {
							throwError('Unexpected "' + exprI(index) + '"', index);
						}
					}
				}

				// If there's only one expression just try returning the expression
				if(nodes.length === 1) {
					return nodes[0];
				} else {
					return {
						type: COMPOUND,
						body: nodes
					};
				}
			};

		// To be filled in by the template
		jsep.version = '0.3.0';
		jsep.toString = function() { return 'JavaScript Expression Parser (JSEP) v' + jsep.version; };

		/**
		 * @method jsep.addUnaryOp
		 * @param {string} op_name The name of the unary op to add
		 * @return jsep
		 */
		jsep.addUnaryOp = function(op_name) {
			unary_ops[op_name] = t; return this;
		};

		/**
		 * @method jsep.addBinaryOp
		 * @param {string} op_name The name of the binary op to add
		 * @param {number} precedence The precedence of the binary op (can be a float)
		 * @return jsep
		 */
		jsep.addBinaryOp = function(op_name, precedence) {
			max_binop_len = Math.max(op_name.length, max_binop_len);
			binary_ops[op_name] = precedence;
			return this;
		};

		/**
		 * @method jsep.removeUnaryOp
		 * @param {string} op_name The name of the unary op to remove
		 * @return jsep
		 */
		jsep.removeUnaryOp = function(op_name) {
			delete unary_ops[op_name];
			if(op_name.length === max_unop_len) {
				max_unop_len = getMaxKeyLen(unary_ops);
			}
			return this;
		};

		/**
		 * @method jsep.removeBinaryOp
		 * @param {string} op_name The name of the binary op to remove
		 * @return jsep
		 */
		jsep.removeBinaryOp = function(op_name) {
			delete binary_ops[op_name];
			if(op_name.length === max_binop_len) {
				max_binop_len = getMaxKeyLen(binary_ops);
			}
			return this;
		};

		// In desktop environments, have a way to restore the old value for `jsep`
		if (false) {
			var old_jsep = root.jsep;
			// The star of the show! It's a function!
			root.jsep = jsep;
			// And a courteous function willing to move out of the way for other similarly-named objects!
			jsep.noConflict = function() {
				if(root.jsep === jsep) {
					root.jsep = old_jsep;
				}
				return jsep;
			};
		} else {
			// In Node.JS environments
			if (typeof module !== 'undefined' && module.exports) {
				exports = module.exports = jsep;
			} else {
				exports.parse = jsep;
			}
		}
	}(this));


/***/ }
/******/ ])
});
;
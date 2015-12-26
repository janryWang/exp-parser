'use strict'

import { extend,isStr,each,isFunc } from './utils'
import {ExpressionTypes,EXP_HANDLER} from './handler'
import jsep from 'jsep'

jsep.removeBinaryOp("|")

const parseTree = (target, scope)=> {
    let cache = {
        iterationObj: scope
    }
    function parseNode (node){
        let result = null

        each(ExpressionTypes, type=> {
            if (node.type == type) {
                result = EXP_HANDLER[type](parseNode, cache)(node, scope)
                return false
            }
        })
        return result
    }
    return parseNode(jsep(target))
}

class ExpressionParser {
    constructor(globalScope, globalFilter) {
        this.globalScope = globalScope
        this.globalFilter = globalFilter
    }

    filter(filter) {
        extend(this.globalFilter, filter)
        return this
    }

    scope(scope) {
        extend(this.globalScope, scope)
        return this
    }

    parse(str, scope, filter) {
        if (isStr(str)) {
            scope = extend(scope, this.globalScope)
            filter = extend(filter, this.globalFilter)
            let {target,filterArr} = this._parseStr(str)
            return this._resolveFilter(filterArr, filter)
            (parseTree(target, scope), scope)
        }
    }

    _resolveFilter(filterArr, filter) {
        return (target, scope)=> {
            if (filterArr.length) {
                each(filterArr, (filterStr)=> {
                    filterStr = filterStr.split(":")
                    let name = filterStr[0],args,filterFunc
                    if (filter && filter[name]) {
                        args = filterStr.slice(1).map((arg)=>parseTree(arg, scope))
                        filterFunc = filter[name].apply(scope,args)
                        if(isFunc(filterFunc)){
                            target = filterFunc(target)
                        } else {
                            //报错
                        }
                    } else {
                        //报错
                    }
                })
                return target
            } else {
                return target
            }
        }
    }

    _parseStr(str) {
        str = str.replace(/\s*/g, "").split("|")
        if (str.length > 1) {
            return {
                target: str[0],
                filterArr: str.slice(1)
            }
        } else {
            return {
                target: str[0],
                filterArr: []
            }
        }
    }

    static injectExpHandler = ()=>{

    }

    static ExpressionTypes = ExpressionTypes

}

extend(ExpressionParser, jsep)

export default ExpressionParser

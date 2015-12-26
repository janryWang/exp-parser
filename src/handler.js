'use strict'

import * as constants from './constants'
import { toArray,isFunc,isObj,each,calculator } from './utils'

const {
    COMPOUND,
    IDENTIFIER,
    MEMBER_EXP,
    LITERAL,
    THIS_EXP,
    CALL_EXP,
    UNARY_EXP,
    BINARY_EXP,
    LOGICAL_EXP,
    CONDITIONAL_EXP,
    ARRAY_EXP
    } = constants.ExpressionTypes

export const ExpressionTypes = constants.ExpressionTypes


export let EXP_HANDLER = {
    [COMPOUND](){
        return ()=> {

        }
    },
    [IDENTIFIER](){
        return (node, scope)=> scope[node.name]
    },
    [MEMBER_EXP](parseNode, cache){
        return (node)=> {
            let {object,property} = node
            let {iterationObj} = cache
            switch (node.object.type) {
                case MEMBER_EXP:
                    cache.iterationObj = parseNode(object)[property.name]
                    break
                case THIS_EXP:
                    cache.iterationObj = iterationObj[property.name]
                    break
                case IDENTIFIER:
                    cache.iterationObj = iterationObj[object.name][property.name]
            }
            return cache.iterationObj
        }
    },
    [LITERAL](){
        return (node)=> node.value
    },
    [CALL_EXP](parseNode){
        return (node, scope)=> {
            let {callee} = node
            let args = toArray(node.arguments).map(function (arg) {
                return parseNode(arg, scope)
            })
            if (callee.type == IDENTIFIER) {
                let method = scope[callee.name]
                if (method) {
                    if (isFunc(method)) {
                        return method.apply(scope, args)
                    } else if (isObj(method)) {
                        if (isFunc(method.func)) {
                            return method.func.apply(method.context, args)
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

        }
    },
    [UNARY_EXP](parseNode){
        return (node)=> {
            if(node.argument.type !== UNARY_EXP){
                return calculator(node.operator)
                    .unary(parseNode(node.argument))()
            } else {
                //报错,不能在表达式内赋值
            }
        }
    },
    [BINARY_EXP](parseNode){
        return (node)=> calculator(node.operator)
            .binary(parseNode(node.left),parseNode(node.right))()
    },
    [LOGICAL_EXP](parseNode){
        return (node)=> calculator(node.operator)
            .binary(parseNode(node.left),parseNode(node.right))()
    },
    [CONDITIONAL_EXP](parseNode){
        return (node)=> {
            if (parseNode(node.test)) {
                return parseNode(node.consequent)
            } else {
                return parseNode(node.alternate)
            }
        }
    },
    [ARRAY_EXP](parseNode){
        return (node)=> {
            let res = []
            each(node.elements,el => {
                res.push(parseNode(el))
            })
            return res
        }
    }
}

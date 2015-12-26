'use strict'

const is = type=>val=> Object.prototype.toString.call(val) == '[object ' + type + ']'

export const isFunc = is('Function')

export const isStr = is('String')

export const isArr = is('Array')

export const isObj = is('Object')

export const each = (obj, func)=> {
    if (!obj || !isFunc(func)) return
    let keys = Object.keys(obj), i, val, key
    for (i = 0; i < keys.length; i++) {
        key = keys[i]
        val = obj[key]
        if (obj.hasOwnProperty(key)) {
            if (func(val, key) === false) break
        }
    }
}

export const extend = (obj1, obj2)=> {
    if (isObj(obj1) || isArr(obj1)) {
        each(obj2, (val, key)=> {
            obj1[key] = val
        })
        return obj1
    } else {
        return obj1
    }
}

export const calculator = (operator) =>{
    return {
        unary:(x)=>new Function(`return ${operator}${x}`),
        binary:(x,y)=>new Function(`return ${x}${operator}${y}`)
    }
}

export const toArray = obj => Array.prototype.slice.call(obj)


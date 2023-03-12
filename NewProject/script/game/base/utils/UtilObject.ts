/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-cond-assign */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-proto */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: hwx
 * @Date: 2022-06-29 16:36:22
 * @FilePath: \SanGuo24\assets\script\game\base\utils\UtilObject.ts
 * @Description: 对象工具
 */

function set(obj, key, val) {
    if (typeof val.value === 'object') val.value = UtilObject.clone(val.value);
    if (!val.enumerable || val.get || val.set || !val.configurable || !val.writable || key === '__proto__') {
        Object.defineProperty(obj, key, val);
    } else obj[key] = val.value;
}

export default class UtilObject {
    /**
     * 拷贝，仅支持数据类对象
     * @param obj
     * @param deepCopy
     * @returns
     */
    public static clone(obj, deepCopy = true): any {
        if (typeof obj !== 'object') return obj;
        if (!deepCopy) return { ...obj };

        let i = 0; let k; let list; let tmp; const str = Object.prototype.toString.call(obj);

        if (str === '[object Object]') {
            tmp = Object.create(obj.__proto__ || null);
        } else if (str === '[object Array]') {
            tmp = Array(obj.length);
        } else if (str === '[object Set]') {
            tmp = new Set();
            obj.forEach((val) => {
                tmp.add(this.clone(val));
            });
        } else if (str === '[object Map]') {
            tmp = new Map();
            obj.forEach((val, key) => {
                tmp.set(this.clone(key), this.clone(val));
            });
        } else if (str === '[object Date]') {
            tmp = new Date(+obj);
        } else if (str === '[object RegExp]') {
            tmp = new RegExp(obj.source, obj.flags);
        } else if (str === '[object DataView]') {
            tmp = new obj.constructor(this.clone(obj.buffer));
        } else if (str === '[object ArrayBuffer]') {
            tmp = obj.slice(0);
        } else if (str.slice(-6) === 'Array]') {
            // ArrayBuffer.isView(x)
            // ~> `new` bcuz `Buffer.slice` => ref
            tmp = new obj.constructor(obj);
        }

        if (tmp) {
            for (list = Object.getOwnPropertySymbols(obj); i < list.length; i++) {
                set(tmp, list[i], Object.getOwnPropertyDescriptor(obj, list[i]));
            }

            for (i = 0, list = Object.getOwnPropertyNames(obj); i < list.length; i++) {
                if (Object.hasOwnProperty.call(tmp, k = list[i]) && tmp[k] === obj[k]) continue;
                set(tmp, k, Object.getOwnPropertyDescriptor(obj, k));
            }
        }

        return tmp || obj;
    }

    public static equals<T>(x: T, y: T): boolean {
        if (x === y) {
            return true; // if both x and y are null or undefined and exactly the same
        } else if (!(x instanceof Object) || !(y instanceof Object)) {
            return false; // if they are not strictly equal, they both need to be Objects
        } else if (x.constructor !== y.constructor) {
            // they must have the exact same prototype chain, the closest we can do is
            // test their constructor.
            return false;
        } else {
            for (const p in x) {
                if (!x.hasOwnProperty(p)) {
                    continue; // other properties were tested using x.constructor === y.constructor
                }
                if (!y.hasOwnProperty(p)) {
                    return false; // allows to compare x[ p ] and y[ p ] when set to undefined
                }
                if (x[p] === y[p]) {
                    continue; // if they have the same strict value or identity then they are equal
                }
                if (typeof x[p] !== 'object') {
                    return false; // Numbers, Strings, Functions, Booleans must be strictly equal
                }
                if (!this.equals(x[p], y[p])) {
                    return false;
                }
            }
            for (const p in y) {
                if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
                    return false;
                }
            }
            return true;
        }
    }
}

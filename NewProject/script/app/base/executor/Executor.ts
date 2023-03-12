/*
 * @Author: zs
 * @Date: 2022-04-07 18:21:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-22 11:20:22
 * @FilePath: \SanGuo\assets\script\app\base\executor\Executor.ts
 * @Description:
 */
const { ccclass } = cc._decorator;

export class Executor {
    private caller_: (...arg) => any = undefined;
    private this_: unknown = undefined;
    private args_: any[] = [];
    public constructor(caller: (...arg) => void, target?: unknown, ...params: any[]) {
        this.caller_ = caller;
        this.this_ = target;
        this.args_ = Array.prototype.slice.call(arguments, 2);
    }

    /**
     * 如果传入参数，则以传入参数作为调用
     * 否则以构造函数传入参数调用
     * @param {any} thisArg
     */
    public invoke(thisArg?: unknown): any {
        if (!this.caller_) { return undefined; }
        let args;
        if (arguments.length) {
            thisArg = thisArg || window;
            args = Array.prototype.slice.call(arguments, 1);
        } else {
            thisArg = this.this_ || window;
            args = this.args_;
        }

        return this.caller_.apply(thisArg, args);
    }

    /**
     * 重新传入参数执行回调
     * @param params 参数
     * @returns any
     */
    public invokeWithArgs(...params: any[]): any {
        const f = this.caller_;
        if (!f || typeof f !== 'function') { return undefined; }

        const this_ = this.this_ || window;
        // eslint-disable-next-line dot-notation
        if (this_ && this_['isValid'] === false) {
            const stack = new Error().stack;
            console.warn('invokeWithArgs this.isValid is false:', this_, stack);
        }
        return f.apply(this_, params);
    }

    /** 是否相同的callback和target */
    public equals(callback: (...arg) => void, target?: unknown): boolean {
        return this.caller_ === callback && this.this_ === target;
    }

    public callback(): (...arg) => any {
        return this.caller_;
    }

    public target(): unknown {
        return this.this_;
    }

    public getArgs(): any[] {
        return this.args_;
    }

    /** 清除属性 */
    public clear(): void {
        this.caller_ = undefined;
        this.this_ = undefined;
        this.args_.length = 0;
        this.args_ = undefined;
    }
}

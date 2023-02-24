import { _decorator } from 'cc';
import { RecordObj, TFunc, Type } from '../../global/GConst';

const { ccclass } = _decorator;

@ccclass('Executor')
export class Executor {
    private func: TFunc;
    private this_: RecordObj = undefined;
    private args_: any[] = [];
    public constructor(func: TFunc, target?: RecordObj, ...params: any[]) {
        this.func = func;
        this.this_ = target;
        this.args_ = params;
    }

    /**
     * 如果传入参数，则以传入参数作为调用
     * 否则以构造函数传入参数调用
     * @param {any} thisArg
     */
    public invoke(thisArg?: unknown): any {
        if (!this.func) { return undefined; }
        let args;
        if (arguments.length) {
            thisArg = thisArg || window;
            args = Array.prototype.slice.call(arguments, 1);
        } else {
            thisArg = this.this_ || window;
            args = this.args_;
        }

        return this.func.apply(thisArg, args);
    }

    /**
     * 调用回调，并且传入参数
     * @param params 参数
     * @returns any
     */
    public invokeWithArgs(...params: any[]): any {
        const f = this.func;
        if (!f || typeof f !== Type.Function) { return undefined; }

        const this_ = this.this_ || window;
        return f.apply(this_, params);
    }

    /** 是否相同的callback和target */
    public equals(callback: TFunc, target?: unknown): boolean {
        return this.func === callback && this.this_ === target;
    }

    public callback(): (...arg)=> any {
        return this.func;
    }

    public target(): RecordObj {
        return this.this_;
    }

    public getArgs(): any[] {
        return this.args_;
    }

    /** 清除属性 */
    public clear(): void {
        this.func = undefined;
        this.this_ = undefined;
        this.args_.length = 0;
        this.args_ = undefined;
    }
}

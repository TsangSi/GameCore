import { _decorator } from 'cc';
import { RecordObj, TFunc } from '../GConst';
import { UtilsArray } from '../utils/UtilsArray';
import { Executor } from './Executor';

const { ccclass } = _decorator;

@ccclass('ExecutorList')
export class ExecutorList {
    private executors_: Executor[] = [];

    private invoked_ = undefined;

    private invoking_ = false;
    private invokingWithArgs_ = false;

    /** @type {Array.<number>} */
    private waitingForRemove_: any[] = [];

    private waitingForClear_ = false;

    public get length(): number {
        return this.executors_.length;
    }

    public clear(): void {
        if (this.invoking_ || this.invokingWithArgs_) {
            this.waitingForClear_ = true;
        } else {
            this._clear();
        }
    }

    private _clear() {
        if (this.waitingForClear_) {
            this.waitingForRemove_.length = 0;
            this.executors_.length = 0;
            this.waitingForClear_ = false;

            return true;
        }

        return false;
    }

    private _push(func: TFunc, target?: RecordObj) {
        const executor = new Executor(func, target);
        this.executors_.push(executor);
        return executor;
    }

    /**
     * 新增一个func
     *
     * 新增唯一的请使用pushUnique
     */
    public push(func: TFunc, target?: RecordObj): Executor {
        if (func) {
            return this._push(func, target);
        }
    }

    /**
     * 新增一个唯一的func
     *
     * 有可能重复的请使用push
     */
    public pushUnique(func: TFunc, target?: RecordObj): Executor {
        if (func && this.indexOf(func, target) >= 0) {
            return this._push(func, target);
        }
    }

    /** 查询，返回索引，没有返回-1 */
    public indexOf(func: TFunc, target?: RecordObj): number {
        if (!func) {
            return -1;
        }

        const executors = this.executors_;
        for (let i = 0, n = executors.length; i < n; ++i) {
            const executor = executors[i];
            if (executor.equals(func, target)) {
                return i;
            }
        }
        return -1;
    }

    public invoke(): Executor[] {
        const results: Executor[] = [];
        if (this.invoking_) {
            return results;
        }

        const executors = this.executors_;
        this.invoking_ = true;
        const removes = this.waitingForRemove_;
        for (let i = 0, n = executors.length; i < n; ++i) {
            const executor = executors[i];

            try {
                results.push(executor.invoke.call(executor, arguments));
            } catch (e) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                console.error(e.stack);
            }

            // let r = this._onInvoked(arguments);
            // if (r & ExecutorList.InvokedResult.Remove) { utils.insertToOrderdUniqueArray(removes, i); }
        }
        this.invoking_ = false;

        if (!this._clear()) { this.removes(removes); }

        return results;
    }
    // /**
    //  * 每次调用后的回调函数
    //  * 用于中断循环
    //  * @param {Function} func -该回调返回true表示继续，否则中断调用循环
    //  * @param {any} target
    //  */
    // onInvoked (func, target) {
    //     this.invoked_ = utils.functor.nnew(fn.Executor.prototype.constructor, arguments);
    // }

    public invokeWithArgs(...params: any[]): void {
        if (this.invokingWithArgs_) {
            return;
        }

        const executors = this.executors_;
        // let results = [];
        this.invokingWithArgs_ = true;
        const removes = this.waitingForRemove_;
        for (let i = 0, n = executors.length; i < n; ++i) {
            const executor = executors[i];
            try {
                // results.push(utils.functor.fcall(executor, executor.invokeWithArgs, arguments));
                // results.push(executor.invokeWithArgs, )
                executor.invokeWithArgs.apply(executor, params);
            } catch (e) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                console.error(e.stack);
            }

            // let r = this._onInvoked(arguments);
            // if (r & ExecutorList.InvokedResult.Remove) { utils.insertToOrderdUniqueArray(removes, i); }
        }
        this.invokingWithArgs_ = false;

        if (!this._clear()) { this.removes(removes); }

        // return results;
    }

    public remove(func: TFunc, target: RecordObj): void {
        if (!func) {
            return;
        }

        const idx = this.indexOf(func, target);
        if (idx < 0) { return; }
        if (this.invokingWithArgs_ || this.invoking_) {
            UtilsArray.Insert(this.waitingForRemove_, idx);
        } else {
            this.executors_.splice(idx, 1);
        }
    }

    public removeAllOf(func: TFunc, target: RecordObj): void {
        if (!func) { return; }

        const executors = this.executors_;
        const removes = this.invokingWithArgs_ || this.invoking_ ? this.waitingForRemove_ : [];
        for (let i = 0, n = executors.length; i < n; ++i) {
            const executor = executors[i];
            if (executor.equals(func, target)) {
                UtilsArray.Insert(removes, i);
            }
        }

        if (!(this.invokingWithArgs_ || this.invoking_)) {
            this.removes(removes);
        }
    }

    /**
     *
     */
    private removes(removes: number[]) {
        const executors = this.executors_;
        for (let i = removes.length - 1; i >= 0; --i) {
            const idx = removes[i];
            executors.splice(idx, 1);
        }
        removes.length = 0;
    }
}

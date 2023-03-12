import { Executor } from './Executor';

const { ccclass } = cc._decorator;
@ccclass
export class ExecutorList {
    private testLength: number = 0;
    private executors_: Executor[] = [];

    private invoked_ = undefined;

    private invoking_ = false;
    private invokingWithArgs_ = false;

    /** @type {Array.<number>} */
    private waitingForRemove_: number[] = [];

    private waitingForClear_ = false;

    public get length(): number {
        if (CC_DEBUG) {
            if (this.testLength !== this.executors_.length) {
                console.warn('ExecutorList testLength != this.executors_.length');
            }
        }
        return this.testLength;
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
            this.testLength = 0;
            this.waitingForClear_ = false;

            return true;
        }

        return false;
    }

    private _push(callback: (...arg) => void, target?: unknown) {
        const executor = new Executor(callback, target);
        this.executors_.push(executor);
        this.testLength++;
    }

    /**
     * 新增一个callback
     *
     * 新增唯一的请使用pushUnique
     */
    public push(callback: (...arg) => void, target?: unknown): void {
        if (!callback || typeof callback !== 'function') {
            return;
        }
        this._push(callback, target);
    }

    /**
     * 新增一个唯一的callback
     *
     * 有可能重复的请使用push
     */
    public pushUnique(callback: (...arg) => void, target?: unknown): boolean {
        if (!callback || typeof callback !== 'function') {
            return false;
        }

        if (this.indexOf(callback, target) >= 0) {
            return false;
        }
        this._push(callback, target);
        return true;
    }

    /** 查询，返回索引，没有返回-1 */
    public indexOf(callback: (...arg) => void, target?: unknown): number {
        if (!callback) {
            return -1;
        }

        const executors = this.executors_;
        for (let i = 0, n = executors.length; i < n; ++i) {
            const executor = executors[i];
            if (executor.equals(callback, target)) {
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
                results.push(executor.invoke.call(executor, arguments) as Executor);
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
    //  * @param {Function} callback -该回调返回true表示继续，否则中断调用循环
    //  * @param {any} target
    //  */
    // onInvoked (callback, target) {
    //     this.invoked_ = utils.functor.nnew(fn.Executor.prototype.constructor, arguments);
    // }

    /**
     * 重新传参执行回调
     * @param params
     * @returns
     */
    public invokeWithArgs(...params: any[]): Executor[] {
        if (this.invokingWithArgs_) {
            return [];
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

        return executors;
    }

    public remove(callback: (...arg) => void, target: unknown): boolean {
        if (!callback || typeof callback !== 'function') {
            return false;
        }

        const idx = this.indexOf(callback, target);
        if (idx < 0) { return false; }
        if (this.invokingWithArgs_ || this.invoking_) {
            // Utils.insertToAscUniqueArray(this.waitingForRemove_, idx);
            this.waitingForRemove_.push(idx);
        } else {
            this.executors_.splice(idx, 1);
            this.testLength--;
        }
        return true;
    }

    public removeAllOf(callback: (...arg) => void, target: unknown): void {
        if (!callback || typeof callback !== 'function') { return; }

        const executors = this.executors_;
        const removes = this.invokingWithArgs_ || this.invoking_ ? this.waitingForRemove_ : [];
        for (let i = 0, n = executors.length; i < n; ++i) {
            const executor = executors[i];
            if (executor.equals(callback, target)) {
                // Utils.insertToAscUniqueArray(removes, i);
                removes.push(i);
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
            this.testLength--;
        }
        removes.length = 0;
    }
}

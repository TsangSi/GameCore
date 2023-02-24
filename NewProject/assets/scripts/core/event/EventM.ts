import { js } from "cc"
import Singleton from "../base/Singleton"
import { Executor } from "../executor/Executor"
import { ExecutorList } from "../executor/ExecutorList"
import { RecordObj, TFunc } from "../GConst"

export interface IEventM {
    /**
     * 监听事件
     * @param id 事件id
     * @param func 回调
     * @param target 回调的this
     * @returns true 成功，false 失败
     */
    on: (id: number, func: TFunc, target: RecordObj) => Executor
    /**
     * 一次性监听事件，一旦触发就会不再监听
     * @param id 事件id
     * @param func 回调
     * @param target 回调的this
     * @returns true 成功，false 失败
     */
    once: (id: number, func: TFunc, target: RecordObj) => Executor
    /**
     * 移除监听事件
     * @param id 事件id
     * @param func 回调
     * @param target 回调的this
     */
    off: (id: number, func: TFunc, target: RecordObj) => void
}

export class EventM extends Singleton<EventM>() implements IEventM {
    
    /** 事件列表 */
    private listeners_: Record<string, ExecutorList> = js ? js.createMap(true) : Object.create(null);
    /** 单次事件列表 */
    private onceListeners_: Record<string, ExecutorList> = js ? js.createMap(true) : Object.create(null);

    public on(id: number, func: TFunc, target: RecordObj): Executor {
        return this.addListener(this.listeners_, id, func, target);
    }

    public once(id: number, func: TFunc, target: RecordObj): Executor {
        return this.addListener(this.onceListeners_, id, func, target);
    }

    public off(id: number, func: TFunc, target: RecordObj): void {
        this.removeListener(id, func, target);
    }

    /**
     *
     * @param {string} id
     * @param {any} arg0
     */
    public fire(id: number | string, ...param: any[]): void {
        return this._fire(id, param);
    }

    /**
     *
     * @param {string} id
     * @param {Array.<any>} args
     * @param {number} start_idx
     */
    private _fire(id: number | string, params: any[]) {
        if (!id) {
            console.warn('fn.EventM.fire: invalid id!');
            return;
        }

        let executors = this.listeners_[id];
        if (executors) {
            executors.invokeWithArgs.apply(executors, params);
        }

        executors = this.onceListeners_[id];
        delete this.onceListeners_[id];
        if (executors) {
            executors.invokeWithArgs.apply(executors, params);
        }
    }

    private addListener(mapping: Record<string, ExecutorList>, id: number | string, func: TFunc, target?: RecordObj) {
        if (!id || !func) {
            console.warn(js.formatStr(
                'hl.EventM._addListener: invalid param(s). id: %s, func: %s',
                id,
                func,
            ));
            return;
        }

        if (this.contains(mapping, id, func, target)) {
            return;
        }

        let executors = mapping[id];
        if (executors) {
            return executors.pushUnique(func, target);
        } else {
            executors = mapping[id] = new ExecutorList();
            return executors.push(func, target);
        }
    }

    private contains(mapping: Record<string, ExecutorList>, id: number | string, func: TFunc, target?: RecordObj) {
        const executors = mapping[id];
        return executors && executors.indexOf(func, target) >= 0;
    }

    /**
     *
     * @param {string} id
     * @param {Function} func
     * @param {any} target
     * @return {fn.EventM}
     */
    private removeListener(id: number | string, func: TFunc, target: RecordObj) {
        if (arguments.length === 1) {
            this.clearListener(id);
        } else if (typeof func === 'function') {
            const listeners = [this.listeners_[id], this.onceListeners_[id]];
            const managers = [this.listeners_, this.onceListeners_];
            for (let k = 0, n = listeners.length; k < n; ++k) {
                const executors = listeners[k];
                if (executors && executors.length) {
                    executors.removeAllOf(func, target);
                }

                if (executors && executors.length === 0) {
                    delete managers[k][id];
                }
            }
        }
    }

    /**
     *
     * @param {string} id
     */
    private clearListener(id: number | string) {
        let listeners = this.listeners_;
        let executors = listeners[id];
        if (executors) {
            executors.clear();
            delete listeners[id];
        }

        listeners = this.onceListeners_;
        executors = listeners[id];
        if (executors) {
            executors.clear();
            delete listeners[id];
        }
    }
}
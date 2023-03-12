/* eslint-disable max-len */
/* eslint-disable dot-notation */
/* eslint-disable camelcase */
import { EventClient } from '../../../app/base/event/EventClient';
import { Executor } from '../../../app/base/executor/Executor';
import { UtilArray } from '../../../app/base/utils/UtilArray';

/*
 * @Author: zs
 * @Date: 2022-05-10 17:44:27
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-17 12:04:21
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\role\RoleEvent.ts
 * @Description:
 *
 */

const ALL = 'All';

type callback = (...args: unknown[]) => void
interface IAttrsExecutor {
    /** 属性列表 */
    keys: string[],
    /** 回调器 */
    executor: Executor
}

export class RoleEvent {
    public constructor() {
        this._EventClient = EventClient.I;
    }
    private _EventClient: EventClient;
    /** 多个属性存储的列表 */
    private multipleEvents: IAttrsExecutor[] = [];
    /** 多个属性存储的列表（一次性） */
    private multipleEventsOnce: IAttrsExecutor[] = [];

    /**
     * 监听属性变化，有一个属性变化就会触发
     * @param cb 回调
     * @param target 回调的this
     */
    public on(cb: callback, target: unknown): void;
    /**
     * 监听单个属性变化，只有该属性变化才会触发
     * @param cb 回调
     * @param target 回调的this
     * @param key 属性名
     */
    public on(cb: callback, target: unknown, key: string): void;
    /**
     * 监听多个属性变化
     * @param cb 回调
     * @param target 回调的this
     * @param args 属性1，属性2，属性3，属性4...
     */
    public on(cb: callback, target: unknown, ...args: string[]): void;
    /**
     * 监听多个属性变化
     * @param cb 回调
     * @param target 回调的this
     * @param args 属性1，属性2，属性3，属性4...
     */
    public on(cb: callback, target: unknown, key: string[]): void;
    public on(cb: callback, target: unknown, key?: string | string[], ...args: string[]): void {
        if (!target || !cb) { return; }
        key = key || ALL;
        if (typeof key === 'string' && args.length === 0) {
            // 单个
            this._EventClient.on(this.getEventName(key), cb, target);
        } else {
            // 多个
            const attrsExecutor: IAttrsExecutor = cc.js.createMap(true);
            attrsExecutor.keys = typeof key === 'string' ? [key, ...args] : key;
            attrsExecutor.executor = new Executor(cb, target);
            this.multipleEvents.push(attrsExecutor);
        }
    }

    /**
     * 移除属性监听
     * @param cb 回调
     * @param target 回调的this
     * @param key 属性1
     * @param args 属性2，属性3，属性4...
     * @returns
     */
    public off(cb: callback, target: unknown, key?: string, ...args: string[]): void {
        if (!cb || !target) { return; }

        key = key || ALL;
        if (typeof key === 'string' && args.length === 0) {
            // 单个
            this._EventClient.off(this.getEventName(key), cb, target);
        } else {
            // 多个
            this.removeFromMultiple(this.multipleEvents, cb, target, key, ...args);
            this.removeFromMultiple(this.multipleEventsOnce, cb, target, key, ...args);
        }
    }

    /**
     * 执行单个回调器
     * @param executor 回调器
     * @param value 变化后的新值
     * @param old 变化前的旧值
     * @param isOnce 是否一次性事件
     */
    public emit(key: string, value?: unknown, old?: unknown): void {
        this._EventClient.emit(this.getEventName(key), value, old);
    }

    /**
     * 执行多个属性的回调器
     * @param attrsExecutors 多个属性结构体列表
     * @param keys 当前变化的所有参数列表
     * @param paramMap 多个属性变化后的map表（新值）
     * @param paramMapOld 多个属性变化钱的map表（旧值）
     * @param isOnce 是否一次性
     */
    private emitFromMultiple(attrsExecutors: IAttrsExecutor[], keys: string[], paramMap?: { [key: string]: any }, paramMapOld?: { [key: string]: any }, isOnce = false): void {
        let attrsExecutor: IAttrsExecutor;
        for (let i = attrsExecutors.length - 1; i >= 0; i--) {
            attrsExecutor = attrsExecutors[i];
            if (attrsExecutor.keys.some((v) => paramMap[v] !== null && paramMap[v] !== undefined)) {
                if (attrsExecutor.executor) {
                    attrsExecutor.executor.invokeWithArgs(paramMap, paramMapOld);
                    if (isOnce) {
                        attrsExecutors.splice(i, 0);
                    }
                }
            }
        }
    }

    /**
     * 触发监听多个属性的事件
     * @param paramMap 多个属性值map
     * @param paramMapOld 多个属性值变化前的map
     * @returns
     */
    protected emits(paramMap: { [key: string]: any }, paramMapOld: { [key: string]: any }): void {
        if (!paramMap) {
            return;
        }
        const keys: string[] = [];
        this.emitFromMultiple(this.multipleEvents, keys, paramMap, paramMapOld);
        this.emitFromMultiple(this.multipleEventsOnce, keys, paramMap, paramMapOld, true);
    }

    /**
     * 移除多个属性的监听
     * @param events 多个属性存储的监听列表
     * @param cb 回调
     * @param target 回调的this
     * @param args 属性列表
     */
    private removeFromMultiple(events: { keys: string[]; executor: Executor; }[], cb: callback, target: unknown, ...args: string[]) {
        let event: {
            keys: string[];
            executor: Executor;
        };
        for (let i = events.length - 1; i >= 0; i--) {
            event = events[i];
            if (events[i].executor.equals(cb, target)) {
                if (UtilArray.Every(event.keys, args)) {
                    events.splice(i, 1);
                }
            }
        }
    }

    private getEventName(attrName: string) {
        return `RoleAttr_${attrName}`;
    }
}

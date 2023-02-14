/* eslint-disable no-prototype-builtins */
import { _decorator } from 'cc';

/*
 * @Description:
 * @version:
 * @Author: zfl
 * @Date: 2019-12-16 09:33:33
 * @LastEditors  : zfl
 * @LastEditTime : 2020-01-15 14:51:18
 */
const { ccclass, property } = _decorator;

@ccclass
export default class UtilsTimeout {
    private _taskQueue: { [id: number]: { f: (...arg: any)=>void, p: any } } = {};
    private _taskIdList = [];
    private timesPerFrame = 10;
    public static _i: UtilsTimeout = null;
    static get I (): UtilsTimeout {
        if (this._i == null) {
            this._i = new UtilsTimeout();
        }
        return this._i;
    }

    update () {
        let processTimes = 0;
        while (this._taskIdList.length > 0 && processTimes < this.timesPerFrame) {
            const taskId = this._taskIdList[0];
            if (taskId <= new Date().getTime()) {
                this._taskIdList.shift();
                processTimes++;
                const t = this._taskQueue[taskId];
                if (t) {
                    delete this._taskQueue[taskId];
                    t.f(t.p);
                }
            } else {
                break;
            }
        }
    }

    public removeTask (_id: number) {
        if (this._taskQueue.hasOwnProperty(_id)) {
            delete this._taskQueue[_id];
        }
        const i = this._taskIdList.indexOf(_id);
        if (i !== -1) {
            this._taskIdList.slice(i, 1);
        }
    }

    public addTask (taskFunc, delaySecond = 0, args?: any): number {
        const ms = delaySecond * 1000;
        return this.addTaskMs(taskFunc, ms, args);
    }
    private addTaskMs (taskFunc, ms = 0, args?: any): number {
        let id: number = new Date().getTime() + ms;
        while (id < 1000) {
            if (this._taskQueue.hasOwnProperty(id)) {
                id++;
            } else {
                break;
            }
        }
        // 添加任务并排序
        this._taskQueue[id] = { f: taskFunc, p: args };
        this._taskIdList.push(id);
        this._taskIdList.sort();
        return id;
    }
    public setTimeout (callback: (...args: any[]) => void, ms: number, doRightNow = false, ...args: any[]): any {
        return setTimeout(callback, ms, args);
    }
    public setInterval (callback: (...args: any[]) => void, ms: number, ...args: any[]): number {
        return setInterval(callback, ms, args);
    }
    public clearTimeout (timeoutId: any): void {
        return clearTimeout(timeoutId);
        // return this.removeTask(timeoutId);
    }
    public clearInterval (intervalId: number): void {
        return clearInterval(intervalId);
    }
}

// 使用示例
// UtilsTimeout.AddTask(MessageBox, 3);
// let aa:number = UtilsTimeout.AddTask(ccc, 4);
// UtilsTimeout.RemoveTask(aa);

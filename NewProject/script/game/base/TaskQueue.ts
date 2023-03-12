/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
/*
 * @Author: kexd
 * @Date: 2022-05-26 18:26:49
 * @LastEditors: kexd
 * @LastEditTime: 2022-05-27 18:10:20
 * @FilePath: \SanGuo\assets\script\game\base\TaskQueue.ts
 * @Description: 这里处理的是一些比较耗时的计算等，需要分帧处理
 */
export interface ITask {
    id?: number,
    callback: Function,
    ctx: any,
    param?: any
}

export default class TaskQueue {
    private static _i: TaskQueue = null;
    public static get I(): TaskQueue {
        if (this._i == null) {
            this._i = new TaskQueue();
        }
        return this._i;
    }

    private _taskQueue: ITask[] = [];

    /**
     * 单个任务
     * @param func 回调
     * @param ctx 上下文
     * @param param 参数
     * @returns
     */
    public addTask(func: () => void, ctx: any, param: any = null): number {
        return this._taskQueue.push({ callback: func, ctx, param });
    }

    /**
     * 多个任务同时加到队列里
     * @param task ITask
     */
    public addTasks(task: ITask[]): void {
        if (task && task.length > 0) {
            for (let i = 0; i < task.length; i++) {
                this._taskQueue.push(task[i]);
            }
        }
    }

    public mainUpdate(dt: number): void {
        const d = this._taskQueue.shift();
        if (!d) return;
        d.callback.call(d.ctx, d.param);
    }
}

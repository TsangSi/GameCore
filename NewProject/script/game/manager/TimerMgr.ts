/* eslint-disable @typescript-eslint/restrict-template-expressions */
/*
 * @Author: dcj
 * @Date: 2022-08-02 11:11:50
 * @FilePath: \SanGuo\assets\script\game\manager\TimerMgr.ts
 * @Description:  计时器管理类
 */

interface ITimer {
    handler: () => void;
    interval: number;
    key: string;
    arg?: any[];
    dt?: number;
}
/** 定时器对应的key */
export enum TimerKeys {
    TEST_KEY = 'TEST_KEY'
}

export default class TimerMgr {
    private static _instance = null;
    protected static GetInstance<T>(): T {
        if (this._instance === null) {
            this._instance = new this();
        }
        return this._instance as T;
    }
    // 获取单例
    public static get I(): TimerMgr {
        return this.GetInstance<TimerMgr>();
    }

    protected timerObj: Map<string, ITimer> = new Map();

    /** 定时器固定每秒钟执行多少次 */
    protected timerCount: number = 100;
    /** 总控定时器 */
    private _timer: number = null;

    // 游戏固定每秒执行一次
    public initTimer(): void {
        this._timer = setInterval(() => {
            this.update();
        }, this.timerCount);
    }

    protected update(): void {
        if (this.timerObj.size === 0 && this._timer !== null) {
            this.clearInterval(this._timer);
            this._timer = null;
            return;
        }

        this.timerObj.forEach((tTimer) => {
            const newdt = tTimer.dt + this.timerCount;
            if (newdt >= tTimer.interval) {
                try {
                    tTimer.handler();
                    tTimer.dt = 0;
                } catch (error) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    console.error(`${tTimer.key}执行出错:${error.stack}`);
                    this.clearScheduled(tTimer.key);
                }
            } else {
                tTimer.dt = newdt;
            }
        });
    }

    /**
     * 定时触发器
     * @param callback 回调
     * @param delay 毫秒
     * @param dt 微调执行时间（毫秒）
     * @param target 回调上下文this
     * @param args 可变参数
     * @returns 此定时器对象
     * 添加后会在delay时间后执行，如果想立即执行则dt加上当前时间
     */
    public addScheduled(timerKey: string, callback: () => void, delay: number, dt?: number, target?: unknown, ...args: any[]): object {
        if (this._timer === null) {
            this.initTimer();
        }
        const delayTime = delay || this.timerCount;
        const dtc = dt || 0;
        if (!this.timerObj.has(timerKey)) {
            this.timerObj.set(timerKey, {
                handler: callback.bind(target, ...args), interval: delayTime, arg: args, dt: dtc, key: timerKey,
            });
        } else {
            console.log('重复添加定时器');
        }
        return this.timerObj.get(timerKey);
    }

    /**
     * 清除指定key定时器
     * @param timerKey 定时器key
     */
    public clearScheduled(timerKey: string): void {
        if (this.timerObj.has(timerKey)) {
            this.timerObj.delete(timerKey);
        }
    }

    public clearAllScheduled(): void {
        this.timerObj.clear();
    }

    /**
     * 获取指定key定时器对象数据
     * @param timerKey 定时器key
     */
    public hasTimer(timerKey: string): boolean {
        return this.timerObj.has(timerKey);
    }

    public getScheduleds(): object {
        return this.timerObj;
    }

    /**
     * 延时触发器
     * @param callback 触发回调
     * @param ms 毫秒
     * @param target 回调上下文this
     * @param args 可变参数
     * @returns 延时器id
     */
    public setTimeout(callback: () => void, ms?: number, target?: unknown, ...args: any[]): number {
        return setTimeout(callback.bind(target, ...args), ms);
    }

    /**
     * 清除延时触发器
     * @param id 延时器id
     */
    public clearTimeout(id: number): void {
        if (id) {
            clearTimeout(id);
            id = null;
        }
    }

    /**
     * 定时器
     * @param callback 触发回调
     * @param ms 毫秒
     * @param target 回调上下文this
     * @param args 可变参数
     * @returns 定时器id
     */
    public setInterval(callback: () => void, ms?: number, target?: unknown, ...args: any[]): number {
        return setInterval(callback.bind(target, ...args), ms);
    }

    /**
     * 清除定时器
     * @param id 延时器id
     */
    public clearInterval(id: number): void {
        if (id) {
            clearInterval(id);
            id = null;
        }
    }
}

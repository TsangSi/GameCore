/* eslint-disable @typescript-eslint/ban-types */

import { Executor } from '../../../base/executor/Executor';
import { ResMgr } from '../../res/ResMgr';

/*
 * @Author: hrd
 * @Date: 2022-04-08 15:39:40
 * @FilePath: \SanGuo\assets\script\app\core\mvc\view\BaseCmp.ts
 * @Description: ui基础类
 */
const { ccclass } = cc._decorator;

interface Interval {
    handle: number;
    cb: Function;
}

@ccclass
export default class BaseCmp extends cc.Component {
    public uiId: number;

    private intervalMsg: Interval[] = [];

    private intervalHandle: number = 10000;

    public constructor() {
        super();
    }

    /**
     * 复写时必须调用 super()
     */
    protected onLoad(): void {
        // todo
    }
    /**
     * 复写时必须调用 super()
     */
    protected start(): void {
        // todo
    }
    /**
     * 复写时必须调用 super()
     */
    protected onEnable(): void {
        // todo
    }
    /**
     * 复写时必须调用 super()
     */
    protected onDisable(): void {
        // todo
    }
    /**
     * 复写时必须调用 super()
     */
    protected onDestroy(): void {
        // todo
    }

    /** UI和数据都初始化完毕  如果有东西修改UI的内容  在这里面处理 */
    public init(...param: unknown[]): void {
        // todo
    }

    /**
     * 面板关闭执行函数，用于子类继承
     * @param param 参数
     */
    public _close(): void {
        this.node.destroy();
    }

    private _oneSecond = 0;
    protected updatePerSecond(): void {
        // todo
    }
    protected update(dt: number): void {
        this._oneSecond += dt;
        if (this._oneSecond >= 1) {
            this._oneSecond -= 1;
            // 每秒执行一次
            if (this.updatePerSecond) {
                this.updatePerSecond();
            }
        }
    }

    public setHide(isShow: boolean): void {
        this.node.active = isShow;
    }

    public getHideState(): boolean {
        return this.node.active;
    }

    protected close(): void {
        this._close();
    }

    protected clearInterval(handle: number): void {
        for (let i = this.intervalMsg.length - 1; i >= 0; --i) {
            if (this.intervalMsg[i].handle === handle) {
                this.unschedule(this.intervalMsg[i].cb);
                this.intervalMsg.splice(i, 1);
                break;
            }
        }
    }

    protected setInterval(cb: Function, delay: number): number {
        const iv = {
            cb, handle: this.intervalHandle,
        };
        this.intervalMsg.push(iv);
        this.schedule(cb, delay / 1000.0);
        return this.intervalHandle++;
    }

    /**
     * 添加代理预制体
     * @param compName 类名
     * @param path 预制体路径
     * @param parent 父节点
     * @param func 可选参数，加载回来执行的回调
     */
    protected addPropertyPrefab(compName: string, path: string, parent: cc.Node, func?: (n: cc.Node) => void): void {
        const isLoad = this[`_is${compName}`];
        if (!isLoad) {
            const funcs = this.getProxyFuncs(compName);
            this[`_is${compName}`] = true;
            ResMgr.I.showPrefab(path, parent, (e, n) => {
                if (e) {
                    this[`_is${compName}`] = false;
                    return;
                }
                if (func) {
                    func(n);
                }
                this[`_${compName}`] = n.getComponent(compName);
                funcs.forEach((ex) => {
                    ex.invoke();
                    ex.clear();
                    ex = undefined;
                });
                funcs.length = 0;
            });
        }
    }

    /**
     * 获取该类名存储的未执行的函数列表
     * @param compName 类名
     * @returns
     */
    private getProxyFuncs(compName: string): Executor[] {
        const funcs: Executor[] = this[`_${compName}Funcs`] = this[`_${compName}Funcs`] || [];
        return funcs;
    }

    /**
     * 异步预制体代理接口
     * @param compName 类名
     * @param funcName 类的接口名
     * @param args 可选可变参，接口需要的参数
     * @returns
     */
    protected proxyFunc<T>(compName: string, funcName: string, ...args: any[]): T {
        const compScript: cc.Component = this[`_${compName}`];
        if (compScript) {
            const func = compScript[funcName] as (...args: any[]) => void;
            return func?.call(compScript, ...args) as T;
        } else {
            const funcs = this.getProxyFuncs(compName);
            funcs.push(new Executor(this.proxyFunc, this, compName, funcName, ...args));
        }
        return undefined;
    }
}

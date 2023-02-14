
import { _decorator, Component, Node, assetManager, AssetManager } from 'cc';
import { ExecutorList } from '../base/ExecutorList';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = BundleManager
 * DateTime = Fri Mar 25 2022 15:17:46 GMT+0800 (中国标准时间)
 * Author = zengsi
 * FileBasename = BundleManager.ts
 * FileBasenameNoExtension = BundleManager
 * URL = db://assets/app/src/core/BundleManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
const enum LoadStatus {
    Empty,
    /** 正在加载中 */
    Load,
    /** 加载完成 */
    Complete
}
/** Bundle管理 */
export class BundleManager {
    private static _I: BundleManager = null;
    static get I(): BundleManager {
        if (this._I == null) {
            this._I = new BundleManager();
        }
        return this._I;
    }

    private loaded: { [name: string]: LoadStatus; } = {};
    private loadcallbacks: { [name: string]: ExecutorList; } = {};
    load(name: string, callback: (err: Error | null, bundle: AssetManager.Bundle) => void, target?: unknown) {
        if (this.loaded[name] === LoadStatus.Complete) {
            callback.call(target, undefined, this.getBundle(name));
            return;
        }

        this.addCallback(name, callback, target);

        if (!this.loaded[name]) {
            this.loaded[name] = LoadStatus.Load;
            this._load(name);
        }
    }

    private _load(name) {
        assetManager.loadBundle(name, (err: Error | null, bundle) => {
            this.loaded[name] = LoadStatus.Complete;
            if (err) {
                console.error('loadBundle error:', err);
            }
            this.doCallback(err, name, bundle);
        });
    }

    private addCallback(name: string, callback: (...arg: any) => void, target?: unknown) {
        let callbacks = this.loadcallbacks[name];
        if (callbacks) {
            callbacks.pushUnique(callback, target);
        } else {
            callbacks = this.loadcallbacks[name] = new ExecutorList();
            callbacks.push(callback, target);
        }
    }

    private doCallback(err: Error | null, name: string, bundle?: unknown) {
        let callbacks = this.loadcallbacks[name];
        if (!callbacks) { return; }
        callbacks.invokeWithArgs(err, bundle || this.getBundle(name));
        callbacks.clear();
        callbacks = undefined;
    }

    getBundle(name: string) {
        return assetManager.getBundle(name);
    }

    /** bundle类型 */
    static Type = {
        gamelogic: 'gamelogic',
    };
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/decorator.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
 */

/*
 * @Author: zs
 * @Date: 2022-04-07 18:21:34
 * @LastEditors: zs
 * @LastEditTime: 2022-05-25 21:35:28
 * @FilePath: \SanGuo\assets\script\app\core\res\BundleMgr.ts
 * @Description:
 */
import { ExecutorList } from '../../base/executor/ExecutorList';

enum LoadStatus {
    Empty,
    /** 正在加载中 */
    Load,
    /** 加载完成 */
    Complete
}

/** bundle类型 */
export const enum BundleType {
    resources = 'resources',
    extend = 'extend',
}

export default class BundleMgr {
    private static _I: BundleMgr = null;
    public static get I(): BundleMgr {
        if (this._I == null) {
            this._I = new BundleMgr();
        }
        return this._I;
    }

    private loaded: { [name: string]: LoadStatus; } = {};
    private loadcallbacks: { [name: string]: ExecutorList; } = {};
    public load(name: string, callback: (err: Error | null, bundle: cc.AssetManager.Bundle) => void, target?: unknown): void {
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

    public async loadAsync(name: string): Promise<cc.AssetManager.Bundle | undefined> {
        return new Promise((resolve, reject) => {
            this.load(name, (err, bundle) => {
                if (err) {
                    resolve(undefined);
                } else {
                    resolve(bundle);
                }
            }, this);
        });
    }

    private _load(name: string) {
        cc.assetManager.loadBundle(name, (err: Error | null, bundle) => {
            if (err) {
                console.warn('loadBundle error:', err);
                this.loaded[name] = LoadStatus.Empty;
            } else {
                this.loaded[name] = LoadStatus.Complete;
            }
            this.doCallback(err, name, bundle);
        });
    }

    private addCallback(name: string, callback: (...arg: any) => void, target?: unknown) {
        if (!callback) { return; }
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

    public getBundle(name: string): cc.AssetManager.Bundle {
        return cc.assetManager.getBundle(name);
    }
}

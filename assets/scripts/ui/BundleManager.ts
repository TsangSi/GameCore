import {
 AssetManager, assetManager,
} from 'cc';
import { ExecutorList } from '../common/ExecutorList';

enum LoadStatus {
    Empty,
    /** 正在加载中 */
    Load,
    /** 加载完成 */
    Complete
}

export default class BundleManager {
    private static _I: BundleManager = null;
    public static get I(): BundleManager {
        if (this._I == null) {
            this._I = new BundleManager();
        }
        return this._I;
    }

    private loaded: { [name: string]: LoadStatus; } = {};
    private loadcallbacks: { [name: string]: ExecutorList; } = {};
    public load(name: string, callback: (err: Error | null, bundle: AssetManager.Bundle) => void, target?: unknown): void {
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

    private _load(name: string) {
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

    public getBundle(name: string): AssetManager.Bundle {
        return assetManager.getBundle(name);
    }

    /** bundle类型 */
    public static Type = {
        gamelogic: 'gamelogic',
    };
}

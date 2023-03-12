/* eslint-disable max-len */
/*
 * @Author: zs
 * @Date: 2023-02-24 14:54:25
 * @Description:
 *
 */
import BundleMgr, { BundleType } from './BundleMgr';
import {
    CompleteCallback, IAssetEx, IAssetPrototype,
} from './ResConst';

export class ResLoadLocal {
    protected caches: { [path: string]: IAssetEx } = cc.js.createMap(true);
    private name: string = BundleType.resources;
    public constructor(name: string) {
        this.name = name;
    }
    /** 预加载的路径数组 */
    protected preloadPaths: string[] = [];
    /**
     * 加载本地资源
     * @param path 路径 | 路径数组
     * @param type 资源类型
     * @param callback 回调
     * @param resLoadOps 扩展参数
     */
    public load<T extends cc.Asset>(path: string | string[], type: IAssetPrototype<T>, callback: CompleteCallback<T | T[]>, target?: object, ...args: any[]): void {
        if (Array.isArray(path)) {
            this.loads(path, type, callback, target, ...args);
        } else {
            this._load(path, type, callback as CompleteCallback<T>, target, ...args);
        }
    }

    private _load<T extends cc.Asset>(path: string, type: IAssetPrototype<T>, callback: CompleteCallback<T>, target?: object, ...args: any[]): void {
        const asset = this.getCache(path);
        if (asset) {
            this.loadResult(undefined, asset, path, callback, target, ...args);
        } else if (this.name === BundleType.resources) {
            cc.resources.load(path, type, (e: Error, res: cc.Asset) => {
                this.loadResult(e, res, path, callback, target, ...args);
            });
        } else {
            BundleMgr.I.load(this.name, (e: Error | null, bundle: cc.AssetManager.Bundle) => {
                if (bundle) {
                    this.loadBundleResult(bundle, path, type, callback, target, ...args);
                } else {
                    console.warn(`not found bundler err:${this.name}`);
                    this.doCallback(e, undefined, callback, target, ...args);
                }
            });
        }
    }

    private loads<T extends cc.Asset>(path: string[], type: IAssetPrototype<T>, callback: CompleteCallback<T[]>, target?: object, ...args: any[]): void {
        const assets: cc.Asset[] = [];
        let assetsNum = 0;
        path.forEach((p, index) => {
            this._load(p, type[index], (e, asset: cc.Asset) => {
                if (e) {
                    this.loadResult(e, assets, path, callback, target, ...args);
                    return;
                }
                assetsNum++;
                assets[index] = asset;
                if (assetsNum >= path.length) {
                    this.loadResult(e, assets, path, callback, target, ...args);
                }
            }, this);
        });
    }

    /**
     * 通用执行回调
     * @param e 错误码
     * @param res 资源
     * @param callback 回调
     * @param target 回调的this
     * @param args ...args: any[] 扩展参数
     */
    protected doCallback<T extends cc.Asset>(e: Error, res: T | T[], callback: CompleteCallback<T | T[]>, target?: object, ...args: any[]): void {
        if (callback) {
            if (target) {
                callback.call(target, e, res, ...args);
            } else {
                callback(e, res, ...args);
            }
        }
    }

    public preload<T extends cc.Asset>(path: string, type: IAssetPrototype<T>, rightNow: boolean = false): void {
        if (!this.getCache(path)) {
            cc.resources.preload(path, type as any);
            this.preloadPaths.push(path);
        }
        if (rightNow) {
            this.load(path, type, undefined);
        }
    }

    public delPreLoad(path: string): void {
        const preIndex = this.preloadPaths.indexOf(path);
        if (preIndex >= 0) {
            this.preloadPaths.splice(preIndex, 1);
        }
        this.delCache(path);
    }

    protected loadResult(e: Error, asset: unknown, path: string | string[], callback: CompleteCallback<any>, target?: object, ...args: any[]): void {
        const tmpAsset: cc.Asset | cc.Asset[] = asset as cc.Asset | cc.Asset[];
        if (e) {
            console.warn('resources.load Error:', e);
        }
        let addRefRes: cc.Asset[] = [];
        let paths: string[] = [];
        if (tmpAsset) {
            if (Array.isArray(tmpAsset)) {
                addRefRes = tmpAsset;
                paths = path as string[];
            } else {
                addRefRes.push(tmpAsset);
                paths.push(path as string);
            }
        }
        addRefRes.forEach((r, index) => {
            // r.addRef();
            const preIndex = this.preloadPaths.indexOf(paths[index]);
            if (preIndex >= 0) {
                this.addCache(paths[index], r);
                this.preloadPaths.splice(preIndex, 1);
            }
        });
        // console.log('执行回调=', tmpAsset._name, tmpAsset.refCount);
        this.doCallback(undefined, tmpAsset, callback, target, ...args);
        // console.log('开始减计数=', tmpAsset._name, tmpAsset.refCount);
        addRefRes.forEach((r) => {
            if (r.refCount === 0) {
                r.decRef();
            }
        });
        // console.log('减完计数=', tmpAsset._name, tmpAsset.refCount);
    }

    private loadBundleResult(bundle: cc.AssetManager.Bundle, path: string, type: any, callback: CompleteCallback<cc.Asset | cc.Asset[]>, target?: object, ...args: any[]): void {
        if (target || args.length > 0) {
            bundle.load(path as any, type, (e: Error | null, res: cc.Asset | cc.Asset[]) => {
                if (e) {
                    console.warn('load prefab err:', e);
                }
                this.doCallback(e, res, callback, target, ...args);
            });
        } else {
            bundle.load(path as any, type, callback);
        }
    }

    /**
     * 添加缓存资源
     * @param path 路径
     * @param asset 资源
     */
    protected addCache(path: string, asset: cc.Asset): void {
        if (!this.caches[path]) {
            if (asset.addRef) {
                asset.addRef();
            }
            this.caches[path] = asset;
        }
    }

    /**
     * 根据uuid删除缓存资源
     * @param uuid
     * @returns
     */
    public delCache(uuid: string): boolean {
        for (const path in this.caches) {
            const t = this.caches[path];
            if (t._uuid === uuid) {
                this.caches[path].decRef();
                delete this.caches[path];
                return true;
            }
        }
        return false;
    }

    /**
     * 根据路径获取缓存资源（获取的时候自动会addRef())
     * @param path 路径
     * @returns
     */
    protected getCache(path: string) {
        const asset = this.caches[path];
        if (asset && asset.isValid) {
            asset.addRef();
            return asset;
        } else {
            if (asset) {
                console.warn('texture cache not found asset path: ', path);
            }
            return undefined;
        }
    }

    /**
     * 是否是预加载的
     * @param path 路径
     * @returns
     */
    private isPreload(path: string) {
        return this.preloadPaths.indexOf(path) >= 0;
    }
}

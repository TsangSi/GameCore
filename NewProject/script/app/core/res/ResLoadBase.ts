/* eslint-disable max-len */
import {
    CompleteCallback, IAssetEx, IResBase, LoadInfo,
} from './ResConst';
import { ResMgr } from './ResMgr';
// import { ResMgr } from './ResMgr';

/*
 * @Author: zs
 * @Date: 2023-02-24 12:12:17
 * @Description:
 *
 */
export class ResLoadBase<T extends IAssetEx> {
    private _resMgr: IResBase = null;
    protected get resMgr(): IResBase {
        if (this._resMgr) {
            return this._resMgr;
        }
        this._resMgr = ResMgr.I;
        return this._resMgr;
    }
    protected caches: { [path: string]: T } = cc.js.createMap(true);
    protected cacheCount: number = 0;
    protected name: string = 'ResLoadBase';
    public constructor(name: string) {
        this.name = name || this.name;
    }

    /**
     * 加载远程资源（没有缓存会走这里）
     * @param path 加载路径
     * @param callback 回调
     * @param target 回调的this
     * @param args ...args: any[] 扩展参数
     */
    protected loadRemote(path: string, callback: CompleteCallback<T>, target: object, loadInfo: LoadInfo, ...args: any[]): void {
        this.resMgr._loadRemote(path, this.loadResult, this, path, callback, target, loadInfo, ...args);
    }

    /**
     * 加载资源（有缓存使用缓存）
     * @param path 路径
     * @param loadInfo 加载信息
     * @param callback 回调
     * @param target 回调的this
     * @param args ...args: any[] 扩展参数
     */
    public load(path: string, loadInfo: LoadInfo, callback: CompleteCallback<any>, target?: object, ...args: any[]): void {
        const asset = this.getCache(path);
        if (asset) {
            this.complete(undefined, asset, callback, target, loadInfo, ...args);
        } else {
            this.loadRemote(path, callback, target, loadInfo, ...args);
        }
    }

    /**
     * 处理完成后执行这个
     * @param e 错误码
     * @param asset 资源对象
     * @param callback 回调
     * @param target 回调的this
     * @param args ...args: any[] 扩展参数
     */
    protected complete(e: Error, asset: T, callback: CompleteCallback<T>, target?: object, ...args: any[]): void {
        this.doCallback(e, asset, callback, target, ...args);
    }

    /**
     * 加载资源结果
     * @param e 错误码
     * @param asset 资源对象
     * @param path 该资源的加载路径（没有http的路径）
     * @param callback 回调
     * @param target 回调的this
     * @param loadInfo 加载信息
     * @param args ...args: any[] 扩展参数
     * @returns
     */
    protected loadResult(e: Error, asset: T, path: string, callback: CompleteCallback<T>, target?: object, loadInfo?: LoadInfo, ...args: any[]): void {
        if (!e) {
            const assetCache = this.getCache(path);
            if (!assetCache) {
                this.addCache(path, asset);
            } else {
                if (asset !== assetCache) {
                    // 缓存中有，把当前这个释放掉
                    console.log(this.name, '缓存中有，把当前这个释放掉=', asset._uuid, '计数=', asset.refCount);
                    this.resMgr.decRef(asset);
                    asset = null;
                }
                asset = assetCache;
            }
        }
        this.complete(e, asset, callback, target, loadInfo, ...args);
    }

    /**
     * 添加缓存资源
     * @param path 路径
     * @param asset 资源
     */
    protected addCache(path: string, asset: T): void {
        if (!this.caches[path]) {
            if (asset.addRef) {
                this.log(this.name, '添加缓存=', asset._uuid, '计数=', asset.refCount);
                asset.addRef();
            }
            this.caches[path] = asset;
            this.cacheCount++;
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
                // this.caches[path].decRef();
                this.log(this.name, '删除缓存，在这里不减计数=', this.caches[path]._uuid, '计数=', this.caches[path].refCount);
                delete this.caches[path];
                this.cacheCount--;
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
    protected getCache(path: string): T {
        const asset = this.caches[path];
        if (asset && (!asset.addRef || asset.isValid)) {
            if (asset.addRef) {
                this.log(this.name, '获取缓存=', asset._uuid, '计数=', asset.refCount);

                if (this.name === 'SpriteFrame') {
                    const spriteFrame: cc.SpriteFrame = asset as any;
                    const texture = spriteFrame.getTexture();
                    if (texture && texture.isValid) {
                        texture.addRef();
                    } else {
                        return undefined;
                    }
                }
                asset.addRef();
            }
            return asset;
        }
        if (asset && asset.addRef) {
            console.warn('texture cache not found asset path: ', this.name, path);
        }
        return undefined;
    }

    /**
     * 通用执行回调
     * @param e 错误码
     * @param res 资源
     * @param callback 回调
     * @param target 回调的this
     * @param args ...args: any[] 扩展参数
     */
    protected doCallback(e: Error, res: T | T[], callback: CompleteCallback<T | T[]>, target?: object, ...args: any[]): void {
        if (callback) {
            if (target) {
                callback.call(target, e, res, ...args);
            } else {
                callback(e, res, ...args);
            }
        }
    }

    protected log(...args: any[]): void {
        // console.log(this.name, ...args);
    }
}

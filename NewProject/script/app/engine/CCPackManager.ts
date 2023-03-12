/* eslint-disable func-names */
/* eslint-disable max-len */
/*
 * @Author: zs
 * @Description:
 *
 */

interface IAssetInfo {
    uuid: string;
    packs?: IPackInfo[];
    redirect?: string;
    ver?: string;
    nativeVer?: string;
    extension?: string;
}
interface IPackInfo extends IAssetInfo {
    packedUuids: string[];
    ext: string;
}

interface IXHROptions extends Record<string, any> {
    xhrResponseType?: XMLHttpRequestResponseType;
    xhrWithCredentials?: boolean;
    xhrTimeout?: number;
    xhrHeader?: Record<string, string>;
    xhrMimeType?: string;
}

interface IDownloadParseOptions extends IXHROptions {
    priority?: number;
    audioLoadMode?: number;
    onFileProgress?: (loaded: number, total: number) => void;
    maxConcurrency?: number;
    maxRequestsPerFrame?: number;
    maxRetryCount?: number;
    cacheEnabled?: boolean;
}

type CompleteCallback<T = any> = (err: Error | null, data?: T | null) => void;

interface IUnpackRequest {
    onComplete: CompleteCallback;
    id: string;
}
type Unpacker = (packUuid: string[], data: any, options: IDownloadParseOptions, onComplete: CompleteCallback) => void;
const enum EFile {
    Version = 0,
    Context = 0,

    SharedUuids,
    SharedStrings,
    SharedClasses,
    SharedMasks,

    Instances,
    InstanceTypes,

    Refs,

    DependObjs,
    DependKeys,
    DependUuidIndices,

    ARRAY_LENGTH,
}

class PackMgr {
    private _turnOn: boolean = false;
    private _resCollect: boolean = false;
    private _resTotal: number = 0;

    public get turnOn(): boolean {
        return this._turnOn;
    }
    public set turnOn(value: boolean) {
        this._turnOn = value;
    }

    public get resCollect(): boolean {
        return this._resCollect;
    }
    public set resCollect(value: boolean) {
        this._resCollect = value;
    }

    public get resTotal(): number {
        return this._resTotal;
    }
    public set resTotal(value: number) {
        this._resTotal = value;
    }
}
export const ccPackMgr = new PackMgr();

class FilesCache<T = any> {
    private _map: { [key: string]: T };
    private _count: number = 0;

    /**
     * @en
     * The count of cached content
     *
     * @zh
     * 缓存数量
     *
     */
    public get count(): number {
        return this._count;
    }
    public constructor() {
        this._map = cc.js.createMap(true);
        this._count = 0;
    }

    /**
     * @en
     * Add Key-Value to cache
     *
     * @zh
     * 增加键值对到缓存中
     *
     * @param key - The key
     * @param val - The value
     * @returns The value
     *
     * @example
     * var cache = new Cache();
     * cache.add('test', null);
     *
     */
    public add(key: string, val: any): void {
        if (!(key in this._map)) {
            this._count++;
        }
        this._map[key] = val;
    }
    /**
     * @en
     * Get the cached content by key
     *
     * @zh
     * 通过 key 获取对应的 value
     *
     * @param key - The key
     * @returns The corresponding content
     *
     * @example
     * let cache = new Cache();
     * let test = cache.get('test');
     *
     */
    public get(key: string): T | undefined | null {
        const data: any[] = this._map[key] as any;
        let tmp: any = null;
        if (data && data.length) {
            tmp = [];
            data.forEach((d, index) => {
                switch (index) {
                    case EFile.Context:
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        tmp[index] = cc.instantiate(d);
                        break;
                    case EFile.Instances:
                        // eslint-disable-next-line dot-notation, @typescript-eslint/no-unsafe-member-access
                        if (d['length']) {
                            // eslint-disable-next-line no-extra-parens, @typescript-eslint/no-unsafe-member-access
                            tmp[index] = JSON.parse(JSON.stringify(d));
                        } else {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                            tmp[index] = d;
                        }
                        break;
                    case EFile.Refs:
                    case EFile.DependObjs:
                    case EFile.DependKeys:
                    case EFile.DependUuidIndices:
                        // eslint-disable-next-line dot-notation, @typescript-eslint/no-unsafe-member-access
                        if (d['length']) {
                            // eslint-disable-next-line no-extra-parens, @typescript-eslint/no-unsafe-member-access
                            tmp[index] = (d as number[]).concat();
                        } else {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                            tmp[index] = d;
                        }
                        break;
                    default:
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        tmp[index] = d;
                }
            });
        }
        return tmp as T;
    }

    /**
     * @en
     * Check whether or not content exists by key
     *
     * @zh
     * 通过 Key 判断是否存在对应的内容
     *
     * @param key - The key
     * @returns True indicates that content of the key exists
     *
     * @example
     * var cache = new Cache();
     * var exist = cache.has('test');
     *
     */
    public has(key: string): boolean {
        return key in this._map;
    }
    /**
     * @en
     * Remove the cached content by key
     *
     * @zh
     * 通过 Key 移除对应的内容
     *
     * @param key - The key
     * @returns The removed content
     *
     * @example
     * var cache = new Cache();
     * var content = cache.remove('test');
     *
     */
    public remove(key: string): T | undefined | null {
        const out = this._map[key];
        if (key in this._map) {
            delete this._map[key];
            this._count--;
        }
        return out;
    }
    /**
     * @en
     * Clear all content
     *
     * @zh
     * 清除所有内容
     *
     * @example
     * var cache = new Cache();
     * cache.clear();
     *
     */
    public clear(): void {
        if (this._count !== 0) {
            this._map = cc.js.createMap(true);
            this._count = 0;
        }
    }

    /**
     * @en
     * Destroy this cache
     *
     * @zh
     * 销毁这个 cache
     *
     */
    public destroy(): void {
        this._map = cc.js.createMap(true);
    }
}
const isOpenCache = true;
let _err: Error | null = null;
let _id: string = '';
const _files = new FilesCache<any>();
// eslint-disable-next-line dot-notation
const _init: () => void = cc.assetManager.packManager['init'];
const _load = cc.assetManager.packManager.load;
const _download = cc.assetManager.downloader.download;
const _unpack = cc.assetManager.packManager.unpack;
const _resources = 'resources';
/** 合并json的文件名 */
let _jsonUuid: string = '';
/** 当前是否需要缓存 */
let _curIsNeedCache = false;
/** resources的json缓存开关 */
const _loading = new cc.AssetManager.Cache();
if (isOpenCache) {
    const isLoading = function (val: IPackInfo) {
        return _loading.has(val.uuid);
    };

    // eslint-disable-next-line dot-notation
    cc.assetManager.packManager['init'] = function (): void {
        _init();
        _loading.clear();
    };

    // eslint-disable-next-line consistent-return
    cc.assetManager.packManager.load = function (item: cc.AssetManager.RequestItem, options: IDownloadParseOptions | null, onComplete: CompleteCallback): unknown {
        if (ccPackMgr.turnOn && ccPackMgr.resCollect) {
            ccPackMgr.resTotal++;
        }
        // eslint-disable-next-line dot-notation
        if (CC_EDITOR || window['ResJsonStopCache'] === true) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return _load.call(this, item, options, onComplete);
        }
        // if not in any package, download as uausl
        const itemInfo: IAssetInfo = item.info;
        if (item.isNative || !itemInfo || !itemInfo.packs) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return _download.call(cc.assetManager.downloader, item.id, item.url, item.ext, item.options, onComplete);
        }
        if (_files.has(item.id)) {
            return onComplete(null, _files.get(item.id));
        }
        let pack = itemInfo.packs.find(isLoading);
        if (pack) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            _loading.get(pack.uuid).push({ onComplete, id: item.id });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return _load.call(this, item, options, onComplete);
        }
        pack = itemInfo.packs[0];
        // eslint-disable-next-line @typescript-eslint/no-floating-promises, dot-notation
        _loading.add(pack.uuid, [{ onComplete, id: item.id }]);
        if (item) {
            // eslint-disable-next-line dot-notation
            const config: { name: string } = item['config'];
            if (!_jsonUuid && config?.name === _resources) {
                _jsonUuid = itemInfo?.packs[0].uuid;
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return _load.call(this, item, options, onComplete);
    };

    cc.assetManager.downloader.download = function (id: string, url: string, type: string, options: IDownloadParseOptions, onComplete: CompleteCallback): void {
        // eslint-disable-next-line dot-notation
        if (CC_EDITOR || window['ResJsonStopCache'] === true) {
            _download.call(this, id, url, type, options, onComplete);
            return;
        }
        _id = id;
        _download.call(this, id, url, type, options, (err, data) => {
            _err = err;
            if (_jsonUuid === id) {
                _curIsNeedCache = true;
            }
            onComplete(err, data);
        });
    };

    cc.assetManager.packManager.unpack = function (pack: string[], data: any, type: string, options: IDownloadParseOptions, onComplete: CompleteCallback): void {
        // 外部设置ResJsonStopCache = true，那么就停止缓存json
        // eslint-disable-next-line dot-notation
        if (CC_EDITOR || window['ResJsonStopCache'] === true || !_curIsNeedCache) {
            _unpack.call(this, pack, data, type, options, onComplete);
            return;
        }
        if (!data) {
            if (onComplete) {
                onComplete(new Error('package data is wrong!'));
            }
            return;
        }
        _curIsNeedCache = false;
        const uuid = _id;
        const err = _err;
        _err = null;
        _id = '';
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, dot-notation
        const unpacker = this.unpackJson as Unpacker;
        unpacker.call(this, pack, data, options, (err2, result: { [id: string]: any }) => {
            if (!err2) {
                for (const id in result) {
                    _files.add(id, result[id]);
                }
            }
            // eslint-disable-next-line dot-notation
            const callbacks: IUnpackRequest[] | null | undefined = _loading.remove(uuid);
            if (callbacks) {
                for (let i = 0, l = callbacks.length; i < l; i++) {
                    const cb = callbacks[i];
                    if (err || err2) {
                        cb.onComplete(err || err2);
                        continue;
                    }

                    const unpackedData = result[cb.id];
                    if (!unpackedData) {
                        cb.onComplete(new Error('can not retrieve data from package'));
                    } else {
                        cb.onComplete(null, unpackedData);
                    }
                }
            } else {
                onComplete(new Error('can not retrieve data from package'));
            }
        });
    };
} else {
    /**
     * 加载资源包:assetManager.loadBundle、加载远程资源:assetManager.loadRemote、加载本地资源resource.load、resource.preload都会进asset-manager.loadAny
     * 若是加载本地资源如预制，预制里用到的图，等，loadAny接口会创建一个加载任务，交给加载管线pipeline，异步加载每一个任务对象。
     * 它们最终都会进pack-manager的load接口。
     */

    cc.assetManager.packManager.load = function (item, options, onComplete) {
        if (ccPackMgr.turnOn && ccPackMgr.resCollect) {
            ccPackMgr.resTotal++;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return _load.call(this, item, options, onComplete);
    };
}

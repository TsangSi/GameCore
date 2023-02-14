/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable max-len */
import {
 _decorator, resources, Prefab, __private, SpriteFrame, assetManager, ImageAsset, Texture2D, SpriteAtlas, rect, v2, size, AssetManager, Asset, Node, instantiate, js, Sprite,
} from 'cc';
import GlobalConfig from '../config/GlobalConfig';
import UtilsString from '../utils/UtilsString';
import BundleManager from '../ui/BundleManager';
import {
 AssetType, BundleType, MPQ_FILE_INFO,
} from '../global/GConst';
import { Executor } from '../core/executor/Executor';

const { ccclass } = _decorator;

interface FrameData { Rotated?: boolean, Frame?: number[][], Offset?: number[], SourceSize?: number[] }

class LoadInfo {
    /** 相对路径 */
    public path = '';
    /** jsonPath */
    public jsonPath = '';
    /** 文件名 */
    public name = '';
    /** 文件后缀 */
    public suffix = '';
    /** 文件类型 */
    public type: AssetType;
    /** 是否拷贝克隆的 */
    public isCopy = false;
    /** 加载完成回调 */
    // public callback: (err: Error | null, object: any, customData: any) => void;
    // /** 加载失败回调 */
    // fail_callback: (path: string, customData?: any) => void;
    // public target: unknown;
    /** 回传参数 */
    // public customData: any;
    /** 回调器 */
    public complete: Executor;
    /** object */
    public loadedData: Asset;
    /** 重试次数 */
    public retry = 0;
    /** 优先级 */
    public priority = 0;
    public constructor(url: string) {
        if (url) {
            const s = UtilsString.getFileTypeByUrl(url);
            this.name = s.name;
            this.path = s.path + s.name;
            this.suffix = s.suffix;
        }
    }
}
type KKK = Record<string, unknown>;

@ccclass('ResManager')
export class ResManager {
    private static _I: ResManager = null;
    public static get I(): ResManager {
        if (this._I == null) {
            this._I = new ResManager();
        }
        return this._I;
    }
    public mark = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    public markC = ['y', 'z'];
    public repl = ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012', '013', '014', '015', '016', '017', '018', '019', '020', '021', '022', '023', '024', '1024,1024', '1024'];
    public replC = ['1024,1024', '1024'];

    public spMark = ['!', '[@', '[#', '[$', '[%', '[^', '[&', '[*', '[(', '[)', '@', '#', '$', '%', '^', '&', '*', '(', ')'];
    public spRepl = ['action_', '/fairy', '/horse', '/npc', '/pet', '/role', '/skill_effect', '/start', '/weapon', '/wing', 'fairy/', 'horse/', 'npc/', 'pet/', 'role/', 'skill_effect/', 'start/', 'weapon/', 'wing/'];

    public actionResMap: { [name: string]: {[key: string]: unknown} } = {};

    // private preload_list = [];

    // private load_queue: LoadInfo[] = [];
    // private release_queue: string[] = [];
    private texturesCaches: { [path: string]: Texture2D} = js.createMap(true);
    private spriteFrameCaches: { [path: string]: SpriteFrame} = js.createMap(true);

    private readonly MAX_RETRY: number = 5;// 下载最大重试次数
    // private down_queue: LoadInfo[] = [];
    // private down_cache = [];
    public static ResType = {
        Prefab: '.prefab',
        Png: '.png',
        Jpg: '.jpg',
        Txt: '.txt',
        Json: '.json',
        Mp3: '.mp3',
        Material: '.material',
    };

    /** 单次加载数量 */
    private loadOnceCount = 100;
    /**  */
    private isLoading = false;
    private resLevel: LoadInfo[] = [];
    /**
     * 根据路径+类型 获取 带后缀的路径
     * @param path 相对路径
     * @param type 类型
     * @param isadd 是否强制加上后缀
     * @returns
     */
    private getPathAndSuffix(path: string, type: AssetType, isadd = false) {
        const s = path.split('.');
        if (isadd || s.length > 1) {
            return !isadd ? path : s[0] + type;
        }

        switch (type) {
            case AssetType.SpriteAtlas:
                type = AssetType.SpriteAtlas;
                break;
            case AssetType.SpriteFrame:
                type = AssetType.Png;
                break;
            case AssetType.Plist:
                break;
            default:
                type = AssetType.Empty;
                break;
        }
        return path + type;
    }

    private loadObjectPool: { [pathType: string]: LoadInfo; } = {};
    private getLoadInfo(path: string): LoadInfo {
        return this.loadObjectPool[path];
    }

    /**
     * 加载非远程资源
     * @param path 资源路径
     * @param type 资源类型
     * @param callback 成功回调
     * @param target 回调上下文
     * @param customData 自定义参数
     */
    // eslint-disable-next-line camelcase
    public load(path: string, type: __private._cocos_core_asset_manager_shared__AssetType, callback: (err: Error | null, object?: any, customData?: any) => void, target?: unknown, customData?: any, bundle?: BundleType) {
        if (bundle) {
            this.loadFromBundle(bundle, path, type, callback, target, customData);
        } else {
            this._load(path, type, callback, target, customData);
        }
    }

    /**
     * 加载远程资源
     * @param path 相对路径
     * @param type 类型
     * @param callback 回调
     * @param target 回调上下文
     */
    public loadRemote<T extends Asset>(path: string, type: AssetType, onComplete: (err: Error | null, object: T, customData?) => void, target: unknown, customData?: unknown) {
        let jsonPath = '';
        if (!path) { return; }
        if (type === AssetType.SpriteAtlas && path.indexOf('/action/texture/action/') >= 0) {
            jsonPath = path.replace('/action/texture/action/', '');
            if (!this.actionResMap[`${jsonPath}.plist`]) { return; }
        }
        const pathSuffix = this.getPathAndSuffix(path, type);
        let loadInfo = this.getLoadInfo(pathSuffix);
        if (loadInfo) {
            // loadInfo.callback = onComplete;
            // loadInfo.target = target;
            // loadInfo.customData = customData;
            const copyLoadInfo = instantiate(loadInfo);
            copyLoadInfo.complete.clear();
            copyLoadInfo.complete = new Executor(onComplete, target, customData);
            copyLoadInfo.isCopy = true;
            this.loadRemoteDispatcher(copyLoadInfo);
        } else {
            loadInfo = new LoadInfo(path);
            loadInfo.complete = new Executor(onComplete, target, customData);
            loadInfo.type = type;
            loadInfo.jsonPath = jsonPath;
            this.resLevel.push(loadInfo);
            if (this.isLoading === false) {
                this.isLoading = true;
                this.startDown();
            }
        }
    }

    /**
     * 加载bundle资源
     * @param bundleName bundle名字
     * @param path 资源路径
     * @param type 资源类型
     * @param callback 成功回调
     * @param target 回调上下文
     * @param customData 自定义参数
     */
    // eslint-disable-next-line camelcase
    public loadFromBundle(bundleName: BundleType, path: string, type: __private._cocos_core_asset_manager_shared__AssetType, callback: (err: Error | null, object?: any, customData?: any) => void, target?: unknown, customData?: any) {
        console.time('loadFromBundle');
        BundleManager.I.load(bundleName, (err: Error | null, bundle: AssetManager.Bundle) => {
            if (bundle) {
                console.timeEnd('loadFromBundle');
                console.time('bundle.load');
                bundle.load(path, type, (e: Error | null, res) => {
                    if (e) {
                        console.error('load prefab err:', err);
                    }
                    console.timeEnd('bundle.load');
                    if (callback) callback.call(target, e, res, customData);
                });
            } else {
                console.error(`not found bundler err:${bundleName}`);
                if (callback) callback.call(target, err, bundle, customData);
            }
        });
    }

    /**
     * 资源加载，封装一层，方便扩展
     * @param path 资源路径
     * @param type 资源类型
     * @param callback 成功回调
     * @param target 回调上下文
     * @param customData 自定义参数
     */
    // eslint-disable-next-line camelcase
    private _load(path: string, type: __private._cocos_core_asset_manager_shared__AssetType, callback: (err: Error | null, object: any, customData?: any) => void, target?: unknown, customData: any = null) {
        // if (this.load_cache[path]) {
        //     if (callback) {
        //         callback.call(target, null, this.load_cache[path], customData);
        //     }
        // } else {
        console.time('111111111');
        resources.load(path, type, (err: Error, res: any) => {
            console.timeEnd('111111111');
            if (err) {
                console.error('err=', err);
            } else {
                // this.load_cache[path] = res;
            }
            if (callback) {
                callback.call(target, err, res, customData);
            }
            // this.startDown();
        });
        // }
    }

    /** 开始下载 */
    private startDown() {
        let loadInfos: LoadInfo[] = null;
        if (this.resLevel.length > 0) {
            loadInfos = this.resLevel;
        } else {
            this.isLoading = false;
        }
        if (this.isLoading) {
            if (loadInfos.length > this.loadOnceCount) {
                console.log(`${loadInfos.length}：加载长度大于100:${loadInfos[0].path},${loadInfos[loadInfos.length - 1].path}`);
            }
            for (let i = 0, n = Math.min(this.loadOnceCount, loadInfos.length); i < n; i++) {
                this.loadRemoteDispatcher(loadInfos.shift());
            }
            if (loadInfos.length < 1) {
                this.startDown();
            } else {
                setTimeout(() => {
                    this.startDown();
                }, 60);
            }
        }
    }

    /**
     * 远程加载分发器，不同类型分开处理
     */
    private loadRemoteDispatcher(loadInfo: LoadInfo) {
        switch (loadInfo.type) {
            case AssetType.SpriteFrame:
                this.loadSpriteFrame(loadInfo);
                break;
            case AssetType.Prefab:
                this.loadPrefab(loadInfo);
                break;
            case AssetType.SpriteAtlas:
                this.loadSpriteAtlas(loadInfo);
                break;
            case AssetType.Texture2D:
                this.loadTexture2D(loadInfo);
                break;
            case AssetType.Font:
                this.loadFont(loadInfo);
                break;
            default:
                this.loadOther(loadInfo);
                break;
        }
    }

    /**
     * 组装SpriteAtlas
     * @param plist plist
     * @param obj png
     * @returns SpriteAtlas
     */
    private getSpriteAtlasByPlist(plist: Record<string, unknown>, obj: Texture2D) {
        const spriteAtlas: SpriteAtlas = new SpriteAtlas();
        for (let fName in plist) {
            let frameData: FrameData = {};
            if (typeof plist[fName] === 'string') {
                let orgStr = `${plist[fName] as string}`;
                for (let n = 0; n < this.markC.length; n++) {
                    orgStr = orgStr.replace(this.markC[n], this.replC[n]);
                }
                orgStr = orgStr.replace('[,', '[0,');
                orgStr = orgStr.replace(',]', ',0]');
                while (orgStr.indexOf(',,') >= 0) {
                    orgStr = orgStr.replace(/,,/g, ',0,');
                }
                frameData = {};
                let mDat = JSON.parse(orgStr) as number[];
                frameData.Rotated = mDat[0] === 1;
                frameData.Frame = [[mDat[1], mDat[2]], [mDat[3], mDat[4]]];
                frameData.Offset = [mDat[5], mDat[6]];
                frameData.SourceSize = [mDat[7], mDat[8]];
                delete plist[fName];
                fName = this.repl[this.mark.indexOf(fName)];
                plist[fName] = frameData;
                mDat = null;
            } else {
                frameData = plist[fName];
            }
            let frame = frameData.Frame;
            let offset = frameData.Offset;
            let fSize = frameData.SourceSize;
            const _rect = rect(frame[0][0], frame[0][1], frame[1][0], frame[1][1]);
            const _offset = v2(offset[0], offset[1]);
            const _size = size(fSize[0], fSize[1]);
            const sp = new SpriteFrame();
            sp.texture = obj;
            sp.rect = _rect;
            sp.rotated = frameData.Rotated;
            sp.offset = _offset;
            sp.originalSize = _size;
            sp.name = fName;
            // 整图
            spriteAtlas.spriteFrames[fName] = sp;
            frameData = null;
            frame = null;
            offset = null;
            fSize = null;
        }
        spriteAtlas._uuid = spriteAtlas._uuid || obj._uuid;
        return spriteAtlas;
    }

    private getRealFilePath(filePath: string) {
        if (filePath.indexOf('http://') === 0 || filePath.indexOf('https://') === 0) {
            return filePath;
        }
        let tmpFilepath = filePath;
        if (filePath.indexOf('texture/action') === 0) {
            tmpFilepath = filePath.replace('texture/action/', '/action/texture/action/');
        } else if (filePath.indexOf('e/') === 0 && filePath.indexOf('e/prefab/') !== 0) {
            tmpFilepath = filePath.replace('e/', '/e/');
        }
        return `${GlobalConfig.getHLResUrl()}/${tmpFilepath}`;
    }

    /** http url统一在这加上 */
    private _loadRemote<T extends Asset>(filePath: string, onComplete: (err: Error | null, asset: T) => void) {
        filePath = this.getRealFilePath(filePath);
        assetManager.loadRemote(filePath, onComplete);
    }

    private loadSpriteAtlas(loadInfo: LoadInfo) {
        if (loadInfo.loadedData) {
            this.loadResult(undefined, loadInfo.loadedData, loadInfo);
        } else {
            this.loadTexture2DByCache(loadInfo, (e, texture) => {
                if (e) {
                    this.loadResult(e, texture, loadInfo);
                    return;
                }
                const plistUrl = this.getPathAndSuffix(loadInfo.path, AssetType.Plist, true);
                const jsonPlistUrl = loadInfo.jsonPath ? this.getPathAndSuffix(loadInfo.jsonPath, AssetType.Plist, true) : plistUrl;
                // const plistUrl = `${loadInfo.path}.plist`;
                // const json_path_url = `${loadInfo.jsonPath}.plist`;
                let plist = this.actionResMap[jsonPlistUrl];
                if (!plist) {
                    this._loadRemote(plistUrl, (err, object) => {
                        if (err) {
                            this.loadResult(err, object, loadInfo);
                            return;
                        }
                        if (loadInfo.path.indexOf('3048') >= 0) {
                            if (this.actionResMap[jsonPlistUrl]) {
                                console.log('已经有了');
                            }
                        }
                        if (!this.actionResMap[jsonPlistUrl]) {
                            plist = this.getPlistByObject(object);
                            this.actionResMap[jsonPlistUrl] = plist;
                        } else {
                            plist = this.actionResMap[jsonPlistUrl];
                        }
                        if (plist) {
                            const spriteAtlas = this.getSpriteAtlasByPlist(plist, texture);
                            spriteAtlas.name = loadInfo.name;
                            // if (loadInfo.path.indexOf('3048') >= 0) {
                            //     console.log('1 loadResult loadInfo.path=', loadInfo.path);
                            // }
                            this.loadResult(undefined, spriteAtlas, loadInfo);
                        }
                    });
                } else if (typeof plist === 'string') {
                    plist = JSON.parse(plist) as Record<string, unknown>;
                    this.actionResMap[jsonPlistUrl] = plist;
                    const spriteAtlas = this.getSpriteAtlasByPlist(plist, texture);
                    spriteAtlas.name = loadInfo.name;
                    // if (loadInfo.path.indexOf('3048') >= 0) {
                    //     console.log('2 loadResult loadInfo.path=', loadInfo.path);
                    // }
                    this.loadResult(undefined, spriteAtlas, loadInfo);
                } else {
                    const spriteAtlas = this.getSpriteAtlasByPlist(plist, texture);
                    spriteAtlas.name = loadInfo.name;
                    // if (loadInfo.path.indexOf('3048') >= 0) {
                    //     console.log('3 loadResult loadInfo.path=', loadInfo.path);
                    // }
                    this.loadResult(undefined, spriteAtlas, loadInfo);
                }
            });
        }
    }

    /**
     * 加载结果
     * @param err 错误码
     * @param obj 远程文件对象
     * @param loadInfo 加载item
     */
    private loadResult<T extends Asset>(err: Error | null, obj: T, loadInfo: LoadInfo) {
        if (err) {
            obj = null;
            if (loadInfo.type === AssetType.SpriteFrame || loadInfo.type === AssetType.SpriteAtlas || loadInfo.retry > this.MAX_RETRY) {
                // 如果图片,不再重试。
                // if (loadInfo.callback) {
                //     loadInfo.callback.call(loadInfo.target, err, obj, loadInfo.customData);
                // }
                if (loadInfo.complete) {
                    loadInfo.complete.invokeWithArgs(err, obj, loadInfo.complete.getArgs()[0]);
                }
                console.log(`加载错误：${loadInfo.path}${loadInfo.suffix}`);
            } else {
                loadInfo.retry++;
                this.loadRemoteDispatcher(loadInfo);
            }
        } else if (obj) {
            if (obj.loaded === false || (loadInfo.type === AssetType.SpriteFrame && obj instanceof SpriteFrame && !obj.texture)) {
                // Tool.I.log("[" + loadInfo.path + "]完成回调,但加载状态为false,当做未加载处理");
                // loaded为false的资源,重新加载一遍
                this.loadRemoteDispatcher(loadInfo);
            } else {
                if (!loadInfo.loadedData) {
                    loadInfo.loadedData = obj;
                }
                if (loadInfo.type === AssetType.Prefab || loadInfo.type === AssetType.SpriteAtlas) {
                    if (!this.loadObjectPool[loadInfo.path + loadInfo.type]) {
                        this.loadObjectPool[loadInfo.path + loadInfo.type] = loadInfo;
                    }
                }
                if (loadInfo.complete) {
                    loadInfo.complete.invokeWithArgs(err, obj, loadInfo.complete.getArgs()[0]);
                }
                if (loadInfo.isCopy) {
                    loadInfo = null;
                }
            }
        }
    }

    // private loadPlist(loadInfo: LoadInfo) {
    //     let path_plist = this.getPathAndSuffix(loadInfo.path, AssetType.Plist, true);
    //     this._loadRemote(path_plist, (err, object: AssetInfo)=> {

    //     });
    //     assetManager.loadRemote(url, (err, object: AssetInfo)=> {
    //         let plist = this.getPlistByObject(object);
    //         func.call(this, plist);
    //     });
    // }

    private getPlistByObject(object) {
        if (object && object._file) {
            const plist = {};
            const frams = object._file.frames;
            for (const fName in frams) {
                let frameData = frams[fName];
                const plistData: { Rotated?: boolean, Frame?: number[][], Offset?: number[], SourceSize?: number[]; } = {};
                frameData.frame = frameData.frame.replace(/{/g, '[').replace(/}/g, ']');
                plistData.Frame = JSON.parse(frameData.frame);
                frameData.offset = frameData.offset.replace('{', '[').replace('}', ']');
                plistData.Offset = JSON.parse(frameData.offset);
                plistData.Rotated = frameData.rotated;
                frameData.sourceSize = frameData.sourceSize.replace('{', '[').replace('}', ']');
                plistData.SourceSize = JSON.parse(frameData.sourceSize);
                frameData = null;
                plist[fName.split('.')[0]] = plistData;
            }
            return plist;
        }
        return undefined;
    }

    private loadPrefab(loadInfo: LoadInfo) {
        //
    }

    private loadFont(loadInfo: LoadInfo) {
        //
    }

    private loadOther(loadInfo: LoadInfo) {
        this._loadRemote(loadInfo.path + loadInfo.suffix, (err, text) => {
            this.loadResult(err, text, loadInfo);
        });
    }

    public removeTexture(uuid: string) {
        for (const path in this.texturesCaches) {
            const t = this.texturesCaches[path];
            if (t._uuid === uuid) {
                delete this.texturesCaches[path];
            }
        }
    }

    public removeSpriteFrame(uuid: string) {
        for (const path in this.spriteFrameCaches) {
            const t = this.spriteFrameCaches[path];
            if (t._uuid === uuid) {
                delete this.spriteFrameCaches[path];
            }
        }
    }

    private loadSpriteFrame(loadInfo: LoadInfo) {
        const path = loadInfo.path + loadInfo.suffix;
        if (this.spriteFrameCaches[path]) {
            this.loadResult(undefined, this.spriteFrameCaches[path], loadInfo);
        } else {
            this.loadTexture2DByCache(loadInfo, (e, t) => {
                let spriteFrame: SpriteFrame;
                if (t) {
                    spriteFrame = new SpriteFrame();
                    spriteFrame.texture = t;
                    spriteFrame._uuid = t._uuid;
                }
                this.spriteFrameCaches[path] = spriteFrame;
                this.loadResult(e, spriteFrame, loadInfo);
            });
        }
    }

    private loadTexture2DByCache(loadInfo: LoadInfo, callback: (err: Error, texture: Texture2D) => void) {
        const path = loadInfo.path + loadInfo.suffix;
        if (this.texturesCaches[path]) {
            if (callback) {
                callback(null, this.texturesCaches[path]);
            }
        } else {
            this._loadRemote(path, (err, imageasset: ImageAsset) => {
                if (err) {
                    callback(err, undefined);
                    return;
                }
                let texture: Texture2D;
                if (!this.texturesCaches[path]) {
                    texture = new Texture2D();
                    texture.image = imageasset;
                    texture._uuid = imageasset._uuid;
                    this.texturesCaches[path] = texture;
                } else {
                    texture = this.texturesCaches[path];
                }
                if (callback) {
                    callback(null, texture);
                }
            });
        }
    }

    private loadTexture2D(loadInfo: LoadInfo) {
        this.loadTexture2DByCache(loadInfo, (e, t) => {
            this.loadResult(null, t, loadInfo);
        });
    }

    private getSpriteFrameByImageAsset(image: ImageAsset) {
        const spriteFrame = new SpriteFrame();
        const texture = new Texture2D();
        texture.image = image;
        spriteFrame.texture = texture;
        return spriteFrame;
    }
    private getTexture2DByImageAsset(image: ImageAsset) {
        const texture = new Texture2D();
        texture.image = image;
        return texture;
    }

    /**
     * 显示prefab
     * @param parent 父节点
     * @param path prefab路径
     * @param bundle bundle名字
     * @param callback 回调
     * @param target 回调上下文
     * @param args 扩展参数
     */
    public showPrefab(parent: Node, path: string, bundle?: BundleType, callback?: (err, node: Node) => void, target?: any, args?: any) {
        const func = (err, p: Prefab) => {
            let node: Node;
            if (!err && p) {
                node = instantiate(p);
                if (args) {
                    if (args.pos) {
                        node.setPosition(args.pos.x, args.pos.y);
                    }
                    node.attr({ _args: args });
                }
                if (parent) {
                    if (parent.isValid) {
                        parent.addChild(node);
                        if (callback) {
                            callback.call(target, err, node);
                        }
                    } else {
                        node.destroy();
                    }
                } else if (callback) {
                        callback.call(target, err, node);
                    }
            }
        };
        if (bundle) {
            this.loadFromBundle(bundle, path, Prefab, func, this);
        } else {
            this.load(path, Prefab, func, this);
        }
    }

    public _resFileData: { [name: string]: MPQ_FILE_INFO; } = {};
    public get resFileData(): { [name: string]: MPQ_FILE_INFO; } {
        return this._resFileData;
    }
    public set resFileData(val: { [name: string]: MPQ_FILE_INFO; }) {
        this._resFileData = val;
    }

       /**
     * 根据url获取文件类型
     */
    public static getFileTypeByUrl(url: string) {
        const s = url.split('/');
        const last = s[s.length - 1];
        const n = last.split('.');
        const sf = n[1] ? `.${n[1]}` : AssetType.Png;
        return {
            path: url.split(last)[0],
            name: n[0],
            suffix: sf,
        };
    }

    // private timeer;
    // public addReleaseQueue (uuid: string) {
    //     this.release_queue.push(uuid);
    //     if (!this.timeer && this.release_queue.length === 1) {
    //         this.timeer = setTimeout(() => {
    //             this.doReleaseQueue();
    //         }, 100);
    //     }
    // }

    // private doReleaseQueue() {
    //     if (this.timeer) {
    //         this.timeer = null;
    //     }
    //     if (this.release_queue.length > 0) {
    //         let uuid = this.release_queue.shift();
    //         let a = assetManager.assets.get(uuid);
    //         if (a) {
    //             a.decRef();
    //             if (a.refCount <= 0) {
    //                 if (this.load_cache[a._nativeUrl]) {
    //                     this.load_cache[a._nativeUrl] = null;
    //                 }
    //             }
    //         }
    //         this.timeer =  setTimeout(() => {
    //             this.doReleaseQueue();
    //         }, 100);
    //     }
    // }

    // private getPriority() {
    //     return this.load_queue.shift();
    // }

    // private getDownPriority() {
    //     return this.down_queue.shift();
    // }

    // startDown() {
    //     if (this.load_queue.length == 0) { return; }
    //     let f = this.getDownPriority();
    //     this.down(f.path, f.type, f.callback, f.target);
    // }
}

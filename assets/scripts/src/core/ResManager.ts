
import { _decorator, Component, Node, js, Texture2D, __private, resources, Asset, assetManager, SpriteFrame, SpriteAtlas, ImageAsset, rect, v2, size, instantiate } from 'cc';
import { Executor } from '../base/Executor';
import {BundleManager} from './BundleManager';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ResManager
 * DateTime = Fri Mar 25 2022 15:12:09 GMT+0800 (中国标准时间)
 * Author = zengsi
 * FileBasename = ResManager.ts
 * FileBasenameNoExtension = ResManager
 * URL = db://assets/app/src/core/ResManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

 export const enum AssetType {
    SpriteFrame = '.frame',
    SpriteAtlas = '.atlas',
    Texture2D = '.txture',
    JsonAsset = '.json',
    TextAsset = '.txt',
    Font = '.fnt',
    Prefab = '.prefab',
    AudioClip = '.mp3',
    /** 这个类型表示material中所用到的资源   有可能只是一个贴图 */
    Material = '.material',
    Plist = '.plist',
    Png = '.png',
    Empty = '',
}

/** bundle类型 */
export const enum BundleType {
    default = 'app',
    game = 'game'
}

type CCAssetType = __private._cocos_core_asset_manager_shared__AssetType;

interface FileInfo { path: string, name: string, suffix: string };

/** 加载信息 */
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
    /** 加载完成的回调器 */
    public completeExec: Executor;
    /** 是否是拷贝的 */
    public isCopy = false;
    // public callback: (err: Error | null, object: any, customData: any) => void;
    // /** 加载失败回调 */
    // fail_callback: (path: string, customData?: any) => void;
    // public target: unknown;
    /** 回传参数 */
    // public customData: any;
    /** object */
    public loadedData: Asset;
    /** 重试次数 */
    public retry = 0;
    /** 优先级 */
    public priority = 0;
    public constructor(url?: string) {
        if (url) {
            const s = this.getFileTypeByUrl(url);
            this.name = s.name;
            this.path = s.path + s.name;
            this.suffix = s.suffix;
        }
    }
    /**
     * 根据url获取文件类型
     */
    private getFileTypeByUrl(url: string): FileInfo {
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
}

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

    /** 下载最大重试次数 */
    private readonly MAX_RETRY: number = 5;
    /** 根据 */
    private loadInfosByLevel: LoadInfo[] = [];
    /** plist存储表 */
    public actionResMap: { [name: string]: Record<string, unknown>; } = js.createMap(true);
    /** 贴图缓存表 */
    private texturesCaches: { [path: string]: Texture2D} = js.createMap(true);
    /** 单次加载数量 */
    private loadOnceCount = 100;
    /** 是否正在加载 */
    private isLoading = false;
    /** 加载过的加载信息池 */
    private loadInfoPool: { [pathType: string]: LoadInfo; } = {};
    /**
     * 加载非远程资源
     * @param bundle bundle名字
     * @param path 资源路径
     * @param type 资源类型
     * @param callback 成功回调
     * @param target 回调上下文
     * @param customData 自定义参数
     */
    // public load(bundle: BundleType, path: string, type: CCAssetType, callback: (err: Error | null, object?: any, customData?: any) => void, target?: unknown, customData?: any) {
    //     if (bundle) {
    //         this.loadFromBundle(bundle, path, type, callback, target, customData);
    //     } else {
    //         this._load(path, type, callback, target, customData);
    //     }
    // }

    /**
     * 加载bundle资源
     * @param bundleName bundle名字
     * @param path 资源路径
     * @param type 资源类型
     * @param callback 成功回调
     * @param target 回调上下文
     * @param customData 自定义参数
     */
    public loadFromBundle(bundleName: BundleType, path: string, type: CCAssetType, callback: (err: Error | null, object?: any, customData?: any) => void, target?: unknown, customData?: any) {
        BundleManager.I.load(bundleName, (err, bundle) => {
            if (bundle) {
                const imgType = this.getImgTypeByAssetType(type);
                bundle.load(path + imgType, type, (e: Error | null, res) => {
                    if (e) {
                        console.error('load prefab err:', err);
                    }
                    if (callback) callback.call(target, e, res, customData);
                });
            } else {
                console.error(`not found bundler err:${bundleName}`);
                if (callback) callback.call(target, err, bundle, customData);
            }
        });
    }

    private getImgTypeByAssetType(type: CCAssetType) {
        let imgType = '';
        if (type === Texture2D) {
            imgType = '/texture'
        } else if (type === SpriteFrame) {
            imgType = '/spriteFrame';
        }
        return imgType;
    }

    /**
     * 资源加载，封装一层，方便扩展
     * @param path 资源路径
     * @param type 资源类型
     * @param callback 成功回调
     * @param target 回调上下文
     * @param customData 自定义参数
     */
     private _load(path: string, type: CCAssetType, callback: (err: Error | null, object: any, customData?: any) => void, target?: unknown, customData: any = null) {
        // if (this.load_cache[path]) {
        //     if (callback) {
        //         callback.call(target, null, this.load_cache[path], customData);
        //     }
        // } else {
        resources.load(path, type, (err: Error, res: any) => {
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
    /**
     * 加载远程资源
     * @param path 带后缀的相对路径，不带后缀就默认会加上.png
     * @param type 类型
     * @param callback 回调
     * @param target 回调上下文
     */
     public loadRemote<T extends Asset>(path: string, type: AssetType, onComplete: (err: Error | null, object: T, customData?) => void, target?: unknown, customData?: unknown) {
        let jsonPath = '';
        
        if (!path) { return; }
        if (type === AssetType.SpriteAtlas && path.indexOf('/action/texture/action/') >= 0) {
            jsonPath = path.replace('/action/texture/action/', '');
            if (!this.actionResMap[`${jsonPath}.plist`]) { return; }
        }
        const psuffix = this.getPathAndSuffix(path, type);
        let loadInfo = this.getLoadInfo(psuffix);
        if (loadInfo) {
            const copyLoadInfo = instantiate(loadInfo);
            copyLoadInfo.completeExec.clear();
            copyLoadInfo.completeExec = new Executor(onComplete, target, customData);
            copyLoadInfo.isCopy = true;
            this.loadRemoteDispatcher(loadInfo);
        } else {
            loadInfo = new LoadInfo(path);
            // loadInfo.callback = onComplete;
            // loadInfo.target = target;
            // loadInfo.customData = customData;
            loadInfo.completeExec = new Executor(onComplete, target, customData);
            loadInfo.type = type;
            loadInfo.jsonPath = jsonPath;
            this.loadInfosByLevel.push(loadInfo);
            if (this.isLoading === false) {
                this.isLoading = true;
                this.startDown();
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
     * 远程加载，http url统一在这加上
     * @param filePath 资源路径
     * @param onComplete 
     */
    private _loadRemote<T extends Asset>(filePath: string, onComplete: (err: Error | null, asset: T) => void) {
        filePath = this.getRealFilePath(filePath);
        assetManager.loadRemote(filePath, onComplete);
    }
    /**
     * 根据路径获取带有真实带有http的路径
     * @param filePath 资源路径
     * @returns 真实http路径
     */
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
        return `http://huanling1_dev_yxres.kaixinxiyou.com/${tmpFilepath}`;
    }

    
    /** 开始下载 */
    private startDown() {
        let loadInfos: LoadInfo[] = null;
        if (this.loadInfosByLevel.length > 0) {
            loadInfos = this.loadInfosByLevel;
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
     * 加载预制体
     * @param loadInfo 加载信息
     */
    private loadPrefab(loadInfo: LoadInfo) {
        //
    }

    /**
     * 加载字体
     * @param loadInfo 加载信息
     */
    private loadFont(loadInfo: LoadInfo) {
        //
    }

    /**
     * 加载其他类型
     * @param loadInfo 加载信息
     */
    private loadOther(loadInfo: LoadInfo) {
        this._loadRemote(loadInfo.path + loadInfo.suffix, (err, text) => {
            this.loadResult(err, text, loadInfo);
        });
    }

    /**
     * 加载SpriteFrame
     * @param loadInfo 加载信息
     */
    private loadSpriteFrame(loadInfo: LoadInfo) {
        this.loadTexture2DByCache(loadInfo, (e, t) => {
            const spriteFrame = new SpriteFrame();
            spriteFrame.texture = t;
            spriteFrame._uuid = t._uuid;
            this.loadResult(null, spriteFrame, loadInfo);
        });
    }

    /**
     * 加载图集
     * @param loadInfo 加载信息
     */
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
                let plist = this.actionResMap[jsonPlistUrl];
                if (!plist) {
                    this._loadRemote(plistUrl, (err, object) => {
                        if (err) {
                            this.loadResult(err, object, loadInfo);
                            return;
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
                            this.loadResult(undefined, spriteAtlas, loadInfo);
                        }
                    });
                } else if (typeof plist === 'string') {
                    plist = JSON.parse(plist) as Record<string, unknown>;
                    this.actionResMap[jsonPlistUrl] = plist;
                    const spriteAtlas = this.getSpriteAtlasByPlist(plist, texture);
                    spriteAtlas.name = loadInfo.name;
                    this.loadResult(undefined, spriteAtlas, loadInfo);
                } else {
                    const spriteAtlas = this.getSpriteAtlasByPlist(plist, texture);
                    spriteAtlas.name = loadInfo.name;
                    this.loadResult(undefined, spriteAtlas, loadInfo);
                }
            });
        }
    }

    /**
     * 加载结果
     * @param err 错误码
     * @param obj 远程文件对象
     * @param loadInfo 加载信息
     */
    private loadResult<T extends Asset>(err: Error | null, obj: T, loadInfo: LoadInfo) {
        if (err) {
            obj = null;
            if (loadInfo.type === AssetType.SpriteFrame || loadInfo.type === AssetType.SpriteAtlas || loadInfo.retry > this.MAX_RETRY) {
                // 如果图片,不再重试。
                // if (loadInfo.callback) {
                //     loadInfo.callback.call(loadInfo.target, err, obj, loadInfo.customData);
                // }
                if (loadInfo.completeExec) {
                    loadInfo.completeExec.invokeWithArgs(err, obj, loadInfo.completeExec.getArgs()[0]);
                }
                console.log(`加载错误：${loadInfo.path}.${loadInfo.suffix}`);
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
                    if (!this.loadInfoPool[loadInfo.path + loadInfo.type]) {
                        this.loadInfoPool[loadInfo.path + loadInfo.type] = loadInfo;
                    }
                }
                if (loadInfo.completeExec) {
                    loadInfo.completeExec.invokeWithArgs(err, obj, loadInfo.completeExec.getArgs()[0]);
                }
                if (loadInfo.isCopy) {
                    loadInfo = null;
                }
            }
        }
    }

    /**
     * 从缓存里加载贴图
     * @param loadInfo 加载信息
     * @param callback 回调
     */
    private loadTexture2DByCache(loadInfo: LoadInfo, callback: (err: Error, texture: Texture2D) => void) {
        const path = loadInfo.path + loadInfo.suffix;
        if (this.texturesCaches[path]) {
            if (callback) {
                callback(null, this.texturesCaches[path]);
            }
        } else {
            this._loadRemote(path, (err, imageasset: ImageAsset) => {
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

    /**
     * 加载贴图
     * @param loadInfo 加载信息 
     */
    private loadTexture2D(loadInfo: LoadInfo) {
        this.loadTexture2DByCache(loadInfo, (e, t) => {
            this.loadResult(null, t, loadInfo);
        });
    }
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

    private getLoadInfo(path: string): LoadInfo {
        return this.loadInfoPool[path];
    }

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
    /**
     * 组装SpriteAtlas
     * @param plist plist
     * @param obj png
     * @returns SpriteAtlas
     */
    private getSpriteAtlasByPlist(plist: Record<string, unknown>, obj: Texture2D) {
        const spriteAtlas: SpriteAtlas = new SpriteAtlas();
        for (let fName in plist) {
            let frameData: { Rotated?: boolean, Frame?: number[][], Offset?: number[], SourceSize?: number[]; };
            if (typeof plist[fName] === 'string') {
                let orgStr = `${<string>plist[fName]}`;
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
            spriteAtlas.spriteFrames[fName] = sp;
            frameData = null;
            frame = null;
            offset = null;
            fSize = null;
        }
        spriteAtlas._uuid = spriteAtlas._uuid || obj._uuid;
        return spriteAtlas;
    }


    public removeTextures(uuid: string) {
        for (const path in this.texturesCaches) {
            const t = this.texturesCaches[path];
            if (t._uuid === uuid) {
                delete this.texturesCaches[path];
            }
        }
    }
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

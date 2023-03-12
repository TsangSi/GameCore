/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable func-names */
/* eslint-disable dot-notation */
/* eslint-disable no-loop-func */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: zs
 * @Date: 2022-04-07 18:21:34
 * @FilePath: \SanGuo\assets\script\app\core\res\ResMgr.ts
 * @Description:
 *
 */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable max-len */
// import { CCResMgr, GIF, GIFFrameData } from 'h3_engine';
import { Asset, _decorator } from 'cc';
import {
    AssetType,
    BigAssetType,
    CompleteCallback,
    IAssetEx,
    IAssetPrototype,
    IResBase,
    IResLoadOps, IShowPrefabResultData, LoadInfo,
} from './ResConst';
import { ResLoadBase } from './ResLoadBase';
import { ResLoadLocal } from './ResLoadLocal';
import { ResLoadPlist } from './ResLoadPlist';
import { ResLoadSpine } from './ResLoadSpine';
import { ResLoadSpriteAtlas } from './ResLoadSpriteAtlas';
import { ResLoadSpriteFrame } from './ResLoadSpriteFrame';
// import { ResMgrBase } from './ResMgrBase';

const ASTSFOLDS = [
    'action',
    'spine',
    'effect',
    'e',
];

const ASTSFOLDS_CFG = {
    action: '6x6',
    effect: '6x6',
    map: '6x6',
    spine: '6x6',
    'texture/battleUI/bg': '6x6',
    'texture/collectionBook': '6x6',
    'texture/com/bg': '6x6',
    'texture/com/bigBg': '6x6',
    'texture/com/bnr': '6x6',
    'texture/com/sceneBg': '6x6',
    'texture/com/img': '6x6',
    'texture/com/edge': '8x6',
    'texture/login': '6x6',
    'texture/fbExplore': '6x6',
    'texture/gameLevel': '6x6',
    'texture/gem': '6x6',
    'texture/gradeGift': '6x6',
    'texture/maincity': '6x6',
    'texture/official': '6x6',
    'texture/role': '6x6',
    'texture/roleExercise': '6x6',
    'texture/roleskill': '6x6',
    'texture/beaconWar': '6x6',
    'texture/roleskin': '6x6',
    'texture/family': '6x6',
    'texture/shop': '6x6',
    'texture/silkRoad': '6x6',
    'texture/strength': '6x6',
    'texture/team': '6x6',
    'texture/tips': '6x6',
    'texture/vip': '6x6',
    'texture/wintab': '6x6',
    'texture/worldBoss': '6x6',
};

const { ccclass } = _decorator;
@ccclass('ResM')
export class ResM implements IResBase {
    private static _I: ResM = null;
    public static get I(): ResM {
        if (this._I == null) {
            this._I = new ResM();
            // CCResMgr.SetRemoveSpriteFrameCallback(this._I.removeSpriteFrame, this._I);
            // CCResMgr.SetRemoveTextureCallback(this._I.removeTexture, this._I);
            // CCResMgr.SetDecRefCallback(this._I.decRef, this._I);
        }
        return this._I;
    }

    public constructor() {
        this.resLoadLocal.resources = new ResLoadLocal('resources');
        this.resLoadTexture = new ResLoadBase('Texture2D');
        this.resLoadSpriteFrame = new ResLoadSpriteFrame();
        this.resLoadPlist = new ResLoadPlist();
        this.resloadSpriteAtlas = new ResLoadSpriteAtlas();
        this.resloadSpine = new ResLoadSpine();
    }

    /** 检测资源的定时器标识id */
    private checkResTimerId: number;
    /** 资源地址 */
    private _ResUrl: string = '';
    /** 等待删除CD时间 */
    private waitDeleteTime = 5;
    /** 等待删除列表 */
    private waitDelete: { [uuid: string]: { asset: Asset, time: number } } = cc.js.createMap(true);
    /** 清除下载任务记录 */
    private SingleFrameLoadCount = 0;
    /** 贴图加载类 */
    protected resLoadTexture: ResLoadBase<cc.Texture2D> = null;
    /** 精灵帧加载类 */
    protected resLoadSpriteFrame: ResLoadSpriteFrame = null;
    /** plist加载类 */
    protected resLoadPlist: ResLoadPlist = null;
    /** 图集加载类 */
    protected resloadSpriteAtlas: ResLoadSpriteAtlas = null;
    /** spine加载类 */
    protected resloadSpine: ResLoadSpine = null;
    /** 本地资源加载类 */
    protected resLoadLocal: { [bundle: string]: ResLoadLocal } = cc.js.createMap(true);

    /** 缓存占用内存阈值 */
    public maxMemory: number = 400;
    /** 下载最大重试次数 */
    private readonly MAX_RETRY: number = 5;
    /** 单次加载数量 */
    private loadOnceCount = 100;
    /** 下载间隔时间ms */
    private downSpacingTime = 60;
    /** 加载权重等级数组 */
    private resLevel: LoadInfo[] = [];
    /** 下载队列定时器 */
    private DownTimeJS: number;

    /**
     * 预加载本地资源，增加参数是否缓存该资源
     * @param path 资源路径
     * @param type 资源类型
     * @param rightNow 是否马上就去加载
     */
    public preload(path: string, type: any, rightNow: boolean = false) {
        this.resLoadLocal[BundleType.resources].preload(path, type, rightNow);
    }

    /**
     * 删除预加载
     * @param path 资源路径
     */
    public delPreLoad(path: string) {
        this.resLoadLocal[BundleType.resources].delPreLoad(path);
    }

    /**
    * 加载本地资源，加载预制体请使用showPrefab
    * @param path 资源路径
    * @param type 资源类型
    * @param callback 成功回调
    * @param target: 回调上下文this
    * @param customData: 自定义参数
    * @param bundle: bundle名字
    * ```ts
    * 资源加载可选参数
    * export interface IResLoadOps {
    *    target?: unknown,
    *    customData?: any,
    *    bundle?: BundleType,
    * }
    * ```
    */
    public loadLocal<T extends cc.Asset>(path: string | string[], type: IAssetPrototype<T>, callback: CompleteCallback<T | T[]>, resLoadOps?: IResLoadOps) {
        const bundleName = resLoadOps?.bundle || BundleType.resources;
        this.resLoadLocal[bundleName].load(path, type, callback, resLoadOps?.target, resLoadOps?.customData);
    }

    /**
     * 获取大类型的路径（带后缀）
     * @param path 路径 | 路径列表
     * @param type 类型 | 后缀名
     * @returns
     */
    private getBigTypePathWithSuffix(path: string | string[], type: AssetType | string) {
        let pathWithSuffix = '';
        const suffix = typeof type === 'string' ? type : LoadInfo.GetSuffixByType(type);
        if (typeof path === 'string') {
            pathWithSuffix = `${path}.${suffix}`;
        } else {
            pathWithSuffix = `${path[0]}.${suffix}`;
        }
        return pathWithSuffix;
    }

    /**
    * 加载远程资源
    * @param path 相对路径
    * @param type 类型
    * @param onComplete: 加载完成的回调
    * @param resLoadOps: 自定义参数
    */
    public loadRemote<T extends cc.Asset>(path: string | string[], type: AssetType, onComplete: CompleteCallback<T>, resLoadOps?: IResLoadOps) {
        const bigType = Math.floor(type / 10) * 10;
        const executor = new Executor(onComplete, resLoadOps?.target, resLoadOps?.customData);
        let p: string | string[] = null;
        if (bigType === BigAssetType.SpriteAtlas) {
            if (this.isCanUseAstc()) {
                p = this.replaceAstcPaths(path);
                if (p) {
                    path = p;
                    if (type === AssetType.SpriteAtlas_mergeJson) {
                        type = AssetType.SpriteAtlas_mergeJson_astc;
                    } else {
                        type = AssetType.SpriteAtlas_astc;
                    }
                }
            }
            this.makeLoadInfoStartDown(path, type, executor);
        } else if (bigType === BigAssetType.Spine) {
            if (this.isCanUseAstc()) {
                p = this.replaceAstcPaths(path);
                if (p) {
                    path = p;
                    type = AssetType.Spine_astc;
                }
            }
            this.makeLoadInfoStartDown(path, type, executor);
        } else if (bigType === BigAssetType.SpriteFrame) {
            if (this.isCanUseAstc()) {
                p = this.replaceAstcPaths(path);
                if (p) {
                    path = p;
                    type = AssetType.SpriteFrame_astc;
                }
            }
            this.makeLoadInfoStartDown(path, type, executor);
        } else if (typeof path === 'string') {
            const pathNoSuffix = UtilString.GetFilePathNoSuffix(path);
            this.makeLoadInfoStartDown(pathNoSuffix, type, executor);
        }
    }

    private _gmAstc: boolean = true;
    public get gmAstc(): boolean {
        return this._gmAstc;
    }
    public set gmAstc(astc: boolean) {
        console.log('gmAstc=', astc);
        this._gmAstc = astc;
    }

    /** 能否使用astc */
    private isCanUseAstc() {
        // eslint-disable-next-line dot-notation
        return this._gmAstc && !!cc.renderer['device'].ext('WEBGL_compressed_texture_astc');
        // return true;
    }

    /** 默认png的图集路径替换成astc */
    private replaceAstcPath(path: string, sourceFoldNames: string[] = ASTSFOLDS) {
        let foldPath: string = '';
        // sourceFoldNames.forEach((name) => {

        //     foldPath = `${name}/`;
        //     if (path.indexOf(foldPath) === 0) {
        //         path = path.replace(foldPath, `${name}_astc/`);
        //     }
        // });
        let astc_path: string = null;
        for (const key in ASTSFOLDS_CFG) {
            if (Object.prototype.hasOwnProperty.call(ASTSFOLDS_CFG, key)) {
                foldPath = key;
                // const element = ASTSFOLDS_CFG[key];
                if (path.indexOf(`${foldPath}/`) === 0) {
                    astc_path = path.replace(foldPath, `astc/${foldPath}`);
                }
            }
        }
        console.log('==================', astc_path);
        return astc_path;
    }

    /** 批量默认png的图集路径替换成astc */
    private replaceAstcPaths(path: string | string[]) {
        if (typeof path === 'string') {
            return this.replaceAstcPath(path, ASTSFOLDS);
        } else {
            let tmps: string[] = [];
            for (let i = 0; i < path.length; i++) {
                const p = path[i];
                const v = this.replaceAstcPath(p, ASTSFOLDS);
                if (!v) {
                    tmps = null;
                    break;
                }
                tmps.push(p);
            }
            return tmps;
        }
    }

    private makeLoadInfoStartDown(path: string | string[], type: AssetType, excutor: Executor) {
        const bigType = Math.floor(type / 10) * 10;
        const suffix = LoadInfo.GetSuffixByType(type);
        // 做好标记，资源回来后，清除loadinfo
        const isCopy = false;// loadInfo && !loadInfo.loadedData;
        const loadInfo = new LoadInfo(path, suffix);
        loadInfo.isCopy = isCopy;
        loadInfo.complete = excutor;
        loadInfo.type = type;
        loadInfo.bigType = bigType;
        this.resLevel.push(loadInfo);
        if (this.SingleFrameLoadCount < this.loadOnceCount) {
            this.startDown();
        }
    }

    /**
    * 等待异步-加载非远程资源，加载预制体请使用showPrefabAsync
    * @param path 资源路径
    * @param type 资源类型
    * @param callback 成功回调
    * @param target 回调上下文
    * @param customData 自定义参数
    */
    // eslint-disable-next-line camelcase
    public async loadAsync<T extends cc.Asset>(path: string, type: any, bundle?: BundleType | string): Promise<T>;
    public async loadAsync<T extends cc.Asset>(paths: string[], type: any, bundle?: BundleType | string): Promise<T[]>;
    public async loadAsync<T extends cc.Asset>(path, type: any, bundle?: BundleType | string) {
        if (bundle) {
            const p = await this.loadFromBundleAsync(bundle, path, type);
            return p as unknown;
        } else {
            const p = await this._loadAsync(path, type);
            return p;
        }
    }

    /**
    * 等待异步-显示prefab
    * @param path prefab路径
    * @param parent 父节点
    * @param bundle bundle名字
    * @param func 回调
    * @param target 回调上下文
    * @param args 扩展参数
    */
    public async showPrefabAsync(path: string, parent?: cc.Node, bundle?: BundleType): Promise<cc.Node | undefined>;
    public async showPrefabAsync(paths: string[], parent?: cc.Node, bundle?: BundleType): Promise<cc.Node[]>;
    public async showPrefabAsync(path: string | string[], parent?: cc.Node, bundle?: BundleType) {
        if (typeof path === 'string') {
            const p: cc.Prefab = await this.loadAsync(path, cc.Prefab, bundle);
            if (p) {
                const t = new Date().getTime();
                let n: cc.Node = cc.instantiate(p);
                if (parent) {
                    if (cc.isValid(parent)) {
                        parent.addChild(n);
                        const endTime = new Date().getTime() - t;
                        if (n.name !== 'BagItemIcon') {
                            console.log(`【${n.name}】instanite+addChild时间:${endTime}毫秒`);
                            ModelMgr.I.GmModel.setPageTime(n.name, endTime);
                        }
                    } else {
                        n.destroy();
                        n = undefined;
                    }
                }
                return n;
            } else {
                return undefined;
            }
        } else {
            const prefabs = await this.loadAsync(path, cc.Prefab, bundle);
            const nodes: cc.Node[] = [];
            prefabs.forEach((p: cc.Prefab) => {
                const n = cc.instantiate(p);
                if (parent) {
                    parent.addChild(n);
                }
                nodes.push(n);
            });
            return nodes;
        }
    }

    /**
     * 等待异步-加载资源
     * @param path 路径
     * @param type 类型
     * @returns
     */
    private async _loadAsync<T extends cc.Asset>(path: string, type: IAssetPrototype<T>): Promise<T>;
    private async _loadAsync<T extends cc.Asset>(paths: string[], type: IAssetPrototype<T>): Promise<T | T[]>;
    private async _loadAsync<T extends cc.Asset>(path: string | string[], type: IAssetPrototype<T>) {
        return new Promise((resolve) => {
            this.loadLocal(path, type, (err: Error, res: T | T[]) => {
                if (err) {
                    resolve(undefined);
                } else {
                    resolve(res);
                }
            });
        });
    }

    /**
    * 等待异步-加载bundle资源
    * @param bundleName bundle名字
    * @param path 资源路径
    * @param type 资源类型
    * @param callback 成功回调
    * @param target 回调上下文
    * @param customData 自定义参数
    */
    private async loadFromBundleAsync<T extends cc.Asset>(bundleName: BundleType | string, path: string, type: any): Promise<T> {
        const bundle = await BundleMgr.I.loadAsync(bundleName);
        if (!bundle) {
            return undefined;
        }
        const p: T = await this._bundleLoadAsync(bundle, path, type);
        return p;
    }

    /**
     * 等待异步-从bundle包加载资源
     * @param bundle bundle对象
     * @param path 路径
     * @param type 类型
     * @returns
     */
    private async _bundleLoadAsync<T extends cc.Asset>(bundle: cc.AssetManager.Bundle, path: string, type: any): Promise<T> {
        return new Promise((resolve) => {
            this._bundleLoad(bundle, path, type, (err, res: T) => {
                if (err) {
                    resolve(undefined);
                } else {
                    resolve(res);
                }
            });
        });
    }

    /**
     * 从bundle加载数据
     * @param bundle bundle对象
     * @param path 路径
     * @param type 资源类型
     * @param callback 回调
     * @param target 回调上下文
     * @param customData 自定义参数
     */
    private _bundleLoad<T extends cc.Asset>(bundle: cc.AssetManager.Bundle, path: string, type: any, callback: CompleteCallback<T>, target?: unknown, customData?: any) {
        bundle.load(path, type, (err: Error, res: T) => {
            if (err) {
                console.warn(`bundle: ${bundle.name} load prefab err:`, err);
            }
            if (callback) {
                callback.call(target, err, res, customData);
            }
        });
    }

    /** 开始下载 */
    private startDown() {
        this.runDown();
        if (!this.DownTimeJS) {
            this.DownTimeJS = setInterval(() => {
                this.clearDownTaskFlag();
                this.runDown();
            }, this.downSpacingTime);
        }
    }

    /**
     * 清除下载任务记录
     */
    private clearDownTaskFlag() {
        this.SingleFrameLoadCount = 0;
    }

    private runDown() {
        let loadInfos: LoadInfo[] = null;
        if (this.resLevel.length > 0) {
            loadInfos = this.resLevel;
            if (loadInfos.length > this.loadOnceCount) {
                console.log(`${loadInfos.length}：一次性加载长度大于${this.loadOnceCount}:${loadInfos[0].path},${loadInfos[loadInfos.length - 1].path}`);
            }
            for (let i = 0, n = Math.min(this.loadOnceCount, loadInfos.length); i < n; i++) {
                this.loadRemoteDispatcher(loadInfos.shift());
                this.SingleFrameLoadCount++;
            }
        } else if (this.DownTimeJS) {
            clearInterval(this.DownTimeJS);
            delete this.DownTimeJS;
        }
    }

    /**
    * 远程加载分发器，不同类型分开处理
    */
    private loadRemoteDispatcher(loadInfo: LoadInfo) {
        switch (loadInfo.bigType) {
            case BigAssetType.SpriteFrame:
                this.loadSpriteFrame(loadInfo);
                break;
            // case BigAssetType.Prefab:
            //     this.loadPrefab(loadInfo);
            //     break;
            case BigAssetType.Spine:
                this.loadSpine(loadInfo, this.loadResultRemote, this);
                break;
            case BigAssetType.SpriteAtlas:
                this.loadSpriteAtlas(loadInfo.getPathByIndex(0), loadInfo, this.loadResultRemote, this);
                break;
            case BigAssetType.Texture2D:
                this.loadTexture(loadInfo.path, loadInfo, this.loadResultRemote, this);
                break;
            // case BigAssetType.Font:
            // this.loadFont(loadInfo);
            // break;
            case BigAssetType.Plist:
                this.loadPlist(loadInfo.path, loadInfo, this.loadResultRemote, this);
                break;
            // case BigAssetType.Gif:
            //     this.loadGif(loadInfo.path, loadInfo);
            //     break;
            default:
                this.loadOther(loadInfo);
                break;
        }
    }

    /**
     * 加载图集
     * @param loadInfo 加载信息
     */
    public loadSpriteAtlas(path: string, loadInfo: LoadInfo, callback: CompleteCallback<cc.SpriteAtlas>, target?: object, ...args: any[]): void {
        this.resloadSpriteAtlas.load(path, loadInfo, callback, target, ...args);
    }

    /**
    * 加载结果
    * @param err 错误码
    * @param obj 远程文件对象
    * @param loadInfo 加载item
    */
    public loadResultRemote<T extends cc.Asset>(err: Error | null, obj: T, loadInfo: LoadInfo) {
        if (err) {
            obj = null;
            if (loadInfo.type === AssetType.SpriteFrame
                || loadInfo.type === AssetType.SpriteAtlas
                || loadInfo.type === AssetType.SpriteAtlas_json
                || loadInfo.type === AssetType.SpriteAtlas_mergeJson
                || loadInfo.retry > this.MAX_RETRY) {
                // 如果图片,不再重试。
                if (loadInfo.complete) {
                    loadInfo.complete.invokeWithArgs(err, obj, loadInfo.complete.getArgs()[0]);
                }
                console.log(`加载错误：${loadInfo.path}`);
            } else {
                loadInfo.retry++;
                this.loadRemoteDispatcher(loadInfo);
            }
        } else if (obj) {
            // eslint-disable-next-line dot-notation
            if (obj.loaded === false || (loadInfo.type === AssetType.SpriteFrame && obj instanceof cc.SpriteFrame && !obj.getTexture())) {
                // Tool.I.log("[" + loadInfo.path + "]完成回调,但加载状态为false,当做未加载处理");
                // loaded为false的资源,重新加载一遍
                this.loadRemoteDispatcher(loadInfo);
            } else {
                if (!loadInfo.loadedData || !loadInfo.loadedData.isValid || loadInfo.loadedData.refCount <= 0) {
                    loadInfo.loadedData = obj;
                }
                if (loadInfo.complete) {
                    loadInfo.complete.invokeWithArgs(err, obj, loadInfo.complete.getArgs()[0]);
                }
                if (obj.refCount !== undefined && obj.refCount !== null) {
                    if (loadInfo.bigType === BigAssetType.SpriteFrame || loadInfo.bigType === BigAssetType.Texture2D || loadInfo.bigType === BigAssetType.SpriteAtlas
                        || loadInfo.bigType === BigAssetType.Spine) {
                        if (obj.refCount <= 0) {
                            const stack = new Error().stack;
                            console.warn('加载回调完，计数就是0，=', obj, stack);
                        }
                        if (obj instanceof cc.SpriteFrame) {
                            this.decRef(obj);
                            // if (obj.refCount <= 0) {
                            const texture = obj.getTexture();
                            if (texture) {
                                this.decRef(texture);
                            }
                            // }
                        } else if (obj instanceof cc.Texture2D) {
                            this.decRef(obj);
                        } else if (obj instanceof cc.SpriteAtlas) {
                            RemoveSpriteAtlas(obj);
                        } else if (obj instanceof sp.SkeletonData) {
                            RemoveSpine(obj);
                        }
                    }
                }
                loadInfo = null;
            }
        }
    }

    public getEditorSkillFrame(path: string, skillName: string): number[] {
        return this.resLoadPlist.getEditorSkillFrame(path, skillName);
    }

    /** 加载Gif */
    private loadGif(path: string, loadInfo: LoadInfo) {
        // const anyData: any = loadInfo.loadedData;
        // const gifData: GIF = anyData;
        // if (gifData && gifData.spriteFrames.length && gifData.spriteFrames[0] && gifData.spriteFrames[0].texture.isValid) {
        //     this.loadResultRemote(undefined, gifData as any, loadInfo);
        // } else {
        //     const filePath = this.getRealFilePath(path);
        //     this.time(`loadPlistUrl ${filePath}`);
        //     cc.assetManager.loadAny({ url: filePath }, (err, data: GIFFrameData) => {
        //         this.loadResultRemote(err, data, loadInfo);
        //     });
        // }
    }

    /** 加载其它 */
    private loadOther(loadInfo: LoadInfo) {
        this._loadRemote(loadInfo.path, (err, text: cc.Asset) => {
            this.loadResultRemote(err, text, loadInfo);
        });
    }

    public loadSpine(loadInfo: LoadInfo, callback: CompleteCallback<sp.SkeletonData>, target: object, ...args: any[]): void {
        this.resloadSpine.load(undefined, loadInfo, callback, target, ...args);
    }

    /** 加载精灵帧 */
    private loadSpriteFrame(loadInfo: LoadInfo) {
        this.resLoadSpriteFrame.load(loadInfo.path, loadInfo, this.loadResultRemote, this);
    }

    /** 加载贴图 */
    public loadTexture(path: string, loadInfo: LoadInfo, callback: CompleteCallback<cc.Texture2D>, target?: object, ...args: any[]) {
        this.resLoadTexture.load(path, loadInfo, callback, target, ...args);
    }

    public loadPlist<T>(path: string, loadInfo: LoadInfo, callback: CompleteCallback<T>, target?: object, plistName?: string, ...args: any[]): void {
        this.resLoadPlist.load(path, loadInfo, callback, target, plistName, ...args);
    }
    /**
    * 显示prefab
    * @param path prefab路径
    * @param parent 父节点
    * @param func 回调
    * @param resLoadOps 扩展可选参数 {target?, customData?, bundle?}
    */
    public showPrefab(path: string | string[], parent?: cc.Node, func?: (err, node: cc.Node, customData?: any) => void, resLoadOps?: IResLoadOps) {
        this.loadLocal(path, cc.Prefab, this.showPrefabResult, {
            target: this,
            customData: {
                parent, func, target: resLoadOps?.target, customData: resLoadOps?.customData,
            },
        });
    }

    /**
    * 显示prefab，只会添加一次，会检查
    * @param path prefab路径
    * @param parent 父节点
    * @param func 回调
    * @param resLoadOps 扩展可选参数 {target?, customData?, bundle?}
    */
    public showPrefabOnce(path: string, parent?: cc.Node, func?: (err, node: cc.Node, customData?: any) => void, resLoadOps?: IResLoadOps) {
        this.loadLocal(path, cc.Prefab, this.showPrefabResult, {
            target: this,
            customData: {
                parent, func, isOnce: true, target: resLoadOps?.target, customData: resLoadOps?.customData,
            },
        });
    }

    /**
     * 回调处理显示预制体结果
     * @param err 错误码
     * @param p 预制体
     * @param resultData 结果数据
     */
    private showPrefabResult(err: Error, p: cc.Prefab, resultData?: IShowPrefabResultData) {
        const func = resultData.func;
        const target = resultData.target;
        const parent = resultData.parent;
        /** 是否只添加一次 */
        const isOnce = resultData.isOnce;
        const customData = resultData.customData;
        if (err) {
            if (func) {
                func.call(target, err, undefined, customData);
            }
            return;
        }
        const t = new Date().getTime();
        const node = cc.instantiate(p);

        if (parent && !parent.isValid) {
            node.destroy();
            return;
        }
        /** 预制体拉回来后检查如果已经添加过相同的就不再添加了 */
        if (isOnce === true && parent?.getChildByName(node.name)) {
            node.destroy();
            return;
        }
        if (customData) {
            if (customData.pos) {
                node.setPosition(customData.pos.x, customData.pos.y);
            }
            node.attr({ _args: customData });
        }
        if (parent) {
            if (cc.isValid(parent)) {
                parent.addChild(node);
                // if (func) {
                func?.call(target, err, node, customData);
                if (node.name !== 'RedDot' && node.name) {
                    const endTime = new Date().getTime() - t;
                    if (node.name !== 'BagItemIcon') {
                        console.log(`【${node.name}】instanite+addChild时间:${endTime}毫秒`);
                        ModelMgr.I.GmModel.setPageTime(node.name, endTime);
                    }
                }
                // }
            } else {
                node.destroy();
            }
        } else if (func) {
            func.call(target, err, node, customData);
        }
    }

    /** 从贴图缓存表剔除某个贴图 */
    public removeTexture(uuid: string): void {
        this.resLoadTexture.delCache(uuid);
    }

    /** 从精灵帧缓存表剔除某个精灵帧 */
    public removeSpriteFrame(uuid: string): void {
        this.resLoadSpriteFrame.delCache(uuid);
    }
    /** 从精灵帧缓存表剔除某个精灵帧 */
    public removeSpriteAtlas(uuid: string): void {
        this.resloadSpriteAtlas.delCache(uuid);
    }
    /** 从精灵帧缓存表剔除某个精灵帧 */
    public removeSpine(uuid: string): void {
        this.resloadSpine.delCache(uuid);
    }
    /**
     * 减少资源的引用并尝试加入缓存机制
     * @param asset 资源
     * @param force 是否自动释放，不加入缓存机制，默认为false
     * @returns
     */
    public decRef(asset: IAssetEx, force?: boolean): void {
        if (!asset.addRef || !asset.isValid) {
            // eslint-disable-next-line no-debugger
            debugger;
        }
        const isShowLog = false;
        force = force || false;
        const time = force ? 0 : this.waitDeleteTime;
        asset.decRef(force);
        if (asset.refCount === 0) {
            // eslint-disable-next-line dot-notation
            let k: string = asset['_uuid'] || asset['_name'];
            if (asset instanceof cc.SpriteFrame) {
                k += '@cc.SpriteFrame';
            } else if (asset instanceof sp.SkeletonData) {
                k += '@sp.SkeletonData';
            } else if (asset instanceof cc.Texture2D) {
                k += '@cc.Texture2D';
            } else if (asset instanceof cc.SpriteAtlas) {
                k += '@cc.SpriteAtlas';
            }
            if (this.waitDelete[k] && this.waitDelete[k].asset !== asset) {
                if (isShowLog) {
                    console.log('待删除列表已存在相同key，释放掉原来的=', k, '计数=', this.waitDelete[k].asset.refCount);
                }
                this.removeAsset(this.waitDelete[k].asset, k);
            }
            if (time === 0) {
                if (isShowLog) {
                    console.log('时间到了，去释放=', k, '计数=', asset.refCount);
                }
                this.removeAsset(asset, k);
            } else {
                if (isShowLog) {
                    console.log('待删除列表新增 k=', k, '计数=', asset.refCount);
                }
                this.waitDelete[k] = { asset, time };
                this.startTimer();
            }
        }
    }

    private getAssetDeleteKey(asset: cc.Asset) {
        let k: string = asset['_uuid'] || asset['_name'];
        if (asset instanceof cc.SpriteFrame) {
            k += '@cc.SpriteFrame';
        } else if (asset instanceof sp.SkeletonData) {
            k += '@sp.SkeletonData';
        } else if (asset instanceof cc.Texture2D) {
            k += '@cc.Texture2D';
        } else if (asset instanceof cc.SpriteAtlas) {
            k += '@cc.SpriteAtlas';
        }
        return k;
    }

    public addAssetCaches(asset: cc.Asset): void {
        const k = this.getAssetDeleteKey(asset);
        this.waitDelete[k] = { asset, time: this.waitDeleteTime };
    }

    /** 启动定时器 */
    private startTimer(): void {
        if (this.checkResTimerId !== undefined && this.checkResTimerId !== null) {
            return;
        }
        this.checkResTimerId = TimerMgr.I.setInterval(this.checkAssetCaches, 200, this);
    }

    /** 停止定时器 */
    private stopTimer(): void {
        if (this.checkResTimerId !== undefined && this.checkResTimerId !== null) {
            TimerMgr.I.clearInterval(this.checkResTimerId);
            this.checkResTimerId = undefined;
        }
    }

    /** 移除资源 */
    private removeAsset(asset: cc.Asset, k?: string): void {
        if (asset instanceof cc.SpriteFrame) {
            const spriteFrame: ISpriteFrameEx = asset;
            if (spriteFrame._uuid && spriteFrame._name) {
                spriteFrame.decRef(true);
            } else {
                spriteFrame.destroy();
            }
            if (spriteFrame._uuid !== '') {
                this.removeSpriteFrame(spriteFrame._uuid);
            }
        } else if (asset instanceof cc.Texture2D) {
            const texture: ITexture2DEx = asset;
            texture.decRef(true);
            this.removeTexture(texture._uuid);
        } else if (asset instanceof cc.SpriteAtlas) {
            const spriteAtlas: ISpriteAtlasEx = asset;
            if (spriteAtlas._uuid !== '') {
                this.removeSpriteAtlas(spriteAtlas._uuid);
            }
            const removeTextureUuid: { [uuid: string]: any } = cc.js.createMap(true);
            spriteAtlas.getSpriteFrames().forEach((f) => {
                f.decRef(true);
                this.removeAsset(f);
                if (f.refCount <= 0) {
                    const texture: ITexture2DEx = f.getTexture();
                    const uuid: string = texture._uuid;
                    removeTextureUuid[uuid] = texture;
                }
                f = null;
            });
            for (const uuid in removeTextureUuid) {
                const texture = removeTextureUuid[uuid];
                texture.decRef(true);
                this.removeAsset(texture);
            }
            spriteAtlas.destroy();
        } else if (asset instanceof sp.SkeletonData) {
            // eslint-disable-next-line dot-notation
            if (asset['_uuid'] !== '') {
                // eslint-disable-next-line dot-notation
                this.removeSpine(asset['_uuid']);
            }
            asset.textures.forEach((texture) => {
                texture.decRef(true);
                this.removeAsset(texture);
            });
            asset.destroy();
            // }
        } else {
            asset.decRef(true);
        }
        if (k && this.waitDelete[k]) {
            delete this.waitDelete[k];
        }
    }

    private _checkCount: number = 0;
    /** 检查资源缓存 */
    private checkAssetCaches(): void {
        this._checkCount++;
        let isRemove = false;
        let data: { asset: cc.Asset, time: number };
        if (this._checkCount >= 5) {
            for (const k in this.waitDelete) {
                data = this.waitDelete[k];
                if (!data || data.asset.refCount > 0) {
                    delete this.waitDelete[k];
                } else if (data.time <= 0) {
                    // this.removeAsset(data.asset, k);
                    isRemove = true;
                } else {
                    data.time -= 1;
                }
            }
            this._checkCount = 0;
        }

        // eslint-disable-next-line dot-notation
        if (isRemove && window && window['getTextureMemory']) {
            // eslint-disable-next-line dot-notation
            const memory = window['getTextureMemory']();
            if (memory >= this.maxMemory) {
                console.log(`内存超过阈值 ${memory}mb/${this.maxMemory}mb`);
                console.log('this.waitDelete ', this.waitDelete);
                // console.log(`内存超过阈值 ${memory}mb/${this.maxMemory}mb`);
                // console.log('this.assetCaches ', this.assetCaches);
                for (const k in this.waitDelete) {
                    data = this.waitDelete[k];
                    if (data && data.asset?.isValid) {
                        this.removeAsset(data.asset, k);
                    } else {
                        delete this.waitDelete[k];
                    }
                }
                const tId = setTimeout(() => {
                    clearTimeout(tId);
                    // eslint-disable-next-line dot-notation, @typescript-eslint/restrict-template-expressions
                    console.log(`释放缓存后内存大小 ${window['getTextureMemory']()}mb/${this.maxMemory}mb`);
                }, 0);
                ResMgr.I.doGarbageCollect();
            }
        }

        if (isRemove) {
            ResMgr.I.doGarbageCollect();
        }
    }

    public doGarbageCollect(): void {
        const tId = setTimeout(() => {
            clearTimeout(tId);
            console.log(`释放缓存后内存大小 ${window['getTextureMemory']()}mb/${this.maxMemory}mb`);
            if (cc.sys.os === cc.sys.OS_IOS || cc.sys.os === cc.sys.OS_OSX) {
                // ios 手动调用 GC
                console.log('ios 手动调用 GC');
                cc.sys.garbageCollect();
            }
        }, 0);
    }

    /** http url统一在这加上 */
    // eslint-disable-next-line max-len
    public _loadRemote<T>(filePath: string, onComplete: (e: Error, obj: T, ...args: any[]) => void, target?: object, ...args: any[]): void {
        filePath = this.getRealFilePath(filePath);
        // this.time(`_loadRemote ${filePath}`);
        cc.assetManager.loadRemote(filePath, (e, obj: T) => {
            // this.timeEnd(`_loadRemote ${filePath}`);
            onComplete.call(target, e, obj, ...args);
        });
    }
    /** 根据文件路径获取远程服务器真实存储路径 */
    public getRealFilePath(filePath: string): string {
        if (filePath.indexOf('http://') === 0 || filePath.indexOf('https://') === 0) {
            return filePath;
        }
        const resUrl = this.getResUrl();
        return `${resUrl}/${filePath}`;
    }

    public setResUrl(url: string): void {
        this._ResUrl = url;
    }
    public getResUrl(): string {
        return this._ResUrl;
    }

    /** 析构接口 */
    public fini(): void {
        this.stopTimer();
    }

    private _debugNode: cc.Node = null;
    public showDebug(): void {
        const show = this._debugNode == null;
        if (show) {
            if (!this._debugNode || !this._debugNode.isValid) {
                const width = Math.floor(cc.visibleRect.width);
                const height = Math.floor(cc.visibleRect.height);
                this._debugNode = new cc.Node('DYNAMIC_ATLAS_DEBUG_NODE');
                this._debugNode.width = width;
                this._debugNode.height = height;
                this._debugNode.x = width / 2;
                this._debugNode.y = height / 2;
                this._debugNode.zIndex = cc.macro.MAX_ZINDEX;
                this._debugNode.parent = cc.director.getScene();
                cc.Camera['_setupDebugCamera']();

                const scroll = this._debugNode.addComponent(cc.ScrollView);

                const content = new cc.Node('CONTENT');
                const layout = content.addComponent(cc.Layout);
                // layout.type = cc.Layout.Type.HORIZONTAL;
                layout.type = cc.Layout.Type.VERTICAL;
                layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
                layout.spacingY = 10;
                content.width = width;
                content.height = height * 10;
                content.scaleX = 1;
                content.scaleY = 1;
                content.anchorY = 0.5;
                content.parent = this._debugNode;
                scroll.content = content;
                let n = 0;

                const len = Object.keys(this.waitDelete).length;
                for (const key in this.waitDelete) {
                    const d = this.waitDelete[key];
                    if (!(d.asset instanceof cc.Texture2D)) {
                        continue;
                    }
                    if (!d.asset['_texture']) {
                        continue;
                    }
                    n++;
                    const nodeName = new cc.Node(`图集名称${n}`);
                    nodeName.x = 0;
                    nodeName.y = 0;
                    const label = nodeName.addComponent(cc.Label);
                    label.string = `———————[${key}] (${n}/${len})———————`;
                    label.node.color = cc.Color.BLUE;
                    nodeName.parent = content;

                    const atlasNode = new cc.Node('atlas');
                    atlasNode.anchorX = 0;
                    atlasNode.x = -width / 2;
                    atlasNode.anchorY = 0.5;
                    atlasNode.width = d.asset.width;
                    atlasNode.height = d.asset.height;
                    const texture = d.asset;
                    const spriteFrame = new cc.SpriteFrame();
                    spriteFrame.setTexture(texture);
                    // spriteFrame[`_texture`] = texture; //未生效
                    atlasNode.addComponent(cc.Sprite);
                    const sp = atlasNode.getComponent(cc.Sprite);
                    sp.spriteFrame = spriteFrame;
                    spriteFrame['_calculateUV']();
                    atlasNode.parent = content;
                    atlasNode.scale = 1;
                }
            }
        } else if (this._debugNode) {
            this._debugNode.parent = null;
            this._debugNode = null;
        }
    }
}

if (CC_DEV) {
    // eslint-disable-next-line dot-notation
    window['ResMgr'] = ResMgr.I;
}

const __decRef = cc.Asset.prototype.decRef;
cc.Asset.prototype.decRef = function (force?: boolean) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const asset: cc.Asset = this;
    let r = false;
    if (asset instanceof cc.SpriteFrame
        || asset instanceof cc.Texture2D
        || asset instanceof cc.SpriteAtlas
        // || asset instanceof sp.SkeletonData
        || asset instanceof cc.Prefab) {
        r = true;
    }
    if (r && force !== true) {
        force = false;
        __decRef.call(this, force);
        if (this.refCount === 0) {
            ResMgr.I.addAssetCaches(this);
        }
    } else {
        __decRef.call(this, force);
    }
    return this;
};

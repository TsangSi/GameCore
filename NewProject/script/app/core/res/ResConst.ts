/*
 * @Author: zs
 * @Date: 2022-05-12 22:05:18
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-10 10:37:13
 * @FilePath: \SanGuo2.4\assets\script\app\core\res\ResConst.ts
 * @Description:
 */
import { Executor } from '../../base/executor/Executor';
import { UtilString } from '../../base/utils/UtilString';
import { BundleType } from './BundleMgr';

/** 图集里的精灵帧数据 */
export interface IFrameData { Rotated?: boolean, Frame?: number[][], Offset?: number[], SourceSize?: number[] }

export type CompleteCallback<T> = (err: Error | null, object?: T, ...args: any[]) => void
/** 模拟plist回来的object */

export interface IAssetEx extends cc.Asset {
    _uuid?: string,
    decRef: (autoRelease?: boolean) => cc.Asset
}
export interface ITexture2DEx extends cc.Texture2D {
    _uuid?: string
}
export interface ISpriteFrameEx extends cc.SpriteFrame {
    _uuid?: string
    _name?: string
    _original?: {
        _texture?: cc.Texture2D,
        _frame?: cc.SpriteFrame,
        _x?: number,
        _y?: number,
    }
}
export interface ISpriteAtlasEx extends cc.SpriteAtlas {
    _uuid?: string
}

export interface IAssetPrototype<T> {
    prototype: T
}

interface IPlistBase {
    frames: {
        [name: string]: {
            frame: string,
            offset: string,
            rotated: boolean,
            sourceColorRect: string,
            sourceSize: string
        }
    };
    metadata: {
        format: number
        realTextureFileName: string
        size: string
        smartupdate: string
        textureFileName: string
    }
}
export interface IPlistAsset extends cc.JsonAsset {
    _nativeAsset?: IPlistBase,
    _file?: IPlistBase,
    json: object
}
export interface IFrame {
    Frame: number[][],
    Offset: number[],
    Rotated: boolean,
    SourceSize: number[],
}

export interface IPlistFrame {
    [key: string]: IFrame
}
export interface IPlistJson {
    [key: string]: string
}

/** 资源加载可选参数 */
export interface IResLoadOps {
    /** 回调上下文this */
    target?: object,
    /** 自定义参数 */
    customData?: any,
    /** bundle名字 */
    bundle?: BundleType,
}

/** 显示prefab的扩展参数 */
export interface IShowPrefabCustomData {
    /** 显示位置 */
    pos?: cc.Vec2
}

export interface IShowPrefabResultData {
    parent?: cc.Node,
    func?: (err: Error, node: cc.Node, customData?: any) => void,
    isOnce?: boolean
    target?: any,
    customData?: IShowPrefabCustomData
}

/** 加载信息类 */
export class LoadInfo {
    /** 相对路径 */
    private _pathNoSuffix: string[] = [];
    /** 合并的json路径 */
    private _mergeJsonPathNoSuffix: string[] = [];

    private _pathNum = 0;
    /** 路径数量 */
    public get pathNum(): number {
        if (!this._pathNum) {
            this._pathNum = this._pathNoSuffix.length;
        }
        return this._pathNum;
    }
    /** 文件名 */
    private _name = '';
    public get name(): string {
        return this._name;
    }
    /** 文件后缀 */
    private _suffix = '';
    private _plistSuffix = '';
    /** 后缀(plist、json、frame、atlas等) */
    private get plistSuffix(): string {
        if (!this._plistSuffix) {
            const name = AssetType[this.type];
            this._plistSuffix = SpriteAtlasSuffix[name] as string;
        }
        return this._plistSuffix;
    }
    /** 文件类型 */
    public type: AssetType;
    public bigType: BigAssetType;
    /** 是否拷贝克隆的 */
    public isCopy = false;
    /** 回调器 */
    public complete: Executor;
    /** object */
    public loadedData: cc.Asset;
    /** 重试次数 */
    public retry = 0;
    /** 优先级 */
    public priority = 0;

    private _pathWithSuffix = '';
    /** 相对路径带路径 */
    public get path(): string {
        if (!this._pathWithSuffix) {
            this._pathWithSuffix = this.getPathByIndex();
        }
        return this._pathWithSuffix;
    }

    public get pathWithNoSuffix(): string {
        return `${this._pathNoSuffix[0] || ''}`;
    }

    private _plistWithSuffix = '';
    /** 图集用到的plist */
    public get plist(): string {
        if (!this._plistWithSuffix) {
            this._plistWithSuffix = this.getPlistByIndex();
        }
        return this._plistWithSuffix;
    }

    public constructor(pathNoSuffix: string | string[], suffix: string = ESuffix.Png) {
        if (pathNoSuffix) {
            if (typeof pathNoSuffix === 'string') {
                this._name = UtilString.GetFileName(pathNoSuffix);
                this._pathNoSuffix = [pathNoSuffix];
                if (pathNoSuffix.indexOf('action') >= 0) {
                    this._mergeJsonPathNoSuffix = [UtilString.ReplaceFileNameForAnim(pathNoSuffix, '_cfg')];
                }
            } else {
                this._name = UtilString.GetFileName(pathNoSuffix[0]);
                this._pathNoSuffix = pathNoSuffix;
                this._mergeJsonPathNoSuffix = [];
                for (let i = 0; i < pathNoSuffix.length; i++) {
                    if (pathNoSuffix[i].indexOf('action') >= 0) {
                        this._mergeJsonPathNoSuffix.push(UtilString.ReplaceFileNameForAnim(pathNoSuffix[i], '_cfg'));
                    }
                }
            }
            this._suffix = suffix;
        }
    }

    public getPathByIndex(index = 0): string {
        return `${this._pathNoSuffix[index] || ''}.${this._suffix}`;
    }

    public getPathNoSuffixByIndex(index = 0): string {
        return this._pathNoSuffix[index] || '';
    }

    public getPlistByIndex(index = 0): string {
        return `${this._pathNoSuffix[index] || ''}.${this.plistSuffix}`;
    }

    public getMergeJsonPath(index: number = 0): string {
        return `${this._mergeJsonPathNoSuffix[index] || ''}.${this.plistSuffix}`;
    }

    public static GetSuffixByType(type: AssetType): string {
        const name = AssetType[type];
        const suffix: string = AssetTypeSuffix[name];
        return suffix;
    }
}

/**
 * 资源大类型枚举,必须是10的倍数,不需要导出，只是内部使用
 */
export const enum BigAssetType {
    /** 精灵帧对象 */
    SpriteFrame = 10,
    /** 贴图纹理 */
    Texture2D = 20,
    /** json对象 */
    Json = 30,
    /** 文本对象 */
    Text = 40,
    /** 字体对象 */
    Font = 50,
    /** 预制体对象 */
    Prefab = 60,
    /** 音频对象 */
    AudioClip = 70,
    /** 这个类型表示material中所用到的资源   有可能只是一个贴图 */
    Material = 80,
    /** plist对象 */
    Plist = 90,
    /** 图集对象 */
    SpriteAtlas = 100,
    /** gif动态图 */
    // Gif = 110,
    /** spine动画 */
    Spine = 120,
}

/**
 * 后缀名
 */
const enum ESuffix {
    Png = 'png',
    Jpg = 'jpg',
    Json = 'json',
    Txt = 'txt',
    Bin = 'bin',
    Fnt = 'fnt',
    Prefab = 'prefab',
    Mp3 = 'mp3',
    Wav = 'wmv',
    Wma = 'Wma',
    Ogg = 'ogg',
    Flac = 'flac',
    Material = 'material',
    Plist = 'plist',
    Frame = 'frame',
    Pd = 'pd',
    Astc = 'astc',
    Gif = 'gif',
    Atlas = 'atlas'
}

/**
 * 资源小类型枚举
 */
export enum AssetType {
    /** .png的精灵帧对象 */
    SpriteFrame = 10, // BigAssetType.SpriteFrame,
    SpriteFrame_astc,
    /** .jpg的精灵帧对象 */
    SpriteFrame_jpg,
    /** .png的贴图纹理对象 */
    Texture2D = 20, // BigAssetType.Texture2D,
    /** .jpg的贴图纹理对象 */
    Texture2D_jpg,
    /** .json的json对象 */
    Json = 30, // BigAssetType.Json,
    /** .txt的文本对象 */
    Text = 40, // BigAssetType.Text,
    /** .bin的文本对象 */
    Text_bin,
    /** .font的字体对象 */
    Font = 50, // BigAssetType.Font,
    /** .prefab的预制体对象 */
    Prefab = 60, // BigAssetType.Prefab,
    /** .mp3的音频对象 */
    AudioClip = 70, // BigAssetType.AudioClip,
    /** .wav的音频对象 */
    AudioClip_wav,
    /** .wma的音频对象 */
    AudioClip_wma,
    /** .ogg的音频对象 */
    AudioClip_ogg,
    /** .flac的音频对象 */
    AudioClip_flac,
    /** 这个类型表示material中所用到的资源   有可能只是一个贴图 */
    Material = 80, // BigAssetType.Material,
    /** .plist的对象 */
    Plist = 90, // BigAssetType.Plist,
    /** .freme的对象 */
    Plist_frame,
    /** .plist & .png的图集对象 */
    SpriteAtlas = 100, // BigAssetType.SpriteAtlas,
    /** .frame & .pd的图集对象 */
    SpriteAtlas_pd,
    /** .json & .png的图集对象 */
    SpriteAtlas_json,
    /** 多个json合在一起 */
    SpriteAtlas_mergeJson,
    /** .json & .astc的图集对象 */
    SpriteAtlas_astc,
    SpriteAtlas_mergeJson_astc,
    Gif = 110,
    /** .atlas & .json & .png的spine动画 */
    Spine = 120,
    /** .atlas & .json & .astc的spine动画 */
    Spine_astc,

}

/** 图集信息文件后缀 */
enum SpriteAtlasSuffix {
    /** plist */
    SpriteAtlas = ESuffix.Plist,
    /** json */
    SpriteAtlas_json = ESuffix.Json,
    /** json */
    SpriteAtlas_mergeJson = ESuffix.Json,
    /** frame */
    SpriteAtlas_pd = ESuffix.Frame,
    SpriteAtlas_astc = ESuffix.Json,
    SpriteAtlas_mergeJson_astc = ESuffix.Json,
    /** altas */
    Spine = ESuffix.Atlas,
    Spine_astc = ESuffix.Atlas,
}

/**
 * 资源类型对应的后缀
 */
enum AssetTypeSuffix {
    /** png */
    SpriteFrame = ESuffix.Png,
    /** jpg */
    SpriteFrame_jpg = ESuffix.Jpg,
    /** png */
    Texture2D = ESuffix.Png,
    /** jpg */
    Texture2D_jpg = ESuffix.Jpg,
    Json = ESuffix.Json,
    Text = ESuffix.Txt,
    Text_bin = ESuffix.Bin,
    Font = ESuffix.Fnt,
    Prefab = ESuffix.Prefab,
    AudioClip = ESuffix.Mp3,
    AudioClip_wav = ESuffix.Wav,
    AudioClip_wma = ESuffix.Wma,
    AudioClip_ogg = ESuffix.Ogg,
    AudioClip_flac = ESuffix.Flac,
    Material = ESuffix.Material,
    Plist = ESuffix.Plist,
    Plist_frame = ESuffix.Frame,
    SpriteAtlas = ESuffix.Png,
    SpriteAtlas_pd = ESuffix.Pd,
    SpriteAtlas_json = ESuffix.Png,
    SpriteAtlas_mergeJson = ESuffix.Png,
    SpriteAtlas_astc = ESuffix.Astc,
    SpriteAtlas_mergeJson_astc = ESuffix.Astc,
    Gif = ESuffix.Gif,
    Spine = ESuffix.Png,
    Spine_astc = ESuffix.Astc,
    SpriteFrame_astc = ESuffix.Astc,
}

/**
 * @en Image source in memory
 * @zh 内存图像源。
 */
export interface IMemoryImageSource {
    _data: ArrayBufferView | null;
    _compressed: boolean;
    width: number;
    height: number;
    format: number;
}

/**
 * @en The image source, can be HTML canvas, image type or image in memory data
 * @zh 图像资源的原始图像源。可以来源于 HTML 元素也可以来源于内存。
 */
export type ImageSource = HTMLCanvasElement | HTMLImageElement | IMemoryImageSource | ImageBitmap;

export interface IResBase {
    _loadRemote: <T>(filePath: string, onComplete: (e: Error, obj: T, ...args: any[]) => void, target?: object, ...args: any[]) => void
    loadTexture: (path: string, loadInfo: LoadInfo, callback: CompleteCallback<cc.Texture2D>, target?: object, ...args: any[]) => void
    loadPlist: <T>(path: string, loadInfo: LoadInfo, callback: CompleteCallback<T>, target?: object, plistName?: string, ...args: any[]) => void
    loadSpine: (loadInfo: LoadInfo, callback: CompleteCallback<sp.SkeletonData>, target: object, ...args: any[]) => void
    decRef: (asset: cc.Asset, force?: boolean) => void
}

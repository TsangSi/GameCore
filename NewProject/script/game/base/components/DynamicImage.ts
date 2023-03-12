/*
 * @Author: hwx
 * @Date: 2022-05-11 18:19:47
 * @FilePath: \SanGuo\assets\script\game\base\components\DynamicImage.ts
 * @Description: 动态图片,支持本地和远程URL
 */
import { UtilCocos } from '../../../app/base/utils/UtilCocos';
import { UtilString } from '../../../app/base/utils/UtilString';
import BaseCmp from '../../../app/core/mvc/view/BaseCmp';
import { AssetType } from '../../../app/core/res/ResConst';

const {
    ccclass, property, requireComponent, menu,
} = cc._decorator;

/** 图片类型枚举 */
export enum ImageType { UNKNOWN, PNG, JPG }

@ccclass
@requireComponent(cc.Sprite)
@menu('常用组件/DynamicImage')
export class DynamicImage extends BaseCmp {
    @property
    private _path: string = '';
    @property({ displayName: '图片路径', tooltip: '路径不需要带文件后缀' })
    protected get path(): string { return this._path; }
    protected set path(value: string) {
        this._path = value;
        if (CC_EDITOR) {
            this.preview = false;
            this.remote = false;
            this.type = ImageType.UNKNOWN;

            // 修改图片路径后重置配置
            if (this.sprite.spriteFrame) {
                this.sprite.spriteFrame = null;
            }
        }
    }

    @property
    private _type: ImageType = ImageType.UNKNOWN;
    @property({
        type: cc.Enum(ImageType),
        displayName: '图片类型',
    })
    protected get type(): ImageType { return this._type; }
    protected set type(value: ImageType) {
        this._type = value;
        if (this._type !== ImageType.UNKNOWN && !this.remote) {
            this.loadImage(this.path, value, this.remote, this.bundle);
        }
    }

    @property({ displayName: '远程' })
    protected remote: boolean = false;

    @property({ displayName: '九宫格' })
    protected border: boolean = false;

    @property
    private _preview: boolean = false;
    @property({
        displayName: '预览',
        tooltip: '只在编辑器模式生效',
        visible(this: DynamicImage) {
            const val = CC_EDITOR && this.remote;
            if (!val) { this._preview = false; } // 隐藏后恢复默认值
            return val;
        },
    })
    protected get preview(): boolean { return this._preview; }
    protected set preview(value: boolean) {
        // 非编辑器开发环境一定为 false
        this._preview = CC_EDITOR ? value : false;
        if (this._preview) {
            this._startLoad = true;
            this.loadImage(this.path, this.type, this.remote, this.bundle, this.border);
        } else {
            this.sprite.spriteFrame = null;
        }
    }

    @property({
        displayName: '资源包',
        tooltip: '资源所在的资源包',
        visible(this: DynamicImage) {
            const val = CC_EDITOR && !this.remote;
            if (!val) { this.bundle = 'resources'; } // 隐藏后恢复默认值
            return val;
        },
    })
    protected bundle: string = 'resources';

    private _sprite: cc.Sprite = null;
    protected get sprite(): cc.Sprite {
        if (!this._sprite) {
            this._sprite = this.getComponent(cc.Sprite);
        }
        return this._sprite;
    }

    private _startLoad: boolean = false;
    protected start(): void {
        super.start();

        // 如果编辑器中设置了必要值，加载时就自动开始计时
        if (this.path.length > 0) {
            this._startLoad = true;
            this.loadImage(this.path, this.type, this.remote, this.bundle, this.border);
        }
    }

    /**
     * 加载图片
     * @param path 图片地址
     * @param type 图片类型，默认 0 未知, 1 PNG, 2 JPG
     * @param remote 是否远程，默认false
     * @param bundle 资源包，默认 cc.resources
     * @param border 是否开启9宫格 boolean 默认flash
     * @param cb 回调
     */
    public loadImage(
        path: string,
        type?: ImageType | number,
        remote?: boolean,
        bundle = 'resources',
        border: boolean = false,
        cb: () => void = null,
    ): void {
        /** 重复加载过滤 */
        if (path === this.path && !this._startLoad) return;
        this._startLoad = false;
        this._path = path; // 不触发setter
        this._type = type;
        this.remote = remote;
        this.bundle = bundle;
        this.border = border;
        // 检查加载的图片参数
        if (!this.path || this.path.length === 0) {
            cc.warn('DynamicImage.loadImage: path is null');
            return;
        }

        if (remote) {
            let assetType: AssetType;
            if (type === 1) {
                assetType = AssetType.SpriteFrame;
            } else if (type === 2) {
                assetType = AssetType.SpriteFrame_jpg;
            } else {
                cc.warn('DynamicImage.loadImage: assetType unknown');
                return;
            }
            if (border) {
                const borde = this.setBorder(this._path);
                this.sprite.type = cc.Sprite.Type.SLICED;
                UtilCocos.LoadSpriteFrameRemote(this.sprite, path, assetType, cb || this.loadComplete.bind(this), borde);
            } else {
                UtilCocos.LoadSpriteFrameRemote(this.sprite, path, assetType, cb || this.loadComplete.bind(this));
            }
        } else if (CC_EDITOR) {
            this.loadSpriteFrameInEditor(this.sprite, path);
        } else {
            UtilCocos.LoadSpriteFrame(this.sprite, path, cb || this.loadComplete.bind(this), this.bundle);
        }
    }

    /**
     * 根据文件名设置9宫格模式参数
     * 带
     */
    public setBorder(fileName: string): number[] {
        const bordeData = fileName.split('@9')[1];
        const borde: string[] = JSON.parse(UtilString.replaceAll(bordeData, '_', ','));
        if (borde.length < 4) {
            console.warn('DynamicImage.loadImage: 九宫格图片名字解析出错,使用默认九宫格数据', bordeData[1]);
            return [0, 0, 0, 0];
        }
        const bordeInt: number[] = [];
        borde.forEach((e, i) => {
            bordeInt[i] = parseInt(e);
        });
        return bordeInt;
    }

    /**
     * 加载图片完成
     */
    private loadComplete(): void {
        // 编辑器模式刷新预览
        if (this.preview && CC_EDITOR) {
            // Editor.Selection.unselect('node', this.node.uuid);
            // Editor.Selection.clear('node');
            // Editor.Selection.select('node', this.node.uuid);
        }
    }

    /**
     * 编辑器模式加载精灵帧
     * @param sprite
     * @param path
     */
    private loadSpriteFrameInEditor(sprite: cc.Sprite, path: string): void {
        if (this.type === ImageType.UNKNOWN) return; // 未知类型不刷新
        const ext = ['', '.png', '.jpg'][this.type];
        const url = `db://assets/cc.resources/${path}${ext}/spriteFrame`;
        // Editor.Message.request('asset-db', 'query-uuid', url).then((uuid) => {
        //     if (!uuid || sprite.spriteFrame && sprite.spriteFrame['_uuid'] === uuid) return;
        //     Editor.Message.send('scene', 'set-property', {
        //         uuid: this.node.uuid,
        //         path: '__comps__.1.spriteFrame',
        //         dump: {
        //             type: 'cc.SpriteFrame',
        //             value: {
        //                 uuid,
        //             },
        //         },
        //     });
        // }).catch((err) => {
        //     console.error(err);
        // });
    }

    // 默认png路径
    public pngPath(path: string): void {
        this.loadImage(path, 1, true);
    }
}

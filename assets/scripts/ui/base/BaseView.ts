/* eslint-disable max-len */
/* eslint-disable dot-notation */
import {
 Asset, assetManager, CCBoolean, Component, js, Node, Sprite, SpriteFrame, _decorator, __private,
} from 'cc';
import { EventM } from '../../common/EventManager';
import { ResManager } from '../../common/ResManager';
import { BundleType } from '../../global/GConst';
import Utils from '../../utils/Utils';
import UtilsCC from '../../utils/UtilsCC';
// import Utils from '../utils/Utils';
import {
 PAGE_NAME, UIInfo, UIType, UI_NAME,
} from '../UIConfig';
// import UIManager from '../UIManager';
/** 界面基础类 */
const { ccclass, property } = _decorator;

@ccclass('BaseView')
export class BaseView extends Component {
    /** 该界面的uid */
    private __uid: UI_NAME;

    public ClassName = 'BaseView';

    private __uiInfo: UIInfo;
    /** 监听事件列表，destroy会自动移除监听 */
    private __ons: (string | ((...args: any[]) => void))[][] = [];
    /** 监听单次事件列表，destroy会自动移除监听 */
    private __onces: (string | ((...args: any[]) => void))[][] = [];
    /** 用于计算update的1秒时长 */
    private __oneSecond = 1;
    /** 该界面存活时长 */
    private __existTime = 0;
    /** 界面扩展参数 */
    private __args: { [key: string]: unknown; } = undefined;
    /** 移除等待10秒 */
    private __destroyWaitTime = 10;
    public Win: Node = undefined;
    public isWin = false;

    private EMI = EventM.I;
    private ResCache: Asset[] = [];
    private ResBundleCache: Asset[] = [];

    // private _current_frame_index = 0;
    // @property({
    //     type: CCInteger,
    //     displayName: 'Current Show Sprite Frame Index',
    //     tooltip: DEV && '当前显示的sprite frame',
    //     serializable: true,
    // })
    // get current_frame_index () {
    //     return this._current_frame_index;
    // }
    // set current_frame_index (value: number) {
    //     this._current_frame_index = value;
    //     this.__apply_current_sprite_frame();
    // }

    private _isShowPreWin = false;
    @property({
        type: CCBoolean,
        serializable: true,
    })
    public get isShowPreWin(): boolean {
        return this._isShowPreWin;
    }
    public set isShowPreWin(show: boolean) {
        this._isShowPreWin = show;
        if (show) {
            const preWin = new Node();
            preWin.name = 'PreWin';
            this.node.addChild(preWin);
            preWin.setSiblingIndex(0);

            const paramInfo = {
                parent: preWin.uuid,
                assetUuid: 'd45e823b-1ea3-4bb1-8704-a4a52ced4ab3',
                name: 'Win.Prefab',
                type: 'cc.Prefab',
            };
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            Editor.Message.request('scene', 'create-node', paramInfo).then((uuid) => {
                setTimeout(() => {
                    Editor.Selection.unselect('node', uuid);
                    Editor.Selection.clear('node');
                    Editor.Selection.select('node', this.node.uuid);

                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    Editor.Message.request('scene', 'query-node', this.node.uuid);
                    preWin.getChildByName('Win').getChildByName('Frame').getChildByName('WinTitle').active = true;
                }, 200);
            });
        } else {
            const preWin = this.node.getChildByName('PreWin');
            if (preWin) {
                preWin.destroy();
            }
        }
    }

    protected walkUIInfo(): void {
        if (!this.__uiInfo) {
            this.__uiInfo = UtilsCC.getNodeAttr(this.node, '_ui_info') || js.createMap(true);
        }
    }

    /**
     * 父类监听事件，destroy会自动移除监听
     * @param manager 模块事件管理对象
     * @param event 模块事件名
     * @param func 回调
     */
    protected on(event: string, func: (...args) => void): void {
        this.EMI.on(event, func, this);
        this.__ons.push([event, func]);
    }

    /**
     * 获取扩展参数
     * @param key 参数名
     * @returns 参数值
     */
    protected getArg<T>(key: string, force = false): T {
        if (!this.__args || force) {
            this.__args = Utils.getNodeAttr(this.node, '_args') || js.createMap(true);
        }
        return this.__args[key] as T;
    }

    protected once(event: string, func: (...args) => void): void {
        this.EMI.once(event, func, this);
        this.__onces.push([event, func]);
    }
    protected setSpriteLocal(sprite: Sprite, url: string, callback?: (sp: Sprite) => void, bundleName?: BundleType): void;
    protected setSpriteLocal(node: Node, url: string, callback?: (sp: Sprite) => void, bundleName?: BundleType): void;
    protected setSpriteLocal(path: string, refNode: Node, url: string, callback?: (sp: Sprite) => void, bundleName?: BundleType): void;
    protected setSpriteLocal(path, refNode, url, callback?, bundleName?): void {
        if (!callback && typeof url === 'function') {
            callback = url;
        }
        UtilsCC.setSpriteLocal(path, refNode, url, (sp) => {
            if (sp) {
                if (bundleName) {
                    // sp.spriteFrame.addRef();
                    this.ResCache.push(sp.spriteFrame);
                } else {
                    this.ResBundleCache.push(sp.spriteFrame);
                }
                const func = callback as (sp: Sprite) => void;
                if (func) {
                    func(sp);
                }
            }
        }, bundleName);
    }

    protected setSprite(sprite: Sprite, url: string, callback?: (sp: Sprite) => void): void;
    protected setSprite(node: Node, url: string, callback?: (sp: Sprite) => void): void;
    protected setSprite(path: string, refNode: Node, url: string, callback?: (sp: Sprite) => void): void;
    protected setSprite(path, refNode, url, callback?): void {
        if (!callback && typeof url === 'function') {
            callback = url;
        }
        UtilsCC.setSprite(path, refNode, url, (sp) => {
            if (sp) {
                // sp.spriteFrame.addRef();
                // this.ResCache.push(sp.spriteFrame);
                const func = callback as (sp: Sprite) => void;
                if (func) {
                    func(sp);
                }
            }
        });
    }

    protected loadSpriteFrame(path: string, callback: (err: Error, spriteframe: SpriteFrame) => void, customData?: unknown, bundleName?: BundleType): void {
        this.load(path, SpriteFrame, callback, customData, bundleName);
    }

    // eslint-disable-next-line camelcase
    protected load(path: string, type: __private._cocos_core_asset_manager_shared__AssetType<Asset>, callback: (err: Error, asset: Asset) => void, customData?: unknown, bundle?: BundleType): void {
        if (!path || !callback) { return; }
        ResManager.I.load(path, type, (err: Error, asset: Asset) => {
            if (!err && asset) {
                // if (type != Prefab) {
                asset.addRef();
                this.ResCache.push(asset);
                // }
                callback.call(this, err, asset);
            }
        }, this, customData, bundle);
    }

    /**
     * 子类重写的话，要写super.onDestroy();
     */
    protected onDestroy(): void {
        this.__ons.forEach((e) => {
            this.EMI.off(e[0] as string, e[1] as (...args) => void, this);
        });
        this.__ons.length = 0;

        this.__onces.forEach((e) => {
            this.EMI.off(e[0] as string, e[1] as (...args) => void, this);
        });
        this.__onces.length = 0;

        this.ResCache.forEach((res) => {
            res.decRef();
            if (res instanceof SpriteFrame) {
                if (res.texture && res.texture._uuid) {
                    res.texture.decRef();
                }
            }
            res = null;
        });
        this.ResCache.length = 0;

        this.ResBundleCache.forEach((res) => {
            assetManager.releaseAsset(res);
        });
        this.ResBundleCache.length = 0;
    }

    /** 帮助 */
    protected onHelpClicked(): void {
        console.log(`显示帮助说明面板=${this._getHelpId()}`);
    }

    /** 关闭 */
    public onCloseClicked(): void {
        this.close();
    }

    /**
     * 关闭界面统一走这里
     * 子类重写的话，要写super.close();
     */
    protected close(): void {
        this.walkUIInfo();
        this.__uid = this.__uiInfo.name;
        if (this.__uid) {
            // UIManager.I.close(this.__uid);
            EventM.I.fire(EventM.Type.UI.Close, this.__uid);
            this.__uid = undefined;
        }
    }

    /** 获取destroy等待时间 */
    protected _getDestroyWaitTime(): number {
        return this.__destroyWaitTime;
    }

    /** 获取ui类型 */
    protected _getUIType(): UIType {
        this.walkUIInfo();
        return this.__uiInfo.uiType;
    }

    /** 获取说明文档id */
    protected _getHelpId(): number {
        this.walkUIInfo();
        return this.__uiInfo.helpId || 0;
    }

    /** 获取标题 */
    protected _getTitle(): string {
        this.walkUIInfo();
        return this.__uiInfo.title || '';
    }

    /** 是否隐藏返回按钮 */
    protected _isHideBack(): boolean {
        this.walkUIInfo();
        return this.__uiInfo.hideBack === true;
    }

    /** 获取页签数量 */
    protected _getPagesLength(): number {
        this.walkUIInfo();
        if (this.__uiInfo.pages && this.__uiInfo.pages.length) {
            return this.__uiInfo.pages.length;
        }
        return 0;
    }

    /** 获取页签key */
    protected _getPagesName(index: number): PAGE_NAME {
        this.walkUIInfo();
        return this.__uiInfo.pages[index];
    }

    /**
     * 子类需要计时器的话可重写updateS
     * @param existTime 存活时长
     */
    protected updateS(existTime: number): void {
        //
    }
    protected update(dt: number): void {
        if (this.__oneSecond > 0) {
            this.__oneSecond -= dt;
        } else {
            this.__oneSecond = 1;
            this.__existTime++;
            this.updateS(this.__existTime);
        }
    }
}

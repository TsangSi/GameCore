import {
 Component, Enum, Sprite, SpriteFrame, sys, _decorator,
} from 'cc';
import { EDITOR } from 'cc/env';
import { ResManager } from '../common/ResManager';
import GlobalConfig from '../config/GlobalConfig';
import { AssetType, LoadImgType } from '../global/GConst';
import { BaseView } from '../ui/base/BaseView';
import autoDraw from '../utils/autoDraw';
import UtilsCC from '../utils/UtilsCC';
import UtilsPlatform from '../utils/UtilsPlatform';

const { ccclass, menu, property } = _decorator;

@ccclass
@menu('自定义组件/LoadTexture')
export default class LoadTexture extends BaseView {
    // @property
    // AtlasName: string = '';

    @property
    private SpriteName = '';
    @property({
        type: Enum(LoadImgType),
    })
    private suffix = LoadImgType.Png;

    // sizeModel
    @property({
        type: Sprite.SizeMode,
    })
    private sizeMode = Sprite.SizeMode.CUSTOM;

    @property
    private _inEditor = false;
    @property({
        displayName: '是否在编辑器中显示',
    })
    public get inEditor(): boolean {
        return this._inEditor;
    }
    public set inEditor(val: boolean) {
        if (EDITOR) {
            if (val) {
                this.showImg();
            } else {
                const s = this.node.getComponent(Sprite);
                if (s) { s.spriteFrame = null; }
            }
        }
        this._inEditor = val;
    }
    @property
    private trim = false;

    // 是否为九宫格
    @property
    private isSliced = false;
    // 顶部
    @property
    private insetTop = -1;
    // 底部
    @property
    private insetBottom = -1;
    // 左边
    @property
    private insetLeft = -1;
    // 右边
    @property
    private insetRight = -1;

    // 在我们自己的app包不生效
    @property
    private notLoadOnApp = false;

    protected start(): void {
        // ios
        if (this.notLoadOnApp) {
            if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.submitFromWeb) {
                return;
            }
            // 安卓
            if (window.WebViewJavascriptBridge) {
                return;
            }
            if (UtilsPlatform.isWechatGame()) {
                return;
            }
        }
        this.showImg();
    }

    private showImg() {
        if (this.SpriteName.indexOf('|') === -1) {
            this.getImage();
        } else {
            this.getAtlasImg();
        }
    }

    private getImage() {
        const tempStrArr: Array<string> = this.SpriteName.split('.');
        let suffix = '.png';
        if (this.suffix === LoadImgType.Jpg) {
            suffix = '.jpg';
        }
        let aimStr = this.SpriteName;
        if (tempStrArr.length === 1) {
            aimStr = tempStrArr[0] + suffix;
        }
        this.SpriteName = aimStr;

        const w = UtilsCC.getWidth(this.node);
        const h = UtilsCC.getHeight(this.node);
        this.setSprite(this.node, aimStr, (sp) => {
            // sp.trim = this.trim;
            // sp.sizeMode = this.sizeMode;
            if (this.isSliced) {
                sp.type = Sprite.Type.SLICED;
                sp.spriteFrame.insetBottom = this.insetBottom;
                sp.spriteFrame.insetTop = this.insetTop;
                sp.spriteFrame.insetLeft = this.insetLeft;
                sp.spriteFrame.insetRight = this.insetRight;
            }
            UtilsCC.setSize(this.node, w, h);
            // if (this.node.getComponent(autoDraw)) {
            //     this.node.getComponent(autoDraw).setPosition();
            // }
        });
        // item.suffix = this.suffix;
    }

    /**
     * SpriteName --- "texture/roleUI/taoZhuang|bg_wuping"
     */
    private getAtlasImg() {
        // let altasArr: Array<string> = this.SpriteName.split("|");
        // let act1 = cc.delayTime(0.5);
        // let act2 = cc.callFunc(() => {
        //     ResMgr.I.getAtlasImageItem(altasArr[0], altasArr[1], (sf: cc.SpriteFrame, addData: any) => {
        //         let a = this.node.getComponent(cc.Sprite);
        //         if (!a) {
        //             a = this.node.addComponent(cc.Sprite);
        //         }
        //         a.trim = false;
        //         a.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        //         a.spriteFrame = sf;
        //     }, this);
        // }, this);
        // let seq = cc.sequence(act1, act2);
        // this.node.runAction(seq);
        // this.SpriteName = altasArr[0];
    }
}

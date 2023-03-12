/* eslint-disable no-lonely-if */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable consistent-return */
/* eslint-disable dot-notation */
import CCFrameBlockSync from '../../../game/base/atlas/CCFrameBlockSync';
import { CompUtil } from '../atlas/CompUtil';
import { FrameBlockUtil } from './FrameBlockUtil';
import { RenderImg } from './RenderImg';

export class FrameBlockMgr {
    public openFrameBlock: boolean = true;// true 打开 false 关闭
    // public openFrameBlock: boolean = false;// true 打开 false 关闭

    private static _i: FrameBlockMgr = null;
    public static get I(): FrameBlockMgr {
        if (this._i == null) {
            this._i = new FrameBlockMgr();
            this._i._init();
        }
        return this._i;
    }

    private _init() {
        if (CC_EDITOR) return;
        if (!this.openFrameBlock) return;
        this._labelArr = [];
        this._labelUuidArr = [];
        this._injectWindowFunc();
    }

    private _labelArr: cc.Label[];
    private _labelUuidArr: string[];

    private _rtQueue: { [name: string]: cc.RichText; } = {};

    /* 分帧注入 */
    private _injectWindowFunc() {
        if (CC_EDITOR) return;
        /** 阻断富文本 */
        window[`blockRichTextRender`] = (rt: cc.RichText) => {
            if (!this.openFrameBlock) {
                return false;
            }
            if (CC_EDITOR) return false;// 编辑器模式不阻断
            // if (cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative) return false;//ios原生返回
            if (!rt.node) return false;

            const CCFRAMEBLOCK = rt.node.getComponent('CCFRAMEBLOCK');// 有特殊标记的不处理
            if (CCFRAMEBLOCK) return false;
            return true;// 默认阻断渲染 //大部分的richText都需要处理
        };
        /** 放入池子里 */
        // eslint-disable-next-line dot-notation
        window[`pushRTIntoQueue`] = (rt: cc.RichText) => {
            const uuid = CompUtil.createRichTextUuid(rt);
            if (rt.node && rt.node.getComponent(CCFrameBlockSync)) {
                RenderImg.I.richText2Img(rt);
            } else {
                this._rtQueue[uuid] = rt;
            }
        };

        // 阻断Label渲染
        // eslint-disable-next-line dot-notation
        window[`blockLabelRender`] = (lab: cc.Label) => {
            if (!(lab instanceof cc.Label)) return false;

            if (!this.openFrameBlock) {
                return false;
            }

            if (CC_EDITOR) return false;
            // if (cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative) return false;
            if (!lab.node) return false;
            // 部分特殊的可能需要使用系统字体
            const CCFRAMEBLOCK = lab.node.getComponent('CCFRAMEBLOCK');// 有特殊标记的不处理
            if (CCFRAMEBLOCK) return false;

            if (lab['_N$file'] && lab['_N$file'] instanceof cc.BitmapFont) return false;

            // if (lab.font instanceof cc.BitmapFont) return true;
            // if (lab.font == null && !lab.useSystemFont) lab.useSystemFont = true;
            // if (lab.font != null || !lab.useSystemFont) return false;

            if (lab[`_N$file`] && lab[`_N$file`] instanceof cc.BitmapFont) {
                return false;// 富文本不做处理
            }

            switch (lab.node.name) {
                case 'RIGHT-PANEL':// DrawCall
                case 'LEFT-PANEL':// DrawCall
                case 'RICHTEXT_CHILD':// 处理label时不考虑富文本
                case 'PLACEHOLDER_LABEL':// EditBox
                case 'TEXT_LABEL':// EditBox
                    return false;// 被覆盖，导致无法屏蔽
                default:
                    return true;
            }
            // return true;
        };

        // 阻断之后放入队列
        window[`pushLabelIntoQueue`] = (lab: cc.Label) => {
            if (lab.node && lab.node.getComponent(CCFrameBlockSync)) {
                RenderImg.I.label2Img(lab);
            } else {
                if (this._labelUuidArr.indexOf(lab.uuid) === -1) {
                    this._labelUuidArr.push(lab.uuid);
                    this._labelArr.push(lab);
                }
            }
        };
    }

    /** 每一帧渲染16个Label */
    private _loadLabelString(): boolean {
        if (CC_EDITOR) return;

        let lab: cc.Label = null;
        // || (lab["_isSystemFontUsed"] == false && !(lab.font instanceof cc.BitmapFont))
        while (lab == null || lab.node == null || cc.isValid(lab.node) === false || lab.node.isValid === false) {
            if (this._labelArr.length < 1) return false;
            lab = this._labelArr.shift();
            const i = this._labelUuidArr.indexOf(lab.uuid);
            if (i > -1) {
                this._labelUuidArr.splice(i, 1);
            }
        }

        // const bmfont = lab.node.getCom('bmFont');
        // if (bmfont) return true;

        const _oldString = lab['oldString'];
        const _colorNew = lab.node.color.toString();
        const _oldColor = lab.node['oldColor'];

        const oldFontFamily = lab['oldFontFamily'];
        let fontFamily = 'Microsoft YaHei';
        if (lab['_N$file']?._fontFamily) fontFamily = lab['_N$file']._fontFamily;

        if (lab.string === _oldString && _colorNew === _oldColor && fontFamily === oldFontFamily) {
            return true;
        }
        lab['oldString'] = lab.string;
        lab.node['oldColor'] = lab.node.color.toString();
        lab['oldFontFamily'] = fontFamily;

        return RenderImg.I.label2Img(lab);
    }

    public lateUpdate(dt: number = 0): void {
        if (CC_EDITOR) return;

        if (!this.openFrameBlock) return;
        let n = 0;
        while (n < 16) { // 每帧处理label个数
            if (!this._loadLabelString()) {
                n++;
            }
        }
        n = 0;
        for (const key in this._rtQueue) {
            const richText = this._rtQueue[key];
            if (richText && richText.node) {
                RenderImg.I.richText2Img(richText);
            }
            delete this._rtQueue[key];
            n++;
            if (n >= 3) break;
        }

        if (RenderImg.I.labelPool.size() < 50) {
            RenderImg.I.labelPool.put(FrameBlockUtil.createRandomNode());
        }
    }
}

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable dot-notation */
/*
 * @Author: zs
 * @Date: 2022-08-03 16:50:46
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\reddot\RedDot.ts
 * @Description:
 *
 */
import { i18n, Lang } from '../../../i18n/i18n';
import { ERedDotStyle } from './RedDotConst';
import { RedDotMgr } from './RedDotMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class RedDot extends cc.Component {
    /** 红点上的文本 */
    @property(cc.Label)
    private Label: cc.Label = null;

    /** 样式有三种：无数字  有'新'字  有数字' 0--n' */
    private _style: ERedDotStyle = ERedDotStyle.Nor;
    @property({ type: cc.Enum(ERedDotStyle) })
    public set style(style: ERedDotStyle) {
        this.changeStyle(style);
    }
    public get style(): ERedDotStyle {
        return this._style;
    }

    public onLoad(): void {
        // 父节点变化
        // 目前2.x只有 const CHILD_ADDED = 'child-added';
        // const CHILD_REMOVED = 'child-removed';
        this.node.on('parent-changed', this._onPutPool, this);
    }

    private _onPutPool(oldParent: any): void {
        if (!oldParent) return;// 若是新增红点,则无需重置
        const spf: cc.SpriteFrame = this.node.getComponent(cc.Sprite).spriteFrame;
        if (spf) {
            spf[`_resetDynamicAtlasFrame`]();
            spf['AD_KEY'] = '';
            spf['LAB_UUID'] = '';
        }
    }

    /** 红点id */
    private _rid: number;
    public get rid(): number {
        return this._rid;
    }
    public set rid(rid: number) {
        if (this._rid === rid) { return; }
        this._rid = rid;
        const num = RedDotMgr.I.getRedCount(rid);
        this.onUpdateRed(num > 0, num);
    }

    /** 根据不同样式更新UI */
    private changeStyle(style: ERedDotStyle) {
        if (this._style === style || style === undefined || style === null) { return; }
        this._style = style;
        this.Label.node.active = style !== ERedDotStyle.Nor;
        if (style === ERedDotStyle.New) {
            this.Label.string = i18n.tt(Lang.com_str_new);
        } else if (style === ERedDotStyle.Num) {
            this.Label.string = '1';
        }
    }

    private _limitNum = 99;
    public setData(rid: number, style?: ERedDotStyle, limitNum: number = 99): void {
        this.changeStyle(style);
        this.rid = rid;
        this._limitNum = limitNum;
        if (this.rid !== undefined) {
            RedDotMgr.I.off(rid, this.onUpdateRed, this);
            RedDotMgr.I.on(rid, this.onUpdateRed, this);
        }
    }

    /** 红点数量num大于0 显示红点 */
    private onUpdateRed(isShow: boolean, redNum: number) {
        this.node.active = isShow && redNum > 0;
        if (this._style === ERedDotStyle.Num) {
            const numTip = redNum > this._limitNum ? `${this._limitNum}+` : `${this._limitNum}`;
            this.Label.string = `${numTip}`;
        }
    }

    public offEevent(): void {
        if (this._rid !== undefined) {
            RedDotMgr.I.off(this._rid, this.onUpdateRed, this);
        }
    }

    public unuse(): void {
        this.node.active = true;
        // console.log('红点池回收一个节点');
        this.offEevent();
    }

    private setScale(scale: number) {
        const oldScale = this.node.scaleX;
        if (scale && oldScale !== scale) {
            this.node.setScale(scale, scale);
        } else if (oldScale !== 1) {
            this.node.setScale(1, 1);
        }
    }

    private setPosition(x: number, y: number) {
        // if (x !== this.node.position.x && y !== this.node.position.y && x !== undefined && x !== null && y !== undefined && y !== null) {
        this.node.setPosition(x || 0, y || 0);
        // }
    }

    public reuse(pos: cc.Vec2, style: ERedDotStyle = ERedDotStyle.Nor): void {
        style = style || ERedDotStyle.Nor;
        if (pos) {
            this.setPosition(pos?.x, pos?.y);
        }
        // this.setScale(pos?.z);
        this.style = style || ERedDotStyle.Nor;
    }
    protected onDestroy(): void {
        this.offEevent();
        this.node.off('parent-changed', this._onPutPool, this);
    }
}

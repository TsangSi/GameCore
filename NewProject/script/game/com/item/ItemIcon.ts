/*
 * @Author: hwx
 * @Date: 2022-05-30 18:00:09
 * @FilePath: \SanGuo\assets\script\game\com\item\ItemIcon.ts
 * @Description: 道具图标
 */
import { StorageMgr } from '../../../app/base/manager/StorageMgr';
import { UtilCocos } from '../../../app/base/utils/UtilCocos';
import { UtilNum } from '../../../app/base/utils/UtilNum';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { EffectMgr } from '../../manager/EffectMgr';
import { DynamicImage } from '../../base/components/DynamicImage';
import { SpriteCustomizer } from '../../base/components/SpriteCustomizer';
import { UtilGame } from '../../base/utils/UtilGame';
import UtilItem from '../../base/utils/UtilItem';
import { BTN_CLICK_SCALE } from '../../const/GameConst';
import { ViewConst } from '../../const/ViewConst';
import ControllerMgr from '../../manager/ControllerMgr';
import { RoleMgr } from '../../module/role/RoleMgr';
import {
    ItemIconOptions, ItemTipsOptions, ItemWhere,
} from './ItemConst';
import ItemModel from './ItemModel';
import { UtilColor } from '../../../app/base/utils/UtilColor';
import { BagMgr } from '../../module/bag/BagMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class ItemIcon extends cc.Component {
    @property({ type: cc.Node, displayName: CC_DEV && '点击目标' })
    public clickTarget: cc.Node = null;

    @property({ type: DynamicImage, displayName: CC_DEV && '道具背景' })
    private SprBg: DynamicImage = null;

    @property({ type: cc.Node, displayName: CC_DEV && '光效动画' })
    private NdGlowAmin: cc.Node = null;

    @property({ type: DynamicImage, displayName: CC_DEV && '道具图标' })
    private SprIcon: DynamicImage = null;

    @property({ type: cc.Node, displayName: CC_DEV && '道具星星' })
    private NdStars: cc.Node = null;

    @property({ type: cc.Label, displayName: CC_DEV && '道具数量' })
    private LabCount: cc.Label = null;

    @property({ type: cc.Node, displayName: CC_DEV && '流光动画' })
    private NdStreamerAmin: cc.Node = null;

    @property({ type: cc.Label, displayName: CC_DEV && '道具名称' })
    private LabName: cc.Label = null;

    @property({ type: DynamicImage, displayName: CC_DEV && '道具左上角标' })
    private SprLeftTopFlag: DynamicImage = null;

    @property({ type: DynamicImage, displayName: CC_DEV && '道具右上角标' })
    private SprRightTopFlag: DynamicImage = null;

    /** 道具数据 */
    private _itemModel: ItemModel;
    /** 道具来自哪里 */
    private _where: number;
    /** 点击回调 */
    private _clickCallback: () => void;
    /** 不可点击 */
    private _offClick: boolean = false;
    /** 点击缩放值 */
    private _clickScale: number = BTN_CLICK_SCALE;
    /** Tips可选项 */
    private tipsOpts: ItemTipsOptions = {};

    protected start(): void {
        if (!this._offClick && this.clickTarget) {
            this.clickTarget.targetOff(this);
            UtilGame.Click(this.clickTarget, this.onClickItem, this, { scale: this._clickScale });
        }
    }

    private onClickItem() {
        // 自定义回调
        if (this._clickCallback) this._clickCallback();
        if (this._itemModel) { // 防止默认图标情况被点击
            // 道具调试模式
            const debugItemMode: boolean = StorageMgr.I.getValue('DebugItemMode', false);
            if (debugItemMode) {
                const count: number = StorageMgr.I.getValue('DebugItemModeCount', 1);
                ControllerMgr.I.GMController.reqC2SGm('additem', `${this._itemModel.cfg.Id}@${count}`);
            } else {
                WinMgr.I.open(ViewConst.ItemTipsWin, this._itemModel, this.getTipsOptions());
            }
        }
    }

    /** 清除上一次的资源 */
    private clearLastRes() {
        this.SprIcon.getComponent(cc.Sprite).spriteFrame = null;
        this.SprBg.getComponent(cc.Sprite).spriteFrame = null;
        this.NdGlowAmin.destroyAllChildren();
        this.NdStreamerAmin.destroyAllChildren();
        this.SprLeftTopFlag.node.active = false;
        this.SprRightTopFlag.node.active = false;
        this.NdStars.active = false;
        this.LabName.node.active = false;
        this.LabCount.node.active = false;
    }

    public setData(itemModel: ItemModel, opts?: ItemIconOptions): void {
        this._where = opts ? opts.where : ItemWhere.OTHER;
        this._offClick = opts ? opts.offClick : false;
        this._clickScale = opts ? opts.clickScale : BTN_CLICK_SCALE;
        this._itemModel = itemModel;
        if (!itemModel || !itemModel.cfg) {
            console.warn('道具配置缺失');
            this.clearLastRes();
            return;
        }
        const quality = itemModel.cfg.Quality;
        const sex = opts && typeof opts.sex === 'number' ? opts.sex : RoleMgr.I.d.Sex;
        const star = itemModel.cfg.Star || 0;
        const isHideStar = opts && opts.hideStar || star === 0;
        const isHideName = !(opts && opts.needName);
        const isDarkName = opts && opts.isDarkBg;
        const isCustomName = opts && opts.isCustomName;
        const isHideNum = !(opts && opts.needNum);
        const num1Show = !!(opts && opts.num1Show);
        const allNumShow = !!(opts && opts.allNumShow);
        const isHideLeftLog = !!(opts && opts.hideLeftLogo);
        const isHideRightLog = !!(opts && opts.hideRightLogo);
        const isHideEffect = opts && opts.hideEffect;
        const isHideQualityBg = opts && opts.hideQualityBg;
        const color = opts ? opts.color : null;
        const levelStar = opts ? opts.levelStar : false;
        const levelStarName = opts ? opts.levelStarName : false;

        const isShowLimit = opts && opts.needLimit;

        if (!isHideEffect) {
            // 光效
            this.refreshGlowEffect(quality);
            // 流光
            this.refreshStreamerEffect(quality);
        }

        // 道具品质背景
        if (!isHideQualityBg) { this.refreshQualityBg(quality); }
        // 道具图标
        this.refreshIcon(itemModel.cfg.PicID, sex);
        // 道具左上角标
        this.refreshLeftLogo(itemModel.cfg.LeftLogo, isHideLeftLog);
        // 道具右上角标
        this.refreshRightLogo(itemModel.cfg.RightLogo, isHideRightLog);
        // 星数（默认显示）
        this.refreshStars(star, isHideStar);

        UtilGame.LabelScrollSet(this.LabName);

        if (!isCustomName) {
            if (levelStar) {
                const union = UtilGame.GetLevelStr(itemModel.cfg.Level);
                this.refreshName(isHideName, union, '', quality, isDarkName);
            } else if (levelStarName) {
                const union = UtilGame.GetLevelStr(itemModel.cfg.Level);
                this.refreshName(isHideName, union, itemModel.cfg.Name, quality, isDarkName);
            } else {
                // 道具名称（默认不显示）
                this.refreshName(isHideName, '', itemModel.cfg.Name, quality, isDarkName);
            }
        }

        // 设置道具数量（默认不显示）
        this.refreshNum(itemModel.data.ItemNum, num1Show, allNumShow, isHideNum, color);
        //
        if (this._offClick) {
            this.clickTarget.targetOff(this);
        } else if (!this._offClick && this.clickTarget) {
            this.clickTarget.targetOff(this);
            UtilGame.Click(this.clickTarget, this.onClickItem, this, { scale: this._clickScale });
        }

        // 设置限制显示 99/10
        this.refreshLimit(isShowLimit, itemModel.data.ItemId, itemModel.data.ItemNum, isDarkName);
        // 数量的缩放参数
        if (opts && opts.numScale) {
            this.LabCount.node.scale = opts.numScale;
        } else {
            this.LabCount.node.scale = 1;
        }
    }

    public getData(): ItemModel {
        return this._itemModel;
    }

    /**
     * 刷新品质背景
     * @param quality
     */
    public refreshQualityBg(quality: number): void {
        this.SprBg.loadImage(UtilItem.GetItemQualityBgPath(quality), 1, true);
    }

    /**
     * 刷新发光效果
     * @param quality
     */
    public refreshGlowEffect(quality: number): void {
        const glowEffectPath = UtilItem.GetItemGlowEffectPath(quality);
        this.NdGlowAmin.destroyAllChildren();
        if (glowEffectPath) {
            EffectMgr.I.showEffect(glowEffectPath, this.NdGlowAmin);
        }
    }

    /**
     * 刷新流光效果
     * @param quality
     */
    public refreshStreamerEffect(quality: number): void {
        this.NdStreamerAmin.destroyAllChildren();
        const streamerEffectPath = UtilItem.GetItemStreamerEffectPath(quality);
        if (streamerEffectPath) {
            EffectMgr.I.showEffect(streamerEffectPath, this.NdStreamerAmin);
        }
    }

    /**
     * 关闭流光特效
     */
    public offStreamerEffect(): void {
        this.NdStreamerAmin.destroyAllChildren();
        this.NdStreamerAmin.active = false;
    }

    /**
     * 刷新图标
     * @param picId 图片ID
     * @param sex 性别 1 男，2女
     */
    public refreshIcon(picId: string, sex: number = 1): void {
        this.SprIcon.loadImage(UtilItem.GetItemIconPath(picId, sex), 1, true);
    }

    /**
     * 刷新左上角标
     * @param logoId 图片ID
     */
    public refreshLeftLogo(logoId: number, isHideLeftLogo?: boolean): void {
        const leftFlagPath = UtilItem.GetItemLeftFlagPath(logoId);
        if (leftFlagPath && !isHideLeftLogo) {
            this.SprLeftTopFlag.loadImage(leftFlagPath, 1, true);
            this.SprLeftTopFlag.node.active = true;
        } else {
            this.SprLeftTopFlag.node.active = false;
        }
    }

    /** 外部使用 单独处理左上角角标 */
    public refreshLeftCustomLogo(picId: number | string, hide: boolean = true): void {
        if (picId === null || picId === undefined || picId === '') {
            this.SprLeftTopFlag.node.active = false;
            return;
        }
        const picPath = UtilItem.GetItemIconLeftIconPath(picId);
        if (hide) {
            this.SprLeftTopFlag.node.active = true;
            this.SprLeftTopFlag.loadImage(picPath, 1, true);
        }
    }

    /**
     * 刷新右上角标
     * @param logoId 图片ID
     */
    public refreshRightLogo(logoId: number, isHideRightLogo?: boolean): void {
        const rightFlagPath = UtilItem.GetItemRightFlagPath(logoId);
        if (rightFlagPath && !isHideRightLogo) {
            this.SprRightTopFlag.loadImage(rightFlagPath, 1, true);
            this.SprRightTopFlag.node.active = true;
        } else {
            this.SprRightTopFlag.node.active = false;
        }
    }

    /**
     * 刷新星数
     * @param star
     * @param isHide
     */
    public refreshStars(star: number, isHide?: boolean): void {
        if (isHide) {
            this.NdStars.active = false;
        } else {
            this.NdStars.active = star > 0;
            if (this.NdStars.active) {
                this.NdStars.children.forEach((node, idx) => {
                    const spr = node.getComponent(SpriteCustomizer);
                    if (idx < star) {
                        spr.curIndex = SpriteCustomizer.Statu.Select;
                    } else {
                        spr.curIndex = SpriteCustomizer.Statu.Normall;
                    }
                });
            }
        }
    }

    /**
     * 刷新名称
     * @param isHide
     * @param name
     * @param quality
     * @param union 前缀
     * @param isDark 是否深色
     */
    public refreshName(isHide: boolean, union: string, name: string, quality: number, isDark?: boolean): void {
        if (isHide) {
            this.LabName.node.active = false;
        } else {
            UtilItem.ItemNameScrollSet(this._itemModel, this.LabName, `${union + name}`, isDark);
            this.LabName.node.active = true;
        }
    }

    /**
     * 刷新数量
     * @param num 数量
     * @param num1Show 1是否显示
     * @param allNumShow 任何数值都显示
     * @param isHide 隐藏
     * @param numColor 颜色
     */
    public refreshNum(num: number, num1Show?: boolean, allNumShow?: boolean, isHide?: boolean, numColor?: string): void {
        if (isHide) {
            this.LabCount.node.active = false;
        } else {
            this.LabCount.string = UtilNum.Convert(num);// num.toString();
            if (allNumShow) {
                this.LabCount.node.active = true;
            } else {
                this.LabCount.node.active = num1Show ? num > 0 : num > 1;
            }
            if (numColor) {
                this.LabCount.node.color = UtilColor.Hex2Rgba(numColor);
            }
        }
    }

    public refreshLimit(isShow: boolean, itemId: number, num: number, isDark: boolean): void {
        if (!isShow) return;
        const haveNum = BagMgr.I.getItemNum(itemId);
        this.LabCount.string = `${UtilNum.Convert(haveNum)}/${UtilNum.Convert(num)}`;
        this.LabCount.node.active = true;
        if (!isDark) {
            this.LabCount.node.color = UtilColor.Hex2Rgba(haveNum >= num ? UtilColor.GreenG : UtilColor.RedG);
        } else {
            this.LabCount.node.color = UtilColor.Hex2Rgba(haveNum >= num ? UtilColor.GreenG : UtilColor.RedG);
        }
    }

    /**
     * 设置图标灰置，默认模式1
     * @param grayscale 是否灰置
     * @param mode 1、仅图标、2、图标和背景、3、所有图片
     * @param target 目标节点，仅mode=3时有用，可传二次包装的父节点
     */
    public setGray(grayscale: boolean, mode: number = 1, target: cc.Node = undefined): void {
        if (mode === 3) { // 所有图片
            // 有可能图标是被其他节点包裹的，所有这个target可以传父节点
            const grayTarget = target || this.node;
            UtilCocos.SetSpriteGray(grayTarget, grayscale, true);
            return;
        }
        // if (mode === 2) { // 图标和背景
        //     UtilColor.setGray(this.SprBg.node, grayscale);
        //     return;
        // }
        UtilColor.setGray(this.SprBg.node, grayscale);
    }

    /**
     * 图标是否灰置中
     * @returns boolean 图标的灰置状态
     */
    public isGray(): boolean {
        // return this.SprIcon.node.getComponent(cc.Sprite).grayscale;
        // return this.SprIcon.node.getComponent(cc.Sprite).getState();
        return false;
        // .setState(grayscale ? cc.Sprite.State.GRAY : cc.Sprite.State.NORMAL);
    }

    public setBgActive(active: boolean): void {
        this.SprBg.node.active = active;
    }

    /**
     * 设置额外的点击回调
     * @param callback
     * @param target
     */
    public setClickCallback(callback: () => void, target: unknown): void {
        this._clickCallback = callback.bind(target);
    }

    /**
     * 设置Tips可选项
     * @param opts
     */
    public setTipsOptions(opts: ItemTipsOptions): void {
        this.tipsOpts = opts || {};
    }

    /**
     * 设置Tips可选项
     * @returns ItemTipsOptions
     */
    public getTipsOptions(): ItemTipsOptions {
        // 默认使用道具来源
        if (!this.tipsOpts.where) {
            this.tipsOpts.where = this._where;
        }
        return this.tipsOpts;
    }

    /** 将LabelCount 显示在name的位置 */
    public showCountInName(hasNum: number, needNum: number): void {
        this.LabName.node.active = true;

        UtilGame.LabelScrollSet(this.LabName, `${UtilNum.Convert(hasNum)}/${needNum}`);
        this.LabName.node.color = UtilColor.costColor(hasNum, needNum);
        this.LabName.node.y = -85;
        this.LabName.node.scale = 1.4;
    }
}

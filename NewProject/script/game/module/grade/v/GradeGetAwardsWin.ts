/*
 * @Author: wangxina
 * @Date: 2022-07-18 15:07:03
 * @FilePath: \SanGuo\assets\script\game\module\grade\v\GradeGetAwardsWin.ts
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { ANIM_TYPE } from '../../../base/anim/AnimCfg';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { UtilCurrency } from '../../../base/utils/UtilCurrency';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilGeneral from '../../../base/utils/UtilGeneral';
import UtilItem from '../../../base/utils/UtilItem';
import UtilTitle from '../../../base/utils/UtilTitle';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ItemModel from '../../../com/item/ItemModel';
import WinBase from '../../../com/win/WinBase';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import EntityUiMgr from '../../../entity/EntityUiMgr';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { RoleMgr } from '../../role/RoleMgr';

const { ccclass, property } = cc._decorator;
/**
 *  获得奖励界面
 * @param type // 0默认模板，展示获得物品。 1 三倍领取 2 限时三倍领取
 * @param showName // 道具名字
 * @param quality // 道具质量
 * @param animId  // 动画id
 * @param animType // 动画类型
 * @param animScale // 动画缩放值 默认0.7
 * @param animPosY // 动画y轴距离，默认-40 用于Y轴调整位置
 * @param animPosX // 动画x轴距离，默认0 用于X轴调整位置
 * @param getGradeGiftData? // 三倍领取奖励
 * @param itemPrize? // 道具字符串 100001：6
 * @param autoClose? // 自动关闭时间 秒
 * @param isLockClose // 是否可以点击关掉
 */

export enum EGetAwardsType {
    /** 0 默认模板,展示获得物品 */
    Default = 0,
    /** 1 三倍领取  */
    Treble,
    /** 2 限时三倍领取  */
    TrebleLimit,
}
export interface IGetAwardsInfo {
    type: EGetAwardsType,
    showName: string,
    quality: number,
    animId?: number,
    animType?: ANIM_TYPE,
    animScale?: number,
    animPosY?: number,
    animPosX?: number,
    getGradeGiftData?: { gradeId: number, bigLv: number },
    itemPrize?: string,
    prizeCost?: string,
    autoClose?: number, // 自动关闭时间 传-1不自动关闭
    isLockClose?: boolean, // 是否能关闭窗口
    /** 是否是获得武将的（主要用于显示稀有度） */
    generalRarity?: number,
    /** 是否是称号 */
    titleId?: number,
}

@ccclass
export class GradeGetAwardsWin extends WinBase {
    @property(DynamicImage)
    private SprTitle: DynamicImage = null;

    @property(cc.Node)
    private ShowSkin: cc.Node = null;

    @property(cc.Label)
    private ShowName: cc.Label = null;

    @property(DynamicImage)
    private ShowQuality: DynamicImage = null;

    @property(cc.Node)
    private AllClose: cc.Node = null;

    @property(cc.Node)
    private NdItemContent: cc.Node = null;

    @property(ItemIcon)
    private NdItemIcon: ItemIcon = null;

    @property(cc.Node)
    private NdGradeLv: cc.Node = null;

    @property(cc.Label)
    private LabGradeLv: cc.Label = null;

    @property(cc.Label)
    private LbTips: cc.Label = null;

    @property(cc.Node)
    private NdGetBtn: cc.Node = null;

    @property(cc.Node)
    private NdGetTreeBtn: cc.Node = null;

    @property(DynamicImage)
    private NdPrice: DynamicImage = null;

    @property(DynamicImage)
    private SprBg: DynamicImage = null;

    private isLockClose: boolean = false;
    private type: number = -1;
    private prizeCostId: number = 0;
    private prizeNum: number = 0;
    protected start(): void {
        super.start();
        if (this.type !== 0) {
            console.log('打开领取窗口', this.type);
            EventClient.I.on(E.Grade.UpdateInfo, this.closeWin, this);
        }
    }

    protected onDestroy(): void {
        if (this.type !== 0) {
            this.reqAward(this.gradeId, this.bigLv, true);
            EventClient.I.off(E.Grade.UpdateInfo, this.closeWin, this);
        }
    }

    /**
     * WinMgr.I.open(ViewConst.GradeGetAwardsWin, );
     * @param params [type:number, itemId:number, showName:string, quality:number, animId, animType]
     */
    public init(params: [IGetAwardsInfo]): void {
        const data = params[0];
        this.type = data.type; // 0默认模板，展示获得物品。 1 三倍领取 2 限时三倍领取
        // 是否需要自动关闭 默认3秒
        const autoCloseTime = data.autoClose ? data.autoClose : 3;
        // 是否需要展示道具
        const LbName: string = data.showName;
        const quality: number = data.quality;
        // console.log(data);
        // 设置名字和品质
        this.ShowName.string = LbName;
        if (data.generalRarity) {
            this.ShowQuality.loadImage(UtilGeneral.GRPath(data.generalRarity), 1, true);
        } else {
            this.ShowQuality.loadImage(UtilItem.GetItemQualityFontImgPath(quality, true), 1, true);
        }

        if (this.type === 0) {
            if (data.autoClose !== -1) {
                this.autoClose(autoCloseTime);
                // this.AllClose.active = true;
            }
            this.isLockClose = true;
            this.NdItemContent.active = false;
            // this.AllClose.getComponent(cc.Label).string = `${i18n.tt(Lang.com_click_close_tips)}(${autoCloseTime}${i18n.tt(Lang.com_second)})`;
            this.SprTitle.loadImage('/texture/com/font/com_font_gxhd@ML', 1, true);
        } else {
            this.upDataUiAwards(data);
        }

        this.setlockClose();
        if (data.titleId) {
            UtilTitle.setTitle(this.ShowSkin, data.titleId, false, data.animScale);
            this.ShowSkin.y = data.animPosY || 0;
        } else {
            this.refreshAvatar(data.animId, data.animType, data.animScale, data.animPosY, data.animPosX);
        }
    }

    public refreshView(params: [IGetAwardsInfo]): void {
        this.AllClose.active = false;
        this.NdItemContent.active = true;
        this.unschedule(this.countDown);

        const data = params[0];
        this.type = data.type; // 0默认模板，展示获得物品。 1 三倍领取 2 限时三倍领取
        // 是否需要自动关闭 默认3秒
        const autoCloseTime = data.autoClose ? data.autoClose : 3;
        // 是否需要展示道具
        const LbName: string = data.showName;
        const quality: number = data.quality;
        // console.log(data);
        // 设置名字和品质
        this.ShowName.string = LbName;
        if (data.generalRarity) {
            this.ShowQuality.loadImage(UtilGeneral.GRPath(data.generalRarity), 1, true);
        } else {
            this.ShowQuality.loadImage(UtilItem.GetItemQualityFontImgPath(quality, true), 1, true);
        }

        if (this.type === 0) {
            if (data.autoClose !== -1) {
                this.autoClose(autoCloseTime);
                // this.AllClose.active = true;
            }
            this.isLockClose = true;
            this.NdItemContent.active = false;
            // this.AllClose.getComponent(cc.Label).string = `${i18n.tt(Lang.com_click_close_tips)}(${autoCloseTime}${i18n.tt(Lang.com_second)})`;
            this.SprTitle.loadImage('/texture/com/font/com_font_gxhd@ML', 1, true);
        } else {
            this.upDataUiAwards(data);
        }

        this.ShowSkin.destroyAllChildren();
        this.ShowSkin.removeAllChildren();
        if (data.titleId) {
            UtilTitle.setTitle(this.ShowSkin, data.titleId, false, data.animScale);
        } else {
            this.refreshAvatar(data.animId, data.animType, data.animScale, data.animPosY, data.animPosX);
        }
    }

    private gradeId: number = 0;
    private bigLv: number = 0;
    protected upDataUiAwards(data: IGetAwardsInfo): void {
        // 领取道具后进阶数据刷新，然后关掉这个
        const prizeCost: string[] = data.prizeCost.split(':');
        const item: string = data.itemPrize;
        this.NdItemContent.active = true;
        this.AllClose.active = false;
        this.ShowQuality.node.active = false;
        this.NdGradeLv.active = true;
        this.LabGradeLv.string = UtilNum.ToChinese(data.getGradeGiftData.bigLv);
        /** 测试皮肤动画~ 正式删掉 */
        if (this.type === 1) {
            // 三倍领取
            this.NdGetTreeBtn.active = true;
            this.NdGetBtn.active = true;
            const gradeId: number = data.getGradeGiftData.gradeId;
            const bigLv: number = data.getGradeGiftData.bigLv;
            this.SprTitle.loadImage('/texture/com/font/com_font_gxhd@ML', 1, true);
            this.setBtnClick(gradeId, bigLv);
        }
        if (this.type === 2) {
            // 限时三倍领取
            this.NdGetTreeBtn.active = true;
            this.NdGetTreeBtn.getChildByName('Label').getComponent(cc.Label).string = i18n.tt(Lang.com_receive);
            this.NdGetBtn.active = false;
            this.SprTitle.loadImage('/texture/com/font/com_font_gxhd_1@ML.png', 1, true);
            const gradeId: number = data.getGradeGiftData.gradeId;
            const bigLv: number = data.getGradeGiftData.bigLv;
            this.setBtnClick(gradeId, bigLv);
        }
        // 设置货币
        this.NdPrice.getComponentInChildren(cc.Label).string = prizeCost[1];
        this.prizeCostId = parseInt(prizeCost[0]);
        this.prizeNum = parseInt(prizeCost[1]);
        this.NdPrice.loadImage(UtilCurrency.getIconByCurrencyType(parseInt(prizeCost[0])), 1, true);
        this.setItemIcon(item); // 设置道具信息
    }

    private isReqlAward: boolean = false;

    private reqAward(gradeId: number, bigLv: number, isThree: boolean) {
        if (this.isReqlAward) {
            return;
        }
        ControllerMgr.I.GradeController.reqC2SGradeGetThreeGift(gradeId, bigLv, isThree);
        this.isReqlAward = true;
    }

    public setBtnClick(gradeId: number, bigLv: number): void {
        // 直接领取
        this.gradeId = gradeId;
        this.bigLv = bigLv;
        if (this.type === 1) {
            UtilGame.Click(this.NdGetBtn, () => {
                this.reqAward(gradeId, bigLv, false);
            }, this);
            UtilGame.Click(this.NdGetTreeBtn, () => {
                const huobi = RoleMgr.I.getCurrencyById(this.prizeCostId);
                if (huobi > this.prizeNum) {
                    this.reqAward(gradeId, bigLv, true);
                } else {
                    WinMgr.I.open(ViewConst.ItemSourceWin, this.prizeCostId);
                }
            }, this);
        }
        // 三倍领取
        if (this.type === 2) {
            UtilGame.Click(this.NdGetTreeBtn, () => {
                const huobi = RoleMgr.I.getCurrencyById(this.prizeCostId);
                if (huobi >= this.prizeNum) {
                    this.reqAward(gradeId, bigLv, true);
                } else {
                    WinMgr.I.open(ViewConst.ItemSourceWin, this.prizeCostId);
                }
            }, this);
        }
    }

    private showTime: number = 0;
    public autoClose(closeTime: number): void {
        this.showTime = closeTime;// 5
        this.unschedule(this.countDown);
        this.schedule(this.countDown, 1);
    }

    public countDown(): void {
        this.showTime -= 1;
        // this.AllClose.getComponent(cc.Label).string = `${i18n.tt(Lang.com_click_close_tips)}(${this.showTime}${i18n.tt(Lang.com_second)})`;
        if (this.showTime <= 0) {
            this.unschedule(this.countDown);
            this.showTime = 0;
            this.close();
        }
    }

    /**
     * 关闭锁定，强制领取后才能关闭
     */
    public setlockClose(): void {
        UtilGame.Click(this.NodeBlack, () => {
            if (this.isLockClose || !this.NdItemContent.active) {
                this.close();
            }
        }, this, { scale: 1 });
    }

    /**
     * 属性模型节点，打开时传参
     * @param animId 模型id
     * @param animType 模型类型
     * @param animScale 模型缩放
     * @param animPosY y轴偏移
     * @param animPosX x轴偏移
     */
    public refreshAvatar(animId: number, animType: ANIM_TYPE, animScale: number = 0.7, animPosY = -40, animPosX = 0): void {
        this.ShowSkin.destroyAllChildren();
        this.ShowSkin.removeAllChildren();
        this.ShowSkin.scale = animScale;
        this.ShowSkin.setPosition(animPosX, animPosY);
        EntityUiMgr.I.createEntity(this.ShowSkin, {
            resId: animId,
            resType: animType,
            isPlayUs: false,
        });
    }

    /**
     * 设置道具
     * @param Item 道具icon
     */
    public setItemIcon(prize: string): void {
        const itemdata = prize.split(':');
        const itemModel: ItemModel = UtilItem.NewItemModel(parseInt(itemdata[0]), parseInt(itemdata[1]));
        this.NdItemIcon.setData(itemModel, { needNum: true });
    }

    public closeWin(): void {
        this.close();
    }
}

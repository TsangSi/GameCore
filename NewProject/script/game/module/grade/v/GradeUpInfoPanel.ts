/*
 * @Author: hwx
 * @Date: 2022-07-12 11:54:51
 * @FilePath: \SanGuo\assets\script\game\module\grade\v\GradeUpInfoPanel.ts
 * @Description: 进阶升阶信息面板
 */
// import {
//     cc._decorator, cc.Node, cc.Label, cc.Toggle, cc.v2, cc.Layout,
// } from 'cc';
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { ANIM_TYPE } from '../../../base/anim/AnimCfg';
import { AttrModel } from '../../../base/attribute/AttrModel';
import { DynamicImage } from '../../../base/components/DynamicImage';
import Progress from '../../../base/components/Progress';
import { SpriteCustomizer } from '../../../base/components/SpriteCustomizer';
import { Config } from '../../../base/config/Config';
import { ConfigShopIndexer } from '../../../base/config/indexer/ConfigShopIndexer';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { AttrsStyleA } from '../../../com/attr/AttrsStyleA';
import { E } from '../../../const/EventName';
import { FuncId } from '../../../const/FuncConst';
import { ViewConst } from '../../../const/ViewConst';
import { EntityUnitType } from '../../../entity/EntityConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';
import { IWinAutoPayTips } from '../../pay/WinAutoPayTips';
import { WinAutoPayTipsModel } from '../../pay/WinAutoPayTipsModel';
import { RID } from '../../reddot/RedDotConst';
import { RoleMgr } from '../../role/RoleMgr';
import { ShopChildType } from '../../shop/ShopConst';
import { GradeType, GRADE_MAX_LEVEL, GRADE_MAX_STAR } from '../GradeConst';
import { GradeMgr } from '../GradeMgr';
import { GradeModel } from '../GradeModel';
import { IGetAwardsInfo } from './GradeGetAwardsWin';
import { EOpenType } from './GradeSoulWin';

const { ccclass, property } = cc._decorator;

@ccclass
export class GradeUpInfoPanel extends BaseCmp {
    @property(cc.Node)
    private NdGiftButton: cc.Node = null;

    @property(cc.Node)
    private NdAwardButton: cc.Node = null;

    @property(cc.Node)
    private NdGodButton: cc.Node = null;

    @property(cc.Node)
    private NdSoulButton: cc.Node = null;

    @property(cc.Node)
    private NdUpBtn: cc.Node = null;

    @property(cc.Node)
    private NdOnKeyUpBtn: cc.Node = null;

    @property(cc.Node)
    private NdBreakBtn: cc.Node = null;

    @property(AttrsStyleA)
    private NdAttrsStyleA: AttrsStyleA = null;

    @property(SpriteCustomizer)
    private SprStars: SpriteCustomizer[] = [];

    @property(Progress)
    private BarExp: Progress = null;

    @property(DynamicImage)
    private SprCostIcon: DynamicImage = null;

    @property(cc.Label)
    private LabPrice: cc.Label = null;

    @property(cc.Toggle)
    private TogAutoBuy: cc.Toggle = null;

    @property(cc.Node)
    private NdStars: cc.Node = null;

    @property(cc.Node)
    private NdUp: cc.Node = null;

    @property(cc.Node)
    private NdBreak: cc.Node = null;

    @property(cc.Node)
    private NdFull: cc.Node = null;

    /** 升阶数据模型 */
    private _gradeModel: GradeModel;
    private _gradeId: number;

    private _costItemId: number = 0;
    private _costItemNum: number = 0;
    private _ownCostItemNum: number = 0;
    /** 三倍领取的bigLv */
    private _threeBigLv: number = 0;
    private timeData: { dTime: number, repatSec: number, fmt: string };
    /** 是否更新进度条动画 */
    public progressShowAct: boolean = false;

    public init(...param: unknown[]): void {
        this._gradeModel = param[0] as GradeModel;
        // 第一次打开的时候不需要显示动画，切标签的时候也不去需要，记录了上一次打开的tabid来区分是不是在当前页面
        // this.progressShowAct = this._gradeId === this._gradeModel.data.GradeId && param[1] === 1;
        this.progressShowAct = false;
        this._gradeId = this._gradeModel.data.GradeId;
        this.updateModel(this._gradeModel);

        // 重复绑定不同事件前先清除红点绑定
        UtilRedDot.Unbind(this.NdUpBtn);
        UtilRedDot.Unbind(this.NdOnKeyUpBtn);
        UtilRedDot.Unbind(this.NdBreakBtn);
        UtilRedDot.Unbind(this.NdSoulButton);
        UtilRedDot.Unbind(this.NdGodButton);
        UtilRedDot.Unbind(this.NdGiftButton);

        const redData = GradeMgr.I.getRedUpDataByGradeId(this._gradeId);
        UtilRedDot.Bind(redData.UP_STAR, this.NdUpBtn, cc.v2(82, 21));
        UtilRedDot.Bind(redData.UP_STAR_ONEKEY, this.NdOnKeyUpBtn, cc.v2(82, 21));
        UtilRedDot.Bind(redData.UP_LEVEL, this.NdBreakBtn, cc.v2(82, 21));
        UtilRedDot.Bind(redData.SOUL, this.NdSoulButton, cc.v2(15, 22));
        UtilRedDot.Bind(redData.GOD, this.NdGodButton, cc.v2(15, 22));
        UtilRedDot.Bind(redData.JJHL, this.NdGiftButton, cc.v2(15, 22));
    }

    protected start(): void {
        super.start();
        EventClient.I.on(E.Grade.UpLevel, this.onAutoOpenGEtAwardWin, this);
        EventClient.I.on(E.Grade.GradeItemNumChange.GodDang, this.UpDataGod, this);
        EventClient.I.on(E.Grade.GradeItemNumChange.SoulDang, this.UpDataSoul, this);
        EventClient.I.on(E.Grade.GradeItemNumChange.GradeDang, this.UpDataGradeDang, this);
        UtilGame.Click(this.NdGiftButton, this.onClickGiftButton, this);
        UtilGame.Click(this.NdAwardButton, this.onClickAwardButton, this);
        UtilGame.Click(this.NdGodButton, this.onClickGodButton, this);
        UtilGame.Click(this.NdSoulButton, this.onClickSoulButton, this);
        UtilGame.Click(this.NdUpBtn, this.onClickUpBtn, this);
        UtilGame.Click(this.NdOnKeyUpBtn, this.onClickOnKeyUpBtn, this);
        UtilGame.Click(this.NdBreakBtn, this.onClickBreakBtn, this);
    }

    public refreshPage(winId: number, params: any[]): void {
        if (params) {
            const suitId: number = params[1];
        }
    }

    protected onDestroy(): void {
        EventClient.I.off(E.Grade.UpLevel, this.onAutoOpenGEtAwardWin, this);
        EventClient.I.off(E.Grade.GradeItemNumChange.GodDang, this.UpDataGod, this);
        EventClient.I.off(E.Grade.GradeItemNumChange.SoulDang, this.UpDataSoul, this);
        EventClient.I.off(E.Grade.GradeItemNumChange.GradeDang, this.UpDataGradeDang, this);
        super.onDestroy();
    }

    /**
     * 进阶豪礼
     */
    private onClickGiftButton(): void {
        WinMgr.I.open(ViewConst.GradeGiftWin, this._gradeId);
    }

    /**
     * 3倍奖励 有才显示
     */
    private onClickAwardButton(): void {
        this.openGetAwardWin(this._threeBigLv, 2, false);
    }

    private onAutoOpenGEtAwardWin() {
        // 突破时领取最大的 不懂为什么慢了一阶
        this.openGetAwardWin(this._gradeModel.data.GradeLv.BigLv + 1, 1);
    }

    /** 设置主动打三倍领取 */
    private showGetAwardWin(): void {
        const gradelv: IntAttr1[] = this._gradeModel.data.GradeLv.ThreeGift;
        if (gradelv.length !== 0) {
            const gradelist: IntAttr1[] = [];
            const TimeNow: number = UtilTime.NowSec();
            gradelv.forEach((v, i) => {
                // 0=未领取 1=单倍领取 2=三倍领取 有为领取的 超时长的也不能进来
                if ((v.V1 === 0 || v.V1 === 1) && v.V2 > TimeNow) {
                    gradelist.push(v);
                }
            });
            gradelist.sort((a, b) => a.V2 - b.V2);
            if (gradelist.length === 0) {
                this.NdAwardButton.active = false;
            } else {
                this._threeBigLv = gradelist[0].K;
                this.NdAwardButton.active = true;
                // 大于一天显示 日：时， 小于一天时显示 时：分 大小于一小时显示 分：秒
                const dTime = gradelist[0].V2 - TimeNow;
                let repatSec: number = 0;
                let fmt: string;
                if (dTime > 24 * 60 * 60) {
                    repatSec = 60 * 60;
                    fmt = i18n.tt(Lang.com_time_fmt_dh);
                }
                if (dTime > 60 * 60 && dTime < 60 * 60 * 24) {
                    repatSec = 60;
                    fmt = i18n.tt(Lang.com_time_fmt_hm);
                }
                if (dTime < 60 * 60) {
                    repatSec = 1;
                    fmt = i18n.tt(Lang.com_time_fmt_ms);
                }
                // 每次刷新后清空一个再重启
                this.timeData = { dTime, repatSec, fmt };
                this.NdAwardButton.getChildByName('NdTime').getComponentInChildren(cc.Label).string = UtilTime.FormatTime(dTime, fmt);
                this.unschedule(this.setTimeCallback);
                this.schedule(this.setTimeCallback, repatSec);
            }
        } else {
            this.NdAwardButton.active = false;
        }
    }

    public setTimeCallback(): void {
        const awardTime = this.NdAwardButton.getChildByName('NdTime').getComponentInChildren(cc.Label);
        const repatSec = this.timeData.repatSec;
        const fmt = this.timeData.fmt;
        if (this.timeData.dTime - repatSec > 0) {
            this.timeData.dTime -= repatSec;
            awardTime.string = UtilTime.FormatTime(this.timeData.dTime, fmt);
        } else {
            // 当一个计时结束后，刷新计页面换另一个。
            this.showGetAwardWin();
        }
    }

    /**
     * 打开获取三倍奖励窗口
     */
    private openGetAwardWin(bigLv: number, type: number, isLockClose = false): void {
        if (bigLv > 10) return;
        let showName: string = '';
        let animId: number = 0;
        let animPosY = -35;
        const cfg_Prize: Cfg_GradePrize = GradeMgr.I.getGradePrizeCfg(this._gradeId, bigLv);
        if (this._gradeId === FuncId.BeautyGrade) {
            const cfg = GradeMgr.I.getGradeCfg(this._gradeId, cfg_Prize.Level);
            showName = cfg.Name;
            const lineups = ModelMgr.I.BattleUnitModel.getBattleLineup(EntityUnitType.Beauty);
            let beautyId = 0;
            if (lineups && lineups[0]) {
                beautyId = +lineups[0].OnlyId;
            } else {
                beautyId = ModelMgr.I.BeautyModel.getCurViewShowBeauty()?.BeautyId;
            }
            if (beautyId) {
                const cfg: Cfg_Beauty = Config.Get(Config.Type.Cfg_Beauty).getValueByKey(beautyId);
                animId = cfg.AnimId;
            }
            animPosY = -35;
        } else if (this._gradeId === FuncId.AdviserGrade) {
            const cfg = GradeMgr.I.getGradeCfg(this._gradeId, cfg_Prize.Level);
            showName = cfg.Name;
            animId = ModelMgr.I.AdviserModel.getSkin();
            animPosY = 20;
        } else {
            const skinId = cfg_Prize.SkinId;
            const skinIdx = GradeMgr.I.getGradeSkinCfgById(skinId);
            showName = skinIdx.Name;
            animId = skinIdx.AnimId;
        }
        const itemPrize = cfg_Prize.Prize;
        const prizeCost = cfg_Prize.PrizeCost;
        const getGradeGiftData = { gradeId: this._gradeId, bigLv };
        // 处理动画资源
        const resType: ANIM_TYPE = GradeMgr.I.getResTypeByGradeId(this._gradeId);
        const getAwardsInfos: IGetAwardsInfo = {
            type,
            showName,
            quality: 1,
            animId,
            animType: resType,
            animScale: 0.9,
            animPosY,
            getGradeGiftData,
            itemPrize,
            isLockClose,
            prizeCost,
        };
        WinMgr.I.open(ViewConst.GradeGetAwardsWin, getAwardsInfos);
    }

    /**
     * 炼神
     */
    private onClickGodButton(): void {
        if (this._gradeId === FuncId.BeautyGrade) {
            WinMgr.I.open(ViewConst.GradeGodWin, EOpenType.BEAUTY_GRADE, this._gradeId);
        } else if (this._gradeId === FuncId.AdviserGrade) {
            WinMgr.I.open(ViewConst.GradeGodWin, EOpenType.ADVISER_GRADE, this._gradeId);
        } else {
            WinMgr.I.open(ViewConst.GradeGodWin, EOpenType.GRADE, this._gradeId);
        }
    }

    /**
     * 注灵
     */
    private onClickSoulButton(): void {
        WinMgr.I.open(ViewConst.GradeSoulWin, EOpenType.GRADE, this._gradeId);
    }

    /**
     * 升阶
     */
    private onClickUpBtn(): void {
        this.reqLevelUp(false);
    }

    /**
     * 一键升阶
     */
    private onClickOnKeyUpBtn(): void {
        this.reqLevelUp(true);
    }

    private onClickBreakBtn(): void {
        ControllerMgr.I.GradeController.reqC2SGradeLevelBreak(this._gradeId);
    }

    /**
     * 请求升阶
     * @param isOneKey
     * @returns
     */
    private reqLevelUp(isOneKey: boolean): void {
        // 检查道具货币
        const isAutoBuy = this.TogAutoBuy.isChecked;
        if (this._ownCostItemNum < this._costItemNum) {
            if (isAutoBuy) {
                // 从商城获取道具的价值，计算货币是否足够
                const indexer: ConfigShopIndexer = Config.Get(Config.Type.Cfg_ShopCity);
                const shopitems = indexer.getShopItemsByShopType(ShopChildType.Quick);
                let currencyId: number = 1;
                let price: number = 1;
                shopitems.forEach((v) => {
                    if (v.ItemID === this._costItemId) {
                        currencyId = v.GoldType;
                        price = v.SalePrice;
                    }
                });
                const needNum: number = (this._costItemNum - this._ownCostItemNum) * price;
                const isEnoughBuy = RoleMgr.I.checkCurrency(currencyId, needNum);
                if (!isEnoughBuy) {
                    // 对应货币不足，提示货币获取途径
                    WinMgr.I.open(ViewConst.ItemSourceWin, currencyId);
                    return;
                }
            } else {
                WinMgr.I.open(ViewConst.WinComQuickPay, this._costItemId, this._costItemNum - this._ownCostItemNum);
                // WinMgr.I.open(ViewConst.ItemSourceWin, this._costItemId);
                return;
            }
        }
        this.progressShowAct = true;
        // 请求升阶
        ControllerMgr.I.GradeController.reqC2SGradeLevelUp(this._gradeId, isOneKey, isAutoBuy);
    }

    // 检查是否首次自动购买弹窗
    public checkAutoPayFist(): void {
        const isAuto = WinAutoPayTipsModel.getState(this._gradeId);
        // 如果未勾选提示,将结果交给弹窗处理
        if (!isAuto && !this.TogAutoBuy.isChecked) {
            this.TogAutoBuy.isChecked = false;
            const conf: IWinAutoPayTips = {
                /** 回调 */
                cb: (b: boolean) => {
                    if (this.TogAutoBuy && this.TogAutoBuy.isValid) {
                        this.TogAutoBuy.isChecked = b;
                    }
                },
                /** 购买的物品 */
                itemId: this._costItemId,
                /** 存储的key */
                recordKey: this._gradeId,
            };
            WinMgr.I.open(ViewConst.WinAutoPayTips, conf);
        }
    }

    /**
     * 更新数据模型
     */
    public updateModel(gradeModel: GradeModel): void {
        this._gradeModel = gradeModel;
        const lv = gradeModel.data.GradeLv.BigLv;
        const star = gradeModel.data.GradeLv.SmallLv;

        // const isAuto = WinAutoPayTipsModel.getState(this._gradeId);
        // this.TogAutoBuy.isChecked = isAuto;
        // 设置属性
        const attrInfo = AttrModel.MakeAttrInfo(gradeModel.cfg.AttrId);
        this.NdAttrsStyleA.init(attrInfo);
        this.scheduleOnce(() => {
            // 生成属性后停用layOut
            this.NdAttrsStyleA.node.getChildByName('Layout').getComponent(cc.Layout).enabled = false;
        }, 0.3);
        // 设置星数
        this.SprStars.forEach((spr, idx) => {
            if (idx < star) {
                spr.curIndex = 1; // 显示星
            } else {
                spr.curIndex = 0; // 显示底
            }
        });

        // 设置经验
        const curExp = gradeModel.data.GradeLv.Exp;
        const maxExp = gradeModel.cfg.TotalExp;
        this.BarExp.updateProgress(curExp, maxExp, this.progressShowAct);
        this.progressShowAct = false;

        // 设置注灵，练神按钮数值
        this.UpdataItemNums();

        if (lv === GRADE_MAX_LEVEL && star === GRADE_MAX_STAR) { // 满级
            this.NdUp.active = false;
            this.NdBreak.active = false;
            this.NdStars.active = false;
            this.NdFull.active = true;
        } else if (gradeModel.cfg.Star === GRADE_MAX_STAR && curExp >= maxExp) { // 突破
            this.NdUp.active = false;
            this.NdFull.active = false;
            this.NdStars.active = true;
            this.NdBreak.active = true;
        } else { // 升阶
            this.NdBreak.active = false;
            this.NdFull.active = false;
            this.NdStars.active = true;
            this.NdUp.active = true;
        }
        // 设置进阶奖励
        this.showGetAwardWin();

        // 当前进阶道具数量发生变化，但是进阶数据并未变化服务器是不会推送更新红点消息的，所以打开升级面板的时候手动刷新一下
        // GradeMgr.I.checkRed();
    }

    /**
     * 刷新当前道具变化
     */
    public UpdataItemNums(): void {
        this.UpDataGradeDang();
        this.UpDataGod();
        this.UpDataSoul();
    }

    private UpDataGradeDang(): void {
        // 进阶丹变化
        const [itemId, itemNum] = UtilItem.ParseItemStr(this._gradeModel.cfg.NeedItem);
        const itemCfg = UtilItem.GetCfgByItemId(itemId);
        this.SprCostIcon.loadImage(UtilItem.GetItemIconPath(itemCfg.PicID), 1, true);
        const own = BagMgr.I.getItemNum(itemId);
        this.LabPrice.string = `${UtilNum.Convert(own)}/${itemNum}`;
        this.LabPrice.node.color = own < itemNum ? UtilColor.Red() : UtilColor.Green();
        this._costItemId = itemId;
        this._costItemNum = itemNum;
        this._ownCostItemNum = own;
        // 更新进阶红点
        GradeMgr.I.checkRedUp(this._gradeId, this._gradeModel.data);
    }

    private UpDataGod(): void {
        // 注灵丹数量
        const GodLable = this.NdGodButton.getChildByName('LabName').getComponent(cc.Label);
        GodLable.string = this._gradeModel.data.GradeGod.Num.toString();
        GradeMgr.I.checkRedGod(this._gradeId, this._gradeModel.data);
    }

    private UpDataSoul(): void {
        // 炼神丹数量
        const SoulLable = this.NdSoulButton.getChildByName('LabName').getComponent(cc.Label);
        SoulLable.string = `${i18n.tt(Lang.com_dengji)}:${this._gradeModel.data.GradeSoul.Level}`;
        GradeMgr.I.ckeckRedSould(this._gradeId, this._gradeModel.data);
    }
}

/* eslint-disable @typescript-eslint/no-this-alias */
import { EventClient } from '../../../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../../../app/base/utils/UtilString';
import WinMgr from '../../../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../../../i18n/i18n';
import { ANIM_TYPE } from '../../../../../base/anim/AnimCfg';
import { DynamicImage } from '../../../../../base/components/DynamicImage';
import MsgToastMgr from '../../../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../../../base/utils/UtilGame';
import UtilItem from '../../../../../base/utils/UtilItem';
import ItemModel from '../../../../../com/item/ItemModel';
import { WinTabPage } from '../../../../../com/win/WinTabPage';
import { E } from '../../../../../const/EventName';
import { RES_ENUM } from '../../../../../const/ResPath';
import { ViewConst } from '../../../../../const/ViewConst';
import EntityBase from '../../../../../entity/EntityBase';
import EntityUiMgr from '../../../../../entity/EntityUiMgr';
import ControllerMgr from '../../../../../manager/ControllerMgr';
import { EffectMgr } from '../../../../../manager/EffectMgr';
import ModelMgr from '../../../../../manager/ModelMgr';
import { BagMgr } from '../../../../bag/BagMgr';
import { ClientFlagEnum, WishState } from '../GeneralRecruitConst';
import { GeneralRecruitModel } from '../GeneralRecruitModel';
import CompLeftTop from './CompLeftTop';
import CompLog from './CompLog';
import { GeneralWishItem } from './GeneralWishItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class GeneralRecruitPage extends WinTabPage {
    // 概率预览
    @property(cc.Node)
    private BtnGL: cc.Node = null;
    @property(cc.Node)
    private NdAni: cc.Node = null;

    @property(cc.Node)// 招募1次
    private BtnRecruit1: cc.Node = null;
    @property(cc.Node)// 招募10次
    private BtnRecruit10: cc.Node = null;
    @property(cc.Node)// 招募50次
    private BtnRecruit50: cc.Node = null;

    @property(cc.Node)
    private NdRed1: cc.Node = null;
    @property(cc.Node)
    private NdRed10: cc.Node = null;
    @property(cc.Node)
    private NdRed50: cc.Node = null;
    // 招募1次
    @property(cc.Node)
    private BtnFree: cc.Node = null;
    @property(cc.Node)
    private NdCost: cc.Node = null;
    @property(cc.Label)
    private LabNum1: cc.Label = null;
    @property(DynamicImage)
    private spr1: DynamicImage = null;
    // 招募10次
    @property(cc.Label)
    private LabNum10: cc.Label = null;
    @property(DynamicImage)
    private spr10: DynamicImage = null;
    @property(cc.Node)
    private NdDisCount10: cc.Node = null;
    @property(cc.Label)
    private LabDisCount10: cc.Label = null;

    // 招募50次
    @property(cc.Label)
    private LabNum50: cc.Label = null;
    @property(DynamicImage)
    private spr50: DynamicImage = null;
    @property(cc.Node)
    private NdDisCount50: cc.Node = null;
    @property(cc.Label)
    private LabDisCount50: cc.Label = null;

    @property(cc.Node)
    private ComLeftTop: cc.Node = null;
    @property(cc.Node)
    private CompLog: cc.Node = null;

    @property(cc.RichText)
    private rtZhaoMuBide: cc.RichText = null;
    @property(cc.Toggle)
    private CkJumpAni: cc.Toggle = null;

    // 心愿
    @property(cc.Node)
    private NdWish: cc.Node = null;
    @property(cc.Node)
    private NdOpenWish1: cc.Node = null;
    @property(cc.Node)
    private NdOpenWish2: cc.Node = null;

    @property(GeneralWishItem)
    private wishItem1: GeneralWishItem = null;
    @property(GeneralWishItem)
    private wishItem2: GeneralWishItem = null;
    @property(cc.Node)
    private SprWishBg: cc.Node = null;
    @property(cc.Label)
    private LabNeedNum: cc.Label = null;
    // 模型
    @property(cc.Node)
    private NodeAni: cc.Node = null;
    /** 购买上限描述 */
    @property(cc.Label)
    private LabDesc: cc.Label = null;

    private _role: EntityBase = null;
    protected onEnable(): void {
        if (this._role) {
            this._role.resume();
        }
    }

    private _curIdx: number = 0;
    private _generalArr: Cfg_Server_GeneralZhaoMu[];
    /** 初始展示展示 */
    private showRealRole() {
        this._generalArr = this.model.getCfgBannerGeneral(this._actId);
        this.showModel();
        this.unschedule(this.showModel);
        this.schedule(this.showModel, 5);
    }
    /** 显示模型 */
    public showModel(): void {
        this.NodeAni.destroyAllChildren();
        this.NodeAni.removeAllChildren();
        if (this._curIdx >= this._generalArr.length) {
            this._curIdx = 0;
        }
        const itemId: number = this._generalArr[this._curIdx].ItemId;// 道具ID
        const item: Cfg_Item = UtilItem.GetCfgByItemId(itemId);
        const generalId = item.DetailId;
        const cfgGeneral: Cfg_General = this.model.getGeneralInfo(generalId);
        const cfg: Cfg_General = ModelMgr.I.GeneralModel.getCfg(cfgGeneral.Id);
        const res = cfg.AnimId.split('|')[0];

        this._role = EntityUiMgr.I.createAttrEntity(this.NodeAni, { resId: res, resType: ANIM_TYPE.PET, isPlayUs: false });
        this._curIdx++;
    }

    protected start(): void {
        super.start();
        UtilGame.Click(this.BtnGL, () => WinMgr.I.open(ViewConst.RandomLogTip, { isLog: false, actId: this._actId }), this);
        /** 武将心愿 */
        UtilGame.Click(this.NdOpenWish1, this._openWish, this);
        UtilGame.Click(this.NdOpenWish2, this._openWish, this);

        UtilGame.Click(this.BtnRecruit1, this._onRecrut, this, { customData: 1 });
        UtilGame.Click(this.BtnRecruit10, this._onRecrut, this, { customData: 10 });
        UtilGame.Click(this.BtnRecruit50, this._onRecrut, this, { customData: 50 });
        this.CkJumpAni.node.on('toggle', this._onJumpAni, this);// 跳过动画

        EventClient.I.on(E.Game.DayChange, this._onDayChange, this); // 监听跨天
    }
    protected onDestroy(): void {
        super.onDestroy();
        ModelMgr.I.GeneralRecruitModel.clearDeleteQueue(this._actId);
        this.unschedule(this._getLog);
        EventClient.I.off(E.Bag.ItemChange, this.onItemChange, this);
        EventClient.I.off(E.GeneralRecruit.SetWish, this._onSetWish, this);
        EventClient.I.off(E.GeneralRecruit.InitData, this._updateUI, this);
        EventClient.I.off(E.GeneralRecruit.ZhaoMuSuccess, this._onZhaoMuSuccess, this);
        EventClient.I.off(E.GeneralRecruit.getStageReward, this._onStageReward, this);
    }

    /** 跨时间点 */
    private _onDayChange(time: number): void {
        ControllerMgr.I.GeneralRecruitController.reqC2SZhaoMuUIData(this._actId);
    }

    private _onSetWish(): void {
        this._initRightTop();
    }

    private _onJumpAni() {
        this.model.setJumpAni(this._actId, this.CkJumpAni.isChecked);
    }

    private _rewardData: ItemData[] = [];
    private _luckyDrawData: S2CZhaoMuLuckyDraw;
    private _onZhaoMuSuccess(data: S2CZhaoMuLuckyDraw): void {
        if (data.FuncId === this._actId) {
            this._rewardData = [];
            this._rewardData = data.Reward;
            this._luckyDrawData = data;
            this._playAni();
            this._initLeftTopProgress();// 更新左侧进度
            this._initCenterRichText();// 更新中间文本描述
            this._initRightTop();// 更新右侧心愿武将 此时可能已经获得
            this._initBtnStates();// 更新招募按钮 免费次数用完
            this._upBuyTimesDesc();
        }
    }

    private _playAni() {
        const bol = this.model.getJumpAni(this._actId);
        if (!bol) { // 不勾选 播放动画 勾选跳过动画
            this.playAniSwitchScene();
        } else {
            this._showRewardTip();
        }
    }

    /** 切换地图显示云 */
    public playAniSwitchScene(): void {
        EffectMgr.PlayCocosAnim('animPrefab/ui/xzj_kq/anim/xzj_kq', this.NdAni, null, 0, true, () => {
            this._showRewardTip();
        });
    }

    /** 招募成功奖励弹窗 */
    private _showRewardTip() {
        const arrItemModel: ItemModel[] = [];
        if (this._rewardData && this._rewardData.length) {
            for (let i = 0, len = this._rewardData.length; i < len; i++) {
                const itemModel: ItemModel = UtilItem.NewItemModel(this._rewardData[i]);
                arrItemModel.push(itemModel);
            }
        }
        WinMgr.I.open(ViewConst.GeneralRecRewardWin, arrItemModel, this._actId, this._luckyDrawData);
    }

    /** 领取阶段奖励成功 */
    private _onStageReward(data: S2CZhaoMuGetStageRw): void {
        if (data.FuncId === this._actId) {
            const model = this.model;
            const curGet = model.getStageRwGet(this._actId);
            // 当前数据已经更新了。 应该获取之前
            const cfg: Cfg_Server_ZhaoMuStageReward = this.model.getCfgPreStageCfg(this._actId, curGet);
            const arrAward = cfg.Reward.split(':');
            const [itemId, itemNum] = [Number(arrAward[0]), Number(arrAward[1])];
            // isReward 是否是奖励（预览与领取奖励UI不同）
            WinMgr.I.open(ViewConst.GeneralAwardTip, {
                isReward: true, itemId, itemNum, leftNum: 0,
            });
            this._initLeftTopProgress();
        }
    }

    private _updateUI(data: S2CZhaoMuUIData): void {
        if (data.FuncId === this._actId) { // 防止相同类型活动开启
            this.CkJumpAni.isChecked = this.model.getJumpAni(this._actId);
            this._initLeftTopProgress();
            this._initCenterRichText();
            this._initRightTop();
            this._initBtnStates();
            this._initLogInfo();
            this.showRealRole();
            this._upBuyTimesDesc();

            this.unschedule(this._getLog);
            this.schedule(this._getLog, 3);
        }
    }

    /** 每次过几秒请求一下左下角记录 */
    private _getLog(): void {
        ControllerMgr.I.GeneralRecruitController.reqC2SZhaoMuOpenLog(this._actId, 2, ClientFlagEnum.ClientOut, 5);
    }

    /** 更新招募限制提示  测试说注释 */
    private _upBuyTimesDesc(): void {
        const buyTimes = ModelMgr.I.GeneralRecruitModel.getBuyTimes(this._actId);
        // const descStr = UtilString.FormatArgs(i18n.tt(Lang.general_BuyTimes), buyTimes);
        // this.LabDesc.string = descStr;
    }

    private _initLogInfo(): void {
        this.CompLog.getComponent(CompLog).setData();
    }
    // 左上角阶段奖励
    private _initLeftTopProgress() {
        // 当前值
        const model = this.model;
        const curNum: number = model.getStageRwNum(this._actId);// 当前数据
        // 下一阶段值
        const curGet: number = model.getStageRwGet(this._actId);// 当前已经领取的档位
        const nextNum: number = model.getCfgNextStageNum(this._actId, curGet);
        this.ComLeftTop.getComponent(CompLeftTop).setProgress(curNum, nextNum);
    }

    /** 中间 xxx次必得xxx */
    private _initCenterRichText() {
        const model = this.model;
        const num = model.getBaseRwNeedNum(this._actId);
        const cfgStr = model.getCfgRt(this._actId);
        this.rtZhaoMuBide.string = `<color=${UtilColor.NorV}>${UtilString.FormatArgs(cfgStr, num)}</c>`;
    }

    /** 右上角心愿库 */
    private _initRightTop() {
        const isOpen: boolean = this.model.isOpenWishCfg(this._actId); // 只有开启该功能，才显示
        if (isOpen) {
            this._initWishLayout();// 布局
        }
    }

    private _initWishLayout() {
        // 已经招募次数
        const curZmNum: number = this.model.getTotalNum(this._actId);// 当前招募次数
        // 配置表要招募次数
        const cfgNum: number = this.model.getCfgWishOpenNum(this._actId);

        const wishNum = this.model.getCfgWishNum(this._actId);
        this.wishItem2.node.active = wishNum !== 1;

        // 再招募xxx次开启
        if (curZmNum >= cfgNum) {
            this.LabNeedNum.string = '';
        } else {
            this.LabNeedNum.string = `${i18n.tt(Lang.general_need)}${cfgNum - curZmNum}${i18n.tt(Lang.general_need1)}`;
        }
        // 背景高度
        const h = wishNum === 1 ? 220 : 350;
        this.SprWishBg.height = h;

        const arrNum: number[] = this.model.getWishArrInfo(this._actId);

        if (wishNum === 1) { // 只有一个容器
            if (arrNum.length === 0) { // 都没有
                if (curZmNum >= cfgNum) {
                    this.wishItem1.getComponent(GeneralWishItem).setState(WishState.add);
                } else {
                    this.wishItem1.getComponent(GeneralWishItem).setState(WishState.lock);
                }
            } else {
                const id = arrNum[0];// 1个
                const isAlready = this.model.isInAlready(this._actId, id);// 在已完成列表
                if (isAlready) { // 已领取
                    this.wishItem1.getComponent(GeneralWishItem).setState(WishState.already);
                } else { // 未领取
                    this.wishItem1.getComponent(GeneralWishItem).setState(WishState.change);
                }
                const itemModel = this._getWishItemModel(id);
                this.wishItem1.getComponent(GeneralWishItem).loadIcon(itemModel);
                this.wishItem1.getComponent(GeneralWishItem).refreshLeftLogo(itemModel.cfg.LeftLogo, false);
            }
        } else if (wishNum === 2) { // 有两个容器
            if (curZmNum >= cfgNum) {
                if (arrNum.length === 0) { // 两个都没有
                    this.wishItem1.getComponent(GeneralWishItem).setState(WishState.add);
                    this.wishItem2.getComponent(GeneralWishItem).setState(WishState.add);
                } else if (arrNum.length === 1) {
                    // 两个中有一个
                    // 可以记录下，某个位置，已经实现，就不可以再被替换
                    this.setWishItem(this.wishItem1, arrNum[0]);
                    this.wishItem2.getComponent(GeneralWishItem).setState(WishState.add);
                } else {
                    // eslint-disable-next-line no-lonely-if
                    if (!this._posIds.length) { // 没有就第一次存储
                        this._posIds[0] = arrNum[0];
                        this._posIds[1] = arrNum[1];
                        this.setWishItem(this.wishItem1, arrNum[0]);
                        this.setWishItem(this.wishItem2, arrNum[1]);
                    } else {
                        // 有，那就得判断，当前 哪个是哪个
                        // eslint-disable-next-line no-lonely-if
                        if (arrNum[0] === this._posIds[0]) { // 还是旧位置不变
                            this.setWishItem(this.wishItem1, arrNum[0]);
                            this.setWishItem(this.wishItem2, arrNum[1]);
                            this._posIds[0] = arrNum[0];
                            this._posIds[1] = arrNum[1];
                        } else {
                            this.setWishItem(this.wishItem1, arrNum[1]);
                            this.setWishItem(this.wishItem2, arrNum[0]);
                            this._posIds[0] = arrNum[1];
                            this._posIds[1] = arrNum[0];
                        }
                    }
                }
            } else {
                this.wishItem1.getComponent(GeneralWishItem).setState(WishState.lock);
                this.wishItem2.getComponent(GeneralWishItem).setState(WishState.lock);
            }
        }
    }

    private _posIds: number[] = [];
    public setWishItem(wishItem: GeneralWishItem, id: number): void {
        const isAlready = this.model.isInAlready(this._actId, id);
        if (isAlready) {
            wishItem.getComponent(GeneralWishItem).setState(WishState.already);
        } else {
            wishItem.getComponent(GeneralWishItem).setState(WishState.change);
        }
        const itemModel = this._getWishItemModel(id);
        wishItem.getComponent(GeneralWishItem).loadIcon(itemModel, { offClick: true });
        wishItem.getComponent(GeneralWishItem).refreshLeftLogo(itemModel.cfg.LeftLogo, false);
    }

    private _getWishItemModel(tableId: number): ItemModel {
        const cfg: Cfg_Server_GeneralZhaoMu = this.model.getCfgZhaoMu(tableId);
        const itemModel = UtilItem.NewItemModel(cfg.ItemId, cfg.ItemNum);
        return itemModel;
    }

    /** 打开设置许愿 */
    private _openWish(): void {
        // 总共可以设置几个许愿
        const wishNum = this.model.getCfgWishNum(this._actId);

        const curZmNum: number = this.model.getTotalNum(this._actId);// 当前招募次数
        // 配置表要招募次数
        const cfgNum: number = this.model.getCfgWishOpenNum(this._actId);
        if (curZmNum >= cfgNum) {
            // 完成数量 不等于 能够放下的数量 就可以打开UI
            const arrNum: number[] = this.model.getCurGetWishInfo(this._actId);
            if (arrNum.length !== wishNum) { // 已设置 已获得没有东西
                WinMgr.I.open(ViewConst.GeneralWishTip, { actId: this._actId });
            } else {
                MsgToastMgr.Show(i18n.tt(Lang.general_allGet));
            }
        } else {
            MsgToastMgr.Show(i18n.tt(Lang.open_unopen));
        }
    }

    /** 三个招募按钮 */
    private _initBtnStates() {
        // 1次 是否免费
        const num = this.model.getFreeNum(this._actId);// 获得免费次数
        this.BtnFree.active = num > 0;
        this.NdCost.active = num === 0;

        this.NdRed1.active = num > 0;
        // 1次
        const [itemId1, num1] = this.model.getCfgCost(this._actId, 1);
        this.spr1.loadImage(`${RES_ENUM.Item}${itemId1}`, 1, true);
        const bagNum1 = BagMgr.I.getItemNum(itemId1);// 背包里的数量
        this.LabNum1.string = `${bagNum1}/${num1}`;
        this.LabNum1.node.color = bagNum1 >= num1 ? UtilColor.Green() : UtilColor.Red();

        // 10次
        const [itemId10, num10] = this.model.getCfgCost(this._actId, 10);
        this.spr10.loadImage(`${RES_ENUM.Item}${itemId10}`, 1, true);
        const bagNum10 = BagMgr.I.getItemNum(itemId10);// 背包里的数量
        this.NdRed10.active = bagNum10 >= num10;
        this.LabNum10.string = `${bagNum10}/${num10}`;
        this.LabNum10.node.color = bagNum10 >= num10 ? UtilColor.Green() : UtilColor.Red();
        // 是否显示折扣
        const bol10 = num10 / (10 * num1) !== 1;
        this.NdDisCount10.active = bol10;
        const discount10 = (num10 / (10 * num1)) * 10;
        if (bol10) this.LabDisCount10.string = `${discount10}${i18n.tt(Lang.general_disCount)}`;// 9折

        this.NdRed1.active = num > 0;

        // 50次
        const [itemId50, num50] = this.model.getCfgCost(this._actId, 50);
        this.spr50.loadImage(`${RES_ENUM.Item}${itemId50}`, 1, true);
        // this.LabNum50.string = `${num50}`;
        const bagNum50 = BagMgr.I.getItemNum(itemId50);// 背包里的数量
        this.NdRed50.active = bagNum50 >= num50;
        this.LabNum50.string = `${bagNum50}/${num50}`;
        this.LabNum50.node.color = UtilColor.costColor(bagNum50, num50);

        // 是否显示折扣
        const bol50 = num50 / (50 * num1) !== 1;
        this.NdDisCount50.active = bol50;
        const discount50 = (num50 / (50 * num1)) * 10;
        if (bol50) this.LabDisCount50.string = `${discount50}${i18n.tt(Lang.general_disCount)}`;// 9折
    }

    // 判断是否仓库超出最大容量
    private _checkMax(): boolean {
        const len = this.model.getCurBagLen(this._actId);
        // todo ask_: 常量表为什么要分一号仓库  WareHouse1
        const cfg: Cfg_Config_General = this.model.cfgActZhaoMuConfig.getValueByKey('WareHouse1');
        const maxGeneralLen = Number(cfg.CfgValue);
        return len >= maxGeneralLen;
    }
    /**
     * 发送招募
     * @param num
     * @param autoBuy
     */
    public reqLuckyDraw(num: number, autoBuy: number): void {
        if (this._checkMax()) {
            ModelMgr.I.MsgBoxModel.ShowBox(`<color=${UtilColor.NorV}>${i18n.tt(Lang.general_storefull)}</color>`, () => {
                ControllerMgr.I.GeneralRecruitController.reqZhaoMuLuckyDraw(this._actId, autoBuy, num);
            }, null);
        } else {
            ControllerMgr.I.GeneralRecruitController.reqZhaoMuLuckyDraw(this._actId, autoBuy, num);
        }
    }

    /** 招募 */
    private _onRecrut(target, num: number) {
        // 数量是否足够
        let bagNum = 0;
        if (num === 1) {
            const freeNum = this.model.getFreeNum(this._actId);// 获得免费次数
            if (freeNum) { // 有免费次数 啥也不管直接发
                this.reqLuckyDraw(num, 0);
                return;
            }
        }

        const [itemId, itemNum] = this.model.getCfgCost(this._actId, num);
        bagNum = BagMgr.I.getItemNum(itemId);
        if (bagNum >= itemNum) {
            this.reqLuckyDraw(num, 0);
        } else {
            // 判断是否弹窗
            // 如果弹窗勾选了本次登录不在显示
            const leftNum: number = itemNum - bagNum;
            const isOpenTip: boolean = this.model.isOpenTip;
            if (isOpenTip) {
                // WinMgr.I.open(ViewConst.WinComQuickPay, itemId, itemNum - bagNum);
                const buyTimes = this.model.getBuyTimes(this._actId);
                const descStr = UtilString.FormatArgs(i18n.tt(Lang.general_BuyTimes), buyTimes);
                WinMgr.I.open(ViewConst.GeneralAutoBuyTip, {
                    actId: this._actId, leftNum, num, descStr,
                });
                return;
            }

            /** 杜康酒配置 */
            const curItem: Cfg_ShopCity = this.model.getShopCfgByItemId(itemId);
            // 金币
            const price = curItem.GoodsPrice;// 1个杜康酒 需要 1000 金币
            const costNum = price * leftNum;

            const cfgItem: Cfg_Item = UtilItem.GetCfgByItemId(curItem.GoldType);

            const currencyNum = BagMgr.I.getItemNum(cfgItem.Id);
            if (costNum > currencyNum) {
                WinMgr.I.open(ViewConst.ItemSourceWin, curItem.GoldType);
                // this.close();
            } else {
                // ControllerMgr.I.GeneralRecruitController.reqZhaoMuLuckyDraw(this._actId, 1, num);
                this.reqLuckyDraw(num, 1);
            }
        }
    }

    public onItemChange(changes: { itemModel: ItemModel, status: number }[]): void {
        for (let i = 0, len = changes.length; i < len; i++) {
            const [itemId, num1] = this.model.getCfgCost(this._actId, 1);
            if (itemId === changes[i].itemModel.data.ItemId) {
                this._initBtnStates();
                break;
            }
        }
    }
    //
    private _containerId: number = 0;
    private _actId: number = 0;
    private model: GeneralRecruitModel;
    public init(containerId: number, param: unknown[], tabIdx: number, funcId: number): void {
        super.init(containerId, param, tabIdx, funcId);
        this.model = ModelMgr.I.GeneralRecruitModel;
        EventClient.I.on(E.Bag.ItemChange, this.onItemChange, this);
        EventClient.I.on(E.GeneralRecruit.InitData, this._updateUI, this);
        EventClient.I.on(E.GeneralRecruit.getStageReward, this._onStageReward, this);
        EventClient.I.on(E.GeneralRecruit.ZhaoMuSuccess, this._onZhaoMuSuccess, this);
        EventClient.I.on(E.GeneralRecruit.SetWish, this._onSetWish, this);
        // 活动数据
        this._containerId = containerId;
        this._actId = funcId;
        this.reqData(tabIdx);
    }

    public refreshPage(winId: number, param: unknown, tabIdx: number): void {
        super.refreshPage(winId, param, tabIdx);
        this.reqData(tabIdx);
    }

    private reqData(tabIdx: number) {
        const actIds: number[] = ModelMgr.I.ActivityModel.getActsByContainerId(this._containerId);
        // 根据活动页签 获取活动数据
        this._actId = actIds[tabIdx];

        this.ComLeftTop.getComponent(CompLeftTop).setActId(this._actId);
        this.CompLog.getComponent(CompLog).setActId(this._actId);
        ControllerMgr.I.ActivityController.reqC2SGetActivityConfig(this._actId);
        // 招募基础数据
        ControllerMgr.I.GeneralRecruitController.reqC2SZhaoMuUIData(this._actId);
    }
}

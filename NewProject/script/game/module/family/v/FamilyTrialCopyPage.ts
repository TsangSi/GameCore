import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { ANIM_TYPE } from '../../../base/anim/AnimCfg';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilCurrency } from '../../../base/utils/UtilCurrency';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { BattleCommon } from '../../../battle/BattleCommon';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ItemModel from '../../../com/item/ItemModel';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import EntityBase from '../../../entity/EntityBase';
import EntityUiMgr from '../../../entity/EntityUiMgr';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { EMapFbInstanceType } from '../../../map/MapCfg';
import MapMgr from '../../../map/MapMgr';
import { EBattleType } from '../../battleResult/BattleResultConst';
import { FuBenMgr } from '../../fuben/FuBenMgr';
import { RoleMgr } from '../../role/RoleMgr';
import { EVipFuncType } from '../../vip/VipConst';
import { FamilyFamilyType, FamilyPageType, FamilyTrialPageType } from '../FamilyConst';
import FamilyModel from '../FamilyModel';

const { ccclass, property } = cc._decorator;
/** 试炼副本 */
@ccclass
export default class FamilyTrialCopyPage extends WinTabPage {
    // 顶部信息
    @property(cc.Label)// boss名称 关卡数量
    private LabNameLevel: cc.Label = null;
    @property(cc.Label)// Label 进度条
    private LabProgress: cc.Label = null;
    @property(cc.ProgressBar)// Label 进度条
    private Progress: cc.ProgressBar = null;

    @property(cc.Node)// Boss
    private NdBossAni: cc.Node = null;

    @property(cc.Label)// 挑战剩余次数
    private LabTrialCanNum: cc.Label = null;
    @property(cc.Label)// 挑战总次数
    private LabTotalNum: cc.Label = null;

    @property(cc.Node)// 扫荡
    private BtnMopUp: cc.Node = null;
    @property(cc.Node)// 挑战
    private BtnFight: cc.Node = null;

    @property(cc.Node)// 排行榜
    private BtnRank: cc.Node = null;
    @property(cc.Node)// 红包
    private BtnRedPack: cc.Node = null;
    @property(cc.Node)// 奖励
    private BtnReward: cc.Node = null;

    @property(cc.Node)// 增加挑战次数
    private BtnAddNum: cc.Node = null;

    @property(cc.Node)// 红包红点
    private NdRedPackRed: cc.Node = null;

    @property(cc.Node)// 通关奖励红点
    private NdRewardRed: cc.Node = null;

    // @property(ListView)// 奖励列表
    // private list: ListView = null;

    @property(cc.Prefab)// 奖励预设
    private rewarditem: cc.Prefab = null;
    @property(cc.Node)// 奖励节点
    private NdItemContainer: cc.Node = null;

    public start(): void {
        super.start();
        UtilGame.Click(this.BtnMopUp, this._onBtnMopUpClick, this);// 扫荡
        UtilGame.Click(this.BtnFight, this._onBtnFightClick, this);// 挑战

        UtilGame.Click(this.BtnRank, this._onBtnRankClick, this);// 排行
        UtilGame.Click(this.BtnRedPack, this._onBtnRedPackClick, this);// 红包
        UtilGame.Click(this.BtnReward, this._onBtnRewardClick, this);// 通用奖励

        UtilGame.Click(this.BtnAddNum, this._onBtnAddNumClick, this);// 购买次数
    }

    /** 扫荡 */
    private _onBtnMopUpClick(): void {
        // 1、在活动时间内
        // 1、在活动时间内
        // 1、在活动时间内
        // 1、在活动时间内

        // 2、有伤害数据
        const hurtList: IntAttr[] = this.model.getTrialHurtList();
        const trialId: number = this.model.getTrialId();// 关卡
        if (hurtList?.length) {
            let bol = false;
            for (let i = 0; i < hurtList.length; i++) {
                const item = hurtList[i];
                if (item.K === trialId) {
                    bol = true;
                }
            }
            if (!bol) return;

            const trialCanNum = this.model.getTrialCanNum();// 剩余次数
            if (trialCanNum) {
                const lan = i18n.tt(Lang.family_hurtNum);// 确定按上次的伤害量

                hurtList.sort((l: IntAttr, r: IntAttr) => r.V - l.V);

                const hurt = hurtList[0].V;
                const lan2 = i18n.tt(Lang.family_sweep);

                ModelMgr.I.MsgBoxModel.ShowBox(`<color=${UtilColor.NorV}>${lan}<color=${UtilColor.RedV}>${hurt}</color>${lan2}</color>`, () => {
                    const trialId: number = this.model.getTrialId();// 关卡
                    ControllerMgr.I.FamilyController.reqC2STrialCopySweep(trialId);
                }, null);
            } else {
                this._showBuyInfo();
            }
        } else {
            MsgToastMgr.Show(i18n.tt(Lang.family_fightBeforMod));// 先完成挑战提示
        }
    }

    /** 挑战 */
    private _onBtnFightClick(): void {
        // 1 活动时间
        // 1 活动时间
        // 1 活动时间

        // 2 剩余挑战次数
        const trialCanNum = this.model.getTrialCanNum();// 剩余次数
        if (trialCanNum) {
            if (FuBenMgr.I.checkCanEnterFight(EMapFbInstanceType.YeWai, true)) {
                WinMgr.I.setViewStashParam(ViewConst.FamilyHomePage, [0]);
                WinMgr.I.setViewStashParam(ViewConst.FamilyWin, [FamilyPageType.FamilyFamilyPage]);
                WinMgr.I.setViewStashParam(ViewConst.FamilyTrialCopyWin, [FamilyTrialPageType.FamilyTrialCopyPage]);
                // WinMgr.I.open(ViewConst.FamilyWin, 1, [3]);
                // WinMgr.I.setViewStashParam(ViewConst.FamilyFamilyPage, [FamilyPageType.FamilyFamilyPage, FamilyFamilyType.FamilyTrial]);
                // WinMgr.I.setViewStashParam(ViewConst.FamilyTrialCopyWin, [FamilyTrialPageType.FamilyTrialCopyPage]);
                const trialId: number = this.model.getTrialId();// 关卡
                BattleCommon.I.enter(EBattleType.Family_TrialCopy, trialId);
            }
        } else {
            this._showBuyInfo();
        }
    }

    /** 排行榜 */
    private _onBtnRankClick(): void {
        WinMgr.I.open(ViewConst.FamilyTrialRankTip);
    }
    /** 红包 */
    private _onBtnRedPackClick(): void {
        WinMgr.I.open(ViewConst.FamilyTrialRedPackTip);
    }
    /** 奖励 */
    private _onBtnRewardClick(): void {
        WinMgr.I.open(ViewConst.FamilyTrialAwardTip);
    }

    private model: FamilyModel;
    public init(params: any): void {
        this.model = ModelMgr.I.FamilyModel;
        this._initList();
        this._initTime();

        EventClient.I.on(E.Family.FamilyTrialCopyInfo, this._onFamilyTrialCopyInfo, this);
        ControllerMgr.I.FamilyController.reqC2STrialCopyInfo(); // 试炼副本基础信息
        EventClient.I.on(E.Family.FamilyTrialBossInfo, this._onFamilyTrialBossInfo, this);
        ControllerMgr.I.FamilyController.reqC2STrialCopyBossInfo(); // 试炼副本基础信息

        EventClient.I.on(E.Family.FamilyTiralBuyNm, this._onFamilyTiralBuyNm, this);
        EventClient.I.on(E.Family.FamilyTrialFightSuccess, this._onFamilyTrialFightSuccess, this);
        // 打开红包成功
        EventClient.I.on(E.Family.FamilyRedPacketReward, this._onFamilyRedPacketReward, this);
        /** 领取通关奖励成功 */
        EventClient.I.on(E.Family.FamilyTrialGetReward, this._onFamilyTrialGetReward, this);
    }
    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Family.FamilyTrialGetReward, this._onFamilyTrialGetReward, this);
        EventClient.I.off(E.Family.FamilyRedPacketReward, this._onFamilyRedPacketReward, this);
        EventClient.I.off(E.Family.FamilyTrialFightSuccess, this._onFamilyTrialFightSuccess, this);
        EventClient.I.off(E.Family.FamilyTiralBuyNm, this._onFamilyTiralBuyNm, this);
        EventClient.I.off(E.Family.FamilyTrialBossInfo, this._onFamilyTrialBossInfo, this);
        EventClient.I.off(E.Family.FamilyTrialCopyInfo, this._onFamilyTrialCopyInfo, this);
    }

    /** 扫荡成功 */
    private _onFamilyTrialFightSuccess(): void {
        // 由于挑战成功之后。没有更新。所以在扫荡时候，重新请求数据
        ControllerMgr.I.FamilyController.reqC2STrialCopyInfo(); // 试炼副本基础信息
        ControllerMgr.I.FamilyController.reqC2STrialCopyBossInfo(); // 试炼副本基础信息
    }

    public refreshPage(winId: number, params: any[]): void {
        ControllerMgr.I.FamilyController.reqC2STrialCopyInfo(); // 试炼副本基础信息
        ControllerMgr.I.FamilyController.reqC2STrialCopyBossInfo(); // 试炼副本基础信息
    }

    /** 倒计时 */
    private _initTime(): void {
        // 当前;
        const nowSec = UtilTime.NowSec();// 当前时间
        const week = UtilTime.getWeekNum(nowSec);// 周1 - 7

        const h: number = UtilTime.getHour(nowSec);// 获取当前是几点
        const min: number = UtilTime.getMinutes(nowSec);// 获取当前是几分

        const cfgStTime: string[] = this.model.getCfgTrialCopyST().split('|');

        const weekStart = Number(cfgStTime[0]);// 周1开始

        const cfgEtTime: string[] = this.model.getCfgTrialCopyET().split('|');
        const weekEnd = Number(cfgStTime[0]);// 周1开始

        // 判断当前时间是进心中 还是结束未开始

        // let weekStar

        //
    }

    /** 点击增加按钮 */
    private _onBtnAddNumClick(): void {
        const { tip, vipLv } = ModelMgr.I.VipModel.getMinTimesCfg(EVipFuncType.TrialCopyCount);
        if (RoleMgr.I.d.VipLevel < vipLv) {
            MsgToastMgr.Show(tip);
            return;
        }

        // 判断挑战次数是否足够
        const totalNum: number = this.model.getCfgTrialCopyTimes();// 最多可挑战次数
        const trialCanNum = this.model.getTrialCanNum();// 剩余次数
        if (trialCanNum < totalNum) { // 剩余次数
            this._showBuyInfo();
        } else {
            // 当前挑战次数已满
            MsgToastMgr.Show(i18n.tt(Lang.family_max_challengeTimes));
            // WinMgr.I.close(ViewConst.ConfirmBox);
        }
        // 判断挑战次数是否足够
        // const totalNum: number = this.model.getCfgTrialCopyTimes();// 最多可挑战次数
        // const trialCanNum = this.model.getTrialCanNum();// 剩余次数
        // if (trialCanNum < totalNum) { // 剩余次数
        // const buyNum = this.model.getTrialBuyNum();// 已经购买了几次
        // // 购买次数上限 读vip?
        // const vipLv = RoleMgr.I.d.VipLevel;
        // const limit = ModelMgr.I.VipModel.vipTrialCount(vipLv).split(':')[1];
        // if (buyNum >= Number(limit)) {
        //     MsgToastMgr.Show(i18n.tt(Lang.family_buyLimit));// '购买次数已达上限'
        // } else {
        // this._showBuyInfo();
        // }
        // } else {
        //     // 当前挑战次数已满
        //     MsgToastMgr.Show(i18n.tt(Lang.family_max_challengeTimes));
        // }
    }

    private _showBuyInfo(): void {
        // 判断挑战次数是否足够
        const totalNum: number = this.model.getCfgTrialCopyTimes();// 最多可挑战次数
        const trialCanNum = this.model.getTrialCanNum();// 剩余次数
        if (trialCanNum < totalNum) { // 剩余次数
            // this._showBuyInfo();
        } else {
            // 当前挑战次数已满
            MsgToastMgr.Show(i18n.tt(Lang.family_max_challengeTimes));
            WinMgr.I.close(ViewConst.ConfirmBox);
            return;
        }
        const buyNum = this.model.getTrialBuyNum();// 已经购买了几次

        // 购买次数上限 读vip?
        const vipLv = RoleMgr.I.d.VipLevel;
        const limit = ModelMgr.I.VipModel.vipTrialCount(vipLv).split(':')[1];

        const [itemId, itemNum] = this.model.getBuyCostBuyNum(buyNum + 1);
        const itemModel: ItemModel = UtilItem.NewItemModel(itemId, itemNum);
        // const isCostStr = i18n.tt(Lang.army_iscost);// 是否消耗
        // const itemNumName: string = `${itemNum}${itemModel.cfg.Name}`;
        // const buyOneTimes = i18n.tt(Lang.family_buyOneTime);// 购买一次挑战次数

        // const todayBuyNum = i18n.tt(Lang.family_todayBuyNum);// 今日可购买次数
        const pos = ModelMgr.I.VipModel.vipName(vipLv);
        const laug = i18n.tt(Lang.arena_challenge_time_unenough_tip);

        const config = [
            UtilColor.NorV,
            UtilColor.GreenV,
            itemNum,
            1,
            pos,
            Number(limit) - buyNum,
            limit,
            Number(limit) - buyNum > 0 ? UtilColor.GreenV : UtilColor.RedV,
            itemModel.cfg.Name,
        ];
        const tipString = UtilString.FormatArray(
            laug,
            config,
        );

        ModelMgr.I.MsgBoxModel.ShowBox(
            tipString,
            () => {
                if (Number(limit) - buyNum > 0) {
                    if (!RoleMgr.I.checkCurrency(itemId, itemNum)) {
                        MsgToastMgr.Show(`${itemModel.cfg.Name}${i18n.tt(Lang.com_buzu)}`);
                        return;
                    }
                    ControllerMgr.I.FamilyController.reqC2STrialCopyBuyNum();
                    MsgToastMgr.Show(i18n.tt(Lang.com_buy_success));
                } else {
                    MsgToastMgr.Show(i18n.tt(Lang.arena_buy_times_unenough));
                }
            },
            { showToggle: '', cbCloseFlag: 'FamilyTrialCopy' },
        );
    }

    /** 打开红包成功 更新红点 */
    private _onFamilyRedPacketReward(): void {
        this._updateRedPackRed();
    }

    // 试炼副本基础信息
    private _onFamilyTrialCopyInfo(): void {
        this._initChallengeInfo();
    }
    /** boss信息 */
    private _onFamilyTrialBossInfo(): void {
        this._initBossInfo();
        this._updateRedPackRed();
        this._updateRewardRed();
    }

    /** 有可以打开的红包则显示红点 */
    private _updateRedPackRed(): void {
        const hasCanOpen = this.model.hasCanOpenRedPack();
        this.NdRedPackRed.active = hasCanOpen;
    }

    private _onFamilyTrialGetReward(): void {
        this._updateRewardRed();
    }
    /** 通关奖励红点 */
    private _updateRewardRed(): void {
        const hasCanReward = this.model.hasCanGetReward();
        this.NdRewardRed.active = hasCanReward;
    }

    /** 购买成功 需要更新购买信息 */
    private _onFamilyTiralBuyNm(): void {
        this._initChallengeInfo();
        this._showBuyInfo();
    }

    /** Boss首领模型 */
    private _role: EntityBase = null;
    protected onEnable(): void {
        if (this._role) {
            this._role.resume();
        }
    }
    /** 顶部的 关卡 名称 进度条信息 */
    private _initBossInfo(): void {
        // 名称等级
        const trialId: number = this.model.getTrialId();// 关卡
        const name: string = this.model.getCfgTrialBossName(trialId);// 名称
        this.LabNameLevel.string = `${i18n.tt(Lang.arena_di)}${trialId}${i18n.tt(Lang.com_cen)} ${name}`;// `第${trialId}层 ${name}`;
        // 血量进度
        const TotalHpNum: number = this.model.getCfgTrialBossHp(trialId);// 获取boss总血量
        const hp: number = this.model.getBossHp();// 当前血量
        this.LabProgress.string = `${hp}/${TotalHpNum}`;
        this.Progress.progress = hp / TotalHpNum;
        // 模型

        this.NdBossAni.active = true;
        this.NdBossAni.destroyAllChildren();
        this.NdBossAni.removeAllChildren();

        const refreshId: number = ModelMgr.I.FamilyModel.getCfgTrialBossId(trialId);
        const cfgRefresh: Cfg_Refresh = MapMgr.I.CfgRefresh(refreshId);
        const boss: Cfg_Monster = MapMgr.I.CfgMonster(Number(cfgRefresh.MonsterIds.split('|')[0]));
        this._role = EntityUiMgr.I.createAttrEntity(this.NdBossAni, { resId: boss.AnimId, resType: ANIM_TYPE.PET, isPlayUs: false });
    }

    /** 挑战次数信息  剩余次数/上限 */
    private _initChallengeInfo(): void {
        const totalNum: number = this.model.getCfgTrialCopyTimes();// 最多可挑战次数
        const trialCanNum = this.model.getTrialCanNum();// 剩余次数
        this.LabTrialCanNum.string = `${trialCanNum}/`;
        this.LabTotalNum.string = `${totalNum}`;
    }

    // 奖励信息
    private _rewards: any[][];
    private _initList(): void {
        this._rewards = this.model.getCfgTrialRewards();

        this.NdItemContainer.destroyAllChildren();
        for (let i = 0; i < this._rewards.length; i++) {
            const node: cc.Node = cc.instantiate(this.rewarditem);
            // node.scale = 0.8;
            this.NdItemContainer.addChild(node);

            const item: ItemIcon = node.getComponent(ItemIcon);
            const itemId: number = Number(this._rewards[i][0]);
            const itemNum: number = Number(this._rewards[i][1]);
            const itemModel: ItemModel = UtilItem.NewItemModel(itemId, itemNum);
            item.setData(itemModel, { needNum: true });
        }

        // this.list.setNumItems(this._rewards.length, 0);
        // this.list.scrollTo(0);
    }
    // public onRenderList(nd: cc.Node, index: number): void {
    //     const item: ItemIcon = nd.getComponent(ItemIcon);
    //     const itemId: number = Number(this._rewards[index][0]);
    //     const itemNum: number = Number(this._rewards[index][1]);
    //     const itemModel: ItemModel = UtilItem.NewItemModel(itemId, itemNum);
    //     item.setData(itemModel, { needNum: true });
    // }
}

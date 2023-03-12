/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: wangxin
 * @Date: 2022-10-31 17:13:41
 * @FilePath: \SanGuo2.4\assets\script\game\module\boss\v\ComBossPage.ts
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { EventProto } from '../../../../app/base/event/EventProto';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { ANIM_TYPE } from '../../../base/anim/AnimCfg';
import { DynamicImage } from '../../../base/components/DynamicImage';
import ListView from '../../../base/components/listview/ListView';
import { TickTimer } from '../../../base/components/TickTimer';
import { Config } from '../../../base/config/Config';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { BattleCommon } from '../../../battle/BattleCommon';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ItemModel from '../../../com/item/ItemModel';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { RES_ENUM } from '../../../const/ResPath';
import { ViewConst } from '../../../const/ViewConst';
import EntityUiMgr from '../../../entity/EntityUiMgr';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { EMapFbInstanceType } from '../../../map/MapCfg';
import { BagMgr } from '../../bag/BagMgr';
import { EBattleType } from '../../battleResult/BattleResultConst';
import { FuBenMgr } from '../../fuben/FuBenMgr';
import { RoleMgr } from '../../role/RoleMgr';
import { EVipFuncType } from '../../vip/VipConst';
import { VipModel } from '../../vip/VipModel';
import {
    BossPageType, LocalBossPageType, MultiBossState, WorldBossPageType,
} from '../BossConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class ComBossPage extends WinTabPage {
    @property(cc.Node)
    private NdBossAmin: cc.Node = null;

    /** boss名字和称号 */
    @property(cc.Node)
    private NdBossName: cc.Node = null;
    @property(cc.Label)
    private bossName: cc.Label = null;

    @property(cc.Node)
    private NdHp: cc.Node = null;

    @property(cc.Toggle)
    private NdLockon: cc.Toggle = null;

    @property(cc.Node)
    private NdRefresh: cc.Node = null;

    @property(cc.Label)
    private LbRefreshCd: cc.Label = null;
    // 右边按钮
    @property(cc.Node)
    private NdRank: cc.Node = null;

    @property(cc.Node)
    private NdBuff: cc.Node = null;

    // 挑战按钮次数
    @property(cc.Node)
    private NdChangeBtn: cc.Node = null;
    @property(cc.Label)
    private LbChangeNum: cc.Label = null;

    // 挑战恢复时间和次数
    @property(cc.Label)
    private LbReNum: cc.Label = null;
    @property(TickTimer)
    private LbReTime: TickTimer = null;
    @property(cc.Node)
    private NdAddChangeNum: cc.Node = null;

    // 挑战奖励区块
    @property(cc.Label)
    private LbForPlay: cc.Label = null;
    @property(cc.Label)
    private LbNowT: cc.Label = null;
    @property(ListView)
    private NdRewardJoin: ListView = null;
    @property(ListView)
    private NdRewardFor: ListView = null;
    @property(cc.Node)
    private NdLbitemT2: cc.Node = null;
    @property(ListView)
    private NdBossList: ListView = null;
    @property(cc.Node)
    private NdLeftArrow: cc.Node = null;
    @property(cc.Node)
    private NdRightArrow: cc.Node = null;

    private type: LocalBossPageType = LocalBossPageType.Personal;

    private selectIndex: number = 0;
    private bossId: number = 0;
    private bossUpdInfo: S2CGetMultiBossData = null;
    private bossInfoList: { id: number, bossName: string, bossAnimId: number, needLevel: number }[] = [];
    private AwardList: { join: { itemModel: ItemModel[], isMust: number[] }, best: { itemModel: ItemModel[], isMust: number[] } } = null;
    private myArmyLv: number = 0;
    public init(winId: number, param: unknown[]): void {
        super.init(winId, param, 0);
        // 一分钟刷新一次boss详情
        this.schedule(() => {
            ControllerMgr.I.BossController.reqGetMultiBossData(this.bossId);
            this.upDataNet();
        }, 30);
    }

    public start(): void {
        super.start();
        // client
        EventClient.I.on(E.Boss.UptMulitBoss, this.updBossData, this);
        EventClient.I.on(E.Boss.UptMulitBossPlayData, this.updMyselfData, this);
        EventClient.I.on(E.Boss.MultiBossBuyChage, this.upDataNet, this);
        EventClient.I.on(E.Boss.MultiBossReliveList, this.setBossReliveList, this);
        EventClient.I.on(E.Boss.MtBossInspirem, this.upDMtBossInspirem, this);
        this.NdBossList.node.on('scrolling', this.BListcb, this);
        // net
        // EventProto.I.on(ProtoId.S2CMultiBossFocus_ID, this.LockonBoss, this);
        EventProto.I.on(ProtoId.S2CMultiBossRelive_ID, this.BossReLive, this);
        this.setData(LocalBossPageType.MultiBoss);
    }

    public refreshPage(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        super.refreshPage(winId, param, tabIdx, tabId);
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Boss.UptMulitBoss, this.updBossData, this);
        EventClient.I.off(E.Boss.UptMulitBossPlayData, this.updMyselfData, this);
        EventClient.I.off(E.Boss.MultiBossBuyChage, this.upDataNet, this);
        EventClient.I.off(E.Boss.MultiBossReliveList, this.setBossReliveList, this);
        EventClient.I.off(E.Boss.MtBossInspirem, this.upDMtBossInspirem, this);
        // EventProto.I.off(ProtoId.S2CMultiBossFocus_ID, this.LockonBoss, this);
        EventProto.I.off(ProtoId.S2CMultiBossRelive_ID, this.BossReLive, this);
        this.unscheduleAllCallbacks();
    }

    public setData(type: LocalBossPageType): void {
        this.type = type;
        this.selectIndex = 0;
        // 离谱，这个居然比start还快
        /**
         * 选择boss优先级
         * 优先选择正在挑战的boss 等协议回传解析
         * 其次选择可挑战军衔最高的boss
         * 该方法是打开页面后
         */

        this.myArmyLv = RoleMgr.I.d.ArmyLevel;
        this.bossInfoList = ModelMgr.I.BossModel.GetBossBaseInfo(type);

        const modelId = ModelMgr.I.BossModel.getFightId();
        if (modelId !== -1) {
            this.selectIndex = this.bossInfoList.findIndex((v) => v.id === modelId);
        } else {
            for (let i = this.bossInfoList.length; i > 0; i--) {
                if (this.bossInfoList[i - 1].needLevel <= this.myArmyLv) {
                    this.selectIndex = i - 1; //  this.bossInfoList[i - 1].id;
                    break;
                }
            }
        }

        this.bossId = this.bossInfoList[this.selectIndex].id;
        ControllerMgr.I.BossController.reqGetMultiBossData(this.bossId);
        // console.log('世界boss', type, this.bossInfoList);
        this.updateUIdata();
    }

    public updateUIdata(): void {
        this.setBossInfo();
        this.setLeftBtn();
        this.setChagerBtn();
        this.NdBossList.updateAll();
        this.setRewardItem();
        this.upDataNet();

        // 有时候战斗结束回来协议先到，界面后开，特殊处理下
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const bossData = ModelMgr.I.BossModel.GetMultiBossData();
        if (bossData && bossData.Id === this.bossId) {
            this.updBossData(bossData);
        }
    }

    public upDataNet(showBuy: boolean = false): void {
        // ControllerMgr.I.BossController.reqGetMultiBossData(this.bossId);
        ControllerMgr.I.BossController.reqC2SMultiBossGetPlayerData();
        ControllerMgr.I.BossController.reqC2SMultiBossGetReliveList();

        this.buyTimesView(showBuy);
    }

    private updBossData(d: S2CGetMultiBossData) {
        if (d.Id === this.bossId) {
            // upade boss data
            if (d.CurrOwnerAreaId !== 0) {
                this.LbNowT.string = i18n.tt(Lang.multiBossBeforNow);
                this.LbForPlay.string = `${UtilGame.ShowNick(d.CurrOwnerAreaId, d.CurrOwnerNick)}`;
            } else if (d.LastOwnerAreaId !== 0) {
                this.LbNowT.string = i18n.tt(Lang.multiBossBefor);
                this.LbForPlay.string = `${UtilGame.ShowNick(d.LastOwnerAreaId, d.LastOwnerNick)}`;
            } else {
                this.LbNowT.string = i18n.tt(Lang.multiBossBefor);
                this.LbForPlay.string = i18n.tt(Lang.com_noman_is);
            }
            this.bossUpdInfo = d;
            this.setBossCdTime();
        }
    }

    public parseAwardlist(path: string): { itemModel: ItemModel[], isMust: number[] } {
        const itemModel: ItemModel[] = [];
        const isMust: number[] = [];
        const arr = path.split('|');
        arr.forEach((v: string) => {
            const subdata = v.split(':');
            const _itemM = UtilItem.NewItemModel(Number(subdata[0]), Number(subdata[1]));
            itemModel.push(_itemM);
            // 概率标识 1概率， 2 必掉
            isMust.push(Number(subdata[2]));
        });
        return { itemModel, isMust };
    }

    /** 设置boss详情 */
    private setBossInfo(): void {
        const bossInfo = this.bossInfoList[this.selectIndex];
        const animId: number = bossInfo.bossAnimId;
        const name: string = bossInfo.bossName;
        const bossLv: number = bossInfo.needLevel;
        this.setBossAmin(animId);
        this.setBossNameInfo(name, bossLv);
        this.NdBossList.setNumItems(this.bossInfoList.length);
        this.NdBossList.scrollTo(this.selectIndex);
        // this.setBossCdTime();
    }

    /** 设置模型 */
    private anmiId: number = 0;
    private setBossAmin(animId: number): void {
        if (animId === this.anmiId) return;
        this.anmiId = animId;
        this.NdBossAmin.destroyAllChildren();
        this.NdBossAmin.removeAllChildren();
        EntityUiMgr.I.createAttrEntity(
            this.NdBossAmin,
            {
                resId: animId,
                resType: ANIM_TYPE.PET,
                isPlayUs: false,
            },
        );
    }

    /** 设置boss名和称号 */
    private setBossNameInfo(name: string, lv: number): void {
        // const bossName = this.NdBossName.getComponentInChildren(cc.Label);
        const bossNameicon = this.NdBossName.getChildByName('SprLvIcon').getComponent(DynamicImage);
        const bossTitle = this.NdBossName.getChildByName('SprTitle').getComponent(DynamicImage);
        this.bossName.string = name;
        const url = ModelMgr.I.ArmyLevelModel.getNameIconByArmyLv(lv);
        bossTitle.loadImage(url, 1, true);
        const urlT = `${RES_ENUM.Role_RoleArmy_Icon_Junxian}${lv}`;
        bossNameicon.loadImage(urlT, 1, true);
    }

    private bossHeadRelive: MultiBossRelive[] = [];
    /**
     * 设置boss头像倒计时 逃跑，复活
     */
    private setBossReliveList(d: S2CMultiBossGetReliveList): void {
        this.NdBossList.content.children.forEach((v, index) => {
            v.getChildByName('bgTime').active = false;
            const head = v.getChildByName('HeadMask').getChildByName('HeadImg');
            const myLv = RoleMgr.I.getArmyLevel();
            const bossInfo = this.bossInfoList[index];
            const needLv = bossInfo.needLevel;
            UtilCocos.SetSpriteGray(head, myLv < needLv);
        });
        if (d) {
            this.bossHeadRelive = d.List;
            for (let j = 0; j < this.bossHeadRelive.length; j++) {
                const bossId = this.bossHeadRelive[j].Id;
                const idx = this.bossInfoList.findIndex((v) => v.id === bossId);
                const item = this.NdBossList.getItemByListId(idx);
                const btTime = item.getChildByName('bgTime');
                const head = item.getChildByName('HeadMask').getChildByName('HeadImg');
                if (idx >= 0) {
                    if (item) {
                        const nowTime = UtilTime.NowSec();
                        const runaTime = this.bossHeadRelive[j].ReliveTime > nowTime;
                        btTime.active = runaTime || this.bossHeadRelive[j].RunAwayTime > nowTime;
                        UtilCocos.SetSpriteGray(head, runaTime);
                        if (runaTime) {
                            const tk = btTime.getComponentInChildren(TickTimer);
                            tk.tick(this.bossHeadRelive[j].ReliveTime - nowTime, '%mm:%ss', true, true);
                            tk.node.color = UtilColor.Hex2Rgba(UtilColor.GreenG);
                        }
                        if (this.bossHeadRelive[j].RunAwayTime > nowTime) {
                            const tk = btTime.getComponentInChildren(TickTimer);
                            tk.tick(this.bossHeadRelive[j].RunAwayTime - nowTime, '%mm:%ss', true, true);
                            tk.node.color = UtilColor.Hex2Rgba(UtilColor.RedG);
                        }
                    }
                    // tk.addEndEventHandler(this.node, 'ComBossPage', 'headListTkEvent', String(k));
                } else {
                    btTime.active = false;
                }
            }
        }
    }

    private _bossSelectIndex = -1;
    /** 设置boss头像 */
    private setBossHead(item: cc.Node, i: number): void {
        // 设置头像
        if (this.bossInfoList.length === 0) return;
        const bossInfo = this.bossInfoList[i];
        item.active = true;
        const changeLvLimit = bossInfo.needLevel;
        const myLv = RoleMgr.I.getArmyLevel();
        const headImg = item.getChildByName('HeadMask').getChildByName('HeadImg');

        // 头像倒计时 需要boss刷新时间列表
        // const bossTimeList: number = [];
        //
        const idx = this.bossHeadRelive.findIndex((v) => v.Id === bossInfo.id);
        item.getChildByName('bgTime').active = idx !== -1;
        const head = headImg.getComponent(DynamicImage);
        // 和加锁状态
        UtilCocos.SetSpriteGray(headImg, changeLvLimit > myLv || idx !== -1);
        item.getChildByName('lock').active = changeLvLimit > myLv;
        head.loadImage(`${RES_ENUM.HeadIcon}${bossInfo.bossAnimId}`, 1, true);
        const titel = item.getChildByName('SprTitle').getComponent(DynamicImage);
        titel.loadImage(ModelMgr.I.ArmyLevelModel.getNameIconByArmyLv(bossInfo.needLevel), 1, true);
        item.getChildByName('NdSelect').active = i === this.selectIndex;

        UtilGame.Click(item, () => {
            if (i === this._bossSelectIndex) return;
            this._bossSelectIndex = i;
            const changeLvLimit = this.bossInfoList[i].needLevel;
            const msg = i18n.tt(Lang.multiBossTips);
            const amyInfo = ModelMgr.I.ArmyLevelModel.getArmyName(changeLvLimit, 1);
            if (changeLvLimit > myLv) {
                MsgToastMgr.Show(UtilString.replaceAll(msg, '{1}', `${amyInfo}`));
            } else {
                item.getChildByName('NdSelect').active = true;
                // 设置个刷新cd，防止频繁点击
                if (this.selectIndex === i && this.refbossHeadCd === 3) {
                    this.refbossHeadCd = 0;
                    this.scheduleOnce(() => {
                        this.refbossHeadCd = 3;
                    }, 1);
                    return;
                } else if (this.NdBossList.getItemByListId(this.selectIndex)) {
                    this.NdBossList.getItemByListId(this.selectIndex).getChildByName('NdSelect').active = false;
                }
                this.selectIndex = i;

                this.bossId = this.bossInfoList[i].id;

                this.updateUIdata();
                ControllerMgr.I.BossController.reqGetMultiBossData(this.bossId);
            }
        }, this, { scale: 1 });
    }
    private refbossHeadCd: number = 3;
    /** boss刷新状态 */
    private setBossCdTime() {
        const bossStatus: number = this.bossUpdInfo.State;
        const hp: number = this.bossUpdInfo.Hp;
        // 三种状态， 有血条和倒计时，刷新cd中，刷新中文字 0 初始，1 挑战，2 复活
        const NdTime = this.NdHp.getChildByName('NdTimer');
        this.NdHp.active = bossStatus !== 2;
        NdTime.active = bossStatus === 1;
        this.NdRefresh.active = bossStatus === 2;
        this.LbRefreshCd.node.active = false;// bossStatus === 2;

        const HpBar = this.NdHp.getChildByName('BarHp').getComponent(cc.ProgressBar);
        const bossHpTotal = ModelMgr.I.BossModel.GetMultiBossAttr(this.bossId);
        const barNum = this.NdHp.getChildByName('BarHp').getComponentInChildren(cc.Label);

        this.NdLockon.isChecked = this.bossUpdInfo.Focus === 1;
        if (bossStatus === MultiBossState.Begin) {
            NdTime.active = false;
            HpBar.progress = 1;
            barNum.string = `100%`;
        }
        if (bossStatus === MultiBossState.Fighting) {
            NdTime.active = true;
            const hpNum = hp / parseInt(bossHpTotal.Attr_1) * 100 > 1 ? Math.floor(hp / parseInt(bossHpTotal.Attr_1) * 100) : hp === 0 ? 0 : 1;
            barNum.string = `${hpNum}%`;
            HpBar.progress = hp / parseInt(bossHpTotal.Attr_1);
            const reliveTime = this.bossUpdInfo.RunAwayTimestamp - UtilTime.NowSec();
            const timeLess = this.NdHp.getComponentInChildren(TickTimer);
            timeLess.tick(reliveTime, `${i18n.tt(Lang.com_time_fmt_hms)}${i18n.tt(Lang.multBossRunaway)}`, false, true);
        }
        if (bossStatus === MultiBossState.relive) {
            // 消耗道具图标
            const item = ModelMgr.I.BossModel.GetMultiRelive(this.bossId);
            const useIcon = this.NdRefresh.getChildByName('NdRefreshBtn').getComponentInChildren(DynamicImage);
            console.log('刷新道具', item[0], item[1]);
            const _itemMode = UtilItem.NewItemModel(Number(item[0]), Number(item[1]));
            useIcon.loadImage(`${RES_ENUM.Item}${_itemMode.cfg.PicID}`, 1, true);
            const useNum = this.NdRefresh.getComponentInChildren(cc.Label);
            useNum.string = ` ${item[1]} ${i18n.tt(Lang.com_refesh)}`;
            const reliveTime = this.bossUpdInfo.ReliveTimestamp - UtilTime.NowSec();
            const timeLess = this.NdRefresh.getComponentInChildren(TickTimer);
            timeLess.tick(reliveTime, `${i18n.tt(Lang.com_time_fmt_hms)}${i18n.tt(Lang.com_refesh)}`, false, true);
            UtilGame.Click(this.NdRefresh.getChildByName('NdRefreshBtn'), () => {
                // 点击刷新;
                const itemN = BagMgr.I.getItemNum(Number(item[0]));
                console.log('消耗道具刷新boss', itemN);
                if (itemN > 0) {
                    ControllerMgr.I.BossController.reqC2SMultiBossRelive(this.bossId);
                    ControllerMgr.I.BossController.reqC2SMultiBossGetReliveList();
                } else {
                    WinMgr.I.open(ViewConst.ItemSourceWin, Number(item[0]));
                    // MsgToastMgr.Show(`${UtilItem.GetCfgByItemId(Number(item[0])).Name}不足`);
                }
            }, this);
            // 刷新中
            // this.LbRefreshCd.string = '刷新中....';
        }
    }

    /** 设置leftBtn */
    private setLeftBtn() {
        UtilGame.Click(this.NdBuff, () => {
            WinMgr.I.open(ViewConst.BossInspireWin, this.bossId, this.inspLeftT, this.inspNum);
        }, this);
        UtilGame.Click(this.NdRank, () => {
            WinMgr.I.open(ViewConst.BossRankList, this.bossId);
        }, this);
    }

    /** 设置挑战按钮 */
    private setChagerBtn() {
        // 挑战等级限制
        const changeLvLimit = this.bossInfoList[this.selectIndex].needLevel;
        const myLv = RoleMgr.I.getArmyLevel();
        // const myArmyStar = RoleMgr.I.getArmyStar();
        UtilCocos.SetSpriteGray(this.NdChangeBtn, changeLvLimit > myLv);
        UtilGame.Click(this.NdChangeBtn, () => {
            const msg = i18n.tt(Lang.multiBossTips);
            const amyInfo = ModelMgr.I.ArmyLevelModel.getArmyName(changeLvLimit, 1);
            // const amycolor: string = ArmyLvConst.getLvColorByArmyLV(changeLvLimit);
            if (amyInfo) {
                if (changeLvLimit > myLv) {
                    MsgToastMgr.Show(UtilString.replaceAll(msg, '{1}', `${amyInfo}`));
                    return;
                }
                WinMgr.I.setViewStashParam(ViewConst.BossWin, [BossPageType.Local, LocalBossPageType.MultiBoss]);
                if (FuBenMgr.I.checkCanEnterFight(EMapFbInstanceType.YeWai, true)) {
                    // ControllerMgr.I.BossController.reqC2SMultiBossFight(this.bossId);
                    BattleCommon.I.enter(EBattleType.MultiBoss_PVE, this.bossId);
                }
            }
        }, this);
    }

    /** 设置奖励区块 */
    private setRewardItem(): void {
        this.NdRewardJoin.updateAll();

        if (this.type === LocalBossPageType.MultiBoss) {
            this.NdRewardFor.updateAll();
            this.NdLbitemT2.active = this.type === LocalBossPageType.MultiBoss;
            const _List = ModelMgr.I.BossModel.GetMultiPrize(this.bossId);
            const join = this.parseAwardlist(_List.join);
            const best = this.parseAwardlist(_List.best);
            this.AwardList = { join, best };
            // 参与奖励
            this.NdRewardJoin.setNumItems(join.itemModel.length);
            // 归属奖励
            this.NdRewardFor.setNumItems(best.itemModel.length);
        }
    }

    /** 参与奖励 */
    public setRewardJoin(item: cc.Node, i: number): void {
        // 参与奖励
        item.scale = 0.8;
        const _itemIcon = item.getComponent(ItemIcon);
        _itemIcon.setData(this.AwardList.join.itemModel[i]);
        UtilItem.addMark(item, this.AwardList.join.isMust[i]);
    }

    /** 归属奖励 */
    public setRewardFom(item: cc.Node, i: number): void {
        // 归属奖励
        item.scale = 0.8;
        const _itemIcon = item.getComponent(ItemIcon);
        _itemIcon.setData(this.AwardList.best.itemModel[i]);
        UtilItem.addMark(item, this.AwardList.best.isMust[i]);
    }

    /** 设置刷新次数 */
    public updMyselfData(data: S2CMultiBossGetPlayerData): void {
        const indexer = Config.Get(Config.Type.Cfg_Boss_Config);

        const changeLimite: string = indexer.getValueByKey('MultiBossTimes', 'Value');
        const changeCount = parseInt(changeLimite);
        this.LbChangeNum.string = `${data.LeftTimes}/${changeCount}`;
        const nowTime = UtilTime.NowSec();
        if (data.NextTime > nowTime) {
            const nextTime = data.NextTime - nowTime;
            this.LbReTime.tick(nextTime, '%HH:%mm:%ss', false, true);
        }
        this.LbReTime.node.parent.active = data.NextTime > nowTime;
        this.upDMtBossInspirem(data.InspireLeftTime, data.InspireTimes);
        UtilGame.Click(this.NdAddChangeNum, () => {
            this.buyTimesView(true);
        }, this);
    }
    private buyTimesView(isShow: boolean = false) {
        if (!isShow) return;
        const { tip, vipLv } = ModelMgr.I.VipModel.getMinTimesCfg(EVipFuncType.MTBoss);
        if (RoleMgr.I.d.VipLevel < vipLv) {
            MsgToastMgr.Show(tip);
            return;
        }
        const vip = RoleMgr.I.d.VipLevel;
        const indexer = Config.Get(Config.Type.Cfg_Boss_Config);
        const buyCost: string = indexer.getValueByKey('MultiBossBuyCost', 'Value');
        const cost = buyCost.split(':');
        const vipindexer = Config.Get(Config.Type.Cfg_VIP);
        const vipcfg: string = vipindexer.getValueByKey(vip, 'MTBoss');
        const payMaxNum = vipcfg.split(':')[1];
        const canPayLimit = Number(payMaxNum) - RoleMgr.I.d.MTBossDayBuyTimes;
        const monName = UtilItem.GetCfgByItemId(parseInt(cost[0])).Name;
        const config = [
            UtilColor.NorV,
            UtilColor.GreenV,
            cost[1],
            1,
            ModelMgr.I.VipModel.getVipFullName(RoleMgr.I.d.VipLevel),
            canPayLimit,
            payMaxNum,
            canPayLimit > 0 ? UtilColor.GreenV : UtilColor.RedV,
            monName,
        ];
        const tipString = UtilString.FormatArray(
            i18n.tt(Lang.com_boss_but_tip),
            config,
        );

        ModelMgr.I.MsgBoxModel.ShowBox(tipString, () => {
            if (canPayLimit <= 0) {
                MsgToastMgr.Show(i18n.tt(Lang.arena_buy_times_unenough));
                return;
            }
            const roleCoin = RoleMgr.I.getCurrencyById(Number(cost[0]));
            if (roleCoin < Number(cost[1])) {
                MsgToastMgr.Show(`${monName}${i18n.tt(Lang.com_buzu)}`);
                return;
            }
            ControllerMgr.I.BossController.reqC2SMultiBossBuyTimes();
            MsgToastMgr.Show(i18n.tt(Lang.com_buy_success));
        }, { showToggle: '', cbCloseFlag: 'comBoss' }, null);
    }

    public setLockonBoss(toggle: cc.Toggle, customEventData): void {
        // boss关注变化
        // const ischeck = toggle.isChecked;
        ControllerMgr.I.BossController.reqC2SMultiBossFocus(this.bossId);
    }

    /** 倒计时相关刷新 */
    // 头像倒计时结束了重新刷新一次
    public headListTkEvent(event, customEventData): void {
        console.log('boss刷新cd结束', event);
        ControllerMgr.I.BossController.reqC2SMultiBossGetReliveList();
    }

    // boss刷新
    public BossInfoRe(event, customEventData): void {
        this.NdRefresh.active = false;
        this.LbRefreshCd.node.active = true;
        ControllerMgr.I.BossController.reqGetMultiBossData(this.bossId);
        ControllerMgr.I.BossController.reqC2SMultiBossGetReliveList();
    }

    // boss复活
    public BossReLive(d: S2CMultiBossRelive): void {
        if (d) {
            this.bossUpdInfo.State = 0;
            ControllerMgr.I.BossController.reqGetMultiBossData(this.bossId);
            ControllerMgr.I.BossController.reqC2SMultiBossGetReliveList();
        }
    }

    private inspLeftT: number = 0;
    private inspNum: number = 0;
    public upDMtBossInspirem(leftTime: number, inspNum: number): void {
        this.inspLeftT = leftTime;
        leftTime = leftTime > 900 ? 900 : leftTime;
        this.inspNum = inspNum;
        const LbTime = this.NdBuff.getChildByName('LbTime').getComponent(TickTimer);
        const buff = this.NdBuff.getChildByName('LbBuff').getComponent(cc.Label);
        this.NdBuff.getChildByName('LbTime').active = leftTime > 0;
        buff.node.active = leftTime > 0;
        if (leftTime > 0) {
            LbTime.tick(leftTime, i18n.tt(Lang.com_time_fmt_ms), true, true);
            const buffstr: string = Config.Get(Config.Type.Cfg_Boss_Config).getValueByKey('MultiBossAddAtt', 'Value');
            // eslint-disable-next-line max-len
            buff.string = `${i18n.tt(Lang.com_attr_2_name)}+${parseInt(buffstr) / 10000 * inspNum * 100 <= 100 ? Math.floor(parseInt(buffstr) / 10000 * inspNum * 100) : 100}%`;
        }
    }

    public BossInspireEnd(): void {
        this.NdBuff.getChildByName('LbTime').active = false;
        this.NdBuff.getChildByName('LbBuff').active = false;
        // 是否自动鼓舞
    }

    public BossInspTimeOver(): void {
        ControllerMgr.I.BossController.reqC2SMultiBossGetPlayerData();
    }

    private BListcb(scrollView: cc.ScrollView): void {
        const viewW = this.NdBossList.node.width;
        const contentW = this.NdBossList.content.width;
        const contentX = scrollView.content.position.x;

        this.NdLeftArrow.active = contentX < 0;
        this.NdRightArrow.active = -contentX < contentW - viewW;
    }
}

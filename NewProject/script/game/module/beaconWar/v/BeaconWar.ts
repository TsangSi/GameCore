/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2022-11-03 15:08:21
 * @FilePath: \SanGuo\assets\script\game\module\beaconWar\v\BeaconWar.ts
 * @Description:
 *
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { UtilGame } from '../../../base/utils/UtilGame';
import { E } from '../../../const/EventName';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BeaconWarModel } from '../BeaconWarModel';
import ListView from '../../../base/components/listview/ListView';
import { i18n, Lang } from '../../../../i18n/i18n';
import BeaconBossItem from '../com/BeaconBossItem';
import { EffectMgr } from '../../../manager/EffectMgr';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../const/ViewConst';
import UtilItem from '../../../base/utils/UtilItem';
import BeaconPlayerItem from '../com/BeaconPlayerItem';
import { RoleMgr } from '../../role/RoleMgr';
import { RoleAN } from '../../role/RoleAN';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import MapCfg from '../../../map/MapCfg';
import { BeaconWarCfgKey, EBeaconState } from '../BeaconWarConst';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import BeaconRelive from '../com/BeaconRelive';
import SceneMap from '../../../map/SceneMap';
import BeaconMsg from '../com/BeaconMsg';
import { RoleInfo } from '../../role/RoleInfo';
import { BagMgr } from '../../bag/BagMgr';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilString } from '../../../../app/base/utils/UtilString';
import MapMgr from '../../../map/MapMgr';
import UtilFly from '../../../base/utils/UtilFly';
import { EntityChallengeState } from '../../../entity/EntityConst';
import GameApp from '../../../base/GameApp';
import { AppEvent } from '../../../../app/AppEventConst';
import { GameLayerEnum } from '../../../../app/core/mvc/WinConst';
import { LayerMgr } from '../../../base/main/LayerMgr';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { RID } from '../../reddot/RedDotConst';
import { EntityLayer } from '../../../map/EntityLayer';
import { RES_ENUM } from '../../../const/ResPath';
import { WinAutoPayTipsModel, AutoPayKey } from '../../pay/WinAutoPayTipsModel';

const { ccclass, property } = cc._decorator;

@ccclass
export class BeaconWar extends BaseCmp {
    @property(cc.Node)
    private BtnPackage: cc.Node = null;
    @property(cc.Node)
    private BtnExit: cc.Node = null;
    @property(cc.Node)
    private BtnTreat: cc.Node = null;
    @property(cc.Node)
    private BtnInspire: cc.Node = null;
    @property(cc.Node)
    private BtnAutoFight: cc.Node = null;
    @property(cc.Node)
    private BtnRevive: cc.Node = null;
    // 体力框
    @property(cc.Node)
    private NdAuto: cc.Node = null;
    @property(cc.Label)
    private LabHave: cc.Label = null;
    @property(cc.Label)
    private LabNeed: cc.Label = null;
    @property(cc.Node)
    private BtnAdd: cc.Node = null;
    @property(cc.Toggle)
    private TogBuy: cc.Toggle = null;
    // 左侧列表
    @property(cc.Node)
    private NdArrow: cc.Node = null;
    @property(cc.Node)
    private NdRank: cc.Node = null;
    @property(cc.Label)
    private LabRank: cc.Label = null;
    @property(ListView)
    private ListBoss: ListView = null;
    @property(ListView)
    private ListPlayer: ListView = null;

    private _M: BeaconWarModel = null;
    /** 当前场景id */
    private _curBossHomeId: number = 0;
    /** 主玩家当前对哪个boss有伤害 */
    private _curBossId: number = 0;
    /** boss列表 */
    private _bossDataList: BossHomeBossData[] = [];
    /** boss的伤害列表 */
    private _playerDamageList: BossHomeRankData[] = [];
    /** 当前boss的归属玩家id */
    private _bossBelong: number = 0;
    /** 当前要挑战的Boss */
    private _challengeBossId: number = 0;
    /** 是否自动挑战 */
    private _isAutoFight: boolean = true;
    private _isAutoRelive: boolean = false;
    /** 动画节点 */
    private _NdAutoFightAni: cc.Node = null;
    private _NdReliveAni: cc.Node = null;
    private _NdTreatAni: cc.Node = null;
    private _ClickAnim: cc.Node = null;
    /** 复活节点 */
    private _NdRelive: cc.Node = null;
    /** 归属节点 */
    private _NdBelong: cc.Node = null;

    protected onLoad(): void {
        super.onLoad();
        this._M = ModelMgr.I.BeaconWarModel;
    }

    protected start(): void {
        super.start();
        this.clk();
        this.addE();

        this.TogBuy.isChecked = false;
        this._curBossHomeId = this._M.curBossHomeId;
        this._btnInsNode = this.BtnInspire.getChildByName('NdDesc').getChildByName('BtnDesc');
        this._btnCDNode = this.BtnInspire.getChildByName('NdDesc').getChildByName('BtnCD');

        UtilRedDot.Bind(RID.Boss.CrossBoss.BeaconWar.Bag, this.BtnPackage, cc.v2(25, 35));

        this.initUI();
    }

    private addE() {
        EventClient.I.on(AppEvent.WinBigAllClose, this.dealWinBigClose, this);
        EventClient.I.on(E.BeaconWar.MoveToPlayerPos, this.moveToPlayerPos, this);
        // 点击地图及走到目的地
        EventClient.I.on(E.Map.ClickMap, this.dealClickMap, this);
        EventClient.I.on(E.Map.MoveEnd, this.hideClickAnim, this);
        EventClient.I.on(E.Map.ResetPos, this.hideClickAnim, this);
        EventClient.I.on(E.BeaconWar.HideClickAnim, this.hideClickAnim, this);
        // 伤害列表发生变化
        EventClient.I.on(E.BeaconWar.PlayerDamageRank, this.showList, this);
        // boss数据发生变化
        EventClient.I.on(E.BeaconWar.UptBossData, this.showList, this);

        EventClient.I.on(E.BeaconWar.UptPlayerData, this.uptPlayerMsg, this);
        /** 鼓舞 */
        EventClient.I.on(E.BeaconWar.UptInspire, this.uptBtns, this);

        // 主玩家体力
        RoleMgr.I.on(this.uptEnergy, this, RoleAN.N.BossHomeEnergyVal);
        // 主玩家玩家死亡or活的状态(因为不马上执行，在战斗结束后会执行uptRelive。这里不加监听了)
        RoleMgr.I.on(this.uptRelive, this, RoleAN.N.Map_State, RoleAN.N.Map_ReliveTime, RoleAN.N.BossHomeFightUserId);
        // 主玩家的血
        RoleMgr.I.on(this.uptTreat, this, RoleAN.N.FCurrHp, RoleAN.N.FMaxHp);

        // 挑战boss或玩家会马上返回一些相关协议，但是不能马上执行处理，而是要等战斗结束后再处理
        // 主要有 1. 复活要战斗结束后才判断处理 2. boss列表还是伤害列表的展示切换
        EventClient.I.on(E.Battle.Start, this.onbattleStart, this);
        EventClient.I.on(E.Battle.End, this.onBattleEnd, this);
        EventClient.I.on(E.BattleResult.CloseView, this.onBattleResult, this);

        // 监听货币
        RoleMgr.I.on(this.checkCanAutoRelive, this, RoleAN.N.ItemType_Coin3);
        // 飞奖励效果
        EventClient.I.on(E.BeaconWar.UptAward, this.flyBeaconAward, this);

        // 周围玩家和怪物的属性变化
        EventClient.I.on(E.BeaconWar.PlayerState, this.uptPlayerState, this);
        EventClient.I.on(E.BeaconWar.MonsterState, this.uptMonsterState, this);
        EventClient.I.on(E.BeaconWar.MonsterBelong, this.uptMonsterBelong, this);
    }

    private remE() {
        EventClient.I.off(AppEvent.WinBigAllClose, this.dealWinBigClose, this);
        EventClient.I.off(E.BeaconWar.MoveToPlayerPos, this.moveToPlayerPos, this);
        // 点击地图及走到目的地
        EventClient.I.off(E.Map.ClickMap, this.dealClickMap, this);
        EventClient.I.off(E.Map.MoveEnd, this.hideClickAnim, this);
        EventClient.I.off(E.Map.ResetPos, this.hideClickAnim, this);
        EventClient.I.off(E.BeaconWar.HideClickAnim, this.hideClickAnim, this);
        // 伤害列表发生变化
        EventClient.I.off(E.BeaconWar.PlayerDamageRank, this.showList, this);
        // boss数据发生变化
        EventClient.I.off(E.BeaconWar.UptBossData, this.showList, this);

        EventClient.I.off(E.BeaconWar.UptPlayerData, this.uptPlayerMsg, this);
        // 体力
        RoleMgr.I.off(this.uptEnergy, this, RoleAN.N.BossHomeEnergyVal);
        // 玩家死亡or活的状态(主玩家的死亡状态刷新，会可能要马上刷新也可能要延后刷新)
        RoleMgr.I.off(this.uptRelive, this, RoleAN.N.Map_State, RoleAN.N.Map_ReliveTime, RoleAN.N.BossHomeFightUserId);
        // 血
        RoleMgr.I.off(this.uptTreat, this, RoleAN.N.FCurrHp, RoleAN.N.FMaxHp);
        /** 鼓舞 */
        EventClient.I.off(E.BeaconWar.UptInspire, this.uptBtns, this);
        // 挑战boss或玩家会马上返回一些相关协议，但是不能马上执行处理，而是要等战斗结束后再处理
        EventClient.I.off(E.Battle.Start, this.onbattleStart, this);
        EventClient.I.off(E.Battle.End, this.onBattleEnd, this);
        EventClient.I.off(E.BattleResult.CloseView, this.onBattleResult, this);
        // 监听货币
        RoleMgr.I.off(this.checkCanAutoRelive, this, RoleAN.N.ItemType_Coin3);
        // 飞奖励效果
        EventClient.I.off(E.BeaconWar.UptAward, this.flyBeaconAward, this);

        // 周围玩家和怪物的属性变化
        EventClient.I.off(E.BeaconWar.PlayerState, this.uptPlayerState, this);
        EventClient.I.off(E.BeaconWar.MonsterState, this.uptMonsterState, this);
        EventClient.I.off(E.BeaconWar.MonsterBelong, this.uptMonsterBelong, this);
    }

    private clk() {
        UtilGame.Click(this.BtnPackage, () => {
            // 请求临时背包数据
            ControllerMgr.I.BeaconWarController.reqOpenPackageUI();
        }, this);

        UtilGame.Click(this.BtnExit, () => {
            this._M.exit(true, true);
        }, this);

        UtilGame.Click(this.BtnTreat, () => {
            WinMgr.I.open(ViewConst.BeaconWarTreatWin);
        }, this);

        UtilGame.Click(this.BtnInspire, () => {
            WinMgr.I.open(ViewConst.BeaconWarInspireWin);
        }, this);

        UtilGame.Click(this.BtnAutoFight, this.onAutoFight, this);

        UtilGame.Click(this.BtnRevive, this.onAutoRelive, this);

        UtilGame.Click(this.BtnAdd, () => {
            this._M.addEnergyForUI();
        }, this);

        UtilGame.Click(this.NdArrow, this.onMoveRank, this);
    }

    public get isAutoFight(): boolean {
        return this._isAutoFight;
    }
    public set isAutoFight(v: boolean) {
        this._isAutoFight = v;
        if (this._NdAutoFightAni) {
            this._NdAutoFightAni.active = v;
            this.BtnAutoFight.getChildByName('NdBtn').getComponent(cc.Sprite).enabled = !v;
        }
    }

    public get isAutoRelive(): boolean {
        return this._isAutoRelive;
    }
    public set isAutoRelive(v: boolean) {
        this._isAutoRelive = v;
        if (this._NdReliveAni) {
            this._NdReliveAni.active = v;
            this.BtnRevive.getChildByName('NdBtn').getComponent(cc.Sprite).enabled = !v;
        }
    }

    private dealWinBigClose(isWinBigAllClose: boolean) {
        // 当前不是所有窗口都是关闭了的
        if (!isWinBigAllClose) {
            // console.log('还有窗口未关闭1');
            return;
        }

        // 检测是否要飘奖励
        this.checkFlyAward();
    }

    /** 获得奖励的飞道具效果:这里只保存数据，不能马上飘 */
    private _flyData: number[] = [];
    private flyBeaconAward(itemData: ItemData[]) {
        if (itemData) {
            this._flyData = [];
            for (let i = 0; i < itemData.length; i++) {
                this._flyData.push(itemData[i].ItemId);
            }
        }
        // 检测是否有飘奖励
        this.checkFlyAward();
    }

    /**
     * 有些操作是不能收到协议就马上处理的，比如
     * 1. 收到飘奖励协议，要等到回到主场景且当前没有打开的界面才执行
     * 2. 收到伤害列表，需要区分下什么情况需要马上刷新，什么时候不能马上刷新
     * 3. ...
     */
    private checkFlyAward() {
        if (!this._flyData || this._flyData.length <= 0) return;
        // 战斗中不要飘；有任何一个界面打开中也不要飘
        if (GameApp.I.IsBattleIng) {
            return;
        }
        if (WinMgr.I.checkIsOpen(ViewConst.BattleSettleWin)) {
            return;
        }
        // 当前的复活窗口是否打开中
        if (this._NdRelive && this._NdRelive.active) {
            return;
        }

        /** 坐标转化 */
        const wp = SceneMap.I.mainRole().convertToWorldSpaceAR(cc.v2(0, 0));
        const np = this.node.convertToNodeSpaceAR(wp);

        UtilFly.fly({
            parent: this.node,
            radomStartX: [np.x],
            radomStartY: [np.y],
            endPos: cc.v2(this.BtnPackage.position.x, this.BtnPackage.position.y),
            itemList: this._flyData,
            delayPlay: 1000,
            endAnim: RES_ENUM.Onhook_Ui_8046,
            moveMode: 1,
        });

        // 飘完就重置下数据
        this._flyData.length = 0;
    }

    private initAnim() {
        EffectMgr.I.showEffect(RES_ENUM.Com_Ui_111, this.BtnAutoFight.getChildByName('NdBtn'), cc.WrapMode.Loop, (node) => {
            this._NdAutoFightAni = node;
            node.active = this._isAutoFight;
            this.BtnAutoFight.getChildByName('NdBtn').getComponent(cc.Sprite).enabled = !this._isAutoFight;
        });

        EffectMgr.I.showEffect(RES_ENUM.Fuben_Ui_8001, this.BtnRevive.getChildByName('NdBtn'), cc.WrapMode.Loop, (node) => {
            this._NdReliveAni = node;
            node.active = this._isAutoRelive;
        });

        EffectMgr.I.showEffect(RES_ENUM.Fuben_Ui_8002, this.BtnTreat.getChildByName('NdBtn'), cc.WrapMode.Loop, (node) => {
            node.active = true;
            this._NdTreatAni = node;
            this.uptTreat();
        });

        EffectMgr.I.showEffect(RES_ENUM.Com_Ui_8003, EntityLayer.I.node, cc.WrapMode.Loop, (node) => {
            this._ClickAnim = node;
            this._ClickAnim.zIndex = 1;
            node.active = false;
        });
    }

    /** 治疗的血特效刷新 */
    private uptTreat() {
        let ratio = RoleMgr.I.info.d.FCurrHp / RoleMgr.I.info.d.FMaxHp;
        if (ratio > 1) ratio = 1;
        if (ratio < 0) ratio = 0;
        this._NdTreatAni.anchorX = 0.5;
        this._NdTreatAni.anchorY = 0.5;
        ratio = Math.ceil(ratio * 10) / 10;
        this._NdTreatAni.y = -65 + (ratio * 65) - 5;
        this._NdTreatAni.getComponent(cc.Animation).play('default');
    }

    private onAutoFight() {
        this.isAutoFight = !this.isAutoFight;
        if (this.isAutoFight) {
            this.ai();
        } else {
            SceneMap.I.mainRole().stop();
        }
        this.hideClickAnim();
    }
    private dealClickMap(mapId: number, pos: cc.Vec2) {
        this.isAutoFight = false;
        MapMgr.I.resetChallengeState();

        if (this._ClickAnim) {
            this._ClickAnim.active = true;
            this._ClickAnim.setPosition(pos);
        }
    }

    private hideClickAnim() {
        if (this._ClickAnim) {
            this._ClickAnim.active = false;
        }
    }

    private onAutoRelive() {
        if (!this.isAutoRelive) {
            const str = UtilString.FormatArray(
                i18n.tt(Lang.beaconWar_clickRelive),
                [UtilItem.GetCfgByItemId(this._costId).Name, UtilColor.NorV, UtilColor.RedV],
            );
            ModelMgr.I.MsgBoxModel.ShowBox(str, () => {
                this.isAutoRelive = true;
            }, { showToggle: 'BeaconWarRelive', tipTogState: false });
        } else {
            this.isAutoRelive = !this.isAutoRelive;
        }
    }

    /** 记录下体力<10之前的主玩家是否处在自动战斗状态下 */
    private _recordAuto: boolean = false;
    /** 体力<10只执行一次购买 */
    private _recordEnergy: number = 100;
    private uptEnergy() {
        // 体力
        // console.log('体力变化的刷新', RoleMgr.I.d.BossHomeEnergyVal, 'this._recordAuto=', this._recordAuto, 'this.isAutoFight=', this.isAutoFight, 'this._recordEnergy=', this._recordEnergy);
        let have: number = RoleMgr.I.d.BossHomeEnergyVal;
        if (have < 0) have = 0;
        const need: number = this._M.getNeedEnergy();

        this.LabHave.string = `${have}`;
        this.LabNeed.string = `/${need}`;
        const color = have < 10 ? UtilColor.Hex2Rgba(UtilColor.RedD) : UtilColor.Hex2Rgba(UtilColor.GreenD);
        this.LabHave.node.color = color;
        this.LabNeed.node.color = color;

        // 是否体力<10
        if (have < 10) {
            // console.log('没体力 this._recordAuto=', this._recordAuto, 'this.isAutoFight=', this.isAutoFight, 'this._recordEnergy=', this._recordEnergy, '是否是战斗中=', GameApp.I.IsBattleIng);
            if (!GameApp.I.IsBattleIng && have !== this._recordEnergy) {
                // console.log('---请求加体力');
                // 自动使用体力丹
                const isAutoUse = this.TogBuy.isChecked;
                if (isAutoUse) {
                    // 勾选了自动使用体力丹 有军令就直接使用
                    if (this._M.isHaveEnergyId()) {
                        this._M.buyEnergyMedicine();
                    } else {
                        // 没有军令
                        MsgToastMgr.Show(i18n.tt(Lang.beaconWar_less));
                        this._M.addEnergy(true);
                    }
                } else if (this._M.isHaveEnergyId()) {
                    // 没有勾选了自动使用体力丹
                    // 有军令就直接使用
                    this._M.addEnergy(false);
                } else {
                    // 没有勾选 没有军令
                    this._M.addEnergy(true);
                }

                this._recordAuto = this.isAutoFight;
                this.isAutoFight = false;
                SceneMap.I.mainRole().stop();
                this._recordEnergy = have;
            } else {
                // console.log('---已经请求过加体力了，不再请求');
            }
        } else {
            // 加体力前是自动战斗的，并且当前已经停止了自动战斗了，就重现开始自动战斗
            // console.log('加体力前是自动战斗的，并且当前已经停止了自动战斗了，就重现开始自动战斗');
            // console.log('有体力 this._recordAuto=', this._recordAuto, 'this.isAutoFight=', this.isAutoFight, 'this._recordEnergy=', this._recordEnergy);
            if (this._recordAuto && !this.isAutoFight) {
                this.isAutoFight = true;
                this.ai();
            }
            this._recordAuto = false;
            this._recordEnergy = 100;
        }
    }

    /** 主玩家复活：主要用于点击复活后的节点马上隐藏 */
    private uptRelive() {
        // console.warn('死亡还是复活 uptRelive-------', RoleMgr.I.d.Map_State);
        if (RoleMgr.I.d.Map_State === EBeaconState.Die) {
            // 死亡 看是否可以显示复活窗口
            if (GameApp.I.IsBattleIng) {
                // console.log('战斗中2');
                return;
            }
            if (WinMgr.I.checkIsOpen(ViewConst.BattleSettleWin)) {
                // console.log('结算界面打开2');
                return;
            }
            if (this._M.reqPve || this._M.reqPvp) {
                // console.log('是玩家主动打的怪或玩家，要战斗结束回来后再刷新');
            }
            // 弹出复活窗口
            this.uptReliveBattleEnd();
        } else {
            if (this._NdRelive) {
                // 复活就不需要显示归属了
                this._NdRelive.getComponent(BeaconRelive).end();
                this._NdRelive.active = false;
            }
            // 是否能开始自动战斗
            if (this.isAutoFight) {
                this.ai();
            }
        }
        // 检测是否有飘奖励
        this.checkFlyAward();
    }

    /** 战斗开始 */
    private onbattleStart() {
        this._M.reqPve = false;
        this._M.reqPvp = false;

        if (this._NdBelong) {
            this._NdBelong.active = false;
        }

        if (this._NdRelive) {
            this._NdRelive.active = false;
        }
        // console.log('战斗开始');
    }

    /** 战斗结束 */
    private onBattleEnd() {
        // console.log('战斗结束 onBattleEnd-------', RoleMgr.I.d.Map_State);
        // 1. 刷boss列表还是伤害列表
        this.checkList();
        // 2. 是否能开始自动战斗
        // if (this.isAutoFight) {
        //     this.ai();
        // }
        // 重置下模型状态
        MapMgr.I.resetChallengeState();
        // 自动治疗
        const ratio = RoleMgr.I.info.d.FCurrHp / RoleMgr.I.info.d.FMaxHp;
        if (ratio < 0.6 && WinAutoPayTipsModel.getState(AutoPayKey.BeaconWarAutoTreat)) {
            this._M.autoTreat();
        }
    }

    /** 关闭结算才执行的 */
    private onBattleResult() {
        // console.warn('关闭结算才执行的 onBattleResult-------', RoleMgr.I.d.Map_State);
        // 1.体力
        this.uptEnergy();
        // 2. 弹出复活窗口
        this.uptReliveBattleEnd();
        // 3. 当前是否是自动战斗
        if (this.isAutoFight) {
            this.ai();
        }
        // 检测是否有飘奖励
        this.checkFlyAward();
    }

    private _costId: number = 0;
    private _costNeed: number = 0;
    private initCost() {
        const cost = ModelMgr.I.BeaconWarModel.getReliveCost();
        this._costId = cost.id;
        this._costNeed = cost.need;
    }
    private checkCanAutoRelive() {
        const have = BagMgr.I.getItemNum(this._costId);
        const canAutoRelive = have >= this._costNeed;
        if (this.isAutoRelive && !canAutoRelive) {
            this.isAutoRelive = false;
        }
        return canAutoRelive;
    }

    /** 主玩家复活 */
    private uptReliveBattleEnd() {
        // 是否自动复活
        if (this.isAutoRelive) {
            if (RoleMgr.I.d.Map_State === 0 && this.checkCanAutoRelive()) {
                // const str = UtilString.FormatArray(
                //     i18n.tt(Lang.beaconWar_autoRelive),
                //     [this._costNeed, UtilItem.GetCfgByItemId(this._costId).Name],
                // );
                // MsgToastMgr.Show(str, UtilColor.GreenD);
                ControllerMgr.I.BeaconWarController.reqBossHomeRelive();
                return;
            }
        }

        const state = RoleMgr.I.d.Map_State;
        // console.log('主玩家复活状态：', state, '被谁打死:', RoleMgr.I.d.BossHomeFightUserId, this._curBossId, 'cd=', RoleMgr.I.d.Map_ReliveTime - UtilTime.NowSec());
        if (state === EBeaconState.Die) {
            const now = UtilTime.NowSec();
            const reliveTime = RoleMgr.I.d.Map_ReliveTime;
            const cd = reliveTime - now;
            const userId = RoleMgr.I.d.BossHomeFightUserId;

            if (this._NdRelive) {
                this._NdRelive.active = true;
                if (userId) {
                    this._NdRelive.getComponent(BeaconRelive).killedByOtherPlayer(cd, userId);
                } else {
                    this._NdRelive.getComponent(BeaconRelive).killedByBoss(cd);
                }
            } else if (cd > 0) {
                ResMgr.I.loadLocal(UI_PATH_ENUM.BeaconRelive, cc.Prefab, (err, p: cc.Prefab) => {
                    if (err) return;
                    if (this._NdRelive) {
                        if (userId) {
                            this._NdRelive.getComponent(BeaconRelive).killedByOtherPlayer(cd, userId);
                        } else {
                            this._NdRelive.getComponent(BeaconRelive).killedByBoss(cd);
                        }
                    } else if (p) {
                        const node = cc.instantiate(p);
                        LayerMgr.I.addToLayer(GameLayerEnum.DOWN_LAYER, node);
                        this._NdRelive = node;
                        this._NdRelive.active = true;
                        if (userId) {
                            node.getComponent(BeaconRelive).killedByOtherPlayer(cd, userId);
                        } else {
                            node.getComponent(BeaconRelive).killedByBoss(cd);
                        }
                    }
                });
            }
        } else if (this._NdRelive) {
            this._NdRelive.getComponent(BeaconRelive).end();
            this._NdRelive.active = false;
            // 检测是否有飘奖励
            this.checkFlyAward();
        }
    }

    /** 归属: 主玩家已经有对某个怪造成了伤害 */
    private uptBelong(reqPlayerInfo: boolean = false) {
        if (GameApp.I.IsBattleIng) {
            if (this._NdBelong) {
                this._NdBelong.active = false;
            }
            return;
        }
        if (this._curBossId) {
            if (this._NdBelong) {
                const bossData = this._M.getBossData(this._curBossId);
                this._NdBelong.active = true;
                this._NdBelong.getComponent(BeaconMsg).setData(bossData, reqPlayerInfo);
            } else {
                ResMgr.I.loadLocal(UI_PATH_ENUM.BeaconMsg, cc.Prefab, (err, p: cc.Prefab) => {
                    if (err) return;
                    if (this._NdBelong) {
                        const bossData = this._M.getBossData(this._curBossId);
                        this._NdBelong.getComponent(BeaconMsg).setData(bossData, reqPlayerInfo);
                    } else if (p) {
                        const node = cc.instantiate(p);
                        LayerMgr.I.addToLayer(GameLayerEnum.DOWN_LAYER, node);
                        this._NdBelong = node;
                        node.active = true;
                        const bossData = this._M.getBossData(this._curBossId);
                        node.getComponent(BeaconMsg).setData(bossData, reqPlayerInfo);
                    }
                    // 改下层级
                    if (this._NdRelive) {
                        this._NdBelong.setSiblingIndex(1);
                        this._NdRelive.setSiblingIndex(2);
                    }
                });
            }
        } else if (this._NdBelong) {
            this._NdBelong.active = false;
        }
    }

    /** 周围玩家的属性变化 */
    private uptPlayerState(userId: number) {
        // console.warn('周围玩家的死亡复活状态变化');
        const info: RoleInfo = MapMgr.I.getMapPlayerData(userId);
        if (info) {
            const state = info.d.Map_State;
            MapMgr.I.setChallengeState(true, userId, state === 0 ? EntityChallengeState.Die : EntityChallengeState.Normal);
        }
    }

    /** 怪的属性变化 */
    private uptMonsterState(monsterId: number) {
        // console.log(monsterId, '怪的死亡复活状态变化');
        const info: RoleInfo = MapMgr.I.getMapMonsterData(monsterId);
        if (info) {
            const state = info.d.Monster_State;
            const reliveTime = info.d.Monster_ReliveTime;
            // console.log(monsterId, '怪的死亡复活状态变化', state, reliveTime);
            this._M.uptBossDataState(monsterId, state, reliveTime);
        }
    }

    /** 怪物归属变化 */
    private uptMonsterBelong(monsterId: number, belongId: number) {
        // console.log('--------------怪物归属变化', monsterId, belongId);
        const info: RoleInfo = MapMgr.I.getMapMonsterData(monsterId);
        if (info) {
            this._M.uptBossBelong(monsterId, belongId);
        }
    }

    protected updatePerSecond(): void {
        this._insCd = this._M.inspireData.endTime - UtilTime.NowSec();
        // console.log(this._insCd);

        this._btnCDNode.active = this._insCd > 0;
        this._btnInsNode.active = this._insCd > 0;
        if (this._insCd > 0) {
            this.updateInsTimes();
        }
    }

    private updateInsTimes(): void {
        const _lab = this._btnCDNode.getChildByName('DescLabel').getComponent(cc.Label);
        _lab.string = `${i18n.tt(Lang.com_count_down)}:${UtilTime.FormatTime(this._insCd, '%mm:%ss', false)}`;
        if (this._insAttack > 0) {
            this._btnInsNode.getChildByName('DescLabel').getComponent(cc.Label).string = `${i18n.tt(Lang.com_attr_2_name)}+${this._insAttack}%`;
        }
    }

    private _insAttack: number = 0;
    private _insCd: number = 0;
    private _btnInsNode: cc.Node = null;
    private _btnCDNode: cc.Node = null;
    private uptBtns(): void {
        // 更新鼓舞按钮
        this._insCd = this._M.inspireData.endTime - UtilTime.NowSec();
        const addAttack = +ModelMgr.I.BossModel.getValByKey(BeaconWarCfgKey.BeaconWarAddAtt);
        this._insAttack = (this._M.inspireData.buffNum * addAttack) / 100;
    }

    private initUI() {
        this.initCost();
        this.initAnim();
        this.checkList();
        this.uptBtns();
        this.uptEnergy();

        // 有可能存在有属性变化了但是这里的监听还没创建而错失的情况，这里加个定时器
        this.scheduleOnce(() => {
            // 体力
            this.uptEnergy();
            // 刚进来的主玩家也可能处在死亡状态，里面会判断是否可开始自动战斗
            this.uptRelive();
        }, 1);
    }

    private checkList() {
        this._curBossId = this._M.isHasDamage();
        // console.log('当前主玩家对哪个boss有伤害？', this._curBossId);
        if (this._curBossId > 0) {
            ControllerMgr.I.BeaconWarController.reqBossHomeRank(this._curBossHomeId, this._curBossId);
        } else {
            this.showBossList(true);
        }
        // 归属
        this.uptBelong(true);
    }

    /** 会有个问题，刚打boss还没进战斗呢就返回伤害列表了，这里就马上展示为伤害列表了 */
    private showList() {
        const d: BossHomeData = this._M.getBossHomeData(this._curBossHomeId);
        this._bossDataList = d.BossData;
        this._bossDataList.sort((a, b) => a.BossId - b.BossId);
        this._curBossId = this._M.isHasDamage();

        // console.log('怪物列表 this._bossDataList：', this._bossDataList);
        // console.log('当前主玩家对哪个boss有伤害？', this._curBossId);

        if (this._curBossId > 0) {
            this.showPlayerList(true);
        } else {
            this.showBossList(true);
        }
        // 归属
        this.uptBelong(true);
    }

    /** 更新玩家信息 */
    private uptPlayerMsg(reqPlayerInfo: boolean = false) {
        this._curBossId = this._M.isHasDamage();

        if (this._curBossId > 0) {
            this.showPlayerList(reqPlayerInfo);
        } else {
            this.showBossList(reqPlayerInfo);
        }
        // 归属
        this.uptBelong(reqPlayerInfo);
    }

    /** 左侧箭头，默认打开 */
    private _showList: boolean = true;
    private onMoveRank() {
        this._showList = !this._showList;
        this.moveFoldButton();
    }

    private moveFoldButton(): void {
        this.NdRank.active = true;
        cc.Tween.stopAllByTarget(this.NdRank);
        // console.log('当前坐标x', this.NdRank.x, '将要移动到', pos);
        const w = this.NdRank.getContentSize().width; // this.NdRank.getComponent(UITransform).width;
        const posx = this.NdArrow.position.x;
        const pos = !this._showList ? -w + posx - 59 : posx + 59;
        cc.tween(this.NdRank).to(0.2, { x: pos, y: 116 }).start();
    }

    /** 展示boss列表 */
    private showBossList(reqPlayerInfo: boolean = false) {
        const d: BossHomeData = this._M.getBossHomeData(this._curBossHomeId);
        this._bossDataList = d.BossData;
        this._bossDataList.sort((a, b) => a.BossId - b.BossId);

        // 集中请求归属玩家数据
        if (reqPlayerInfo) {
            const noPlayerInfo: number[] = [];
            for (let i = 0; i < this._bossDataList.length; i++) {
                if (this._bossDataList[i].UserId) {
                    const info: RoleInfo = this._M.playerInfo(this._bossDataList[i].UserId, false);
                    if (!info || !info.d || !info.d.HeadIcon || !info.d.Nick) {
                        noPlayerInfo.push(this._bossDataList[i].UserId);
                    }
                }
            }
            if (noPlayerInfo.length > 0) {
                ControllerMgr.I.BeaconWarController.reqUserShowInfo(noPlayerInfo);
            }
        }

        this.ListBoss.node.active = true;
        this.ListPlayer.node.active = false;
        this.LabRank.string = i18n.tt(Lang.beaconWar_bossList);
        this.ListBoss.setNumItems(this._bossDataList.length, 0);
    }

    private onRenderBossList(node: cc.Node, idx: number): void {
        const data: BossHomeBossData = this._bossDataList[idx];
        const item = node.getComponent(BeaconBossItem);
        if (data && item) {
            item.setData(data, true, true);
        }
    }

    /** 展示玩家列表 */
    private showPlayerList(reqPlayerInfo: boolean = false) {
        // console.log('**** showPlayerList', reqPlayerInfo);
        this.ListBoss.node.active = false;
        this.ListPlayer.node.active = true;
        this.LabRank.string = i18n.tt(Lang.beaconWar_playerList);
        this._playerDamageList = this._M.getBossHomeRankData();
        this._bossBelong = this._M.getBossBelong();

        // 集中请求归属玩家数据
        if (reqPlayerInfo) {
            ModelMgr.I.BeaconWarModel.playerInfo(this._bossBelong, true);
            // 玩家信息获取
            const noPlayerInfo: number[] = [];
            for (let i = 0; i < this._playerDamageList.length; i++) {
                const info: RoleInfo = this._M.playerInfo(this._playerDamageList[i].UserId, false);
                if (!info || !info.d || !info.d.HeadIcon || !info.d.Nick) {
                    noPlayerInfo.push(this._playerDamageList[i].UserId);
                }
            }
            if (noPlayerInfo.length > 0) {
                ControllerMgr.I.BeaconWarController.reqUserShowInfo(noPlayerInfo);
            }
        }
        // 增加排序
        this._playerDamageList.sort((a, b) => {
            if (a.UserId !== b.UserId) {
                return b.UserId - a.UserId;
            }
            return b.Damage - a.Damage;
        });

        // console.log('展示玩家列表(对怪的伤害列表)----------', this._playerDamageList, '归属', this._bossBelong);

        this.ListPlayer.setNumItems(this._playerDamageList.length, 0);
    }

    private onRenderPlayerList(node: cc.Node, idx: number): void {
        const data: BossHomeRankData = this._playerDamageList[idx];
        const item = node.getComponent(BeaconPlayerItem);
        if (data && item) {
            item.setData(data, idx, data.UserId === this._bossBelong);
        }
    }

    /** 自动AI：按顺序找到第一个可挑战的boss，就跑去其身边 */
    private ai() {
        // console.log('ai');
        if (GameApp.I.IsBattleIng) {
            return;
        }
        if (WinMgr.I.checkIsOpen(ViewConst.BattleSettleWin)) {
            // console.log('结算界面打开-ai');
            return;
        }

        // 判断体力
        if (RoleMgr.I.d.BossHomeEnergyVal < 10) {
            return;
        }

        if (this._isAutoFight) {
            // 1. 先判断主玩家的状态是否是复活的
            if (RoleMgr.I.d.Map_State === EBeaconState.Die) {
                // console.log('主玩家已死亡');
                return;
            }
            // 2. 取得可挑战的bossId
            this._curBossId = this._M.isHasDamage();
            let challengeBossId: number = 0;
            if (this._curBossId) {
                challengeBossId = this._curBossId;
            } else {
                for (let i = 0; i < this._bossDataList.length; i++) {
                    if (this._bossDataList[i].State === 1) {
                        challengeBossId = this._bossDataList[i].BossId;
                        break;
                    }
                }
            }

            if (challengeBossId > 0) {
                this._challengeBossId = challengeBossId;
                // 3. 移动到boss所在位置并开始战斗
                this._M.moveToBossPos(this._challengeBossId, () => {
                    // 若目标已死亡，重现寻找其他目标
                    // console.log('若目标已死亡，重现寻找其他目标');
                    this.ai();
                }, this);
            } else {
                // 没有可挑战的boss了
            }
        }
    }

    /** 移动到玩家所在位置并开始战斗 */
    private moveToPlayerPos(d: S2CGetBossHomePlayerPos) {
        this._M.moveToPlayerPos(d.UserId, d.X * MapCfg.I.cellWidth, d.Y * MapCfg.I.cellHeight);
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
        this._M?.cleanAllData();
        this._M?.closeAllWin();
        this._NdBelong?.destroy();
        this._NdRelive?.destroy();
        this._NdAutoFightAni?.destroy();
        this._NdReliveAni?.destroy();
        this._NdTreatAni?.destroy();
        this._ClickAnim?.destroy();

        MapMgr.I.cleanMonster();
    }
}

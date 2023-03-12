/*
 * @Author: zs
 * @Date: 2022-08-29 16:56:23
 * @FilePath: \SanGuo2.4\assets\script\game\module\worldBoss\v\WorldBoss.ts
 * @Description:
 *
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { EffectMgr } from '../../../manager/EffectMgr';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { ANIM_TYPE } from '../../../base/anim/AnimCfg';
import { Config } from '../../../base/config/Config';
import { ConfigDropRewardIndexer } from '../../../base/config/indexer/ConfigDropRewardIndexer';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { E } from '../../../const/EventName';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ViewConst } from '../../../const/ViewConst';
import { EntityMonster } from '../../../entity/EntityMonster';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { EntityLayer } from '../../../map/EntityLayer';
import MapCfg, { EMapFbInstanceType } from '../../../map/MapCfg';
import {
    ECfgWorldBossConfigKey, WorldBossBtnType, IBtnItem, EBossEventType, EBossBuffType, WorldBossRPType, IRollFrameOpts,
} from '../WorldBossConst';
import { WorldBossModel } from '../WorldBossModel';
import { BossBigHp } from './com/BossBigHp';
import { RollFrame } from './com/RollFrame';
import { ShieldFrame } from './com/ShieldFrame';
import { WorldBossRankView } from './WorldBossRankView';
import SceneMap from '../../../map/SceneMap';
import { FuBenMgr } from '../../fuben/FuBenMgr';
import UtilGeneral from '../../../base/utils/UtilGeneral';
import { BattleMgr } from '../../../battle/BattleMgr';
import { EBattleType } from '../../battleResult/BattleResultConst';
import { BattleCommon } from '../../../battle/BattleCommon';
import { RES_ENUM } from '../../../const/ResPath';
import { FuncDescConst } from '../../../const/FuncDescConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class WorldBoss extends BaseCmp {
    @property(cc.Node)
    private NodeTime: cc.Node = null;
    @property(cc.Label)
    private LabelTime: cc.Label = null;
    @property(cc.Node)
    private BtnExit: cc.Node = null;
    @property(cc.Node)
    private BtnInspire: cc.Node = null;
    @property(cc.Node)
    private BtnGrab: cc.Node = null;
    @property(cc.Node)
    private BtnAutoFight: cc.Node = null;
    @property(cc.Node)
    private BtnRewardPreview: cc.Node = null;
    @property(cc.Node)
    private JianTouNd: cc.Node = null;
    /** 左边排行榜，动态加载 */
    @property(cc.Node)
    private NdRank: cc.Node = null;
    /** 排行榜 */
    private worldBossRankView: WorldBossRankView;
    /** boss血条 */
    private bossBigHp: BossBigHp;
    /** 持续时间 */
    private keepTime: number = 0;
    private _M: WorldBossModel = null;
    private btnData: Map<WorldBossBtnType, IBtnItem> = new Map();
    /** 自动寻路打怪中 */
    private moveToFight = false;
    /** 是否在自动战斗 */
    private _isAutoFight: boolean = false;
    public get isAutoFight(): boolean {
        return this._isAutoFight;
    }
    public set isAutoFight(v: boolean) {
        this._isAutoFight = v;
        if (this.autoFightAni) {
            this.autoFightAni.active = v;
            const _bg = this.btnData.get(WorldBossBtnType.BtnAutoFight).target.getChildByName('NdBtn').getChildByName('NdBg');
            _bg.active = !v;
        }
    }
    private autoFightAni: cc.Node = null;
    /** 当前护盾弹窗的显示状态 */
    private curShowShieldIndex: number = -1;
    private lefttime: number = 0;
    private grabtime: number = 0;
    private autotime: number = 0;
    protected onLoad(): void {
        super.onLoad();
        this._M = ModelMgr.I.WorldBossModel;
        UtilGame.Click(this.BtnExit, this.onBtnExit, this);
        UtilGame.Click(this.BtnInspire, this.onBtnInspire, this);
        UtilGame.Click(this.BtnGrab, this.onBtnGrab, this);
        UtilGame.Click(this.BtnAutoFight, this.onBtnAutoFight, this);
        UtilGame.Click(this.BtnRewardPreview, this.onBtnRewardPreview, this);
        UtilGame.Click(this.JianTouNd, this.onBtnJianTouNd, this);

        EventClient.I.on(E.WorldBoss.UpdateShieldFrameStatus, this.onUpdateShieldFrameStatus, this);
        EventClient.I.on(E.WorldBoss.UpdateRollFrameStatus, this.onUpdateRollFrameStatus, this);
        EventClient.I.on(E.RollFrame.ClearCurRollValue, this.onClearCurRollValue, this);
        EventClient.I.on(E.WorldBoss.UpdateRankData, this.onUpdateRankData, this);
        EventClient.I.on(E.ShieldFrame.UpdateProgress, this.onUpdateProgress, this);
        EventClient.I.on(E.WorldBoss.UpdateBossData, this.onUpdateBossData, this);
        EventClient.I.on(E.WorldBoss.UpdateInspireWin, this.onUpdateInspireWin, this);
        EventClient.I.on(E.WorldBoss.UpdateFightResultPVE, this.onUpdateFightResultPVE, this);
        EventClient.I.on(E.WorldBoss.UpdateFightResultPVP, this.onUpdateFightResultPVP, this);
        EventClient.I.on(E.Battle.End, this.onBattleEnd, this);
        this.lefttime = this._M.endTime - UtilTime.NowSec();
    }
    /** 战斗结束 */
    private onBattleEnd() {
        this.flushRankData();
        if (this.btnData.get(WorldBossBtnType.BtnAutoFight).val <= 0) {
            this.autoFightAni.active = false;
            const _bg = this.btnData.get(WorldBossBtnType.BtnAutoFight).target.getChildByName('NdBtn').getChildByName('NdBg');
            _bg.active = true;
        }
    }
    /** 更新界面相关数据 */
    private onUpdateBossData() {
        // 更新按钮状态
        this.updateBtnState();
    }
    // buff刷新
    private onUpdateInspireWin() {
        this.updateBtnState(WorldBossBtnType.BtnInspire);
    }
    // PVE刷新
    private onUpdateFightResultPVE() {
        this.updateBtnState(WorldBossBtnType.BtnAutoFight);
    }
    // PVP刷新
    private onUpdateFightResultPVP() {
        this.updateBtnState(WorldBossBtnType.BtnGrab);
    }
    /** 每一分钟主界面的排行榜刷新一次 */
    private _time: number = 60 + UtilTime.NowSec();
    protected updatePerSecond(): void {
        const NowSec = UtilTime.NowSec();
        this.lefttime = this._M.endTime - NowSec;
        if (this._time - NowSec <= 0) {
            this._time = 60 + NowSec;
            this.flushRankData();
        }
        if (this.grabtime > 0) {
            this.updateBtnTimes(WorldBossBtnType.BtnGrab);
        }
        if (this.autotime > 0) {
            this.updateBtnTimes(WorldBossBtnType.BtnAutoFight);
        }
        if (this.isShowDeBuff && this._M.breakShieldTime && (this._M.breakShieldTime - NowSec) <= 0) {
            this.delDeBuff();
        }
        this.updateTime();
    }

    private updateBtnTimes(_type: WorldBossBtnType) {
        const btnObj = this.btnData.get(_type);
        if (btnObj) {
            const timer = btnObj.cd - UtilTime.NowSec();
            if (timer <= 0) {
                if (_type === WorldBossBtnType.BtnGrab) {
                    this.grabtime = 0;
                } else if (_type === WorldBossBtnType.BtnAutoFight) {
                    this.autotime = 0;
                    this.fightBoss();
                }
                this.updateBtnState(_type);
                return;
            } else if (_type === WorldBossBtnType.BtnGrab) {
                this.grabtime = timer;
            } else if (_type === WorldBossBtnType.BtnAutoFight) {
                this.autotime = timer;
            }
            const timeString = `${timer}${i18n.tt(Lang.com_second)}`;
            btnObj.subTarLab.string = timeString;
        }
    }

    private flushRankData() {
        let range = [1, 100];
        if (WinMgr.I.checkIsOpen(ViewConst.WorldBossGrabWin)) {
            range = this._M.getRankRange(this._M.myRank);
        }
        ControllerMgr.I.WorldBossController.C2SGetWorldBossRank(WorldBossRPType.RpSelf, range[0], range[1]);
    }

    private flushRankView(): boolean {
        // 展示排行榜时自动update数据
        let isUpdate = false;
        if (this.leftJianTouState && this.worldBossRankView) {
            this.worldBossRankView.updateView();
            isUpdate = true;
        }
        return isUpdate;
    }

    private updateTime(): void {
        if (this.lefttime > 0) {
            this.bossBigHp?.updateHp(this.lefttime, this.keepTime);
            this.LabelTime.string = UtilTime.FormatHourDetail(this.lefttime);
        } else {
            this._M.exit();
        }
    }

    /** 更新排行榜数据 */
    private onUpdateRankData() {
        // 更新排行榜数据
        const isUpdate = this.flushRankView();
        if (isUpdate) { return; }
        /** 动态加载排行榜数据 */
        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.WorldBossRankView, this.NdRank, (err, nd: cc.Node) => {
            if (!err && this.NdRank && this.NdRank.isValid) {
                this.JianTouNd.active = true;
                this.NdRank.active = true;
                if (this.leftJianTouState) {
                    this.worldBossRankView = nd.getComponent(WorldBossRankView);
                    this.worldBossRankView.updateView();
                }
            }
        }, { target: this });
    }
    /** 副本左侧箭头，默认打开 */
    private leftJianTouState: boolean = true;
    private onBtnJianTouNd() {
        this.leftJianTouState = !this.leftJianTouState;
        this.moveFoldButton();
    }

    private moveFoldButton(): void {
        this.NdRank.active = true;
        cc.Tween.stopAllByTarget(this.NdRank);
        // cc.Tween.stopAllByTarget(this.JianTouNd);
        const w = this.NdRank.getContentSize().width; // this.NdRank.getComponent(UITransform).width;
        const posx = this.JianTouNd.position.x;
        const pos = !this.leftJianTouState ? -w + posx - 139 : posx + 139;
        cc.tween(this.NdRank).to(0.3, { x: pos, y: 134 }).start();
        // const posJT = !this.leftJianTouState ? posx - 280 : posx + 280;
        // cc.tween(this.JianTouNd).to(0.2, { x: posJT, y: -57 }).start();
        this.flushRankView();
    }
    private monster: EntityMonster;
    private initMonster(resId: number, scale?: number) {
        // const strBornPos = ModelMgr.I.WorldBossModel.getCfgValue(ECfgWorldBossConfigKey.WeekDayBornLocation);
        // const bornPos = strBornPos.split(',');
        // EntityMapMgr.I.role.setPosition(+bornPos[0] * MapCfg.I.cellWidth, +bornPos[1] * MapCfg.I.cellHeight);
        // SceneMap.I.initPlayCell(+bornPos[0], +bornPos[1]);

        this.monster = new EntityMonster(+resId, ANIM_TYPE.PET);
        if (scale) {
            this.monster.setScale(scale, scale);
        }
        EntityLayer.I.node.addChild(this.monster);
        const strBossPos = ModelMgr.I.WorldBossModel.getCfgValue(ECfgWorldBossConfigKey.WeekDayBossLocation);
        const bossPos = strBossPos.split(',');
        this.monster.setPosition(+bossPos[0] * MapCfg.I.cellWidth, +bossPos[1] * MapCfg.I.cellHeight);
    }

    private onUpdateShieldFrameStatus(isOpen: boolean, endTime: number) {
        if (isOpen) {
            this.onStartBossEvent(EBossEventType.Shield, endTime);
        } else {
            this.closeShieldFrame();
        }
    }

    private onUpdateRollFrameStatus(isOpen: boolean, endTime: number) {
        if (isOpen) {
            this.onStartBossEvent(EBossEventType.Roll, endTime);
        } else {
            this.closeRollFrame();
        }
    }

    /** boss事件开始的事件 */
    private onStartBossEvent(type: EBossEventType, endTime: number) {
        switch (type) {
            case EBossEventType.Roll:
                this.showRollFrame(endTime);
                break;
            case EBossEventType.Shield:
                this.showShieldFrame(endTime);
                break;
            default:
                break;
        }
    }

    /** boss事件结束的事件 */
    private onEndBossEvent(type: EBossEventType) {
        switch (type) {
            case EBossEventType.Roll:
                this.closeRollFrame();
                break;
            case EBossEventType.Shield:
                this.closeShieldFrame();
                break;
            default:
                break;
        }
    }

    /** 显示拼点弹窗 */
    private showRollFrame(endTime: number) {
        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.RollFrame, this.node, this.showRollFrameCallback, { target: this, customData: endTime });
    }

    /** 关闭拼点弹窗 */
    private closeRollFrame() {
        this.node.getChildByName('RollFrame')?.destroy();
        this.onClearCurRollValue();
    }

    /** 显示拼点弹窗回调 */
    private showRollFrameCallback(e: Error, node: cc.Node, endTime: number) {
        if (!this._M.getRollShowStatus()) {
            this.closeRollFrame();
            return;
        }
        const keepTime = +this._M.getCfgValue(ECfgWorldBossConfigKey.RollOpenTime);
        const topName = this._M.getRollTopName();
        const topValue = this._M.getRollTopValue();

        const groupId = ModelMgr.I.WorldBossModel.getCfgValue(ECfgWorldBossConfigKey.RollPrize);
        const cfgRwd = Config.Get<ConfigDropRewardIndexer>(Config.Type.Cfg_DropReward).getValueByDay(+groupId);
        const strItem = cfgRwd.ShowItems.split('|')[0];
        const item = strItem.split(':');

        const opts: IRollFrameOpts = {
            target: this,
            value: this._M.curRollValue,
            autoRoll: this._M.getAutoRoll(),
            topName,
            topValue,
            ItemId: +item[0],
            ItemNum: +item[1],
            helpId: FuncDescConst.RollFrame,
        };
        node.getComponent(RollFrame).setData(endTime, keepTime, this.onBtnRollClicked, this.onToggleAutoRoll, opts);
    }

    /** 点击开始拼点 */
    private onBtnRollClicked() {
        ControllerMgr.I.WorldBossController.C2SWorldBossRandomDice();
    }

    /** 勾选自动拼点 */
    private onToggleAutoRoll(b: boolean) {
        this._M.setAutoRoll(b);
    }

    /** 显示护盾弹窗 */
    private showShieldFrame(endTime: number) {
        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.ShieldFrame, this.node, this.showShieldFrameCallback, { target: this, customData: endTime });
        if (this.monster) {
            if (this._M.shieldValue > 0) {
                const resId = ModelMgr.I.WorldBossModel.getCfgValue(ECfgWorldBossConfigKey.ShieldResId);
                const resPath = `${RES_ENUM.WorldBoss_Ui}${resId}`;
                EffectMgr.I.showEffect(resPath, this.monster, cc.WrapMode.Loop, (node) => {
                    const s = this._M.getShieldShowStatus();
                    if (!s || !s.IsOpen || this._M.shieldValue <= 0) {
                        node.destroy();
                    } else {
                        node.setPosition(0, 50);
                    }
                });
            } else {
                this.showDeBuff();
            }
        }
    }
    private onUpdateProgress(curNum: number, maxNum: number) {
        if (curNum <= 0) {
            // 删除护盾特效
            const resId = ModelMgr.I.WorldBossModel.getCfgValue(ECfgWorldBossConfigKey.ShieldResId);
            const resPath = `${RES_ENUM.WorldBoss_Ui}${resId}`;
            EffectMgr.I.delEffect(resPath, this.monster);
            this.showDeBuff();
        }
    }

    /** 是否显示破盾特效 */
    private isShowDeBuff: boolean = false;
    private showDeBuff() {
        this.isShowDeBuff = true;
        const breakResId = ModelMgr.I.WorldBossModel.getCfgValue(ECfgWorldBossConfigKey.ShieldBreakResId);
        const breakResPath = `${RES_ENUM.WorldBoss_Ui}${breakResId}`;
        // 显示破盾特效
        EffectMgr.I.showEffect(breakResPath, this.monster, cc.WrapMode.Loop, (node) => {
            if (this._M.shieldValue > 0 || UtilTime.NowSec() > this._M.breakShieldTime) {
                node.destroy();
                this.isShowDeBuff = false;
            } else {
                node.setPosition(0, 50);
            }
        });

        const skillId = +ModelMgr.I.WorldBossModel.getCfgValue(ECfgWorldBossConfigKey.ShieldBreakDes);
        this.bossBigHp?.addBuff(EBossBuffType.BrokenShield, this._M.breakShieldTime, { skillId });
    }

    private delDeBuff() {
        const breakResId = ModelMgr.I.WorldBossModel.getCfgValue(ECfgWorldBossConfigKey.ShieldBreakResId);
        const breakResPath = `${RES_ENUM.WorldBoss_Ui}${breakResId}`;
        EffectMgr.I.delEffect(breakResPath, this.monster);
        this._M.clearBreakShield();
    }

    /** 关闭护盾弹窗 */
    private closeShieldFrame() {
        this.node.getChildByName('ShieldFrame')?.destroy();
        const resId = ModelMgr.I.WorldBossModel.getCfgValue(ECfgWorldBossConfigKey.ShieldResId);
        EffectMgr.I.delEffect(`${RES_ENUM.WorldBoss_Ui}${resId}`, this.monster);
        this._M.clearShield();
    }

    /** 显示护盾弹窗 */
    private showShieldFrameCallback(e: Error, node: cc.Node, endTime: number) {
        if (!this._M.getShieldShowStatus()) {
            this.closeShieldFrame();
            return;
        }
        const skillId = +ModelMgr.I.WorldBossModel.getCfgValue(ECfgWorldBossConfigKey.ShieldDes);
        // eslint-disable-next-line max-len
        node.getComponent(ShieldFrame).setData(endTime, this._M.shieldValue, this._M.shieldMaxValue, `【${UtilGeneral.GetCampName(this._M.bossCamp)}】`, skillId, { helpId: FuncDescConst.JianShangDun, skillName: i18n.tt(Lang.world_boss_jianshangdun) });

        this.bossBigHp?.addBuff(EBossBuffType.Shield, endTime, { skillId });
    }
    /** 显示活动时间 */
    private showActTime() {
        this.keepTime = this._M.endTime - this._M.startTime;
        if (this.lefttime > 0) {
            this.NodeTime.active = true;
            // this.schedule(this.updateLabelTime, 1);
            this.updateTime();
        } else {
            this.NodeTime.active = false;
        }
    }

    /** 加载显示boss血条 */
    private showBossHp() {
        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.BossBigHp, this.node, this.showBossHpCallback, { target: this });
    }

    /** 加载显示boss血条的回调 */
    private showBossHpCallback(e: Error, n: cc.Node) {
        this.bossBigHp = n.getComponent(BossBigHp);

        const cfgBoss = this._M.CfgWorldBoss.getValueByKey(this._M.bossId, { Name: '', RefreshId: 0, ResId: 0 });
        this.bossBigHp.setData(this._M.bossId, cfgBoss.RefreshId, { Name: cfgBoss.Name, ResId: cfgBoss.ResId });
        // eslint-disable-next-line max-len
        this.addBossEvent(EBossEventType.Roll, ECfgWorldBossConfigKey.RollStartTime, ECfgWorldBossConfigKey.RollOpenTime, RES_ENUM.WorldBoss_6061, FuncDescConst.RollFrame);
        if (this._M.isWeekendBoss()) {
            // eslint-disable-next-line max-len
            this.addBossEvent(EBossEventType.Shield, ECfgWorldBossConfigKey.ShieldStartTime, ECfgWorldBossConfigKey.ShieldOpenTime, RES_ENUM.WorldBoss_6071, FuncDescConst.JianShangDun);
        }
        const time = this._M.endTime - UtilTime.NowSec();
        this.bossBigHp.updateHp(time, this.keepTime);
    }

    /**
     * 添加boss事件
     * @param type 事件类型
     * @param startKey 开始时间的配置key
     * @param openKey 开启时间(持续时间)的配置key
     */
    // eslint-disable-next-line max-len
    private addBossEvent(type: EBossEventType, startKey: ECfgWorldBossConfigKey, openKey: ECfgWorldBossConfigKey, effectPath: string, helpId: number) {
        const strRollTime = this._M.getCfgValue(startKey);
        if (strRollTime) {
            let startPer: number = 0;
            let endPer: number = 0;
            const eventKeepTime = +this._M.getCfgValue(openKey);
            strRollTime.split('|').forEach((time, index) => {
                startPer = Math.ceil((1 - +time / this.keepTime) * 100) / 100;
                // startPer = 1 - per;
                endPer = Math.ceil((1 - ((+time + eventKeepTime) / this.keepTime)) * 100) / 100;
                // endPer = 1 - per;
                this.bossBigHp.addBossEvent(type, {
                    startTime: this.keepTime - Number(time),
                    endTime: this.keepTime - Number(time) - Number(eventKeepTime),
                    startPer,
                    endPer,
                    showValue: `${UtilNum.Float32(startPer * 100)}%`,
                    index,
                    effectPath,
                    helpId,
                });
            });
        }
    }

    protected start(): void {
        super.start();
        // 更新右边按钮状态
        this.updateBtnState();
        this.onUpdateRankData();
        this.showActTime();
        this.showBossHp();

        const cfgBoss = this._M.CfgWorldBoss.getValueByKey(this._M.bossId, { Name: '', RefreshId: 0, ResId: 0 });

        // 通过刷新表找怪物id
        const monsterIds: string = Config.Get(Config.Type.Cfg_Refresh).getValueByKey(cfgBoss.RefreshId, 'MonsterIds');
        const monsterId = +monsterIds.split('|')[0];
        const scale: number = Config.Get(Config.Type.Cfg_Monster).getValueByKey(monsterId, 'Scale');
        this.initMonster(cfgBoss.ResId, scale / 100);

        const rollS = this._M.getRollShowStatus();
        if (rollS && rollS.IsOpen) {
            this.onUpdateRollFrameStatus(!!rollS.IsOpen, rollS.EndTime);
        }
        const shieldS = this._M.getShieldShowStatus();
        if (shieldS && shieldS.IsOpen) {
            this.onUpdateShieldFrameStatus(!!shieldS.IsOpen, shieldS.EndTime);
        }

        if (this.btnData.get(WorldBossBtnType.BtnAutoFight)) {
            const tar = this.btnData.get(WorldBossBtnType.BtnAutoFight).target.getChildByName('NdBtn').getChildByName('NdAni');
            EffectMgr.I.showEffect(RES_ENUM.Com_Ui_111, tar, cc.WrapMode.Loop, (node) => {
                this.autoFightAni = node;
                node.active = false;
            });
        }
    }

    private onBtnExit() {
        this._M.exit(true);
    }

    private updateBtnState(btnType?: WorldBossBtnType) {
        // console.log('更新按钮状态', btnType);
        const btnL = btnType ? [btnType] : [WorldBossBtnType.BtnAutoFight, WorldBossBtnType.BtnGrab, WorldBossBtnType.BtnInspire];
        btnL.forEach((_type) => {
            const btnObj: IBtnItem = cc.js.createMap(true);
            switch (_type) {
                case WorldBossBtnType.BtnAutoFight:
                    btnObj.target = this.BtnAutoFight;
                    btnObj.val = +this._M.getCfgValue(ECfgWorldBossConfigKey.ChallengeTimes) - this._M.challengeTimes;
                    btnObj.label = UtilString.FormatArray(i18n.tt(Lang.world_boss_btn_times), [btnObj.val]);
                    btnObj.color = UtilColor.Hex2Rgba(UtilColor.YellowBtn);
                    btnObj.btnName = i18n.tt(Lang.world_boss_autofught_btn);
                    btnObj.cd = this._M.challengeCD;
                    btnObj.btnRedDot = false;
                    break;
                case WorldBossBtnType.BtnGrab:
                    btnObj.target = this.BtnGrab;
                    btnObj.val = +this._M.getCfgValue(ECfgWorldBossConfigKey.GrabTimes) - this._M.grabTimes;
                    btnObj.label = UtilString.FormatArray(i18n.tt(Lang.world_boss_btn_times), [btnObj.val]);
                    btnObj.color = UtilColor.Hex2Rgba(UtilColor.YellowBtn);
                    btnObj.btnName = i18n.tt(Lang.world_boss_grab_btn);
                    btnObj.cd = this._M.grabCD;
                    btnObj.btnRedDot = btnObj.val > 0 && (this._M.grabCD - UtilTime.NowSec() <= 0);
                    break;
                case WorldBossBtnType.BtnInspire:
                    btnObj.target = this.BtnInspire;
                    btnObj.val = this._M.buffNum;
                    btnObj.label = btnObj.val === 0 ? `${i18n.tt(Lang.com_attr_2_name)}+0%` : this._M.getInspireRatio(btnObj.val);
                    btnObj.color = UtilColor.Hex2Rgba(UtilColor.GreenBtn);
                    btnObj.btnName = i18n.tt(Lang.world_boss_inspire_btn);
                    btnObj.btnRedDot = false;
                    break;
                default:
                    break;
            }
            const Ndlab = UtilCocos.FindNode(btnObj.target, 'NdBtn/BtnDesc/DescLabel');
            const lab = Ndlab.getComponent(cc.Label);
            lab.string = btnObj.label;
            lab.node.color = btnObj.color;
            const btnlab = UtilCocos.FindNode(btnObj.target, 'NdName/btnName');
            const btnName = btnlab.getComponent(cc.Label);
            btnName.string = btnObj.btnName;
            btnObj.subTarLab = btnName;
            this.btnData.set(_type, btnObj);

            if (_type !== WorldBossBtnType.BtnInspire) {
                if (btnObj.val <= 0) {
                    UtilCocos.SetSpriteGray(btnObj.target, true);
                } else if (btnObj.cd && btnObj.cd - UtilTime.NowSec() > 0) {
                    if (_type === WorldBossBtnType.BtnGrab) {
                        this.grabtime = btnObj.cd - UtilTime.NowSec();
                    } else {
                        this.autotime = btnObj.cd - UtilTime.NowSec();
                    }
                }
            }
            // 更新红点
            const Ndbg = UtilCocos.FindNode(btnObj.target, 'NdBtn/NdBg');
            UtilRedDot.UpdateRed(Ndbg, btnObj.btnRedDot, new cc.Vec2(30, 30));
        });
    }
    // 鼓舞按钮
    private onBtnInspire() {
        if (this.btnData.get(WorldBossBtnType.BtnInspire).val >= this._M.CfgWorldBossInspireConfig.length) {
            MsgToastMgr.Show(i18n.tt(Lang.world_boss_inspire_max));
            return;
        }
        WinMgr.I.open(ViewConst.WorldBossInspireWin);
    }
    // 抢夺按钮
    private onBtnGrab() {
        if (this.grabtime > 0) {
            MsgToastMgr.Show(i18n.tt(Lang.world_boss_grab_cooling));
            return;
        } else if (this.btnData.get(WorldBossBtnType.BtnGrab).val <= 0) {
            MsgToastMgr.Show(i18n.tt(Lang.world_boss_auto_null));
            return;
        }
        const range = this._M.getRankRange(this._M.myRank);
        ControllerMgr.I.WorldBossController.C2SGetWorldBossRank(WorldBossRPType.RpSelf, range[0], range[1]);
        WinMgr.I.open(ViewConst.WorldBossGrabWin);
    }

    // 自动战斗按钮
    private onBtnAutoFight() {
        if (this.autotime > 0) {
            MsgToastMgr.Show(i18n.tt(Lang.world_boss_auto_cooling));
            this.moveToFight = false;
            this.isAutoFight = false;
            return;
        } else if (this.btnData.get(WorldBossBtnType.BtnAutoFight).val <= 0) {
            MsgToastMgr.Show(i18n.tt(Lang.world_boss_auto_null));
            this.moveToFight = false;
            this.isAutoFight = false;
            return;
        }
        const pos = this.monster?.getPosition();
        SceneMap.I.movePlayer(pos?.x, pos?.y, () => {
            this.fightBoss();
        });
        this.moveToFight = true;
        this.isAutoFight = true;
        EventClient.I.on(E.Map.MoveStart, this.onMoveStart, this);
    }

    /** 挑战boss */
    private fightBoss() {
        if (this.isAutoFight) {
            if (FuBenMgr.I.checkCanEnterFight(EMapFbInstanceType.WorldBoss, true)) {
                this.closeOtherWin();
                this.scheduleOnce(() => {
                    BattleCommon.I.enter(EBattleType.WorldBoss_PVE_DAYS);
                }, 0);
            }
        }
    }

    private onMoveStart() {
        this.moveToFight = false;
        this.isAutoFight = this.moveToFight;
        if (!this.isAutoFight) {
            EventClient.I.off(E.Map.MoveStart, this.onMoveStart, this);
        }
    }
    // 奖励预览按钮
    private onBtnRewardPreview() {
        WinMgr.I.open(ViewConst.WorldBossRewardPreview);
    }

    private onClearCurRollValue() {
        this._M.clearRoll();
    }
    private closeOtherWin() {
        WinMgr.I.closeViewAttr([
            ViewConst.WorldBossGrabWin,
            ViewConst.ConfirmBox,
            ViewConst.WorldBossInspireWin,
            ViewConst.WorldBossRewardPreview,
            // 只处理boss的结算界面
            ViewConst.BattleSettleWin,
        ]);
    }
    protected onDestroy(): void {
        EventClient.I.off(E.WorldBoss.UpdateShieldFrameStatus, this.onUpdateShieldFrameStatus, this);
        EventClient.I.off(E.WorldBoss.UpdateRollFrameStatus, this.onUpdateRollFrameStatus, this);
        EventClient.I.off(E.WorldBoss.UpdateRankData, this.onUpdateRankData, this);
        EventClient.I.off(E.RollFrame.ClearCurRollValue, this.onClearCurRollValue, this);
        EventClient.I.off(E.ShieldFrame.UpdateProgress, this.onUpdateProgress, this);
        EventClient.I.off(E.WorldBoss.UpdateBossData, this.onUpdateBossData, this);
        EventClient.I.off(E.WorldBoss.UpdateInspireWin, this.onUpdateInspireWin, this);
        EventClient.I.off(E.WorldBoss.UpdateFightResultPVE, this.onUpdateFightResultPVE, this);
        EventClient.I.off(E.WorldBoss.UpdateFightResultPVP, this.onUpdateFightResultPVP, this);
        EventClient.I.off(E.Battle.End, this.onBattleEnd, this);
        EventClient.I.off(E.Map.MoveStart, this.onMoveStart, this);
        this.closeOtherWin();
        this.monster?.destroy();
    }
}

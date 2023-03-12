/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: zs
 * @Date: 2022-08-29 21:15:34
 * @FilePath: \SanGuo2.4\assets\script\game\module\worldBoss\WorldBossModel.ts
 * @Description:
 *
 */
import { EventClient } from '../../../app/base/event/EventClient';
import { UtilNum } from '../../../app/base/utils/UtilNum';
import { UtilTime } from '../../../app/base/utils/UtilTime';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { Config } from '../../base/config/Config';
import { ConfigDropRewardIndexer } from '../../base/config/indexer/ConfigDropRewardIndexer';
import { ConfigIndexer } from '../../base/config/indexer/ConfigIndexer';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { E } from '../../const/EventName';
import ControllerMgr from '../../manager/ControllerMgr';
import { FuBenMgr } from '../fuben/FuBenMgr';
import { BattleExType, ECfgWorldBossConfigKey, WorldBossRPType } from './WorldBossConst';
import { BattleType, EBattleType } from '../battleResult/BattleResultConst';
import { i18n, Lang } from '../../../i18n/i18n';
import { RoleMgr } from '../role/RoleMgr';
import ModelMgr from '../../manager/ModelMgr';
import { IListenInfo, REDDOT_ADD_LISTEN_INFO, RID } from '../reddot/RedDotConst';
import { ViewConst } from '../../const/ViewConst';
import { RedDotMgr } from '../reddot/RedDotMgr';
import { RedDotCheckMgr } from '../reddot/RedDotCheckMgr';
import { FuncId } from '../../const/FuncConst';

const { ccclass } = cc._decorator;
@ccclass('WorldBossModel')
export class WorldBossModel extends BaseModel {
    public clearAll(): void {
        // throw new Error('Method not implemented.');
    }
    public onRedDotEventListen(): void {
        RedDotCheckMgr.I.on(RID.Boss.CrossBoss.Id, this.redUpdateAll, this);
        RedDotCheckMgr.I.on(RID.Boss.CrossBoss.WorldBoss, this.redMjInfo, this);
    }

    public offRedDotEventListen(): void {
        RedDotCheckMgr.I.off(RID.Boss.CrossBoss.Id, this.redUpdateAll, this);
        RedDotCheckMgr.I.off(RID.Boss.CrossBoss.WorldBoss, this.redMjInfo, this);
    }

    // 红点
    public registerRedDotListen(): void {
        const rid = RID.Boss.CrossBoss.WorldBoss;
        const info: IListenInfo = {
            ProtoId: [ProtoId.S2COpenWorldBossUI_ID, ProtoId.S2CExitWorldBoss_ID],
            ProxyRid: [RID.Boss.CrossBoss.Id],
            CheckVid: [ViewConst.BossWin],
        };
        RedDotMgr.I.emit(REDDOT_ADD_LISTEN_INFO, { rid, info });
    }
    private redUpdateAll() {
        let isShow: boolean = false;
        if (UtilFunOpen.isOpen(FuncId.WorldBoss)) {
            isShow = this.redMjInfo(); // || ModelMgr.I.BeaconWarModel.beaconWarMainRed();
        }
        return isShow;
    }

    public redMjInfo(): boolean {
        const isShow = this.isWorldBossOpen();
        RedDotMgr.I.updateRedDot(RID.Boss.CrossBoss.WorldBoss, isShow);
        return isShow;
    }

    /**
     * 获取名将来袭配置表的key对应的值
     * @param key key
     * @returns 值
     */
    /** 名将来袭配置表的索引器 */
    private _CfgWorldBossConfig: ConfigIndexer;
    private _CfgWorldBossRankConfig: ConfigIndexer;
    private _CfgWorldBossInspireConfig: ConfigIndexer;
    private _CfgWorldBoss: ConfigIndexer;
    private _RankCfg: Map<number, Cfg_WorldBoss_Rank[]> = new Map();

    /** 功能信息配置 */
    public get CfgWorldBossConfig(): ConfigIndexer {
        if (!this._CfgWorldBossConfig) {
            this._CfgWorldBossConfig = Config.Get(Config.Type.Cfg_Boss_Config);
        }
        return this._CfgWorldBossConfig;
    }
    /** 排行配置 */
    public get CfgWorldBossRankConfig(): ConfigIndexer {
        if (!this._CfgWorldBossRankConfig) {
            this._CfgWorldBossRankConfig = Config.Get(Config.Type.Cfg_WorldBoss_Rank);
        }
        return this._CfgWorldBossRankConfig;
    }
    /** 鼓舞配置 */
    public get CfgWorldBossInspireConfig(): ConfigIndexer {
        if (!this._CfgWorldBossInspireConfig) {
            this._CfgWorldBossInspireConfig = Config.Get(Config.Type.Cfg_WorldBoss_Inspire);
        }
        return this._CfgWorldBossInspireConfig;
    }
    /** BOSS信息配置 */
    public get CfgWorldBoss(): ConfigIndexer {
        if (!this._CfgWorldBoss) {
            this._CfgWorldBoss = Config.Get(Config.Type.Cfg_WorldBoss);
        }
        return this._CfgWorldBoss;
    }
    /** 奖励预览配置重定向 */
    public get RankCfg(): Map<number, Cfg_WorldBoss_Rank[]> {
        if (this._RankCfg.size === 0) {
            this.initRankConfig();
        }
        return this._RankCfg;
    }
    public initRankConfig(): void {
        const len = this.CfgWorldBossRankConfig.keysLength;
        for (let i = 0; i < len; i++) {
            const element: Cfg_WorldBoss_Rank = this.CfgWorldBossRankConfig.getValueByKey(i + 1);
            const res = this._RankCfg.get(element?.RankType) ?? [];
            res.push(element);
            this._RankCfg.set(element?.RankType, res);
        }
    }
    /**
     * 获取名将来袭配置表的key对应的值
     * @param key key
     * @returns 值
     */
    public getCfgValue(key: ECfgWorldBossConfigKey): string {
        return this.CfgWorldBossConfig.getValueByKey(key, 'Value') || '';
    }
    /** bossid */
    private _bossId: number = 0;
    public get bossId(): number {
        return this._bossId;
    }

    private set bossId(v: number) {
        this._bossId = v;
    }

    /** boss的阵营 */
    public get bossCamp(): number {
        return this.getCfgBossValue('Camp') || 1;
    }

    /** 世界等级 */
    private worldLevel: number = UtilNum.RandomInt(100, 500);
    /** 结束时间戳 */
    private _endTime: number = 0;
    public get endTime(): number {
        return this._endTime; // || this.startTime + 10 * 60;
    }
    /** 开始时间戳 */
    private _startTime: number = 0;
    public get startTime(): number {
        return this._startTime; // || UtilTime.NowSec();
    }
    /** 关闭时间戳 */
    private _closeTime: number = 0;
    public get closeTime(): number {
        return this._closeTime;
    }
    public setBaseData(d: S2COpenWorldBossUI): void {
        this._bossId = d.BossId;
        this._endTime = d.EndTime;
        this._startTime = d.StartTime;
        this._closeTime = d.CloseTime;
        // this.worldLevel = d.WorldLevel;
        EventClient.I.emit(E.WorldBoss.UpdateBossPageData);
    }

    /** 已挑战次数 */
    private _challengeTimes: number = 0;
    public get challengeTimes(): number {
        return this._challengeTimes;
    }
    private set challengeTimes(v: number) {
        this._challengeTimes = v;
    }

    /** 挑战冷却时间戳 */
    private _challengeCD: number = 0;
    public get challengeCD(): number {
        return this._challengeCD;
    }
    public set challengeCD(v: number) {
        this._challengeCD = v;
    }
    /** 已挑战奖励次数 */
    private _challengePrizeTimes: number = 0;
    public get challengePrizeTimes(): number {
        return this._challengePrizeTimes;
    }
    private set challengePrizeTimes(v: number) {
        this._challengePrizeTimes = v;
    }

    /** 已抢夺次数 */
    private _grabTimes: number = 0;
    public get grabTimes(): number {
        return this._grabTimes;
    }
    private set grabTimes(v: number) {
        this._grabTimes = v;
    }

    /** 抢夺冷却时间戳 */
    private _grabCD: number = 0;
    public get grabCD(): number {
        return this._grabCD;
    }
    public set grabCD(v: number) {
        this._grabCD = v;
    }
    /** 购买buff次数 */
    private _buffNum: number = 0;
    public get buffNum(): number {
        return this._buffNum;
    }
    public set buffNum(v: number) {
        this._buffNum = v;
    }

    /** 个人排名 */
    private _myRank: number = 30;
    public get myRank(): number {
        return this._myRank;
    }

    private set myRank(v: number) {
        this._myRank = v;
    }

    /** 个人积分 */
    private _userScore: number = 0;
    public get userScore(): number {
        return this._userScore;
    }

    /** 势力排名 */
    private _areaRank: number = 10;
    public get areaRank(): number {
        return this._areaRank;
    }

    private set areaRank(v: number) {
        this._areaRank = v;
    }

    /** 势力积分 */
    private _areaScore: number = 0;
    public get areaScore(): number {
        return this._areaScore;
    }

    private set areaScore(v: number) {
        this._areaScore = v;
    }

    /** 当前拼点值 */
    private _curRollValue: number = 0;
    public get curRollValue(): number {
        return this._curRollValue;
    }

    public set curRollValue(v: number) {
        this._curRollValue = v;
        if (v === 0 && this.rollTop) {
            delete this.rollTop;
        }
    }

    private _shieldMaxValue: number = 0;
    /** 护盾最大值 */
    public get shieldMaxValue(): number {
        if (!this._shieldMaxValue) {
            this._shieldMaxValue = +this.getCfgValue(ECfgWorldBossConfigKey.ShieldBreakTimes);
        }
        return this._shieldMaxValue;
    }

    /** 当前护盾值 */
    private _shieldValue: number = 0;
    public get shieldValue(): number {
        if (this._breakShieldTime > 0) {
            // 已经破盾了
            return this._shieldValue;
        } else {
            return this._shieldValue || this.shieldMaxValue;
        }
    }

    public set shieldValue(v: number) {
        if (this._shieldValue !== v) {
            this._shieldValue = v;
        }
    }

    /** 护盾百分比值 */
    public get shieldPer(): number {
        return Math.ceil((this.shieldValue / this.shieldMaxValue) * 100);
    }

    /** 破盾的结束时间戳 */
    private _breakShieldTime: number = 0;
    public get breakShieldTime(): number {
        return this._breakShieldTime;
    }
    public set breakShieldTime(v: number) {
        this._breakShieldTime = v;
    }

    /** 清除护盾数据 */
    public clearShield(): void {
        this.shieldValue = this.shieldMaxValue;
    }

    public clearBreakShield(): void {
        this.breakShieldTime = 0;
    }

    /** 清除拼点数据 */
    public clearRoll(): void {
        this.curRollValue = 0;
    }

    /** 拼点结果返回 */
    public rollResult(d: S2CWorldBossRandomDice): void {
        this.curRollValue = d.Points;
        EventClient.I.emit(E.RollFrame.UpdateRoll, this.curRollValue);
    }

    private rollTop: S2CWorldBossCurMaxDiceNumNotice;
    public rollTopResult(d: S2CWorldBossCurMaxDiceNumNotice): void {
        this.rollTop = d;
        EventClient.I.emit(E.RollFrame.UpdateTopRoll, `${d.Name}`, d.MaxNum, d.UserId);// 去掉区服${d.LoginAreaId}.
    }
    public getRollTopName(): string {
        if (this.rollTop) {
            return `${this.rollTop.Name}`;// 去掉区服${this.rollTop.LoginAreaId}.
        } else {
            return '';
        }
    }
    public getRollTopValue(): number {
        if (this.rollTop) {
            return this.rollTop.MaxNum;
        } else {
            return 0;
        }
    }

    public getRollTopUserId(): number {
        if (this.rollTop) {
            return this.rollTop.UserId;
        } else {
            return 0;
        }
    }

    /** 设置boss数据 */
    public setBossData(d: S2CEnterWorldBoss): void {
        this._challengeTimes = d.ChallengeTimes;
        this._challengeCD = d.ChallengeCD;
        this._challengePrizeTimes = d.ChallengePrizeTimes;
        this._grabTimes = d.GrabTimes;
        this._grabCD = d.GrabCD;
        this._buffNum = d.BuffNum;
        this._myRank = d.MyRank;
        this._userScore = d.MyScore;
        this._areaRank = d.AreaRank;
        this._areaScore = d.AreaScore;
        this._bossId = d.BossId;
        // this.worldLevel = d.WorldLevel;
        this._endTime = d.EndTime;
        this._startTime = d.StartTime;
        this.shieldValue = d.AreaShieldNum;
        this.breakShieldTime = d.AreaShieldBreakEndTime;
        EventClient.I.emit(E.WorldBoss.UpdateBossData);
    }

    /**
     * 更新护盾
     * @param value 剩余护盾值
     * @param time 破盾结束时间戳
     */
    public updateShield(value: number, time: number): void {
        this._breakShieldTime = time;
        this._shieldValue = value;
        EventClient.I.emit(E.ShieldFrame.UpdateProgress, this._shieldValue, this.shieldMaxValue);
    }

    /** 排行榜数据 */
    public rankData: Map<WorldBossRPType, Map<number, WorldBossUserRankData | WorldBossAreaRankData>> = new Map();
    /** 设置排行榜数据 */
    public setRankData(d: S2CGetWorldBossRank): void {
        let subMap: Map<number, WorldBossUserRankData | WorldBossAreaRankData> = new Map();
        if (this.rankData.has(d.RankType)) {
            subMap = this.rankData.get(d.RankType);
        }
        switch (d.RankType) {
            case WorldBossRPType.RpSelf:
                // if (d.UserRankList.length === 0) {
                //     return;
                // }
                d.UserRankList.forEach((item) => {
                    subMap.set(item.R, item);
                });
                this.rankData.set(d.RankType, subMap);
                this._myRank = d.MyRank;
                this._userScore = d.MyScore;
                break;
            case WorldBossRPType.RpFamily:
                // if (d.AreaRankList.length === 0) {
                //     return;
                // }
                d.AreaRankList.forEach((item) => {
                    subMap.set(item.R, item);
                });
                this.rankData.set(d.RankType, subMap);
                this._areaRank = d.MyRank;
                this._areaScore = d.MyScore;
                break;
            default:
                break;
        }
        EventClient.I.emit(E.WorldBoss.UpdateRankData);
    }
    /** 排行榜滑动框判定请求后端的范围系数 */
    public addRange = 50;
    /** 根据当前名字获取排行区间 */
    public getRankRange(nowRank: number): number[] {
        const start = nowRank <= this.addRange ? 1 : nowRank - this.addRange;
        const end = nowRank + this.addRange;
        return [start, end];
    }

    public setFightResultPVE(d: S2CChallengeWorldBossPVE): void {
        this._challengeTimes = d.ChallengeTimes;
        this._challengeCD = d.ChallengeCD;
        this._challengePrizeTimes = d.ChallengePrizeTimes;
        EventClient.I.emit(E.WorldBoss.UpdateFightResultPVE);
    }

    public setFightResultPVP(d: S2CChallengeWorldBossPVP): void {
        this._grabTimes = d.GrabTimes;
        this._grabCD = d.GrabCD;
        EventClient.I.emit(E.WorldBoss.UpdateFightResultPVP);
    }

    public getEndTime(): number {
        return this.endTime;
    }

    /** 是否为周末BOSS */
    public isWeekendBoss(): boolean {
        const date = new Date(UtilTime.NowMSec());
        return date.getDay() === 6 || date.getDay() === 0;
    }

    /**
     * 获取名将来袭首领表的key对应的值
     * @param key key
     * @returns
     */
    public getCfgBossValue<T>(key: string): T {
        return this.CfgWorldBoss.getValueByKey(this.bossId, key) || null;
    }

    /** 获取鼓舞属性描述 */
    public getInspireRatio(_time: number): string {
        let str: string = `${i18n.tt(Lang.com_attr_2_name)}+`;
        if (_time !== 0) {
            if (_time > this.CfgWorldBossInspireConfig.length) {
                return i18n.tt(Lang.com_level_max);
            } else {
                const data: Cfg_WorldBoss_Inspire = this.CfgWorldBossInspireConfig.getValueByKey(_time);
                str += `${Math.floor(data.InspireRatio / 1000)}%`;
            }
        } else {
            return i18n.tt(Lang.com_null);
        }
        return str;
    }
    /**
     * 获取排行类型获取当前的排名区间
     * @param _type 奖励类型
     * @param _section 第几个区间
     * @returns
     */
    public getWbRankMess(_type: WorldBossRPType, _section: number): string {
        let str = '';
        const _data: Cfg_WorldBoss_Rank = this.RankCfg.get(_type).filter((v, idx) => idx === _section)[0];
        const minR = _data.MinRank;
        const maxR = _data.MaxRank;
        if (minR === maxR) {
            str = maxR.toString();
        } else if (minR < maxR) {
            str = `${minR}-${maxR}`;
        }
        return str;
    }
    /** 获取当前的奖励信息 */
    public getWbGroupReward(_type: WorldBossRPType, _section: number): string {
        const day = UtilFunOpen.serverDays;
        const _data: Cfg_WorldBoss_Rank = this.RankCfg.get(_type).filter((v, idx) => idx === _section)[0];
        const configIndexer: ConfigDropRewardIndexer = Config.Get(Config.Type.Cfg_DropReward);
        const dropReward: Cfg_DropReward = configIndexer.getValueByDay(_data.GroupId, day);
        return dropReward.ShowItems;
    }
    /** 处理战斗结算数据 */
    public getBattleInfoData(data: S2CPrizeReport, _type: BattleExType): { key: string, val: number | string }[] {
        const _data: { key: string, val: number | string }[] = [];
        switch (_type) {
            case BattleExType.GrabEx:
                if (data.Type === BattleType.Win) {
                    _data.push({
                        key: i18n.tt(Lang.world_boss_grab) + i18n.tt(Lang.world_boss_integral_get),
                        val: data.IntData[0],
                    });
                    _data.push({
                        key: i18n.tt(Lang.world_boss_integral_sheng),
                        val: data.IntData[1],
                    });
                } else {
                    _data.push({
                        key: i18n.tt(Lang.world_boss_grab_fail),
                        val: i18n.tt(Lang.world_boss_integral_nochange),
                    });
                    _data.push({
                        key: i18n.tt(Lang.world_boss_integral_self),
                        val: data.IntData[0],
                    });
                }
                break;
            case BattleExType.BossFightEx:
                _data.push({ key: i18n.tt(Lang.world_boss_integral_rwnumber), val: data.IntData[0] });
                _data.push({ key: i18n.tt(Lang.world_boss_hurt_number), val: data.IntData[1] });
                _data.push({ key: i18n.tt(Lang.world_boss_integral_get), val: data.IntData[2] });
                if (data.IntData[3] !== 0) {
                    const count = data.IntData[3] > this.shieldMaxValue ? this.shieldMaxValue : data.IntData[3];
                    _data.push({ key: i18n.tt(Lang.world_boss_dun_pay), val: `${Math.ceil((count / this.shieldMaxValue) * 100)}%` });
                }
                break;
            case BattleExType.Family_Boss:
                _data.push({ key: i18n.tt(Lang.family_damagefirst), val: data.IntData[0] });
                _data.push({ key: i18n.tt(Lang.family_damagethisTime), val: data.IntData[1] });
                _data.push({ key: i18n.tt(Lang.family_curRank), val: data.IntData[2] });
                break;
            default:
                break;
        }
        return _data;
    }
    /** 根据副本战斗类型获取当前属于哪个战斗结算场景 */
    public getBattleType(fbtype: EBattleType): BattleExType {
        let type: BattleExType;
        switch (fbtype) {
            case EBattleType.WorldBoss_PVE_DAYS:
            case EBattleType.WorldBoss_PVE_WeekDay:
                type = BattleExType.BossFightEx;
                break;
            case EBattleType.WorldBoss_PVP_DAYS:
            case EBattleType.WorldBoss_PVP_WeekDay:
                type = BattleExType.GrabEx;
                break;
            case EBattleType.Family_Boss:
                type = BattleExType.Family_Boss;
                break;
            case EBattleType.Family_Chif:
                type = BattleExType.Family_Chif;
                break;
            default:
                break;
        }
        return type;
    }

    /** 自动拼点 */
    private autoRoll: boolean = false;
    public setAutoRoll(b: boolean): void {
        this.autoRoll = b;
    }

    public getAutoRoll(): boolean {
        return this.autoRoll;
    }

    /** 护盾窗是否显示状态 */
    private shieldShowStatus: S2CWorldBossShieldOpenNotice;
    public getShieldShowStatus(): S2CWorldBossShieldOpenNotice {
        return this.shieldShowStatus;
    }
    /**
     * 设置护盾窗显示状态
     * @param b 是否显示
     */
    public updateShieldShowStatus(d: S2CWorldBossShieldOpenNotice): void {
        this.shieldShowStatus = d;
        EventClient.I.emit(E.WorldBoss.UpdateShieldFrameStatus, d.IsOpen, d.EndTime);
    }
    /** 拼点窗是否显示状态 */
    private rollShowStatus: S2CWorldBossRandomDiceOpenNotice;
    public getRollShowStatus(): S2CWorldBossRandomDiceOpenNotice {
        return this.rollShowStatus;
    }
    /**
     * 拼点窗显示状态
     * @param b 是否显示
     */
    public updateRollShowStatus(d: S2CWorldBossRandomDiceOpenNotice): void {
        this.rollShowStatus = d;
        EventClient.I.emit(E.WorldBoss.UpdateRollFrameStatus, d.IsOpen, d.EndTime);
    }

    /**
     * 活动是否开启,true为开
     */
    public isWorldBossOpen(): boolean {
        return this.startTime < UtilTime.NowSec() && this.endTime > UtilTime.NowSec();
    }

    /**
     * 退出世界boss
     * @param needTip 是否需要二次确认提示,默认false
     */
    public exit(needTip: boolean = false): void {
        FuBenMgr.I.quitFuBen(needTip, undefined, () => {
            ControllerMgr.I.WorldBossController.C2SExitWorldBoss();
        });
    }
    public exitResult(): void {
        // this.curRollValue = 0;
        this.shieldShowStatus = undefined;
        this.rollShowStatus = undefined;
    }
}

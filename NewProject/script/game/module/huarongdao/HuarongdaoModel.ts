/*
 * @Author: lijun
 * @Date: 2023-02-20 15:57:16
 * @Description:
 */

import { UtilArray } from '../../../app/base/utils/UtilArray';
import { UtilTime } from '../../../app/base/utils/UtilTime';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { Config } from '../../base/config/Config';
import ModelMgr from '../../manager/ModelMgr';
import ActivityMgr from '../activity/timerActivity/ActivityMgr';
import { RID } from '../reddot/RedDotConst';
import { RedDotMgr } from '../reddot/RedDotMgr';
import {
    HuarongdaoMatchState, IHuarongdaoActivityTimeStep, IHuarongdaoGenIdList, IHuarongdaoSupportGenInfo,
} from './HuarongdaoConst';

const { ccclass } = cc._decorator;

@ccclass
export default class HuarongdaoModel extends BaseModel {
    public matchState: number = HuarongdaoMatchState.wait;

    /** 华容道信息 */
    private huarongInfo: S2CHuarongInfo = null;
    /** 参赛者信息 */
    private entryInfoMap: { [id: number]: HuarongEntryInfo } = cc.js.createMap(true);
    /** 押注信息列表 */
    private betInfoMap: { [id: number]: HuarongBetInfoByClient } = cc.js.createMap(true);
    /** 购买信息列表 */
    private buyInfoMap: { [id: number]: HuarongBuyInfo } = cc.js.createMap(true);
    /** 活动记录-胜利者 */
    private winEntryMapLog: { [CycNo: number]: HuarongEntryInfo } = cc.js.createMap(true);
    /** 活动记录-押注信息 */
    private betMapLog: { [CycNo: number]: Array<HuarongBetInfo> } = cc.js.createMap(true);
    /** 支持率信息 */
    private supportRateMap: { [id: number]: HuarongBetInfoByClient } = cc.js.createMap(true);

    private countDownTime: number = 0;
    private _stakeTime = 0;// 竞猜时长

    public clearAll(): void {
        //
    }

    /** 清理数据 */
    public clearData(): void {
        this.matchState = HuarongdaoMatchState.wait;
        this.huarongInfo = null;
        this.entryInfoMap = {};
        this.betInfoMap = {};
        this.buyInfoMap = {};
        this.winEntryMapLog = {};
        this.betMapLog = {};
        this.countDownTime = 0;
        this.supportRateMap = {};
    }

    /** 获取常量配置 */
    public getNormalByKey(value: string): Cfg_HuarongdaoNormal {
        const Cfg_Normal = Config.Get(Config.Type.Cfg_HuarongdaoNormal);
        const cfg: Cfg_HuarongdaoNormal = Cfg_Normal.getValueByKey(value);
        return cfg;
    }

    /** 获取地图配置 */
    public getMapByKey(value: number): Cfg_HuarongdaoMap {
        const Cfg_Map = Config.Get(Config.Type.Cfg_HuarongdaoMap);
        const cfg: Cfg_HuarongdaoMap = Cfg_Map.getValueByKey(value);
        return cfg;
    }

    /** 获取事件配置 */
    public getBulletChatByKey(value: number): Cfg_HuarongdaoChat {
        const Cfg_Gen = Config.Get(Config.Type.Cfg_HuarongdaoChat);
        const cfg: Cfg_HuarongdaoChat = Cfg_Gen.getValueByKey(value);
        return cfg;
    }

    /** 获取气泡配置 */
    public getBubbleByKey(value: number): Cfg_HuarongdaoBubble {
        const Cfg_Gen = Config.Get(Config.Type.Cfg_HuarongdaoBubble);
        const cfg: Cfg_HuarongdaoBubble = Cfg_Gen.getValueByKey(value);
        return cfg;
    }

    /** 获取武将配置 */
    public getGenValueByKey(value: number): Cfg_HuarongdaoGen {
        const Cfg_Gen = Config.Get(Config.Type.Cfg_HuarongdaoGen);
        const cfg: Cfg_HuarongdaoGen = Cfg_Gen.getValueByKey(value);
        return cfg;
    }

    /** 获取支持武将类型 */
    public getSupportGenType(): number {
        const keys = Object.keys(this.betInfoMap);
        if (keys.length > 0) {
            const key = Number(keys[0]);
            const cfg = this.getGenValueByKey(this.betInfoMap[key].Id);
            return cfg.OddsType;
        }
        return 0;
    }

    /** 获取支持武将id */
    public getSupportGenArray(): Array<number> {
        const array: Array<number> = [];
        for (const k in this.betInfoMap) {
            array.push(Number(this.betInfoMap[k].Id));
        }
        return array;
    }

    /** 获取武将类型 */
    public getGenType(id: number): number {
        const cfg = this.getGenValueByKey(id);
        if (cfg) {
            return Number(cfg.OddsType);
        } else {
            return 0;
        }
    }

    /** 获取今日可支持上限 */
    public getTodaySupportMax(): number {
        const day = UtilTime.NowDays();

        if (day >= 1 && day <= 5) {
            const cfg = this.getNormalByKey('HuarongdaoTicketCount1');

            return Number(cfg.CfgValue);
        } else {
            const cfg = this.getNormalByKey('HuarongdaoTicketCount2');

            return Number(cfg.CfgValue);
        }
    }

    /** 获取该武将支持数量 */
    public getSupportNumById(id: number): number {
        if (this.betInfoMap[id]) {
            return this.betInfoMap[id].Count || 0;
        }
        return 0;
    }

    /** 获取总支持数量 */
    public getSupportTotalNum(): number {
        let count = 0;
        for (const k in this.betInfoMap) {
            count += this.betInfoMap[k].Count;
        }
        return count;
    }

    /** 类型购买次数 */
    public getButTimesByType(type: number): number {
        if (this.buyInfoMap[type]) {
            return this.buyInfoMap[type].Count;
        }
        return 0;
    }

    /** 华容道信息 */
    public setHuarongInfo(data: S2CHuarongInfo): void {
        this.entryInfoMap = {};
        this.huarongInfo = data;
        data.EntryInfoList.forEach((item) => {
            this.entryInfoMap[item.Id] = item;
            const bet: HuarongBetInfoByClient = {
                Id: item.Id,
                Count: item.BetCount || 0,
            };
            this.supportRateMap[item.Id] = bet;
        });

        this.betInfoMap = {};
        data.BetInfoList.forEach((item) => {
            this.betInfoMap[item.Id] = item;
        });

        this.setBuyInfo(data.BuyInfoList);
    }

    /** 购买信息 */
    public setBuyInfo(buyInfoList: Array<HuarongBuyInfo>): void {
        buyInfoList.forEach((item) => {
            this.buyInfoMap[item.BuyType] = item;
        });
    }

    /** 新的押注信息 */
    public setGenSupportNum(id: number, count: number): void {
        if (!this.betInfoMap[id]) {
            this.betInfoMap[id] = {
                Id: id,
                Count: count,
            };
        } else {
            this.betInfoMap[id].Count = count;
        }
    }

    /** 武将id分类 */
    public getGenIdList(): IHuarongdaoGenIdList {
        let mainRole: number = 0;
        const other: Array<number> = [];
        for (const k in this.entryInfoMap) {
            const id = this.entryInfoMap[k].Id;
            const cfg = this.getGenValueByKey(id);
            if (Number(cfg.OddsType) === 1) {
                mainRole = id;
            } else {
                other.push(id);
            }
        }
        const genList: IHuarongdaoGenIdList = { mainRole, other };
        return genList;
    }
    /** 获取比赛已经开始时间 */
    public getMatchTimeCount(): number {
        const BetTime = this.huarongInfo.BetTime;
        let MacthEndTime = 0;
        this.huarongInfo.EntryInfoList.forEach((item) => {
            if (item.EndTimes > MacthEndTime) {
                MacthEndTime = item.EndTimes;
            }
        });
        const now = UtilTime.NowSec() - this.getCountDownTime();
        if (now < MacthEndTime) {
            return now - BetTime;
        } else {
            return 0;
        }
    }

    /** 获取竞猜时间 */
    public getStakeTime(): number {
        if (!this._stakeTime) {
            const cfg_normal = this.getNormalByKey('HuarongdaoStakeTime');
            this._stakeTime = Number(cfg_normal.CfgValue);
        }

        return this._stakeTime;
    }

    /** 获取当前所处的时间阶段 */
    public getActivityTimeStep(): IHuarongdaoActivityTimeStep {
        const activityTimeStep: IHuarongdaoActivityTimeStep = {
            type: -1, time: 0,
        };

        if (this.huarongInfo) {
            const StartTime = this.huarongInfo.StartTime;
            const StakeTime = this.huarongInfo.BetTime;
            // const EndTime = this.huarongInfo.EndTime;
            const CloseTime = this.huarongInfo.CloseTime;
            let MacthEndTime = 0;
            this.huarongInfo.EntryInfoList.forEach((item) => {
                if (item.EndTimes > MacthEndTime) {
                    MacthEndTime = item.EndTimes;
                }
            });
            const now = UtilTime.NowSec() - this.getCountDownTime();

            if (now < StartTime) {
                activityTimeStep.type = HuarongdaoMatchState.wait;
                activityTimeStep.time = StartTime - now;
            } else if (now < StakeTime) {
                activityTimeStep.type = HuarongdaoMatchState.support;
                activityTimeStep.time = StakeTime - now;
            } else if (now < MacthEndTime) {
                activityTimeStep.type = HuarongdaoMatchState.match;
                activityTimeStep.time = MacthEndTime - now;
            } else if (now < CloseTime) {
                activityTimeStep.type = HuarongdaoMatchState.over;
                activityTimeStep.time = CloseTime - now;
            }
        }

        return activityTimeStep;
    }

    /** 获取当前所处的时间阶段剩余时间 */
    public getActivityLeastTime(step: number): number {
        let time = 0;
        if (this.huarongInfo) {
            const now = UtilTime.NowSec() - this.getCountDownTime();

            if (step === HuarongdaoMatchState.wait) {
                time = this.huarongInfo.StartTime - now;
            } else if (step === HuarongdaoMatchState.support) {
                time = this.huarongInfo.BetTime - now;
            } else if (step === HuarongdaoMatchState.match) {
                let MacthEndTime = 0;
                this.huarongInfo.EntryInfoList.forEach((item) => {
                    if (item.EndTimes > MacthEndTime) {
                        MacthEndTime = item.EndTimes;
                    }
                });
                time = MacthEndTime - now;
            } else if (step === HuarongdaoMatchState.over) {
                time = this.huarongInfo.CloseTime - now;
            }
        }

        return time;
    }

    /** 参赛信息 */
    public getEntryInfoById(id: number): HuarongEntryInfo {
        return this.entryInfoMap[id];
    }

    /** 获取随机气泡 */
    public getRandomBubbleId(id: number): number {
        if (!id) {
            return 0;
        }
        const Cfg_gen: Cfg_HuarongdaoGen = this.getGenValueByKey(id);
        const Cfg_bubble = Config.Get(Config.Type.Cfg_HuarongdaoBubble);
        const bubblekeys = Cfg_bubble.getKeys();
        const array: Array<number> = [];
        for (let i = 0; i < bubblekeys.length; i++) {
            const cfg: Cfg_HuarongdaoBubble = this.getBubbleByKey(bubblekeys[i]);
            const TimeType = Number(cfg.TimeType) === 2 ? HuarongdaoMatchState.match : HuarongdaoMatchState.support;
            if (Cfg_gen.OddsType === cfg.ObjectType && ModelMgr.I.HuarongdaoModel.getMatchState() === TimeType) {
                array.push(Number(bubblekeys[i]));
            }
        }

        const random = UtilArray.GetRandom(array) || 0;
        return random;
    }

    /** 设置当前活动阶段 */
    public setMatchState(state: number): void {
        this.matchState = state;
    }

    /** 获取当前活动阶段 */
    public getMatchState(): number {
        return this.matchState;
    }

    /** 获取倒计时时间 */
    public getCountDownTime(): number {
        return this.countDownTime;
    }

    /** 设置倒计时时间 */
    public setCountDownTime(time: number): void {
        this.countDownTime = time;
    }

    /** 获取获胜武将 */
    public getWinGeninfo(): HuarongEntryInfo {
        const winInfo: HuarongEntryInfo = new HuarongEntryInfo();
        for (const k in this.entryInfoMap) {
            if (this.entryInfoMap[k].IsWin) {
                winInfo.Id = this.entryInfoMap[k].Id;
                winInfo.CycNo = this.entryInfoMap[k].CycNo;
                winInfo.StartTimes = this.entryInfoMap[k].StartTimes;
                winInfo.EndTimes = this.entryInfoMap[k].EndTimes;
                winInfo.OddsRatio = this.entryInfoMap[k].OddsRatio;
                winInfo.SupportRatio = this.entryInfoMap[k].SupportRatio;
                break;
            }
        }

        return winInfo;
    }

    /** 获取活动场次 */
    public getActivityCycNo(): number {
        if (UtilTime.IsSameDay(new Date(UtilTime.NowMSec()), new Date(this.huarongInfo.StartTime * 1000))) {
            if (UtilTime.NowSec() < this.huarongInfo.StartTime) {
                return this.huarongInfo.DayCycNo ? this.huarongInfo.DayCycNo + 1 : 1;
            }
            return this.huarongInfo.DayCycNo || 1;
        }

        return 1;
    }

    /** 获取活动场次 */
    public getActivityStartTime(): number {
        if (this.huarongInfo) {
            return this.huarongInfo.StartTime;
        }

        return 0;
    }

    /** 获取要支持的武将的倍率支持率信 */
    public getSupportGenInfo(id: number): IHuarongdaoSupportGenInfo {
        const data: IHuarongdaoSupportGenInfo = {
            Id: id,
            OddsRatio: this.entryInfoMap[id].OddsRatio,
            SupportRatio: this.entryInfoMap[id].SupportRatio,
        };
        return data;
    }

    /** 活动记录 */
    public setActivityLog(winEntryList: Array<HuarongEntryInfo>, betList: Array<HuarongBetInfo>): void {
        const now = UtilTime.NowMSec();
        this.winEntryMapLog = {};
        this.betMapLog = {};
        winEntryList.forEach((element) => {
            if (UtilTime.IsSameDay(new Date(now), new Date(element.EndTimes * 1000))) {
                this.winEntryMapLog[element.CycNo] = element;
            }
        });

        betList.forEach((element) => {
            if (this.winEntryMapLog[element.CycNo]) {
                if (!this.betMapLog[element.CycNo]) {
                    this.betMapLog[element.CycNo] = [element];
                } else {
                    this.betMapLog[element.CycNo].push(element);
                }
            }
        });
    }

    /** 获取活动记录的玩家信息 */
    public getActivityWinEntryLog(cycNo: number): HuarongEntryInfo {
        return this.winEntryMapLog[cycNo] || null;
    }

    /** 获取活动记录的押注信息 */
    public getActivityBetLog(cycNo: number, id: number): HuarongBetInfo {
        if (this.betMapLog[cycNo]) {
            for (let i = 0; i < this.betMapLog[cycNo].length; i++) {
                if (this.betMapLog[cycNo][i].Id === id) {
                    return this.betMapLog[cycNo][i];
                }
            }

            return this.betMapLog[cycNo][0];
        } else {
            return null;
        }
    }

    /** 今日活动记录编号 */
    public getActivityLogCycNo(): Array<number> {
        const array: Array<number> = [];
        for (const k in this.winEntryMapLog) {
            if (this.huarongInfo && this.winEntryMapLog[k].CycNo === this.huarongInfo.CycNo
                && (this.matchState === HuarongdaoMatchState.match || this.matchState === HuarongdaoMatchState.countDown)) {
                continue;
            }
            array.push(this.winEntryMapLog[k].CycNo);
        }

        array.sort((a, b) => a - b);
        return array;
    }

    /** 支持率数据 */
    public setSupportRateMap(betList: Array<HuarongBetInfoByClient>): void {
        this.supportRateMap = {};
        betList.forEach((element) => {
            this.supportRateMap[element.Id] = element;
        });
    }
    /** 获取支持率 */
    public getSupportRateMap(id: number): number {
        const num = this.supportRateMap[id] ? this.supportRateMap[id].Count : 0;
        let total = 0;
        for (const k in this.supportRateMap) {
            total += this.supportRateMap[k].Count;
        }
        return total > 0 ? Math.floor(num / total * 1000) / 10 : 0;
    }

    /** 计时器索引 */
    private _timeOutIndex = 0;
    /** 红点检查 */
    public redCheck(): void {
        if (this._timeOutIndex) {
            clearTimeout(this._timeOutIndex);
            this._timeOutIndex = 0;
        }
        const activityId = 2001;
        const isInTime = ActivityMgr.I.isInActTime(activityId);
        if (isInTime) { // 是否在活动时间内查找活动结束时间
            RedDotMgr.I.updateRedDot(RID.DailyTask.Huarongdao.Time, true);
            const num = ActivityMgr.I.getActEndLeftTime(activityId);
            if (num) {
                this._timeOutIndex = setTimeout(() => {
                    this._timeOutIndex = 0;
                    RedDotMgr.I.updateRedDot(RID.DailyTask.Huarongdao.Time, false);
                    this.redCheck();
                }, num * 1000);
            }
        } else { // 不在活动时间查找下次开始时间
            RedDotMgr.I.updateRedDot(RID.DailyTask.Huarongdao.Time, false);
            const num = ActivityMgr.I.getActStartLeftTime(activityId);
            if (num) {
                this._timeOutIndex = setTimeout(() => {
                    this._timeOutIndex = 0;
                    RedDotMgr.I.updateRedDot(RID.DailyTask.Huarongdao.Time, true);
                    this.redCheck();
                }, num * 1000);
            }
        }
    }
}

/*
 * @Author: zs
 * @Date: 2023-01-06 17:17:59
 * @Description:
 *
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilBool } from '../../../../app/base/utils/UtilBool';
import BaseModel from '../../../../app/core/mvc/model/BaseModel';
import { i18n, Lang } from '../../../../i18n/i18n';
import { Config } from '../../../base/config/Config';
import { ConfigIndexer } from '../../../base/config/indexer/ConfigIndexer';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import { RedDotCheckMgr } from '../../reddot/RedDotCheckMgr';
import { IListenInfo, REDDOT_ADD_LISTEN_INFO, RID } from '../../reddot/RedDotConst';
import { RedDotMgr } from '../../reddot/RedDotMgr';
import { RoleInfo } from '../../role/RoleInfo';
import { RoleMgr } from '../../role/RoleMgr';
import { ECfgRankMatchNormallKey, ERankMatchAwardTabId } from './RankMatchConst';

const { ccclass, property } = cc._decorator;

type IRankMatchData = S2COpenRankMatchUI
@ccclass('RankMatchModel')
export default class RankMatchModel extends BaseModel {
    private _lastScore: number = 0;
    public get lastScore(): number {
        return this._lastScore;
    }
    public clearAll(): void {
        // throw new Error("Method not implemented.");
    }
    /** 排位赛段位表 */
    public get cfgPos(): ConfigIndexer {
        return Config.Get(Config.Type.Cfg_RankMatchPos);
    }
    /** 排位赛排行奖励 */
    public get cfgReward(): ConfigIndexer {
        return Config.Get(Config.Type.Cfg_RankMatchReward);
    }
    /** 排位赛胜场奖励 */
    public get cfgWinReward(): ConfigIndexer {
        return Config.Get(Config.Type.Cfg_RankMatchWinReward);
    }
    /** 排位赛次数收费 */
    public get cfgCoin(): ConfigIndexer {
        return Config.Get(Config.Type.Cfg_RankMatchCoin);
    }
    /** 排位赛常量表 */
    public get cfgNormal(): ConfigIndexer {
        return Config.Get(Config.Type.Cfg_RankMatchNormal);
    }
    private getValueByCfgKey(cfgKey: string): string {
        const cfg: Cfg_RankMatchNormal = this.cfgNormal.getValueByKey(cfgKey);
        return cfg.CfgValue;
    }

    /** 匹配次数上限 */
    public get RankMatchNumLimit(): number {
        return +this.getValueByCfgKey(ECfgRankMatchNormallKey.RankMatchNumLimit);
    }
    /** 初始积分 */
    public get RankMatchGoals(): number {
        return +this.getValueByCfgKey(ECfgRankMatchNormallKey.RankMatchGoals);
    }
    /** 首胜奖励 */
    public get RankMatchFirstReward(): string {
        return this.getValueByCfgKey(ECfgRankMatchNormallKey.RankMatchFirstReward);
    }

    private _curCfgPos: Cfg_RankMatchPos;
    public get curCfgPos(): Cfg_RankMatchPos {
        if (!this._curCfgPos) {
            this._curCfgPos = this.getCfgPos(this.score);
        }
        return this._curCfgPos;
    }

    /** 剩余次数 */
    public get num(): number {
        return this.data.ChallengeNum ?? this.RankMatchNumLimit;
    }
    /** 我的积分 */
    public get score(): number {
        return this.data.MyScore || this.RankMatchGoals;
    }
    /** 排名 */
    public get rank(): number {
        return this.data?.MyRank || 0;
    }

    /** 获取显示的排名 */
    public getShowRank(): string {
        const rank = this.rank;
        if (rank === 0) {
            return i18n.tt(Lang.com_notinrank);
        }
        const index = this.cfgReward.length - 1;
        const cfg: Cfg_RankMatchReward = this.cfgReward.getValueByIndex(index);
        if (rank > cfg.RankMax) {
            return i18n.tt(Lang.com_notinrank);
        }
        return `${rank}`;
    }
    /**
     * 根据id获取阶级
     * @param id id（可选）
     * @returns
     */
    public getStar(id?: number): number {
        id = id || this.getCfgPos().Id;
        return (id % 5) || 5;
    }

    /**
     * 获取分数对应的段位配置
     * @param score 分数
     * @returns
     */
    public getCfgPos(score?: number): Cfg_RankMatchPos {
        if (UtilBool.isNullOrUndefined(score)) {
            return this.curCfgPos;
        }
        return this.cfgPos.getIntervalData(score) || this.cfgPos.getValueByIndex(this.cfgPos.length - 1);
    }

    /** 获取下一阶段的段位配置 */
    public getCfgPosNext(score?: number): Cfg_RankMatchPos {
        score = score || this.score;
        const index = this.cfgPos.getIntervalIndex(score);
        return this.cfgPos.getValueByIndex(index + 1);
    }

    /** 获取上一阶段的段位配置 */
    public getCfgPosLast(score?: number): Cfg_RankMatchPos {
        score = score || this.score;
        const index = this.cfgPos.getIntervalIndex(score);
        return this.cfgPos.getValueByIndex(index - 1);
    }

    private data: S2COpenRankMatchUI = cc.js.createMap(true);
    public setData(d: S2COpenRankMatchUI): void {
        this._curCfgPos = null;
        this.data = d;
        this.updateTopPlayers(d.TopPlayers);
        EventClient.I.emit(E.RankMatch.UpdateData);
    }

    public getData(): S2COpenRankMatchUI {
        return this.data;
    }

    // IsChangeSession

    public updateData(d: S2CRankMatchChallenge): void {
        this.updateTopPlayers(d.TopPlayers);
        this.updateSessionWinNum(d.SessionWinNum);
        this.updateScore(d.MyScore, d.MyRank);
        this.updateChallengeNum(d.ChallengeNum);
        this.updateNextRefreshTime(d.NextRefreshTime);
    }

    private topPlayers: { [rank: number]: RoleInfo } = cc.js.createMap(true);
    /**
     * 更新前三名玩家信息
     * @param players 玩家信息数组
     */
    public updateTopPlayers(players: BaseUserInfo[]): void {
        this.topPlayers = cc.js.createMap(true);
        players.forEach((p) => {
            const roleInfo = new RoleInfo(p);
            this.topPlayers[roleInfo.d.RankMatchRank] = roleInfo;
        });
    }

    public getTopPlayer(rank: number): RoleInfo {
        return this.topPlayers[rank];
    }

    /** 更新赛季总胜场 */
    public updateSessionWinNum(num: number): void {
        this.data.SessionWinNum = num;
    }

    /**
     * 更新每日首胜奖励状态
     * @param isGetDayWin 是否领取每日首胜奖励
     */
    public updateIsGetDayWin(isGetDayWin: number): void {
        this.data.IsGetDayWin = isGetDayWin;
        EventClient.I.emit(E.RankMatch.UpdateDayWinReward, !!isGetDayWin);
    }

    /** 更新已领取总胜场奖励状态 */
    public updateSessionGetRwList(rewards: number[]): void {
        let changeIds: number[] = [];
        if (this.data?.SessionGetRwList) {
            const isNeedCheck = this.data.SessionGetRwList.length > 0;
            rewards.forEach((id) => {
                if (!isNeedCheck || this.data.SessionGetRwList.indexOf(id) === -1) {
                    if (this.data.SessionGetRwList) {
                        this.data.SessionGetRwList.push(id);
                    }
                    changeIds.push(id);
                }
            });
        } else {
            this.data.SessionGetRwList = rewards;
            changeIds = rewards;
        }
        if (changeIds.length > 0) {
            EventClient.I.emit(E.RankMatch.UpdateSessionGetRwList, changeIds);
        }
    }

    /**
     * 获取胜场的某个奖励是否已领取
     * @param rewardId 奖励id
     * @returns
     */
    public isYlqReward(rewardId: number, tabId: ERankMatchAwardTabId = ERankMatchAwardTabId.Win): boolean {
        if (tabId === ERankMatchAwardTabId.Win) {
            return this.data?.SessionGetRwList?.indexOf(rewardId) >= 0;
        } else {
            return this.data?.LevelGetRwList?.indexOf(rewardId) >= 0;
        }
    }

    /** 更新已领取段位奖励状态 */
    public updateLevelGetRwList(rewards: number[]): void {
        let changeIds: number[] = [];
        if (this.data?.LevelGetRwList) {
            const isNeedCheck = this.data.LevelGetRwList.length > 0;
            rewards.forEach((id) => {
                if (!isNeedCheck || this.data.LevelGetRwList.indexOf(id) === -1) {
                    if (this.data.LevelGetRwList) {
                        this.data.LevelGetRwList.push(id);
                    }
                    changeIds.push(id);
                }
            });
        } else {
            this.data.LevelGetRwList = rewards;
            changeIds = rewards;
        }
        if (changeIds.length > 0) {
            EventClient.I.emit(E.RankMatch.UpdateLevelGetRwList, changeIds);
        }
    }

    /**
     * 更新我的积分和名次
     * @param score 积分
     * @param rank 名次
     */
    public updateScore(score: number, rank: number): void {
        this._lastScore = this.data.MyScore || this.score;
        this.data.MyScore = score;
        this.data.MyRank = rank;
        this._curCfgPos = null;
        EventClient.I.emit(E.RankMatch.UpdateScore);
    }

    /**
     * 更新挑战次数
     * @param challengeNum 当前剩余挑战次数
     * @param dayBuyNum 每日购买次数
     */
    public updateChallengeNum(challengeNum: number, dayBuyNum?: number, isAutoMatch?: boolean): void {
        this.data.ChallengeNum = challengeNum;
        if (!UtilBool.isNullOrUndefined(dayBuyNum)) {
            this.data.DayBuyNum = dayBuyNum;
        }
        EventClient.I.emit(E.RankMatch.UpdateChallengeNum, isAutoMatch);
    }
    /**
     * 更新恢复次数时间
     * @param challengeNum 当前剩余挑战次数
     * @param dayBuyNum 每日购买次数
     */
    public updateNextRefreshTime(time: number): void {
        this.data.NextRefreshTime = time;
        EventClient.I.emit(E.RankMatch.UpdateNextRefreshTime, time);
    }

    /** 下一次请求开始的排名 */
    private nextReqStartRank: number = 1;
    /** 一次请求的数量 */
    private onceReqNum: number = 9;
    private rankPlayers: { [rank: number]: RoleInfo } = cc.js.createMap(true);
    /** 是否没有排行榜数据了 */
    private isNoneRankData: boolean = false;
    /** 是否在请求协议中 */
    private isReqing: boolean = false;
    /** 更新排行榜数据 */
    public updateRankData(datas: BaseUserInfo[]): void {
        this.isReqing = false;
        // const index = datas.length;
        datas.forEach((v) => {
            const role = new RoleInfo(v);
            this.rankPlayers[role.d.RankMatchRank] = role;
        });
        this.nextReqStartRank = this.nextReqStartRank + this.onceReqNum + 1;
        // if (index === 0 || index < 10) {
        //     this.isNoneRankData = true;
        // } else {
        //     this.isNoneRankData = false;
        // }
        EventClient.I.emit(E.RankMatch.UpdateRankData);
    }

    /** 获取排行榜玩家数据 */
    public getRankData(rank: number): RoleInfo {
        if (this.rankPlayers[rank]) {
            return this.rankPlayers[rank];
        }
        if (rank % 10 === 1 && rank >= this.nextReqStartRank) {
            this.reqRankData();
        }
        return undefined;
    }

    /** 请求排行榜数据 */
    public reqRankData(): void {
        if (this.isNoneRankData === false && this.isReqing === false) {
            this.isReqing = true;
            // 1-10,11-20,21-30
            ControllerMgr.I.RankMatchController.C2SGetRankMatchRank(this.nextReqStartRank, this.nextReqStartRank + this.onceReqNum);
        }
    }

    /** 获取排行榜上榜的人数 */
    public getRankDataLength(): number {
        return this.nextReqStartRank - 1;
    }

    /** 清除排行榜数据 */
    public clearRankData(): void {
        this.isReqing = false;
        this.isNoneRankData = false;
        this.nextReqStartRank = 1;
        this.rankPlayers = cc.js.createMap(true);
    }

    /** 获取购买次数消耗配置 */
    public getBuyTimesConfig(times: number): { type: number, num: number } {
        const coin: string = this.cfgCoin.getValueByKey(times, 'Coin') || this.cfgCoin.getValueByIndex(this.cfgCoin.length - 1, 'Coin');
        if (coin) {
            const costs = coin.split('|');
            const cost = costs[Math.min(times, costs.length - 1)];
            const c = cost.split(':');
            return { type: Number(c[0]), num: Number(c[1]) };
        } else {
            return { type: 1, num: 0 };
        }
    }
    /** 获取vip表中可购买次数（排位赛） */
    public configBuyTimes(): number {
        // vip等级从1开始
        const vip = RoleMgr.I.d.VipLevel < 1 ? 1 : RoleMgr.I.d.VipLevel;
        const times: string = Config.Get(Config.Type.Cfg_VIP).getValueByKey(vip, 'RankMatchDun');
        const jccTime = times.split(':')[1];
        const num = Number(jccTime);
        return num;
    }

    // public init(): void {
    //     //
    //     RedDotCheckMgr.I.on(RID.Arena.RankMatch.Reward.Win.Base, this.checkRewardWin, this);
    //     RedDotCheckMgr.I.on(RID.Arena.RankMatch.Reward.Segme, this.checkRewardSegme, this);
    //     RedDotCheckMgr.I.on(RID.Arena.RankMatch.Reward.Win.DayFirst, this.checkRewardWinDay, this);
    // }

    /**
     * 添加红点事件发送的监听
     */
    public onRedDotEventListen(): void {
        RedDotCheckMgr.I.on(RID.Arena.RankMatch.Reward.Win.Base, this.checkRewardWin, this);
        RedDotCheckMgr.I.on(RID.Arena.RankMatch.Reward.Segme, this.checkRewardSegme, this);
        RedDotCheckMgr.I.on(RID.Arena.RankMatch.Reward.Win.DayFirst, this.checkRewardWinDay, this);
    }

    /** 移除红点事件发送的监听 */
    public offRedDotEventListen(): void {
        RedDotCheckMgr.I.off(RID.Arena.RankMatch.Reward.Win.Base, this.checkRewardWin, this);
        RedDotCheckMgr.I.off(RID.Arena.RankMatch.Reward.Segme, this.checkRewardSegme, this);
        RedDotCheckMgr.I.off(RID.Arena.RankMatch.Reward.Win.DayFirst, this.checkRewardWinDay, this);
    }

    public registerRedDotListen(): void {
        const rid1 = RID.Arena.RankMatch.Reward.Win.Base;
        const listenInfo1: IListenInfo = {
            // 协议1 :整个排位赛数据    2：胜场奖励
            ProtoId: [ProtoId.S2COpenRankMatchUI_ID, ProtoId.S2CRankMatchGetSessionWinReward_ID],
        };
        const rid2 = RID.Arena.RankMatch.Reward.Segme;
        const listenInfo2: IListenInfo = {
            // 协议1 :整个排位赛数据    2：段位奖励
            ProtoId: [ProtoId.S2COpenRankMatchUI_ID, ProtoId.S2CRankMatchGetLevelReward_ID],
        };
        const rid3 = RID.Arena.RankMatch.Reward.Win.DayFirst;
        const listenInfo3: IListenInfo = {
            // 协议1 :整个排位赛数据    2：每日首胜奖励
            ProtoId: [ProtoId.S2COpenRankMatchUI_ID, ProtoId.S2CRankMatchGetDayWinReward_ID],
        };
        RedDotMgr.I.emit(
            REDDOT_ADD_LISTEN_INFO,
            { rid: rid1, info: listenInfo1 },
            { rid: rid2, info: listenInfo2 },
            { rid: rid3, info: listenInfo3 },
        );
    }

    /** 检查首胜奖励红点 */
    public checkRewardWinDay(): boolean {
        const isShowRed = this.data.DayWinNum > 0 && !this.data?.IsGetDayWin;
        RedDotMgr.I.updateRedDot(RID.Arena.RankMatch.Reward.Win.DayFirst, isShowRed);
        return isShowRed;
    }

    /** 检查胜场奖励是否需要显示红点 */
    public checkRewardWin(): boolean {
        let isShowRed: boolean = false;
        // 每一项的奖励
        this.cfgWinReward.forEach((cfg: Cfg_RankMatchWinReward) => {
            if (!this.isYlqReward(cfg.Id, ERankMatchAwardTabId.Win) && this.data.SessionWinNum >= cfg.WinNum) {
                isShowRed = true;
                return false;
            }
            return true;
        });
        RedDotMgr.I.updateRedDot(RID.Arena.RankMatch.Reward.Win.Base, isShowRed);
        return isShowRed;
    }

    /** 检查段位奖励是否需要显示红点 */
    public checkRewardSegme(): boolean {
        let isShowRed: boolean = false;
        this.cfgPos.forEach((cfg: Cfg_RankMatchPos) => {
            if (!this.isYlqReward(cfg.Id, ERankMatchAwardTabId.Segme) && this.score >= cfg.GoalMin) {
                isShowRed = true;
                return false;
            }
            return true;
        });
        RedDotMgr.I.updateRedDot(RID.Arena.RankMatch.Reward.Segme, isShowRed);
        return isShowRed;
    }
}

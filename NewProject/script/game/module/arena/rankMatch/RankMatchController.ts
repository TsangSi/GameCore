/*
 * @Author: zs
 * @Date: 2023-01-06 17:17:59
 * @Description:
 *
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { EventProto } from '../../../../app/base/event/EventProto';
import { UtilBool } from '../../../../app/base/utils/UtilBool';
import BaseController from '../../../../app/core/mvc/controller/BaseController';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import { BattleMgr } from '../../../battle/BattleMgr';
import { E } from '../../../const/EventName';
import { FuncId } from '../../../const/FuncConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import NetMgr from '../../../manager/NetMgr';
import { EArenaTabId } from '../ArenaConst';

const { ccclass, property } = cc._decorator;

@ccclass('RankMatchController')
export default class RankMatchController extends BaseController {
    public addNetEvent(): void {
        // throw new Error('Method not implemented.');
        EventProto.I.on(ProtoId.S2COpenRankMatchUI_ID, this.onS2COpenRankMatchUI, this);
        EventProto.I.on(ProtoId.S2CRankMatchStartMatch_ID, this.onS2CRankMatchStartMatch, this);
        EventProto.I.on(ProtoId.S2CRankMatchChallenge_ID, this.onS2CRankMatchChallenge, this);
        EventProto.I.on(ProtoId.S2CRankMatchBuyChallengeNum_ID, this.onS2CRankMatchBuyChallengeNum, this);
        EventProto.I.on(ProtoId.S2CRankMatchOpenFightLogUI_ID, this.onS2CRankMatchOpenFightLogUI, this);
        EventProto.I.on(ProtoId.S2CRankMatchPlayFightLog_ID, this.onS2CRankMatchPlayFightLog, this);
        EventProto.I.on(ProtoId.S2CRankMatchGetDayWinReward_ID, this.onS2CRankMatchGetDayWinReward, this);
        EventProto.I.on(ProtoId.S2CRankMatchGetSessionWinReward_ID, this.onS2CRankMatchGetSessionWinReward, this);
        EventProto.I.on(ProtoId.S2CRankMatchGetLevelReward_ID, this.onS2CRankMatchGetLevelReward, this);
        EventProto.I.on(ProtoId.S2CGetRankMatchRank_ID, this.onS2CGetRankMatchRank, this);
    }
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2COpenRankMatchUI_ID, this.onS2COpenRankMatchUI, this);
        EventProto.I.off(ProtoId.S2CRankMatchStartMatch_ID, this.onS2CRankMatchStartMatch, this);
        EventProto.I.off(ProtoId.S2CRankMatchChallenge_ID, this.onS2CRankMatchChallenge, this);
        EventProto.I.off(ProtoId.S2CRankMatchBuyChallengeNum_ID, this.onS2CRankMatchBuyChallengeNum, this);
        EventProto.I.off(ProtoId.S2CRankMatchOpenFightLogUI_ID, this.onS2CRankMatchOpenFightLogUI, this);
        EventProto.I.off(ProtoId.S2CRankMatchPlayFightLog_ID, this.onS2CRankMatchPlayFightLog, this);
        EventProto.I.off(ProtoId.S2CRankMatchGetDayWinReward_ID, this.onS2CRankMatchGetDayWinReward, this);
        EventProto.I.off(ProtoId.S2CRankMatchGetSessionWinReward_ID, this.onS2CRankMatchGetSessionWinReward, this);
        EventProto.I.off(ProtoId.S2CRankMatchGetLevelReward_ID, this.onS2CRankMatchGetLevelReward, this);
        EventProto.I.off(ProtoId.S2CGetRankMatchRank_ID, this.onS2CGetRankMatchRank, this);
    }
    public addClientEvent(): void {
        // throw new Error('Method not implemented.');
    }
    public delClientEvent(): void {
        // throw new Error('Method not implemented.');
    }
    public clearAll(): void {
        // throw new Error('Method not implemented.');
    }

    /** ????????????????????? */
    public C2SOpenRankMatchUI(): void {
        NetMgr.I.sendMessage(ProtoId.C2SOpenRankMatchUI_ID);
    }

    private onS2COpenRankMatchUI(d: S2COpenRankMatchUI) {
        if (d.Tag === 0) {
            ModelMgr.I.RankMatchModel.setData(d);
        }
    }

    /** ????????????????????? */
    public C2SRankMatchStartMatch(): void {
        NetMgr.I.sendMessage(ProtoId.C2SRankMatchStartMatch_ID);
    }

    private onS2CRankMatchStartMatch(d: S2CRankMatchStartMatch) {
        if (d.Tag === 0) {
            EventClient.I.emit(E.RankMatch.MatchSucess, d.Players);
        }
    }
    /**
     * ?????????????????????
     * @param userId ??????id
     */
    public C2SRankMatchChallenge(userId: number): void {
        const d = new C2SRankMatchChallenge();
        d.UserId = userId;
        NetMgr.I.sendMessage(ProtoId.C2SRankMatchChallenge_ID, d);
    }

    private onS2CRankMatchChallenge(d: S2CRankMatchChallenge) {
        if (d.Tag === 0) {
            ModelMgr.I.RankMatchModel.updateData(d);
        }
    }

    /**
     * ???????????????????????????
     * @param isAutoMatch ??????????????????
     */
    public C2SRankMatchBuyChallengeNum(isAutoMatch: boolean = false): void {
        const d = new C2SRankMatchBuyChallengeNum();
        d.IsAutoMatch = Number(isAutoMatch);
        NetMgr.I.sendMessage(ProtoId.C2SRankMatchBuyChallengeNum_ID, d);
    }

    private onS2CRankMatchBuyChallengeNum(d: S2CRankMatchBuyChallengeNum) {
        if (d.Tag === 0) {
            if (d.IsAutoMatch) {
                this.C2SRankMatchStartMatch();
            }
            ModelMgr.I.RankMatchModel.updateNextRefreshTime(d.NextRefreshTime);
            ModelMgr.I.RankMatchModel.updateChallengeNum(d.ChallengeNum, d.DayBuyNum, d.IsAutoMatch === 1);
        }
    }

    /** ?????????????????? */
    public C2SRankMatchOpenFightLogUI(): void {
        NetMgr.I.sendMessage(ProtoId.C2SRankMatchOpenFightLogUI_ID);
    }

    private onS2CRankMatchOpenFightLogUI(d: S2CRankMatchOpenFightLogUI) {
        if (d.Tag === 0) {
            EventClient.I.emit(E.RankMatch.FightLog, d.FightLog);
        }
    }

    /**
     * ?????????????????????
     * @param time ?????????
     */
    public C2SRankMatchPlayFightLog(time: number): void {
        const d = new C2SRankMatchPlayFightLog();
        d.Time = time;
        NetMgr.I.sendMessage(ProtoId.C2SRankMatchPlayFightLog_ID, d);
    }

    private onS2CRankMatchPlayFightLog(d: S2CRankMatchPlayFightLog) {
        if (d.Tag === 0) {
            EventClient.I.emit(E.Battle.PlayReport, d.Report);
        }
    }

    /** ????????????????????????????????? */
    public C2SRankMatchGetDayWinReward(): void {
        NetMgr.I.sendMessage(ProtoId.C2SRankMatchGetDayWinReward_ID);
    }

    private onS2CRankMatchGetDayWinReward(d: S2CRankMatchGetDayWinReward) {
        if (d.Tag === 0) {
            ModelMgr.I.RankMatchModel.updateIsGetDayWin(d.IsGetDayWin);
        }
    }

    /**
     * ?????????????????????????????????
     * @param rewardId ????????????Id
     */
    public C2SRankMatchGetSessionWinReward(rewardId: number): void {
        const d = new C2SRankMatchGetSessionWinReward();
        d.RewardId = rewardId;
        NetMgr.I.sendMessage(ProtoId.C2SRankMatchGetSessionWinReward_ID, d);
    }

    private onS2CRankMatchGetSessionWinReward(d: S2CRankMatchGetSessionWinReward) {
        if (d.Tag === 0) {
            ModelMgr.I.RankMatchModel.updateSessionGetRwList(d.SessionGetRwList);
        }
    }

    /**
     * ???????????????????????????
     * @param levelId ??????Id
     */
    public C2SRankMatchGetLevelReward(levelId: number): void {
        const d = new C2SRankMatchGetLevelReward();
        d.LevelId = levelId;
        NetMgr.I.sendMessage(ProtoId.C2SRankMatchGetLevelReward_ID, d);
    }

    private onS2CRankMatchGetLevelReward(d: S2CRankMatchGetLevelReward) {
        if (d.Tag === 0) {
            ModelMgr.I.RankMatchModel.updateLevelGetRwList(d.LevelGetRwList);
        }
    }

    /**
     * ??????????????????????????????
     * @param star ????????????
     * @param end ????????????
     */
    public C2SGetRankMatchRank(star: number, end: number): void {
        const d = new C2SGetRankMatchRank();
        d.Start = star;
        d.End = end;
        NetMgr.I.sendMessage(ProtoId.C2SGetRankMatchRank_ID, d);
    }

    private onS2CGetRankMatchRank(d: S2CGetRankMatchRank) {
        if (d.Tag === 0) {
            ModelMgr.I.RankMatchModel.updateScore(d.MyScore, d.MyRank);
            ModelMgr.I.RankMatchModel.updateRankData(d.RankList);
        }
    }

    /**
     * ????????????
     * @param tab ??????id
     * @param params ????????????????????????
     * @param id ?????????????????????????????????
     * @returns
     */
    public linkOpen(tab?: number, params?: any[], id?: number): boolean {
        if (UtilFunOpen.isOpen(FuncId.RankMatch, true)) {
            ControllerMgr.I.ArenaController.linkOpen(tab ?? EArenaTabId.RankMatch);
        }
        return true;
    }
}

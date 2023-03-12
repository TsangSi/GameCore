import { EventClient } from '../../../app/base/event/EventClient';
import { StorageMgr } from '../../../app/base/manager/StorageMgr';
import { UtilBool } from '../../../app/base/utils/UtilBool';
import { UtilColor } from '../../../app/base/utils/UtilColor';
import { UtilString } from '../../../app/base/utils/UtilString';
import { UtilTime } from '../../../app/base/utils/UtilTime';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../i18n/i18n';
import { Config } from '../../base/config/Config';
import { ConfigLimitConditionIndexer } from '../../base/config/indexer/ConfigLimitConditionIndexer';
import { ConfigTeamBossIndexer } from '../../base/config/indexer/ConfigTeamBossIndexer';
import GameApp from '../../base/GameApp';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { NickShowType } from '../../base/utils/UtilGame';
import { BattleCommon } from '../../battle/BattleCommon';
import { E } from '../../const/EventName';
import { FuncId } from '../../const/FuncConst';
import { ViewConst } from '../../const/ViewConst';
import ControllerMgr from '../../manager/ControllerMgr';
import ModelMgr from '../../manager/ModelMgr';
import TimerMgr from '../../manager/TimerMgr';
import MapCfg, { EMapFbInstanceType } from '../../map/MapCfg';
import { EBattleType } from '../battleResult/BattleResultConst';
import { CHAT_CHANNEL_ENUM } from '../chat/ChatConst';
import { InvitationBox } from '../material/v/team/InvitationBox';
import { RedDotCheckMgr } from '../reddot/RedDotCheckMgr';
import { IListenInfo, REDDOT_ADD_LISTEN_INFO, RID } from '../reddot/RedDotConst';
import { RedDotMgr } from '../reddot/RedDotMgr';
import { RoleInfo } from '../role/RoleInfo';
import { RoleMgr } from '../role/RoleMgr';

/** 离队类型 */
enum ELevelTeamType {
    /** 默认主动离队 */
    Normall = 0,
    /** 解散 */
    Diss = 1,
    /** 被踢 */
    Kick = 2,
}
/*
 * @Author: zs
 * @Date: 2022-11-09 16:34:59
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\team\TeamModel.ts
 * @Description:
 *
 */
const { ccclass, property } = cc._decorator;

@ccclass('TeamModel')
export class TeamModel extends BaseModel {
    private _cfg: ConfigTeamBossIndexer;
    public get cfg(): ConfigTeamBossIndexer {
        if (!this._cfg) {
            this._cfg = Config.Get(Config.Type.Cfg_TeamBoss);
        }
        return this._cfg;
    }
    public clearAll(): void {
        this.clearTeamInfo();
    }
    /** 根据副本id存储的是否已通关数据 */
    private passById: { [id: number]: boolean } = cc.js.createMap(true);
    /** 根据副本类型存储的副本信息（挑战，购买次数） */
    private fbInfoByType: { [type: number]: DunType } = cc.js.createMap(true);

    /** 邀请玩家的时间戳 */
    private allPlayerInviteTime: { [userId: number]: number } = cc.js.createMap(true);
    /** 加入队伍的时间戳 */
    private joinTeamTime: { [teamId: number]: number } = cc.js.createMap(true);
    /** 我的队伍信息 */
    private myTeam: S2CMyTeamInfo;
    /** 邀请框的时间戳 */
    private invitationBoxs: { [teamId: number]: number } = cc.js.createMap(true);
    // /** 根据位置存储的组队副本阵容 */
    private lineups: { [onlyId: string]: LineupUnit } = cc.js.createMap(true);
    /** 最大成员数 */
    public readonly maxMemberNum: number = 3;
    /** 当前波数 */
    private _currWarBatchNum: number = 0;
    /** 当前回合数 */
    private _currWarTurnNum: number = 1;

    private _autoAcceptInvite: boolean = false;
    /** 自动接受邀请 */
    public get autoAcceptInvite(): boolean {
        return this._autoAcceptInvite;
    }
    public set autoAcceptInvite(b: boolean) {
        this._autoAcceptInvite = b;
    }

    public get currWarBatchNum(): number {
        return this._currWarBatchNum;
    }

    public set currWarBatchNum(v: number) {
        if (this._currWarBatchNum === v) {
            return;
        }
        this._currWarBatchNum = v;
        this.currWarTurnNum = 1;
        this.updaWarDesc();
    }

    public get currWarTurnNum(): number {
        return this._currWarTurnNum;
    }

    public set currWarTurnNum(v: number) {
        if (this._currWarTurnNum === v) {
            return;
        }
        this._currWarTurnNum = v;
        this.updaWarDesc();
    }

    public registerRedDotListen(): void {
        const rid = RID.MaterialFB.Team.Id;
        const info: IListenInfo = {
            ProtoId: [ProtoId.S2CTeamDunBuyPassTime_ID, ProtoId.S2CTeamDunInfo_ID],
        };
        RedDotMgr.I.emit(REDDOT_ADD_LISTEN_INFO, { rid, info });
        const rid2 = RID.MaterialFB.Team.TeamPlan;
        const info2: IListenInfo = {
            ProtoId: [ProtoId.S2CTeamDunLineupInfo_ID, ProtoId.S2CTeamDunChangeLineup_ID, ProtoId.S2CChangeLineup_ID, ProtoId.S2CLineupInfo_ID],
            // CheckVid: [ViewConst.MaterialWin],
        };
        RedDotMgr.I.emit(REDDOT_ADD_LISTEN_INFO, { rid: rid2, info: info2 });
    }

    public onRedDotEventListen(): void {
        RedDotCheckMgr.I.on(RID.MaterialFB.Team.Id, this.onCheckTeamRed, this);
        RedDotCheckMgr.I.on(RID.MaterialFB.Team.TeamPlan, this.onCheckTeamPlanRed, this);
    }

    public offRedDotEventListen(): void {
        RedDotCheckMgr.I.off(RID.MaterialFB.Team.Id, this.onCheckTeamRed, this);
        RedDotCheckMgr.I.off(RID.MaterialFB.Team.TeamPlan, this.onCheckTeamPlanRed, this);
    }

    private onCheckTeamRed(): boolean {
        let isShow: boolean = false;
        let finallIsShow: boolean = false;
        this.cfg.forEach((cfg: Cfg_TeamBoss, index: number) => {
            isShow = this.getPassTime(cfg.Id) > 0;
            finallIsShow = finallIsShow || isShow;
            RedDotMgr.I.updateRedDot(RID.MaterialFB.Team.Type + index, isShow);
            return true;
        });
        return finallIsShow;
    }

    private onCheckTeamPlanRed(): boolean {
        const teamLineups = this.getLineups();
        let isShow = false;
        if (teamLineups.length < this.maxMemberNum) {
            const battleLineup = ModelMgr.I.BattleUnitModel.getAllBattleLineup();
            const allLineups: LineupUnit[] = [];
            teamLineups.forEach((l) => {
                allLineups.push(l);
            });
            for (const type in battleLineup) {
                let b: LineupUnit;
                for (let i = 0, n = battleLineup[type].length; i < n; i++) {
                    b = battleLineup[type][i];
                    if (!ModelMgr.I.TeamModel.isLineup(b.OnlyId)) {
                        allLineups.push({ Type: b.Type, Pos: b.Pos, OnlyId: b.OnlyId });
                    }
                }
            }
            isShow = allLineups.length > teamLineups.length;
        }
        RedDotMgr.I.updateRedDot(RID.MaterialFB.Team.TeamPlan, isShow);
        return isShow;
    }

    /** 协助次数 */
    public getHelpPassTime(fbType: number): number {
        return this.fbInfoByType[fbType]?.HelpPassTime || 0;
    }
    /** 是否在自动匹配 */
    private _autoMatch: boolean = false;
    /** 自动开始的结束时间戳 */
    private _autoStartEndTime: number = 0;

    /**
     * 根据副本类型获取剩余挑战次数
     * @param fbType 副本类型
     * @returns
     */
    public getPassTime(fbType: number): number {
        return this.fbInfoByType[fbType]?.PassTime || 0;
    }

    /**
     * 根据副本类型获取已购买次数
     * @param fbType 副本类型
     * @returns
     */
    public getBuyTime(fbType: number): number {
        return this.fbInfoByType[fbType]?.BuyTime || 0;
    }

    /** 队伍id */
    private _myTeamId: number = 0;
    public get myTeamId(): number {
        return this._myTeamId || 0;
    }

    public get myTeamFbType(): number {
        const cfgTBL: Cfg_TeamBoss_Level = this.cfg.getValueByKeyFromLevel(this.myTeamFbId);
        return cfgTBL.FBId;
    }

    /** 队伍的副本id */
    public get myTeamFbId(): number {
        return this.myTeam?.DunId || 0;
    }

    /** 队伍战力 */
    public get myTeamFV(): number {
        return this.myTeam?.PowerLimit || 0;
    }

    /** 更新队伍限制战力 */
    public updatePowerLimit(fightValue: number): void {
        if (this.myTeam) {
            this.myTeam.PowerLimit = fightValue;
        } else {
            const myteam: S2CMyTeamInfo = this.myTeam = cc.js.createMap(true);
            myteam.PowerLimit = fightValue;
        }
        EventClient.I.emit(E.Team.UpdatePowerLimit, fightValue);
    }

    /** 是否有队伍 */
    public hasTeam(): boolean {
        return this.myTeamId !== 0;
    }

    /** 是否是队长 */
    public isCap(): boolean {
        return this.hasTeam() && this.myTeam && this.myTeam.TeamMemberList[0].UserId === RoleMgr.I.d.UserId;
    }

    /**
     * 保存组队副本个人信息
     * @param d 协议下发的组队副本个人信息
     */
    public setFBInfo(d: S2CTeamDunInfo): void {
        this._myTeamId = d.TeamId;
        d.DunTypeList.forEach((info) => {
            this.fbInfoByType[info.DunType] = info;
        });
        d.DunIdList.forEach((dun) => {
            this.passById[dun.DunId] = !!dun.IsPass;
        });
        EventClient.I.emit(E.Team.UpdateTeamInfo);
        if (this.isCanBeginShowAutoStart()) {
            this.startAutoStart();
        } else {
            this.stopAutoStart();
        }
    }

    public updateBuyPassTime(d: S2CTeamDunBuyPassTime): void {
        const fbinfo: DunType = this.fbInfoByType[d.DunType] = this.fbInfoByType[d.DunType] || cc.js.createMap(true);
        fbinfo.BuyTime = d.BuyTime;
        fbinfo.PassTime = d.PassTime;
        fbinfo.DunType = d.DunType;
        EventClient.I.emit(E.Team.UpdateBuyPassTime, fbinfo.DunType);
        MsgToastMgr.Show(i18n.tt(Lang.team_page_buy_success_tips));
    }

    /** 我的队伍信息 */
    public setMyTeamInfo(team: S2CMyTeamInfo): void {
        if (this.myTeam?.TeamMemberList && team?.TeamMemberList?.length) {
            /** 原来队伍的玩家id列表 */
            const oldMember: { [userId: number]: TeamMember } = cc.js.createMap(true);
            const newMember: { [userId: number]: TeamMember } = cc.js.createMap(true);
            this.myTeam.TeamMemberList.forEach((m) => {
                oldMember[m.UserId] = m;
                if (newMember[m.UserId]) {
                    delete newMember[m.UserId];
                }
                for (let i = 0, n = team.TeamMemberList.length; i < n; i++) {
                    if (m.UserId === team.TeamMemberList[i].UserId) {
                        delete oldMember[m.UserId];
                    } else if (!oldMember[m.UserId] && !newMember[team.TeamMemberList[i].UserId]) {
                        newMember[team.TeamMemberList[i].UserId] = team.TeamMemberList[i];
                    }
                }
            });
            if (!GameApp.I.IsBattleIng) {
                for (const id in oldMember) {
                    // 该玩家已经不在队伍里了
                    const r = new RoleInfo({ A: oldMember[id].IntAttr, B: oldMember[id].StrAttr });
                    MsgToastMgr.Show(UtilString.FormatArgs(i18n.tt(Lang.team_page_leave_tips), r.getAreaNick(NickShowType.ArenaNick)));
                }
                for (const id in newMember) {
                    // 新加入的玩家
                    const r = new RoleInfo({ A: newMember[id].IntAttr, B: newMember[id].StrAttr });
                    MsgToastMgr.Show(UtilString.FormatArgs(i18n.tt(Lang.team_page_join_tips), r.getAreaNick(NickShowType.ArenaNick)));
                }
            }
        }
        this.myTeam = team;
        this._myTeamId = team.TeamId;
        if (this.isCanBeginShowAutoStart()) {
            this.startAutoStart();
        } else {
            this.stopAutoStart();
        }
        EventClient.I.emit(E.Team.UpdateMember);
        if (this.isFullTeam()) {
            this.stopAutoMatch();
        }
    }

    /** 队伍是否已满 */
    public isFullTeam(): boolean {
        return this.myTeam?.TeamMemberList?.length === this.maxMemberNum;
    }

    public getTeamMemberNum(): number {
        return this.myTeam?.TeamMemberList?.length || 0;
    }

    /**
     * 根据位置获取队员
     * @param pos 位置
     * @returns
     */
    public getTeamMemberByPos(pos: number): TeamMember | undefined {
        if (this.myTeam?.TeamMemberList) {
            for (let i = 0, n = this.myTeam.TeamMemberList.length; i < n; i++) {
                if (this.myTeam.TeamMemberList[i].Pos === pos) {
                    return this.myTeam.TeamMemberList[i];
                }
            }
        }
        return undefined;
    }

    /** 清除队伍信息 */
    private clearTeamInfo() {
        delete this.myTeam;
        this._myTeamId = 0;
        this.stopAutoMatch();
        this.clearMatchList();
    }

    /**
     * 从队伍里移除某个队员
     * @param teamId 队伍id
     * @param userId 玩家id
     */
    private removeTeamMember(userId: number) {
        EventClient.I.emit(E.Team.RemoveMember, userId);
    }

    /** 队伍列表 */
    public setTeamList(list: TeamView[]): void {
        EventClient.I.emit(E.Team.UpdateTeamList, list);
    }

    /**
     * 是否已通关
     * @param fbId 副本id
     * @returns
     */
    public isPass(fbId: number): boolean {
        return this.passById[fbId] || false;
    }

    /**
     * 能否扫荡
     * @param fbId 副本id
     * @param isShowTips 是否显示提示
     * @returns
     */
    public isCanSweep(fbId: number, isShowTips: boolean = false): boolean {
        if (!this.isPass(fbId)) {
            if (isShowTips) {
                MsgToastMgr.Show(i18n.tt(Lang.team_page_sweep_tips));
            }
            return false;
        }

        const cfgTBLevel: Cfg_TeamBoss_Level = this.cfg.getValueByKeyFromLevel(fbId);
        const info = Config.Get<ConfigLimitConditionIndexer>(Config.Type.Cfg_LimitCondition).getCondition(cfgTBLevel.SweepLimit);
        if (info?.state) {
            const result = this.getPassTime(cfgTBLevel.FBId) > 0;
            if (!result && isShowTips) {
                MsgToastMgr.Show(i18n.tt(Lang.team_page_battle_num_tips));
            }
            return result;
        }
        if (isShowTips) {
            let tips = '';
            if (info.info.ConditionFunc === 10) {
                if (info.info.Param1 > 10) {
                    tips = UtilString.FormatArgs(i18n.tt(Lang.team_page_sweep_tips2), info.info.Param1 % 10);
                } else {
                    tips = UtilString.FormatArgs(i18n.tt(Lang.team_page_sweep_tips1), info.info.Param1);
                }
            }
            MsgToastMgr.Show(tips || info.desc);
        }
        return false;
    }

    /**
     * 创建队伍
     * @param teamId 队伍id
     */
    public createTeamResult(teamId: number): void {
        EventClient.I.emit(E.Team.Create, teamId);
    }

    /**
     * 进入副本
     * @param teamId 队伍id
     */
    public enterFB(): void {
        EventClient.I.emit(E.Team.EnterFB);
    }

    /**
     * 离开队伍
     * @param teamId 队伍id
     * @param userId 玩家id
     * @returns
     */
    public leaveTeamResult(type: number): void {
        const timeId = this.myTeamId;
        this.clearTeamInfo();

        switch (type) {
            case ELevelTeamType.Diss:
                if (!GameApp.I.IsBattleIng) {
                    MsgToastMgr.Show(i18n.tt(Lang.team_dissolve));
                }
                break;
            case ELevelTeamType.Kick:
                this.addTeamTime(timeId);
                this.addInvitationBoxTime(timeId);
                if (!GameApp.I.IsBattleIng) {
                    MsgToastMgr.Show(i18n.tt(Lang.team_kick_team));
                }
                break;
            default:
                break;
        }
        EventClient.I.emit(E.Team.Leave);
    }

    /**
     * 给该玩家添加cd时间，在cd时间内不能邀请该玩家
     * @param userId 玩家id
     */
    private addPlayerTime(userId: number) {
        this.allPlayerInviteTime[userId] = UtilTime.NowSec() + this.teamInviteCD;
    }

    /**
     * 给该队伍添加cd时间，在cd时间内不能加入该队伍
     * @param teamId 队伍id
     */
    private addTeamTime(teamId: number) {
        this.joinTeamTime[teamId] = UtilTime.NowSec() + this.teamJoinCD;
    }

    /**
     * 给该队伍添加cd时间，在cd时间内不会显示该队伍的邀请弹窗
     * @param teamId 队伍id
     */
    private addInvitationBoxTime(teamId: number) {
        this.invitationBoxs[teamId] = UtilTime.NowSec() + this.teamInviteCD;
    }

    /**
     * 踢出队伍
     * @param userId 玩家id
     */
    public kickTeamResult(userId: number): void {
        this.addPlayerTime(userId);
        this.removeTeamMember(userId);
        this.stopAutoStart();
        EventClient.I.emit(E.Team.Kick, userId);
    }

    /** 获取购买次数消耗配置 */
    public getBuyTimesConfig(fbType: number, times: number): { type: number, num: number } {
        const coin: string = this.cfg.getValueByKey(fbType, 'BuyCost');
        const costs = coin.split('|');
        const cost = costs[Math.min(times, costs.length - 1)];
        const c = cost.split(':');
        return { type: Number(c[0]), num: Number(c[1]) };
    }
    /** 获取vip表中可购买次数（组队副本） */
    public configBuyTimes(): number {
        // vip等级从1开始
        const vip = RoleMgr.I.d.VipLevel < 1 ? 1 : RoleMgr.I.d.VipLevel;
        const times: string = Config.Get(Config.Type.Cfg_VIP).getValueByKey(vip, 'TeamDun1');
        const jccTime = times.split(':')[1];
        const num = Number(jccTime);
        return num;
    }

    /**
     * 设置组队副本阵容
     * @param lineups 助战单位列表
     */
    public setLineup(lineups: LineupUnit[]): void {
        this.lineups = cc.js.createMap(true);
        lineups.forEach((l) => {
            this.lineups[l.OnlyId] = l;
        });
        EventClient.I.emit(E.Team.PlanList, lineups);
    }

    /** 是否已上阵 */
    public isLineup(onlyId: string): boolean {
        return !!this.lineups[onlyId];
    }

    public getLineup(onlyId: string): LineupUnit {
        return this.lineups[onlyId];
    }

    public getLineups(): LineupUnit[] {
        const lineups: LineupUnit[] = [];
        for (const k in this.lineups) {
            lineups.push(this.lineups[k]);
        }
        return lineups;
    }

    /** 更新组队副本阵容 */
    public updateLineup(d: S2CTeamDunChangeLineup): void {
        if (!d.OnlyId) {
            if (this.lineups[d.OldOnlyId]) {
                delete this.lineups[d.OldOnlyId];
            }
            EventClient.I.emit(E.Team.PlanDown, d.Pos, d.OldOnlyId);
        } else if (d.OnlyId2 || d.OldOnlyId2) {
            if (d.OnlyId === d.OldOnlyId2 && !d.OldOnlyId && !d.OnlyId2) {
                const pos2 = this.lineups[d.OnlyId].Pos;
                this.lineups[d.OnlyId].Pos = d.Pos;
                EventClient.I.emit(E.Team.PlanChange, d.Pos, d.OnlyId, d.Type, pos2);
            } else {
                this.lineups[d.OnlyId] = { Type: d.Type, OnlyId: d.OnlyId, Pos: d.Pos };
                this.lineups[d.OnlyId2] = { Type: d.Type2, OnlyId: d.OnlyId2, Pos: d.Pos2 };
                EventClient.I.emit(E.Team.PlanReplace, d.Pos, d.OnlyId, d.Type, d.Pos2);
            }
        } else {
            if (d.OldOnlyId && this.lineups[d.OldOnlyId]) {
                delete this.lineups[d.OldOnlyId];
            }
            this.lineups[d.OnlyId] = { Type: d.Type, OnlyId: d.OnlyId, Pos: d.Pos };
            EventClient.I.emit(E.Team.PlanUp, d.Pos, d.OnlyId, d.Type, d.OldOnlyId);
        }
    }

    /** 是否正在自动匹配 */
    public get autoMatch(): boolean {
        return this._autoMatch;
    }
    private set autoMatch(b: boolean) {
        this._autoMatch = b;
    }

    /** 自动匹配结果 */
    public matchPlayerResult(): void {
        if (this.isFullTeam()) {
            this.stopAutoMatch();
        }
    }

    /** 开始匹配 */
    public startAutoMatch(): void {
        if (this.autoMatch) {
            return;
        }
        this.autoMatch = true;
        TimerMgr.I.addScheduled('TeamAutoMatch', () => {
            if (this.isFullTeam() || !this.autoMatch) {
                this.stopAutoMatch();
                return;
            }
            ControllerMgr.I.TeamController.C2STeamDunMatchPlayer();
        }, 4000);
        EventClient.I.emit(E.Team.BeginAutoMatch);
    }

    /** 停止匹配 */
    public stopAutoMatch(): void {
        this.autoMatch = false;
        TimerMgr.I.clearScheduled('TeamAutoMatch');
        EventClient.I.emit(E.Team.EndAutoMatch);
    }

    /** 获取满人自动开始的结束时间戳 */
    public get autoStartEndTime(): number {
        return this._autoStartEndTime;
    }

    private _autoStart: boolean;
    public get autoStart(): boolean {
        if (UtilBool.isNullOrUndefined(this._autoStart)) {
            this._autoStart = StorageMgr.I.getValue('TeamAutoStart');
        }
        return this._autoStart;
    }

    public set autoStart(b: boolean) {
        if (this._autoStart === b) {
            return;
        }
        this._autoStart = b;
        StorageMgr.I.setValue('TeamAutoStart', b);

        if (this.isCanBeginShowAutoStart()) {
            this.startAutoStart();
        } else {
            this.stopAutoStart();
        }
    }

    /** 是否能开始倒计时进入战斗 */
    public isCanBeginShowAutoStart(): boolean {
        return this.isCap() && this.isFullTeam() && this.autoStart;
    }

    /** 开始满人自动开始的逻辑 */
    public startAutoStart(): void {
        if (GameApp.I.IsBattleIng) { return; }
        if (this.getPassTime(this.myTeamFbType) <= 0) {
            return;
        }
        if (this._autoStartEndTime > 0) {
            return;
        }
        const time = 10;
        this._autoStartEndTime = UtilTime.NowSec() + time;
        TimerMgr.I.addScheduled('TeamAutoStart', () => {
            this.stopAutoStart();
            if (!GameApp.I.IsBattleIng) {
                if (this.isCanBeginShowAutoStart()) {
                    BattleCommon.I.enter(EBattleType.TeamFB_PVE);
                }
            }
        }, time * 1000);
        EventClient.I.emit(E.Team.BeginAutoStart);
    }
    /** 停止满人自动开始 */
    public stopAutoStart(): void {
        this._autoStartEndTime = 0;
        TimerMgr.I.clearScheduled('TeamAutoStart');
        EventClient.I.emit(E.Team.EndAutoStart);
    }

    public getMatchListByType(type: CHAT_CHANNEL_ENUM): TeamViewPlayer[] {
        if (!this.matchPlayers[type]) {
            ControllerMgr.I.TeamController.C2STeamDunMatchList(type);
        }
        return this.matchPlayers[type];
    }

    private matchPlayers: { [type: number]: TeamViewPlayer[] } = cc.js.createMap(true);
    public setMatchList(type: CHAT_CHANNEL_ENUM, players: TeamViewPlayer[]): void {
        this.matchPlayers[type] = players;
        EventClient.I.emit(E.Team.UpdateMathPlayers, type);
    }

    public clearMatchList(): void {
        this.matchPlayers = cc.js.createMap(true);
    }

    /**
     * 收到邀请框
     * @param d 协议下发
     */
    public showInvitationBox(d: S2CTeamDunReceiveInvite): void {
        if (!this.invitationBoxs[d.TeamId] || (UtilTime.NowSec() - this.invitationBoxs[d.TeamId]) >= 0) {
            this.addInvitationBoxTime(d.TeamId);
            const name = RoleInfo.GetAreaNick(NickShowType.ArenaNick, d.LeaderName, d.AreaId) || '';
            const cfgTBLevel: Cfg_TeamBoss_Level = this.cfg.getValueByKeyFromLevel(d.DunId);
            const cfgTB: Cfg_TeamBoss = this.cfg.getValueByKey(cfgTBLevel.FBId);
            const cfgConfig: Cfg_FB_Config = Config.Get(Config.Type.Cfg_FB_Config).getValueByKey('WinCD');
            const desc = UtilString.FormatArgs(
                i18n.tt(Lang.team_invitation_box_desc),
                name,
                cfgTB.Name,
                cfgTBLevel.LevelLimit,
                UtilColor.GoldD,
                UtilColor.YellowD,
                UtilColor.GreenV,
            );
            const time = cfgConfig?.Value || 5;
            InvitationBox.Show(desc, +time, {
                isSureTime: RoleMgr.I.d.TeamDunAccept === 1 || this.autoAcceptInvite,
                sureCallback: () => {
                    ModelMgr.I.TeamModel.checkLinkJoinTeam(d.TeamId, d.DunId);
                },
                rejectCallback: () => {
                    ControllerMgr.I.TeamController.C2STeamDunReject(d.InviteUserId);
                },
            });
        }
    }

    /** 收到有人拒绝邀请组队 */
    public rejectInvite(d: S2CTeamDunReject): void {
        const name = RoleInfo.GetAreaNick(NickShowType.ArenaNick, d.RejectName, d.RejectAreaId);
        MsgToastMgr.Show(UtilString.FormatArgs(i18n.tt(Lang.team_invitation_reject_tips), name));
    }

    public joinTeamSuccess(fbId: number, teamId: number): void {
        if (WinMgr.I.checkIsOpen(ViewConst.TeamWin)) {
            EventClient.I.emit(E.Team.Join, teamId);
        } else {
            /** 加入了队伍就清除其他的邀请框 */
            WinMgr.I.clearPopupView(ViewConst.InvitationBox);
            ControllerMgr.I.TeamController.linkOpen(fbId, ViewConst.TeamWin);
        }
    }

    /**
     * 检查加入队伍
     * @param fbId 副本id
     * @param teamId 队伍id
     * @returns
     */
    public checkLinkJoinTeam(teamId: number, fbId?: number): boolean {
        if (!UtilFunOpen.isOpen(FuncId.Team, true)) {
            return true;
        }

        if (fbId) {
            const cfg = Config.Get<ConfigTeamBossIndexer>(Config.Type.Cfg_TeamBoss);
            const cfgTBLevel: Cfg_TeamBoss_Level = cfg.getValueByKeyFromLevel(fbId);
            if (cfgTBLevel) {
                if (RoleMgr.I.d.Level < cfgTBLevel.LevelLimit) {
                    MsgToastMgr.Show(i18n.tt(Lang.tip_userLv_notenaugh));
                    return true;
                } else if (this.myTeamId === teamId) {
                    MsgToastMgr.Show(i18n.tt(Lang.team_share_click_has_team_tips1));
                    return true;
                } else if (!ModelMgr.I.TeamModel.isPass(fbId)) {
                    const fbids = ModelMgr.I.TeamModel.cfg.getFBIds(cfgTBLevel.FBId);
                    const index = fbids.indexOf(fbId);
                    if (index > 0) {
                        if (!ModelMgr.I.TeamModel.isPass(fbids[index - 1])) {
                            const c: Cfg_TeamBoss_Level = ModelMgr.I.TeamModel.cfg.getValueByKeyFromLevel(fbids[index - 1]);
                            MsgToastMgr.Show(UtilString.FormatArgs(i18n.tt(Lang.team_page_select_pass_tips), c.LevelLimit));
                            return true;
                        }
                    }
                }
            }
        }
        // if (this.hasTeam()) {
        //     MsgToastMgr.Show(i18n.tt(Lang.team_share_click_has_team_tips2));
        //     return true;
        // }
        if (MapCfg.I.mapData.InstanceType !== EMapFbInstanceType.YeWai) {
            MsgToastMgr.Show(i18n.tt(Lang.team_page_create_tips));
            return false;
        }
        ControllerMgr.I.TeamController.C2STeamDunJoin(teamId);
        return true;
    }
    /** 获取组队战斗提示信息 */
    public getTameBattleDesc(): string {
        let jump: string = '';
        let endNum = 0;
        const cfgTBLevel: Cfg_TeamBoss_Level = this.cfg.getValueByKeyFromLevel(this.myTeamFbId);
        if (cfgTBLevel) {
            jump = cfgTBLevel.Jump;
            endNum = cfgTBLevel.END;
        }
        const strArr = UtilString.SplitToArray(jump);
        const turnNum = this.currWarTurnNum;
        if (!turnNum) return '';
        let turn: number = 0;
        let num: number = 0;
        for (let i = 0; i < strArr.length; i++) {
            const t = +strArr[i][0];
            const b = +strArr[i][1];
            if (turnNum <= t) {
                turn = t;
                num = Math.min(b + this._currWarBatchNum, endNum);
                break;
            }
        }
        if (!num) {
            return '';
        }
        // todo 文本读表
        const str = i18n.tt(Lang.team_battle_desc);
        // console.log('jump=', jump);
        return UtilString.FormatArray(str, [turnNum, num, endNum]);
    }

    private updaWarDesc(): void {
        if (this._currWarBatchNum === 0) return;
        const desc = this.getTameBattleDesc();
        EventClient.I.emit(E.Battle.DescChange, desc);
    }

    private _teamInviteCD: number = 0;
    /** 配置表获取的邀请cd */
    private get teamInviteCD(): number {
        if (!this._teamInviteCD) {
            const cfgFBConfig: Cfg_FB_Config = Config.Get(Config.Type.Cfg_FB_Config).getValueByKey('TeamInviteCD');
            this._teamInviteCD = cfgFBConfig.Value ? +cfgFBConfig.Value : 30;
        }
        return this._teamInviteCD;
    }

    private _teamJoinCD: number = 0;
    /** 配置表获取的加入cd */
    private get teamJoinCD(): number {
        if (!this._teamJoinCD) {
            const cfgFBConfig: Cfg_FB_Config = Config.Get(Config.Type.Cfg_FB_Config).getValueByKey('TeamJoinCD');
            this._teamJoinCD = cfgFBConfig.Value ? +cfgFBConfig.Value : 30;
        }
        return this._teamJoinCD;
    }
    /** 邀请玩家加入队伍 */
    public invitePlayer(userId: number): void {
        if (!this.allPlayerInviteTime[userId] || (UtilTime.NowSec() - this.allPlayerInviteTime[userId]) >= 0) {
            ControllerMgr.I.TeamController.C2STeamDunInvite(this.myTeamFbId, userId);
            this.addPlayerTime(userId);
        } else {
            // eslint-disable-next-line max-len
            MsgToastMgr.Show(UtilString.FormatArgs(i18n.tt(Lang.team_invitation_again_player_tips), this.allPlayerInviteTime[userId] - UtilTime.NowSec()));
        }
    }

    /**
     * 邀请所有玩家
     * @param type 频道类型
     */
    public inviteAllPlayer(type: CHAT_CHANNEL_ENUM): void {
        if (!this.allPlayerInviteTime[type] || (UtilTime.NowSec() - this.allPlayerInviteTime[type]) >= 0) {
            const model = ModelMgr.I.TeamModel;
            ControllerMgr.I.TeamController.C2STeamDunInviteAuto(type, model.myTeamFbId);
            this.addPlayerTime(type);
            MsgToastMgr.Show(i18n.tt(Lang.team_invitation_all_success_tips));
        } else {
            // eslint-disable-next-line max-len
            MsgToastMgr.Show(UtilString.FormatArgs(i18n.tt(Lang.team_invitation_all_again_player_tips), this.allPlayerInviteTime[type] - UtilTime.NowSec()));
        }
    }

    /** 获取邀请该玩家的cd时间 */
    public getInvitePlayerTime(userId: number): number {
        return this.allPlayerInviteTime[userId] || 0;
    }

    /**
     * 获取加入该队伍的cd时间
     * @param teamId 队伍id
     * @returns
     */
    public getJoinTeamTime(teamId: number): number {
        return this.joinTeamTime[teamId] || 0;
    }

    /**
     * 一键邀请结果
     * @param type 频道类型
     * @param isSuccess 是否成功
     */
    public allInviteResult(type: CHAT_CHANNEL_ENUM, isSuccess: boolean): void {
        if (!isSuccess) {
            this.allPlayerInviteTime[type] = 0;
        } else if (this.matchPlayers[type]) {
            const nowTime = UtilTime.NowSec();
            const endTime = nowTime + this.teamInviteCD;
            this.matchPlayers[type].forEach((p) => {
                if (!this.allPlayerInviteTime[p.UserId] || (nowTime - this.allPlayerInviteTime[p.UserId]) > 0) {
                    this.allPlayerInviteTime[p.UserId] = endTime;
                }
            });
        }
        EventClient.I.emit(E.Team.UpdateAllInvite);
    }
}

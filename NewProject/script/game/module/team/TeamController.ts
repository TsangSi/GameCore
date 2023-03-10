import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../i18n/i18n';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { E } from '../../const/EventName';
import { FuncId } from '../../const/FuncConst';
import { ViewConst } from '../../const/ViewConst';
import ControllerMgr from '../../manager/ControllerMgr';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';
import { EBattleType } from '../battleResult/BattleResultConst';
import { CHAT_CHANNEL_ENUM } from '../chat/ChatConst';
import { MaterialTabId } from '../material/MaterialConst';
import { InvitationBox } from '../material/v/team/InvitationBox';

/*
 * @Author: zs
 * @Date: 2022-11-09 16:34:59
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\team\TeamController.ts
 * @Description:
 *
 */
const { ccclass, property } = cc._decorator;

@ccclass('TeamController')
export default class TeamController extends BaseController {
    public addNetEvent(): void {
        // throw new Error("Method not implemented.");
        EventProto.I.on(ProtoId.S2CTeamDunInfo_ID, this.onS2CTeamDunInfo, this);
        EventProto.I.on(ProtoId.S2CTeamDunBuyPassTime_ID, this.onS2CTeamDunBuyPassTime, this);
        EventProto.I.on(ProtoId.S2CTeamDunSweep_ID, this.onS2CTeamDunSweep, this);
        EventProto.I.on(ProtoId.S2CTeamDunViewList_ID, this.onS2CTeamDunViewList, this);
        EventProto.I.on(ProtoId.S2CTeamDunCreate_ID, this.onS2CTeamDunCreate, this);
        EventProto.I.on(ProtoId.S2CTeamDunJoin_ID, this.onS2CTeamDunJoin, this);
        EventProto.I.on(ProtoId.S2CTeamDunLeaveOrCancel_ID, this.onS2CTeamDunLeaveOrCancel, this);
        EventProto.I.on(ProtoId.S2CTeamDunKick_ID, this.onS2CTeamDunKick, this);
        EventProto.I.on(ProtoId.S2CTeamDunStart_ID, this.onS2CTeamDunStart, this);
        EventProto.I.on(ProtoId.S2CTeamDunMatchPlayer_ID, this.onS2CTeamDunMatchPlayer, this);
        EventProto.I.on(ProtoId.S2CMyTeamInfo_ID, this.onS2CMyTeamInfo, this);
        EventProto.I.on(ProtoId.S2CTeamDunLineupInfo_ID, this.onS2CTeamDunLineupInfo, this);
        EventProto.I.on(ProtoId.S2CTeamDunChangeLineup_ID, this.onS2CTeamDunChangeLineup, this);
        EventProto.I.on(ProtoId.S2CTeamDunSetPowerLimit_ID, this.onS2CTeamDunSetPowerLimit, this);
        EventProto.I.on(ProtoId.S2CTeamDunReceiveInvite_ID, this.onS2CTeamDunReceiveInvite, this);
        EventProto.I.on(ProtoId.S2CTeamDunInviteAuto_ID, this.onS2CTeamDunInviteAuto, this);
        EventProto.I.on(ProtoId.S2CTeamDunInvite_ID, this.onS2CTeamDunInvite, this);
        EventProto.I.on(ProtoId.S2CTeamDunSetAccept_ID, this.onS2CTeamDunSetAccept, this);
        EventProto.I.on(ProtoId.S2CTeamDunMatchList_ID, this.onS2CTeamDunMatchList, this);
        EventProto.I.on(ProtoId.S2CTeamDunReject_ID, this.onS2CTeamDunReject, this);
    }

    public delNetEvent(): void {
        EventClient.I.off(E.Battle.Start, this.onBattleStart, this);
        EventClient.I.off(E.Battle.End, this.onBattleEnd, this);
        EventClient.I.off(E.Battle.BacthNumChange, this.onBacthNumChange, this);
        EventClient.I.off(E.Battle.TurnNumChange, this.onTurnNumChange, this);
    }
    public addClientEvent(): void {
        EventClient.I.on(E.Game.Start, this.onLoginReq, this);
    }
    public delClientEvent(): void {
        EventClient.I.off(E.Game.Start, this.onLoginReq, this);
    }
    private onLoginReq(): void {
        this.C2STeamDunInfo();
        this.C2STeamDunLineupInfo();
    }
    public clearAll(): void {
        // throw new Error("Method not implemented.");
    }

    /** ???????????????????????? */
    public C2STeamDunInfo(): void {
        NetMgr.I.sendMessage(ProtoId.C2STeamDunInfo_ID);
    }

    private onS2CTeamDunInfo(d: S2CTeamDunInfo) {
        if (d.Tag === 0) {
            ModelMgr.I.TeamModel.setFBInfo(d);
        }
    }

    /**
     * ????????????????????????
     */
    public C2SMyTeamInfo(): void {
        NetMgr.I.sendMessage(ProtoId.C2SMyTeamInfo_ID);
    }

    private onS2CMyTeamInfo(d: S2CMyTeamInfo) {
        if (d.Tag === 0) {
            ModelMgr.I.TeamModel.setMyTeamInfo(d);
        }
    }

    /**
     * ????????????????????????
     * @param fbId ??????id
     */
    public C2STeamDunViewList(fbId: number): void {
        const d = new C2STeamDunViewList();
        d.DunId = fbId;
        NetMgr.I.sendMessage(ProtoId.C2STeamDunViewList_ID, d);
    }

    private onS2CTeamDunViewList(d: S2CTeamDunViewList) {
        if (d.Tag === 0) {
            ModelMgr.I.TeamModel.setTeamList(d.TeamViewList);
        }
    }

    /**
     * ??????????????????
     * @param fbId ??????id
     */
    public C2STeamDunCreate(fbId: number): void {
        const d = new C2STeamDunCreate();
        d.DunId = fbId;
        NetMgr.I.sendMessage(ProtoId.C2STeamDunCreate_ID, d);
    }

    private onS2CTeamDunCreate(d: S2CTeamDunCreate) {
        if (d.Tag === 0) {
            ModelMgr.I.TeamModel.createTeamResult(d.TeamId);
        }
    }

    /**
     * ??????????????????
     * @param teamId ??????id
     */
    public C2STeamDunJoin(teamId: number): void {
        const d = new C2STeamDunJoin();
        d.TeamId = teamId;
        NetMgr.I.sendMessage(ProtoId.C2STeamDunJoin_ID, d);
    }

    private onS2CTeamDunJoin(d: S2CTeamDunJoin) {
        if (d.Tag === 0) {
            ModelMgr.I.TeamModel.joinTeamSuccess(d.DunId, d.TeamId);
        } else {
            EventClient.I.emit(E.Team.JoinFail, d.TeamId);
        }
    }

    /**
     * ????????????/????????????
     */
    public C2STeamDunLeaveOrCancel(): void {
        NetMgr.I.sendMessage(ProtoId.C2STeamDunLeaveOrCancel_ID);
    }

    private onS2CTeamDunLeaveOrCancel(d: S2CTeamDunLeaveOrCancel) {
        if (d.Tag === 0) {
            ModelMgr.I.TeamModel.leaveTeamResult(d.LeaveType);
        }
    }

    /**
     * ????????????
     * @param teamId ??????id
     * @param userId ??????id
     */
    public C2STeamDunKick(userId: number): void {
        const d = new C2STeamDunKick();
        d.KickUserId = userId;
        NetMgr.I.sendMessage(ProtoId.C2STeamDunKick_ID, d);
    }

    private onS2CTeamDunKick(d: S2CTeamDunKick) {
        if (d.Tag === 0) {
            ModelMgr.I.TeamModel.kickTeamResult(d.KickUserId);
        }
    }

    /**
     * ????????????
     * @param teamId ??????id
     */
    public C2STeamDunStart(): void {
        ModelMgr.I.TeamModel.currWarBatchNum = 0;
        NetMgr.I.sendMessage(ProtoId.C2STeamDunStart_ID);
    }

    private onS2CTeamDunStart(d: S2CTeamDunStart) {
        if (d.Tag === 0) {
            EventClient.I.on(E.Battle.Start, this.onBattleStart, this);
            EventClient.I.on(E.Battle.End, this.onBattleEnd, this);
            EventClient.I.on(E.Battle.BacthNumChange, this.onBacthNumChange, this);
            EventClient.I.on(E.Battle.TurnNumChange, this.onTurnNumChange, this);
            ModelMgr.I.TeamModel.enterFB();
            this.C2STeamDunGetReport();
        }
    }

    /**
     * ????????????????????????
     * @param fbId ??????id
     */
    public C2STeamDunMatchPlayer(): void {
        NetMgr.I.sendMessage(ProtoId.C2STeamDunMatchPlayer_ID);
    }

    private onS2CTeamDunMatchPlayer(d: S2CTeamDunMatchPlayer) {
        if (d.Tag === 0) {
            ModelMgr.I.TeamModel.matchPlayerResult();
        }
    }

    /**
     * ????????????
     * @param fbId ??????id
     */
    public C2STeamDunBuyPassTime(fbType: number): void {
        const d = new C2STeamDunBuyPassTime();
        d.DunType = fbType;
        NetMgr.I.sendMessage(ProtoId.C2STeamDunBuyPassTime_ID, d);
    }

    private onS2CTeamDunBuyPassTime(d: S2CTeamDunBuyPassTime) {
        if (d.Tag === 0) {
            ModelMgr.I.TeamModel.updateBuyPassTime(d);
        }
    }

    /**
     * ??????
     * @param fbId ??????id
     */
    public C2STeamDunSweep(fbId: number): void {
        const d = new C2STeamDunSweep();
        d.DunId = fbId;
        NetMgr.I.sendMessage(ProtoId.C2STeamDunSweep_ID, d);
    }

    private onS2CTeamDunSweep(d: S2CTeamDunSweep) {
        if (d.Tag === 0) {
            EventClient.I.emit(E.Team.SweepFB, d.DunId);
        }
    }

    /** ?????????????????????????????? */
    public C2STeamDunLineupInfo(): void {
        NetMgr.I.sendMessage(ProtoId.C2STeamDunLineupInfo_ID);
    }

    private onS2CTeamDunLineupInfo(d: S2CTeamDunLineupInfo) {
        if (d.Tag === 0) {
            ModelMgr.I.TeamModel.setLineup(d.Lineup);
        }
    }

    /**
     * ??????????????????????????????
     * @param pos ??????
     * @param onlyId ??????????????????id
     */
    public C2STeamDunChangeLineup(pos: number, onlyId: string): void {
        const d = new C2STeamDunChangeLineup();
        d.Pos = pos;
        d.OnlyId = onlyId;
        NetMgr.I.sendMessage(ProtoId.C2STeamDunChangeLineup_ID, d);
    }

    private onS2CTeamDunChangeLineup(d: S2CTeamDunChangeLineup) {
        if (d.Tag === 0) {
            ModelMgr.I.TeamModel.updateLineup(d);
        }
    }

    /** ??????????????????????????????????????? */
    public C2STeamDunSetPowerLimit(fightValue: number): void {
        const d = new C2STeamDunSetPowerLimit();
        d.PowerLimit = fightValue;
        NetMgr.I.sendMessage(ProtoId.C2STeamDunSetPowerLimit_ID, d);
    }

    private onS2CTeamDunSetPowerLimit(d: S2CTeamDunSetPowerLimit) {
        if (d.Tag === 0) {
            ModelMgr.I.TeamModel.updatePowerLimit(d.PowerLimit);
        }
    }

    /**
     * ????????????????????????????????????
     * @param isAccept ??????????????????
     */
    public C2STeamDunSetAccept(isAccept: boolean): void {
        const d = new C2STeamDunSetAccept();
        d.IsAccept = isAccept ? 1 : 0;
        NetMgr.I.sendMessage(ProtoId.C2STeamDunSetAccept_ID, d);
    }

    private onS2CTeamDunSetAccept(d: S2CTeamDunSetAccept) {
        if (d.Tag === 0) {
            ModelMgr.I.TeamModel.autoAcceptInvite = d.IsAccept === 1;
        }
    }

    /**
     * ????????????????????????
     * @param fbId ??????id
     * @param userId ??????id
     */
    public C2STeamDunInvite(fbId: number, userId: number): void {
        const d = new C2STeamDunInvite();
        d.DunId = fbId;
        d.InviteUserId = userId;
        NetMgr.I.sendMessage(ProtoId.C2STeamDunInvite_ID, d);
    }

    private onS2CTeamDunInvite(d: S2CTeamDunInvite) {
        if (d.Tag !== 0) {
            EventClient.I.emit(E.Team.InviteFail, d.InviteUserId);
        } else {
            MsgToastMgr.Show(i18n.tt(Lang.team_invitation_all_success_tips));
        }
    }

    /**
     * ????????????
     * @param fbType ????????????
     * @param fbId ??????id
     */
    public C2STeamDunInviteAuto(chatType: CHAT_CHANNEL_ENUM, fbId: number): void {
        const d = new C2STeamDunInviteAuto();
        d.Type = chatType;
        d.DunId = fbId;
        NetMgr.I.sendMessage(ProtoId.C2STeamDunInviteAuto_ID, d);
    }

    private onS2CTeamDunInviteAuto(d: S2CTeamDunInviteAuto) {
        ModelMgr.I.TeamModel.allInviteResult(d.Type, d.Tag === 0);
    }

    /**
     * ??????????????????
     * @param inviteUserId ?????????id
     */
    public C2STeamDunReject(inviteUserId: number): void {
        const d = new C2STeamDunReject();
        d.InviteUserId = inviteUserId;
        NetMgr.I.sendMessage(ProtoId.C2STeamDunReject_ID, d);
    }

    private onS2CTeamDunReject(d: S2CTeamDunReject) {
        if (d.Tag === 0) {
            ModelMgr.I.TeamModel.rejectInvite(d);
        }
    }

    /**
     * ????????????????????????
     * @param type ??????(1)/??????(2)/??????(???)
     */
    public C2STeamDunMatchList(type: CHAT_CHANNEL_ENUM): void {
        const d = new C2STeamDunMatchList();
        d.Type = type;
        NetMgr.I.sendMessage(ProtoId.C2STeamDunMatchList_ID, d);
    }

    private onS2CTeamDunMatchList(d: S2CTeamDunMatchList) {
        if (d.Tag === 0) {
            ModelMgr.I.TeamModel.setMatchList(d.Type, d.MatchList);
        }
    }

    /** ???????????????????????? */
    private onS2CTeamDunReceiveInvite(d: S2CTeamDunReceiveInvite) {
        ModelMgr.I.TeamModel.showInvitationBox(d);
    }

    /** ??????????????????????????? */
    public C2STeamDunGetReport(): void {
        NetMgr.I.sendMessage(ProtoId.C2STeamDunGetReport_ID);
    }

    /** ??????????????????????????????????????????????????? */
    private onBattleStart(type: number) {
        if (type === EBattleType.TeamFB_PVE) {
            this.C2STeamDunGetReport();
        }
    }

    /** ?????????????????? */
    private onBacthNumChange(num: number): void {
        ModelMgr.I.TeamModel.currWarBatchNum = num;
    }
    /** ????????????????????? */
    private onTurnNumChange(num: number): void {
        ModelMgr.I.TeamModel.currWarTurnNum = num;
    }

    /** ?????????????????? */
    private onBattleEnd(type: number) {
        if (type === EBattleType.TeamFB_PVE) {
            EventClient.I.off(E.Battle.Start, this.onBattleStart, this);
            EventClient.I.off(E.Battle.End, this.onBattleEnd, this);
            EventClient.I.off(E.Battle.BacthNumChange, this.onBacthNumChange, this);
            EventClient.I.off(E.Battle.TurnNumChange, this.onTurnNumChange, this);
            // ModelMgr.I.TeamModel.currWarBatchNum = 0;
            this.linkOpen(ModelMgr.I.TeamModel.myTeamFbId, ViewConst.TeamWin);
        }
    }

    /**
     * ????????????
     * @param tab ??????id
     * @param params ????????????????????????
     * @param id ?????????????????????????????????
     * @returns
     */
    public linkOpen(fbId?: number, exParam?: number): boolean {
        if (UtilFunOpen.isOpen(FuncId.Team, true)) {
            ControllerMgr.I.MaterialController.linkOpen(MaterialTabId.Team, undefined, { fbId, exParam });
        }
        return true;
    }
}

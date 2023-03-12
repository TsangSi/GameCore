import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../i18n/i18n';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import { E } from '../../const/EventName';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';
import { ModifyPageType, TaskState } from './FamilyConst';

const { ccclass } = cc._decorator;

@ccclass
export default class FamilyController extends BaseController {
    public addNetEvent(): void {
        // 世家
        EventProto.I.on(ProtoId.S2CFamilyInfo_ID, this._onS2CFamilyInfo, this);
        // 成员列表
        EventProto.I.on(ProtoId.S2CFamilyMemberList_ID, this._onS2CFamilyMemberList, this);

        // 事务列表 & 刷新列表
        EventProto.I.on(ProtoId.S2CFamilyTaskInfo_ID, this._onS2CFamilyTaskInfo, this);
        EventProto.I.on(ProtoId.S2CFamilyTaskRefresh_ID, this._onS2CFamilyTaskRefresh, this);

        // 设置协助返回
        EventProto.I.on(ProtoId.S2CFamilyTaskSetPartnerToHelp_ID, this._onS2CFamilyTaskSetPartnerToHelp, this);

        // 请求他人的协助伙伴列表
        EventProto.I.on(ProtoId.S2CFamilyTaskHelpPartner_ID, this._onS2CFamilyTaskHelpPartner, this);

        // 发送一键派遣列表 派遣 & 一键派遣
        EventProto.I.on(ProtoId.S2CFamilyTaskGetAllCanStart_ID, this._onS2CFamilyTaskGetAllCanStart, this);
        EventProto.I.on(ProtoId.S2CFamilyTaskStart_ID, this._onS2CFamilyTaskStart, this);
        EventProto.I.on(ProtoId.S2CFamilyTaskStartOneKey_ID, this._onS2CFamilyTaskStartOneKey, this);

        // 领取奖励 加速CD
        EventProto.I.on(ProtoId.S2CFamilyTaskGetPrice_ID, this._onS2CFamilyTaskGetPrice, this);
        EventProto.I.on(ProtoId.S2CFamilyTaskSpeed_ID, this._onS2CFamilyTaskSpeed, this);
        EventProto.I.on(ProtoId.S2CFamilyTopPlayerData_ID, this._onS2CFamilyTopPlayerData, this);
        // 改名成功
        EventProto.I.on(ProtoId.S2CFamilyRename_ID, this._onS2CFamilyRename, this);
        EventProto.I.on(ProtoId.S2CFamilyRenameWord_ID, this._onS2CFamilyRenameWord, this);
        // 膜拜成功
        EventProto.I.on(ProtoId.S2CFamilyWorship_ID, this._onS2CFamilyWorship, this);
        /** 每日俸禄 */
        EventProto.I.on(ProtoId.S2CFamilyDailySalary_ID, this._onS2CFamilyDailySalary, this);
        /** 世家奖励等领取信息 */
        EventProto.I.on(ProtoId.S2CFamilyRoleInfo_ID, this._onS2CFamilyRoleInfo, this);
        /** 族长争夺基础信息 */
        EventProto.I.on(ProtoId.S2CFamilyPatriInfo_ID, this._onS2CFamilyPatriInfo, this);
        /** 族长争夺 我的排行 */
        EventProto.I.on(ProtoId.S2CFamilyPatriGetMyRank_ID, this._onS2CFamilyPatriGetMyRank, this);
        /** 挑战boss */
        EventProto.I.on(ProtoId.S2CFamilyPatriChallengeBoss_ID, this._onS2CFamilyPatriChallengeBoss, this);
        /** 挑战首领 */
        EventProto.I.on(ProtoId.S2CFamilyPatriChallengeLeader_ID, this._onS2CFamilyPatriChallengeLeader, this);
        /** 观看视频 */
        EventProto.I.on(ProtoId.S2CFamilyPatriWatchVideos_ID, this._onS2CFamilyPatriWatchVideos, this);
        /** 伤害排行 */
        EventProto.I.on(ProtoId.S2CFamilyPatriGetRank_ID, this._onS2CFamilyPatriGetRank, this);

        /** 二阶段基础信息 */
        EventProto.I.on(ProtoId.S2CFamilyPatriLeaderInfo_ID, this._onS2CFamilyPatriLeaderInfo, this);
        /** 校场基础信息 */
        EventProto.I.on(ProtoId.S2CGetDrillGroundInfo_ID, this._onS2CGetDrillGroundInfo, this);
        /** 校场升级 */
        EventProto.I.on(ProtoId.S2CDrillGroundLevelUp_ID, this._onS2CDrillGroundLevelUp, this);
        /** 校场共鸣 */
        EventProto.I.on(ProtoId.S2CDrillGroundResonateLevelUp_ID, this._onS2CDrillGroundResonateLevelUp, this);

        /** 图腾基础信息 */ /** 图腾铸造 */
        EventProto.I.on(ProtoId.S2CTotemInfo_ID, this._onS2CTotemInfo, this);
        EventProto.I.on(ProtoId.S2CTotemBuild_ID, this._onS2CTotemBuild, this);

        /** 试炼副本基础信息 */
        EventProto.I.on(ProtoId.S2CTrialCopyInfo_ID, this._onS2CTrialCopyInfo, this);// 基础信息
        EventProto.I.on(ProtoId.S2CTrialCopyBossInfo_ID, this._onS2CTrialCopyBossInfo, this);// boss信息
        EventProto.I.on(ProtoId.S2CTrialCopyChallenge_ID, this._onS2CTrialCopyChallenge, this);// 挑战成功
        EventProto.I.on(ProtoId.S2CTrialCopySweep_ID, this._onS2CTrialCopySweep, this);// 扫荡成功

        EventProto.I.on(ProtoId.S2CTrialCopyReward_ID, this._onS2CTrialCopyReward, this);// 试炼副本-领取通关奖励
        // 试炼副本-红包排行榜
        EventProto.I.on(ProtoId.S2CTrialCopyRedPacketRank_ID, this._onS2CTrialCopyRedPacketRank, this);// 试炼副本-红包排行榜
        EventProto.I.on(ProtoId.S2CTrialCopyRedPacket_ID, this._onS2CTrialCopyRedPacket, this);// 试炼副本-打开红包
        // 试炼副本购买次数
        EventProto.I.on(ProtoId.S2CTrialCopyBuyNum_ID, this._onS2CTrialCopyBuyNum, this);// 试炼副本-购买次数
        // 排行榜
        EventProto.I.on(ProtoId.S2CTrialCopyRank_ID, this._onS2CTrialCopyRank, this);// 试炼副本-排行榜
    }
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CTrialCopyBuyNum_ID, this._onS2CTrialCopyBuyNum, this);// 试炼副本-购买次数
        EventProto.I.off(ProtoId.S2CTrialCopyRedPacket_ID, this._onS2CTrialCopyRedPacket, this);// 试炼副本-打开红包
        EventProto.I.off(ProtoId.S2CTrialCopyReward_ID, this._onS2CTrialCopyReward, this);// 试炼副本-领取通关奖励
        EventProto.I.off(ProtoId.S2CTrialCopyChallenge_ID, this._onS2CTrialCopyChallenge, this);// 挑战成功
        EventProto.I.off(ProtoId.S2CTrialCopySweep_ID, this._onS2CTrialCopySweep, this);// 扫荡成功
        EventProto.I.off(ProtoId.S2CTrialCopyInfo_ID, this._onS2CTrialCopyInfo, this);// 基础信息
        EventProto.I.off(ProtoId.S2CTrialCopyBossInfo_ID, this._onS2CTrialCopyBossInfo, this);// boss信息
        EventProto.I.off(ProtoId.S2CFamilyPatriLeaderInfo_ID, this._onS2CFamilyPatriLeaderInfo, this);
        EventProto.I.off(ProtoId.S2CGetDrillGroundInfo_ID, this._onS2CGetDrillGroundInfo, this);
        EventProto.I.off(ProtoId.S2CDrillGroundLevelUp_ID, this._onS2CDrillGroundLevelUp, this);
        EventProto.I.off(ProtoId.S2CDrillGroundResonateLevelUp_ID, this._onS2CDrillGroundResonateLevelUp, this);
        EventProto.I.off(ProtoId.S2CTotemInfo_ID, this._onS2CTotemInfo, this);
        EventProto.I.off(ProtoId.S2CTotemBuild_ID, this._onS2CTotemBuild, this);
        EventProto.I.off(ProtoId.S2CFamilyPatriGetRank_ID, this._onS2CFamilyPatriGetRank, this);
        EventProto.I.off(ProtoId.S2CFamilyPatriWatchVideos_ID, this._onS2CFamilyPatriWatchVideos, this);
        EventProto.I.off(ProtoId.S2CFamilyPatriChallengeLeader_ID, this._onS2CFamilyPatriChallengeLeader, this);
        EventProto.I.off(ProtoId.S2CFamilyPatriChallengeBoss_ID, this._onS2CFamilyPatriChallengeBoss, this);
        EventProto.I.off(ProtoId.S2CFamilyPatriGetMyRank_ID, this._onS2CFamilyPatriGetMyRank, this);
        EventProto.I.off(ProtoId.S2CFamilyPatriInfo_ID, this._onS2CFamilyPatriInfo, this);
        EventProto.I.off(ProtoId.S2CFamilyRoleInfo_ID, this._onS2CFamilyRoleInfo, this);
        EventProto.I.off(ProtoId.S2CFamilyDailySalary_ID, this._onS2CFamilyDailySalary, this);
        EventProto.I.off(ProtoId.S2CFamilyWorship_ID, this._onS2CFamilyWorship, this);
        EventProto.I.off(ProtoId.S2CFamilyRename_ID, this._onS2CFamilyRename, this);
        EventProto.I.off(ProtoId.S2CFamilyRenameWord_ID, this._onS2CFamilyRenameWord, this);
        EventProto.I.off(ProtoId.S2CFamilyMemberList_ID, this._onS2CFamilyMemberList, this);
        EventProto.I.off(ProtoId.S2CFamilyInfo_ID, this._onS2CFamilyInfo, this);
        EventProto.I.off(ProtoId.S2CFamilyTaskStartOneKey_ID, this._onS2CFamilyTaskStartOneKey, this);
        EventProto.I.off(ProtoId.S2CFamilyTaskInfo_ID, this._onS2CFamilyTaskInfo, this);
        EventProto.I.off(ProtoId.S2CFamilyTaskRefresh_ID, this._onS2CFamilyTaskRefresh, this);
        EventProto.I.off(ProtoId.S2CFamilyTaskStart_ID, this._onS2CFamilyTaskStart, this);
        EventProto.I.off(ProtoId.S2CFamilyTaskGetPrice_ID, this._onS2CFamilyTaskGetPrice, this);
        EventProto.I.off(ProtoId.S2CFamilyTaskSetPartnerToHelp_ID, this._onS2CFamilyTaskSetPartnerToHelp, this);
        EventProto.I.off(ProtoId.S2CFamilyTaskSpeed_ID, this._onS2CFamilyTaskSpeed, this);
        EventProto.I.off(ProtoId.S2CFamilyTopPlayerData_ID, this._onS2CFamilyTopPlayerData, this);
    }
    public addClientEvent(): void {
        // EventClient.I.on(E.Game.Start, this.onGameStart, this);
    }
    public delClientEvent(): void {
        // EventClient.I.off(E.Game.Start, this.onGameStart, this);
    }
    public clearAll(): void {
        //
    }
    //
    /** 请求世家基础信息 */
    public reqC2SFamilyInfo(): void {
        const req = new C2SFamilyInfo();
        NetMgr.I.sendMessage(ProtoId.C2SFamilyInfo_ID, req);
    }
    private _onS2CFamilyInfo(data: S2CFamilyInfo): void {
        if (!data.Tag) {
            ModelMgr.I.FamilyModel.setFamilyInfo(data);
        }
    }
    /** 成员列表 */
    public reqC2SFamilyMemberList(start: number, end: number): void {
        const req = new C2SFamilyMemberList();
        req.Start = start;
        req.End = end;
        NetMgr.I.sendMessage(ProtoId.C2SFamilyMemberList_ID, req);
    }
    private _onS2CFamilyMemberList(data: S2CFamilyMemberList): void {
        if (!data.Tag) {
            ModelMgr.I.FamilyModel.setMemberList(data);
        }
    }
    // 请求事务信息列表
    public reqC2SFamilyTaskInfo(): void {
        const req = new C2SFamilyTaskInfo();
        NetMgr.I.sendMessage(ProtoId.C2SFamilyTaskInfo_ID, req);
    }
    // 返回事务基础信息
    private _onS2CFamilyTaskInfo(data: S2CFamilyTaskInfo): void {
        if (!data.Tag) {
            ModelMgr.I.FamilyModel.FamilyTaskInfo(data);
        }
    }
    // 请求刷新事务
    public reqC2SFamilyTaskRefresh(): void {
        const req = new C2SFamilyTaskRefresh();
        NetMgr.I.sendMessage(ProtoId.C2SFamilyTaskRefresh_ID, req);
    }
    // 返回刷新事务
    private _onS2CFamilyTaskRefresh(data: S2CFamilyTaskRefresh): void {
        if (!data.Tag) {
            ModelMgr.I.FamilyModel.refreshTask(data);
        }
    }
    // 设置协助
    public reqC2SFamilyTaskSetPartnerToHelp(list: SetPartner[]): void {
        const req = new C2SFamilyTaskSetPartnerToHelp();
        req.SetPartnerList = list;
        NetMgr.I.sendMessage(ProtoId.C2SFamilyTaskSetPartnerToHelp_ID, req);
    }
    private _onS2CFamilyTaskSetPartnerToHelp(data: S2CFamilyTaskSetPartnerToHelp): void {
        if (!data.Tag) { // 更新设置协助时间 列表
            ModelMgr.I.FamilyModel.updateSetPartnerToHelp(data);
        }
    }
    // 协助好友列表
    public reqC2SFamilyTaskHelpPartner(): void {
        const req = new C2SFamilyTaskHelpPartner();
        NetMgr.I.sendMessage(ProtoId.C2SFamilyTaskHelpPartner_ID, req);
    }
    private _onS2CFamilyTaskHelpPartner(data: S2CFamilyTaskHelpPartner): void {
        if (!data.Tag) {
            ModelMgr.I.FamilyModel.initSenderHelperPartnerL(data);
        }
    }
    // 主页英雄数据
    public reqC2SFamilyTopPlayerData(): void {
        const req = new C2SFamilyTopPlayerData();
        NetMgr.I.sendMessage(ProtoId.C2SFamilyTopPlayerData_ID, req);
    }
    private _onS2CFamilyTopPlayerData(data: S2CFamilyTopPlayerData): void {
        if (!data.Tag) {
            ModelMgr.I.FamilyModel.initModelInfo(data);
        }
    }
    // 请求一键派遣列表
    public reqC2SFamilyTaskGetAllCanStart(): void {
        const req = new C2SFamilyTaskGetAllCanStart();
        NetMgr.I.sendMessage(ProtoId.C2SFamilyTaskGetAllCanStart_ID, req);
    }
    private _onS2CFamilyTaskGetAllCanStart(data: S2CFamilyTaskGetAllCanStart): void {
        if (!data.Tag) {
            ModelMgr.I.FamilyModel.initFamilyOneKeyList(data);
        }
    }
    // 一键派遣
    public reqC2SFamilyTaskStartOneKey(CanStartTaskL: CanStartTask[]): void {
        const req = new C2SFamilyTaskStartOneKey();
        req.CanStartTaskL = CanStartTaskL;
        NetMgr.I.sendMessage(ProtoId.C2SFamilyTaskStartOneKey_ID, req);
    }
    private _onS2CFamilyTaskStartOneKey(data: S2CFamilyTaskStartOneKey): void {
        if (!data.Tag) {
            ModelMgr.I.FamilyModel.FamilyTaskStartOneKey(data);
        }
    }
    // 单独派遣
    public reqC2SFamilyTaskStart(taskId: number, TaskPartner: SetPartner[]): void {
        const req = new C2SFamilyTaskStart();
        req.TaskId = taskId;// 任务ID
        req.SetPartnerL = TaskPartner;// 派遣伙伴
        NetMgr.I.sendMessage(ProtoId.C2SFamilyTaskStart_ID, req);
    }
    private _onS2CFamilyTaskStart(data: S2CFamilyTaskStart): void {
        if (!data.Tag) {
            ModelMgr.I.FamilyModel.SingleFamilyTaskStart(data);
        }
    }
    // 请求 一键领取所有奖励 领取完需要删除列表
    public reqC2SFamilyTaskGetPrice(): void {
        const req = new C2SFamilyTaskGetPrice();
        NetMgr.I.sendMessage(ProtoId.C2SFamilyTaskGetPrice_ID, req);
    }
    // 返回 领取奖励
    private _onS2CFamilyTaskGetPrice(data: S2CFamilyTaskGetPrice): void {
        if (!data.Tag) { // 获得奖励
            // 领取完奖励，删除事务列表
            if (data.TaskIds && data.TaskIds.length) {
                for (let i = 0; i < data.TaskIds.length; i++) {
                    ModelMgr.I.FamilyModel.deleteFamilyTaskListItem(data.TaskIds[i]);
                }
            }
            // 更新协助伙伴列表
            ModelMgr.I.FamilyModel.updateUserPartnerId(data.UsePartnerId);
            EventClient.I.emit(E.Family.FamilyGetReward, data);
        }
    }
    // 请求 加速CD完成任务
    public reqC2SFamilyTaskSpeed(taskId: number): void {
        const req = new C2SFamilyTaskSpeed();
        req.TaskId = taskId;
        NetMgr.I.sendMessage(ProtoId.C2SFamilyTaskSpeed_ID, req);
    }
    // 返回  加速CD完成任务
    private _onS2CFamilyTaskSpeed(data: S2CFamilyTaskSpeed): void {
        if (!data.Tag) { // 获得奖励
            ModelMgr.I.FamilyModel.updateTaskState(data.TaskId, TaskState.reward);
            EventClient.I.emit(E.Family.FamilySpeedUpCD);
        }
    }

    // -------------世家2期协议--------------
    // 请求 修改世家名称
    public reqC2SFamilyRename(name: string): void {
        const req = new C2SFamilyRename();
        req.Name = name;
        NetMgr.I.sendMessage(ProtoId.C2SFamilyRename_ID, req);
    }
    // 返回 改名成功
    private _onS2CFamilyRename(data: S2CFamilyRename): void {
        if (!data.Tag) { // 改名成功
            ModelMgr.I.FamilyModel.updateReNameInfo(data.RenameNum, data.RenameTime);
            EventClient.I.emit(E.Family.FamilyModify, ModifyPageType.Name);
        }
    }
    // 请求 修改宣言
    public reqC2SFamilyRenameWord(word: string): void {
        const req = new C2SFamilyRenameWord();
        req.Word = word;
        NetMgr.I.sendMessage(ProtoId.C2SFamilyRenameWord_ID, req);
    }
    // 返回 修改宣言
    private _onS2CFamilyRenameWord(data: S2CFamilyRenameWord): void {
        if (!data.Tag) { // 修改宣言
            ModelMgr.I.FamilyModel.updateFamilyWordTime(data.RenameWordTime);
            EventClient.I.emit(E.Family.FamilyModify, ModifyPageType.Word);
        }
    }
    // 请求 膜拜
    public reqC2SFamilyWorship(): void {
        const req = new C2SFamilyWorship();
        NetMgr.I.sendMessage(ProtoId.C2SFamilyWorship_ID, req);
    }
    // 返回  膜拜成功
    private _onS2CFamilyWorship(data: S2CFamilyWorship): void {
        if (!data.Tag) {
            ModelMgr.I.FamilyModel.updateFamilyWorship(data.Worship);
        }
    }
    // 请求 领取 每日俸禄
    public reqC2SFamilyDailySalary(): void {
        const req = new C2SFamilyDailySalary();
        NetMgr.I.sendMessage(ProtoId.C2SFamilyDailySalary_ID, req);
    }
    // 返回  每日俸禄
    private _onS2CFamilyDailySalary(data: S2CFamilyDailySalary): void {
        if (!data.Tag) { // data.DailySalary//每日俸禄领取次数 // 领取成功之后,更新次数
            ModelMgr.I.FamilyModel.updateDailySalary(data.DailySalary);
        }
    }
    // 请求 基础信息 cd 领取次数等
    public reqC2SFamilyRoleInfo(): void {
        const req = new C2SFamilyRoleInfo();
        NetMgr.I.sendMessage(ProtoId.C2SFamilyRoleInfo_ID, req);
    }
    // 返回  每日俸禄
    private _onS2CFamilyRoleInfo(data: S2CFamilyRoleInfo): void {
        ModelMgr.I.FamilyModel.initFamilyRoleInfo(data);
    }

    // ---------------族长争夺---------------
    // 请求 争夺基础信息
    public reqC2SFamilyPatriInfo(): void {
        const req = new C2SFamilyPatriInfo();
        NetMgr.I.sendMessage(ProtoId.C2SFamilyPatriInfo_ID, req);
    }
    // 返回  争夺基础信息
    private _onS2CFamilyPatriInfo(data: S2CFamilyPatriInfo): void {
        ModelMgr.I.FamilyModel.initFamilyPatriInfo(data);
    }
    // 挑战boss
    public reqC2SFamilyPatriChallengeBoss(): void {
        const req = new C2SFamilyPatriChallengeBoss();
        NetMgr.I.sendMessage(ProtoId.C2SFamilyPatriChallengeBoss_ID, req);
    }
    // 返回  挑战boss
    private _onS2CFamilyPatriChallengeBoss(data: S2CFamilyPatriChallengeBoss): void {
        if (!data.Tag) {
            // MsgToastMgr.Show('挑战Boss成功');
        }
    }
    // 挑战首领
    public reqC2SFamilyPatriChallengeLeader(): void {
        const req = new C2SFamilyPatriChallengeLeader();
        NetMgr.I.sendMessage(ProtoId.C2SFamilyPatriChallengeLeader_ID, req);
    }
    // 返回  挑战首领
    private _onS2CFamilyPatriChallengeLeader(data: S2CFamilyPatriChallengeLeader): void {
        if (!data.Tag) {
            // MsgToastMgr.Show('挑战首领成功');
        }
    }

    /** 族长争夺 二阶段基础信息 */
    // 请求 二阶段基础信息
    public reqC2SFamilyPatriLeaderInfo(): void {
        const req = new C2SFamilyPatriLeaderInfo();
        NetMgr.I.sendMessage(ProtoId.C2SFamilyPatriLeaderInfo_ID, req);
    }
    // 返回 二阶段基础信息
    private _onS2CFamilyPatriLeaderInfo(data: S2CFamilyPatriLeaderInfo): void {
        ModelMgr.I.FamilyModel.initFamilyPatriLeaderInfo(data);
    }

    // 请求 观看视频
    public reqC2SFamilyPatriWatchVideos(idx: string): void {
        const req = new C2SFamilyPatriWatchVideos();
        req.Index = idx;
        NetMgr.I.sendMessage(ProtoId.C2SFamilyPatriWatchVideos_ID, req);
    }
    // 返回 观看视频
    private _onS2CFamilyPatriWatchVideos(data: S2CFamilyPatriWatchVideos): void {
        // MsgToastMgr.Show('观看视频');
    }

    // 请求 获取我的排行榜
    public reqC2SFamilyPatriGetMyRank(): void {
        const req = new C2SFamilyPatriGetMyRank();
        NetMgr.I.sendMessage(ProtoId.C2SFamilyPatriGetMyRank_ID, req);
    }
    // 返回 获取我的排行榜
    private _onS2CFamilyPatriGetMyRank(data: S2CFamilyPatriGetMyRank): void {
        if (!data.Tag) {
            ModelMgr.I.FamilyModel.initMyRankInfo(data);
        }
    }
    // 请求 获取排行榜
    public reqC2SFamilyPatriGetRank(): void {
        const req = new C2SFamilyPatriGetRank();
        req.Start = 0;
        req.End = 999;
        NetMgr.I.sendMessage(ProtoId.C2SFamilyPatriGetRank_ID, req);
    }
    // 返回 排行榜
    private _onS2CFamilyPatriGetRank(data: S2CFamilyPatriGetRank): void {
        if (!data.Tag) {
            ModelMgr.I.FamilyModel.initDamageList(data.FamilyPatriHurtRankList);
        }
    }

    /** ---------------------校场--------------------- */
    // 请求 校场基础信息
    public reqC2SGetDrillGroundInfo(): void {
        const req = new C2SGetDrillGroundInfo();
        NetMgr.I.sendMessage(ProtoId.C2SGetDrillGroundInfo_ID, req);
    }
    // 返回 校场基础信息
    private _onS2CGetDrillGroundInfo(data: S2CGetDrillGroundInfo): void {
        ModelMgr.I.FamilyModel.initDrillGroundInfo(data);
    }

    // 校场升级
    public reqC2SDrillGroundLevelUp(dgId: number): void {
        const req = new C2SDrillGroundLevelUp();
        req.Id = dgId;
        NetMgr.I.sendMessage(ProtoId.C2SDrillGroundLevelUp_ID, req);
    }
    // 返回 校场升级
    private _onS2CDrillGroundLevelUp(data: S2CDrillGroundLevelUp): void {
        if (!data.Tag) { ModelMgr.I.FamilyModel.updateDrillGroundMap(data); }
    }

    // 校场共鸣
    public reqC2SDrillGroundResonateLevelUp(): void {
        const req = new C2SDrillGroundResonateLevelUp();
        NetMgr.I.sendMessage(ProtoId.C2SDrillGroundResonateLevelUp_ID, req);
    }
    // 返回 校场共鸣
    private _onS2CDrillGroundResonateLevelUp(data: S2CDrillGroundResonateLevelUp): void {
        if (!data.Tag) { ModelMgr.I.FamilyModel.updateDrillGroundResonate(data); }
    }

    /** ------------图腾------------ */
    // 图腾基础信息
    public reqC2STotemInfo(): void {
        const req = new C2STotemInfo();
        NetMgr.I.sendMessage(ProtoId.C2STotemInfo_ID, req);
    }
    // 返回 图腾基础信息
    private _onS2CTotemInfo(data: S2CTotemInfo): void {
        if (!data.Tag) { ModelMgr.I.FamilyModel.initTotemInfo(data); }
    }

    // 图腾铸造
    public reqC2STotemBuild(Id: number): void {
        const req = new C2STotemBuild();
        req.Id = Id;
        NetMgr.I.sendMessage(ProtoId.C2STotemBuild_ID, req);
    }
    // 返回 图腾铸造
    private _onS2CTotemBuild(data: S2CTotemBuild): void {
        if (!data.Tag) {
            MsgToastMgr.Show(i18n.tt(Lang.family_buildSuccess));// 铸造成功
        }
    }
    /** ------------试炼副本------------ */
    // 试炼副本基础信息
    public reqC2STrialCopyInfo(): void {
        const req = new C2STrialCopyInfo();
        NetMgr.I.sendMessage(ProtoId.C2STrialCopyInfo_ID, req);
    }
    // 返回 试炼副本基础信息
    private _onS2CTrialCopyInfo(data: S2CTrialCopyInfo): void {
        if (!data.Tag) {
            ModelMgr.I.FamilyModel.initTrialCopyInfo(data);
        }
    }
    // 试炼副本Boss信息
    public reqC2STrialCopyBossInfo(): void {
        const req = new C2STrialCopyBossInfo();
        NetMgr.I.sendMessage(ProtoId.C2STrialCopyBossInfo_ID, req);
    }
    // 返回 试炼副本Boss信息
    private _onS2CTrialCopyBossInfo(data: S2CTrialCopyBossInfo): void {
        if (!data.Tag) {
            ModelMgr.I.FamilyModel.initTrialBossInfo(data);
        }
    }
    // 试炼副本挑战
    public reqC2STrialCopyChallenge(trialId: number): void {
        const req = new C2STrialCopyChallenge();
        req.TrialId = trialId;
        NetMgr.I.sendMessage(ProtoId.C2STrialCopyChallenge_ID, req);
    }
    // 返回 试炼副本挑战
    private _onS2CTrialCopyChallenge(data: S2CTrialCopyChallenge): void {
        if (!data.Tag) {
            // 挑战成功
            EventClient.I.emit(E.Family.FamilyTrialFightSuccess);
        }
    }
    // 试炼副本扫荡
    public reqC2STrialCopySweep(trialId: number): void {
        const req = new C2STrialCopySweep();
        req.TrialId = trialId;
        NetMgr.I.sendMessage(ProtoId.C2STrialCopySweep_ID, req);
    }
    // 返回 试炼副本扫荡
    private _onS2CTrialCopySweep(data: S2CTrialCopyChallenge): void {
        if (!data.Tag) {
            ModelMgr.I.FamilyModel.deleteTrialHurtList();
            ModelMgr.I.FamilyModel.updateTrialBuyNumCanNum(data, 1);
            this.reqC2STrialCopyBossInfo();
        }
    }

    // 发送 领取 试炼副本通关奖励
    public reqC2STrialCopyReward(trialId: number): void {
        const req = new C2STrialCopyReward();
        req.TrialId = trialId;
        NetMgr.I.sendMessage(ProtoId.C2STrialCopyReward_ID, req);
    }
    // 返回 试炼副本通关奖励
    private _onS2CTrialCopyReward(data: S2CTrialCopyReward): void {
        if (!data.Tag) {
            ModelMgr.I.FamilyModel.updateFamilyTrialRewardList(data.TrialId);
        }
    }
    // 发送 发送购买次数
    public reqC2STrialCopyBuyNum(): void {
        const req = new C2STrialCopyBuyNum();
        NetMgr.I.sendMessage(ProtoId.C2STrialCopyBuyNum_ID, req);
    }
    // 返回 购买次数
    private _onS2CTrialCopyBuyNum(data: S2CTrialCopyBuyNum): void {
        if (!data.Tag) {
            ModelMgr.I.FamilyModel.updateTrialBuyNumCanNum(data);
        }
    }

    /** 红包数据 */
    // 发送 获取红包排行榜
    public reqC2STrialCopyRedPacketRank(): void {
        const req = new C2STrialCopyRedPacketRank();
        NetMgr.I.sendMessage(ProtoId.C2STrialCopyRedPacketRank_ID, req);
    }
    // 返回 获取红包排行榜
    private _onS2CTrialCopyRedPacketRank(data: S2CTrialCopyRedPacketRank): void {
        if (!data.Tag) {
            ModelMgr.I.FamilyModel.trialCopyRedPackRank(data.RedPacketRankList);
        }
    }

    //
    // 发送 打开红包
    public reqC2STrialCopyRedPacket(trialId: number): void {
        const req = new C2STrialCopyRedPacket();
        req.TrialId = trialId;
        NetMgr.I.sendMessage(ProtoId.C2STrialCopyRedPacket_ID, req);
    }
    // 返回 打开红包
    private _onS2CTrialCopyRedPacket(data: S2CTrialCopyRedPacket): void {
        if (!data.Tag) {
            ModelMgr.I.FamilyModel.updateTrialRedPackList(data);
        }
    }

    // 发送 获取排行榜
    public reqC2STrialCopyRank(): void {
        const req = new C2STrialCopyRank();
        NetMgr.I.sendMessage(ProtoId.C2STrialCopyRank_ID, req);
    }
    // 返回 获取排行榜
    private _onS2CTrialCopyRank(data: S2CTrialCopyRank): void {
        if (!data.Tag) {
            ModelMgr.I.FamilyModel.initTrialRankInfo(data);
        }
    }

    public linkOpen(tab?: number, params?: any[], ...args: any[]): boolean {
        // params  0  1  2 3 对应配置表的 param1 param2 param3 param4
        WinMgr.I.open(ViewConst.FamilyWin, tab, params, args);
        return true;
    }
}

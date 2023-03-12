/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: dcj
 * @Date: 2022-08-25 18:54:41
 * @FilePath: \SanGuo\assets\script\game\module\worldBoss\WorldBossController.ts
 * @Description:
 */
import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { E } from '../../const/EventName';
import { FuncId } from '../../const/FuncConst';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';
import { bossTabDataArr } from '../boss/BossConst';
import { FuBenMgr } from '../fuben/FuBenMgr';
import { WorldBossRPType } from './WorldBossConst';

const { ccclass, property } = cc._decorator;

/** 测试 */
const TEST = false;
@ccclass('WorldBossController')
export class WorldBossController extends BaseController {
    /**
     * 打开界面
     * @param tab 页签id
     * @param params 配置表的参数列表
     * @param args 可变参，手动传入的参数
     * @returns
     */
    public linkOpen(tab: number = 0, params: any[] = [0], ...args: any[]): boolean {
        let funcId: number = FuncId.WorldBoss;
        if (tab) {
            const index = bossTabDataArr.findIndex((v) => v.TabId === tab);
            if (index >= 0) {
                funcId = bossTabDataArr[index].funcId;
            }
        }
        if (UtilFunOpen.isOpen(funcId, true)) {
            WinMgr.I.open(ViewConst.BossWin, tab, params ? params[0] : 0);
        }
        return true;
    }

    /** 监听网络事件 子类实现 */
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2COpenWorldBossUI_ID, this.onS2COpenWorldBossUI, this);
        EventProto.I.on(ProtoId.S2CEnterWorldBoss_ID, this.onS2CEnterWorldBoss, this);
        EventProto.I.on(ProtoId.S2CGetWorldBossRank_ID, this.onS2CGetWorldBossRank, this);
        EventProto.I.on(ProtoId.S2CChallengeWorldBossPVE_ID, this.onS2CChallengeWorldBossPVE, this);
        EventProto.I.on(ProtoId.S2CChallengeWorldBossPVP_ID, this.onS2CChallengeWorldBossPVP, this);
        EventProto.I.on(ProtoId.S2CWorldBossBuyBuff_ID, this.onS2CWorldBossBuyBuff, this);
        EventProto.I.on(ProtoId.S2CWorldBossRandomDice_ID, this.onS2CWorldBossRandomDice, this);
        EventProto.I.on(ProtoId.S2CExitWorldBoss_ID, this.onS2CExitWorldBoss, this);
        EventProto.I.on(ProtoId.S2CWorldBossShieldNotice_ID, this.onS2CWorldBossShieldNotice, this);
        EventProto.I.on(ProtoId.S2CWorldBossCurMaxDiceNumNotice_ID, this.onS2CWorldBossCurMaxDiceNumNotice, this);
        EventProto.I.on(ProtoId.S2CWorldBossShieldOpenNotice_ID, this.onS2CWorldBossShieldOpenNotice, this);
        EventProto.I.on(ProtoId.S2CWorldBossRandomDiceOpenNotice_ID, this.onS2CWorldBossRandomDiceOpenNotice, this);
    }

    /** 移除网络事件 子类实现 */
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2COpenWorldBossUI_ID, this.onS2COpenWorldBossUI, this);
        EventProto.I.off(ProtoId.S2CEnterWorldBoss_ID, this.onS2CEnterWorldBoss, this);
        EventProto.I.off(ProtoId.S2CGetWorldBossRank_ID, this.onS2CGetWorldBossRank, this);
        EventProto.I.off(ProtoId.S2CChallengeWorldBossPVE_ID, this.onS2CChallengeWorldBossPVE, this);
        EventProto.I.off(ProtoId.S2CChallengeWorldBossPVP_ID, this.onS2CChallengeWorldBossPVP, this);
        EventProto.I.off(ProtoId.S2CWorldBossBuyBuff_ID, this.onS2CWorldBossBuyBuff, this);
        EventProto.I.off(ProtoId.S2CWorldBossRandomDice_ID, this.onS2CWorldBossRandomDice, this);
        EventProto.I.off(ProtoId.S2CExitWorldBoss_ID, this.onS2CExitWorldBoss, this);
        EventProto.I.off(ProtoId.S2CWorldBossShieldNotice_ID, this.onS2CWorldBossShieldNotice, this);
        EventProto.I.off(ProtoId.S2CWorldBossCurMaxDiceNumNotice_ID, this.onS2CWorldBossCurMaxDiceNumNotice, this);
        EventProto.I.off(ProtoId.S2CWorldBossShieldOpenNotice_ID, this.onS2CWorldBossShieldOpenNotice, this);
        EventProto.I.off(ProtoId.S2CWorldBossRandomDiceOpenNotice_ID, this.onS2CWorldBossRandomDiceOpenNotice, this);
    }
    public onGameStart(): void {
        this.C2SOpenWorldBossUI();
    }

    /** 监听业务事件 子类实现 */
    public addClientEvent(): void {
        EventClient.I.on(E.Game.Start, this.onGameStart, this);
    }

    /** 移除网络事件 子类实现 */
    public delClientEvent(): void {
        EventClient.I.off(E.Game.Start, this.onGameStart, this);
    }

    /** 清理数据 */
    public clearAll(): void {
        //
    }

    public init(): void {
        //
    }

    /** 打开世界boss主ui */
    public C2SOpenWorldBossUI(): void {
        NetMgr.I.sendMessage(ProtoId.C2SOpenWorldBossUI_ID);
    }

    /** 打开世界boss主ui 返回 */
    private onS2COpenWorldBossUI(d: S2COpenWorldBossUI): void {
        if (!d.Tag) {
            ModelMgr.I.WorldBossModel.setBaseData(d);
        }
    }

    /** 进入世界boss */
    public C2SEnterWorldBoss(): void {
        NetMgr.I.sendMessage(ProtoId.C2SEnterWorldBoss_ID);
        if (TEST) {
            this.onS2CEnterWorldBoss(new S2CEnterWorldBoss({ Tag: 0 }));
        }
    }

    /** 进入世界boss 返回 */
    private onS2CEnterWorldBoss(d: S2CEnterWorldBoss): void {
        if (!d.Tag) {
            ModelMgr.I.WorldBossModel.setBossData(d);
            // 主界面默认打开个人积分，先取100个排行数据
            this.C2SGetWorldBossRank(WorldBossRPType.RpSelf, 1, 100);
        }
        FuBenMgr.I.enterResult(!d.Tag);
    }

    /** 获取世界boss排行榜数据 */
    public C2SGetWorldBossRank(_type: WorldBossRPType, start: number, end: number): void {
        if (!ModelMgr.I.WorldBossModel.isWorldBossOpen()) {
            return;
        }
        const d: C2SGetWorldBossRank = { RankType: _type, Start: start, End: end };
        NetMgr.I.sendMessage(ProtoId.C2SGetWorldBossRank_ID, d);
    }

    /** 获取世界boss排行榜数据返回 */
    private onS2CGetWorldBossRank(d: S2CGetWorldBossRank): void {
        if (!d.Tag) {
            ModelMgr.I.WorldBossModel.setRankData(d);
        }
    }

    /** 挑战世界boss(PVE) */
    public C2SChallengeWorldBossPVE(): void {
        if (!ModelMgr.I.WorldBossModel.isWorldBossOpen()) {
            return;
        }
        NetMgr.I.sendMessage(ProtoId.C2SChallengeWorldBossPVE_ID);
    }

    /** 挑战世界boss(PVE)返回 */
    private onS2CChallengeWorldBossPVE(d: S2CChallengeWorldBossPVE): void {
        if (!d.Tag) {
            ModelMgr.I.WorldBossModel.setFightResultPVE(d);
        }
    }

    /** 挑战世界boss(PVP) */
    public C2SChallengeWorldBossPVP(userId: number): void {
        if (!ModelMgr.I.WorldBossModel.isWorldBossOpen()) {
            return;
        }
        const d = new C2SChallengeWorldBossPVP();
        d.TargetId = userId;
        NetMgr.I.sendMessage(ProtoId.C2SChallengeWorldBossPVP_ID, d);
    }
    /** 挑战世界boss(PVP)返回 */
    private onS2CChallengeWorldBossPVP(d: S2CChallengeWorldBossPVP): void {
        if (!d.Tag) {
            ModelMgr.I.WorldBossModel.setFightResultPVP(d);
        }
    }

    /** 世界boss购买鼓舞 */
    public C2SWorldBossBuyBuff(): void {
        NetMgr.I.sendMessage(ProtoId.C2SWorldBossBuyBuff_ID);
    }

    /** 世界boss购买鼓舞返回 */
    private onS2CWorldBossBuyBuff(d: S2CWorldBossBuyBuff): void {
        if (!d.Tag) {
            // int32 BuyBuffTimes = 2; //已购买buff次数
            ModelMgr.I.WorldBossModel.buffNum = d.BuyBuffTimes;
            EventClient.I.emit(E.WorldBoss.UpdateInspireWin);
        }
    }

    /** 世界boss拼点 */
    public C2SWorldBossRandomDice(): void {
        NetMgr.I.sendMessage(ProtoId.C2SWorldBossRandomDice_ID);
        if (TEST) {
            this.onS2CWorldBossRandomDice({ Tag: 0, Points: 51 });
        }
    }

    /** 世界boss拼点返回 */
    private onS2CWorldBossRandomDice(d: S2CWorldBossRandomDice): void {
        if (!d.Tag) {
            ModelMgr.I.WorldBossModel.rollResult(d);
        }
    }

    private onS2CWorldBossShieldNotice(d: S2CWorldBossShieldNotice): void {
        if (!d.Tag) {
            ModelMgr.I.WorldBossModel.updateShield(d.AreaShieldNum, d.AreaShieldBreakEndTime);
        }
    }

    /** 退出世界boss */
    public C2SExitWorldBoss(): void {
        NetMgr.I.sendMessage(ProtoId.C2SExitWorldBoss_ID);
        if (TEST) {
            this.onS2CExitWorldBoss(new S2CExitWorldBoss({}));
        }
    }

    /** 退出世界boss返回 */
    private onS2CExitWorldBoss(d: S2CExitWorldBoss): void {
        ModelMgr.I.WorldBossModel.exitResult();
    }

    private onS2CWorldBossCurMaxDiceNumNotice(d: S2CWorldBossCurMaxDiceNumNotice) {
        if (!d.Tag) {
            ModelMgr.I.WorldBossModel.rollTopResult(d);
        }
    }

    private onS2CWorldBossShieldOpenNotice(d: S2CWorldBossShieldOpenNotice) {
        if (!d.Tag) {
            ModelMgr.I.WorldBossModel.updateShieldShowStatus(d);
        }
    }

    private onS2CWorldBossRandomDiceOpenNotice(d: S2CWorldBossRandomDiceOpenNotice) {
        if (!d.Tag) {
            ModelMgr.I.WorldBossModel.updateRollShowStatus(d);
        }
    }
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2022-06-20 18:46:07
 * @FilePath: \SanGuo2.4\assets\script\game\module\boss\BossController.ts
 * @Description: 重置次数gm:resetalltimes,设置属性gm:setattr@560@15
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
import {
    BossPageTabs, BossPageType, bossTabDataArr, WorldBossPageTabs,
} from './BossConst';

const { ccclass } = cc._decorator;
@ccclass('BossController')
export default class BossController extends BaseController {
    /** 网络监听 */
    public addNetEvent(): void {
        // 个人首领
        EventProto.I.on(ProtoId.S2CBossPersonalInfo_ID, this.onS2CPersonalList, this);
        EventProto.I.on(ProtoId.S2CBossPersonalFight_ID, this.onS2CPersonalFight, this);
        EventProto.I.on(ProtoId.S2CBossPersonalSweep_ID, this.onS2CPersonalSweep, this);
        // 至尊首领
        EventProto.I.on(ProtoId.S2CBossVipInfo_ID, this.onS2CVipList, this);
        EventProto.I.on(ProtoId.S2CBossVipFight_ID, this.onS2CVipFight, this);
        EventProto.I.on(ProtoId.S2CBossVipSweep_ID, this.onS2CVipSweep, this);
        // 多人首领
        EventProto.I.on(ProtoId.S2CGetMultiBossData_ID, this.onS2CGetMultiBossData, this);
        EventProto.I.on(ProtoId.S2CMultiBossFight_ID, this.onS2CMultiBossFight, this);
        EventProto.I.on(ProtoId.S2CMultiBossInspire_ID, this.onS2CMultiBossInspire, this);
        EventProto.I.on(ProtoId.S2CMultiBossBuyTimes_ID, this.onS2CMultiBossBuyTimes, this);
        EventProto.I.on(ProtoId.S2CMultiBossGetRankData_ID, this.onS2CMultiBossGetRankData, this);
        EventProto.I.on(ProtoId.S2CMultiBossGetPlayerData_ID, this.onS2CMultiBossGetPlayerData, this);
        EventProto.I.on(ProtoId.S2CMultiBossGetReliveList_ID, this.onS2CMultiBossGetReliveList, this);
        EventProto.I.on(ProtoId.S2CMultiBossUpdateState_ID, this.onS2CBossUpdateState, this);
    }
    public delNetEvent(): void {
        // 个人首领
        EventProto.I.off(ProtoId.S2CBossPersonalInfo_ID, this.onS2CPersonalList, this);
        EventProto.I.off(ProtoId.S2CBossPersonalFight_ID, this.onS2CPersonalFight, this);
        EventProto.I.off(ProtoId.S2CBossPersonalSweep_ID, this.onS2CPersonalSweep, this);
        // 至尊首领
        EventProto.I.off(ProtoId.S2CBossVipInfo_ID, this.onS2CVipList, this);
        EventProto.I.off(ProtoId.S2CBossVipFight_ID, this.onS2CVipFight, this);
        EventProto.I.off(ProtoId.S2CBossVipSweep_ID, this.onS2CVipSweep, this);
        // 多人首领
        EventProto.I.off(ProtoId.S2CGetMultiBossData_ID, this.onS2CGetMultiBossData, this);
        EventProto.I.off(ProtoId.S2CMultiBossFight_ID, this.onS2CMultiBossFight, this);
        EventProto.I.off(ProtoId.S2CMultiBossInspire_ID, this.onS2CMultiBossInspire, this);
        EventProto.I.off(ProtoId.S2CMultiBossBuyTimes_ID, this.onS2CMultiBossBuyTimes, this);
        EventProto.I.off(ProtoId.S2CMultiBossGetRankData_ID, this.onS2CMultiBossGetRankData, this);
        EventProto.I.off(ProtoId.S2CMultiBossGetPlayerData_ID, this.onS2CMultiBossGetPlayerData, this);
        EventProto.I.off(ProtoId.S2CMultiBossGetReliveList_ID, this.onS2CMultiBossGetReliveList, this);
        EventProto.I.off(ProtoId.S2CMultiBossUpdateState_ID, this.onS2CBossUpdateState, this);
    }

    public addClientEvent(): void {
        //
    }
    public delClientEvent(): void {
        //
    }
    public clearAll(): void {
        //
    }

    /**
     * 打开界面
     * @param tab 页签id
     * @param params 配置表的参数列表
     * @param args 可变参，手动传入的参数
     * @returns
     */
    public linkOpen(tab?: number, params?: any[], ...args: any[]): boolean {
        let funcId: number = FuncId.BossPersonal;
        if (tab) {
            const index = bossTabDataArr.findIndex((v) => v.TabId === tab);
            if (index >= 0) {
                switch (index) {
                    case BossPageType.Local:
                        if (typeof args[1] === 'number') {
                            funcId = BossPageTabs[args[1]].funcId;
                        }
                        break;
                    case BossPageType.Cross:
                        if (typeof args[1] === 'number') {
                            funcId = WorldBossPageTabs[args[1]].funcId;
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        if (UtilFunOpen.isOpen(funcId, true)) {
            WinMgr.I.open(ViewConst.BossWin, tab, params ? params[0] : 0);
        }

        return true;
    }

    /* ----------------------------------------个人首领----------------------------------- */
    /** 请求个人首领列表 */
    public reqC2SPersonalInfo(): void {
        NetMgr.I.sendMessage(ProtoId.C2SBossPersonalInfo_ID, {});
        // console.log('请求个人首领列表:');
    }

    /** 进入战斗 */
    public reqC2SPersonalFight(id: number): void {
        NetMgr.I.sendMessage(ProtoId.C2SBossPersonalFight_ID, { Id: id });
        // console.log('请求个人首领进入战斗:', id);
    }

    /** 扫荡 */
    public reqC2SPersonalSweep(): void {
        NetMgr.I.sendMessage(ProtoId.C2SBossPersonalSweep_ID, {});
        // console.log('请求个人首领一键扫荡:');
    }

    /** 个人首领列表 */
    private onS2CPersonalList(data: S2CBossPersonalInfo): void {
        // console.log('+个人首领列表:', data);
        if (data) {
            ModelMgr.I.BossModel.setPersonal(data.Infos);
        }
    }
    /** 进战斗 */
    private onS2CPersonalFight(data: S2CBossPersonalFight): void {
        // console.log('+进战斗:', data);
        if (data && data.Tag === 0) {
            ModelMgr.I.BossModel.uptPersonal(data.Id, data.LeftTimes);
            // if (data.Ret === 2) {
            //     WinMgr.I.open(ViewConst.BattleVictory, ModelMgr.I.BossModel.award);
            // } else if (data.Ret === 1) {
            //     WinMgr.I.open(ViewConst.BattleFail, 0);
            // }
        }
    }
    /** 扫荡 */
    private onS2CPersonalSweep(data: S2CBossPersonalSweep): void {
        // console.log('+扫荡:', data);
        if (data && data.Tag === 0) {
            for (let i = 0; i < data.Infos.length; i++) {
                ModelMgr.I.BossModel.uptPersonal(data.Infos[i].Id, data.Infos[i].LeftTimes);
            }
        }
    }

    /* ----------------------------------------至尊首领----------------------------------- */
    /** 请求至尊首领列表 */
    public reqC2SVipInfo(): void {
        NetMgr.I.sendMessage(ProtoId.C2SBossVipInfo_ID, {});
        // console.log('请求至尊首领列表:');
    }

    /** 进入战斗 */
    public reqC2SVipFight(id: number): void {
        NetMgr.I.sendMessage(ProtoId.C2SBossVipFight_ID, { Id: id });
        // console.log('请求至尊首领进入战斗:', id);
    }

    /** 扫荡 */
    public reqC2SVipSweep(): void {
        NetMgr.I.sendMessage(ProtoId.C2SBossVipSweep_ID, {});
        // console.log('请求至尊首领一键扫荡:');
    }

    /** 至尊首领列表 */
    private onS2CVipList(data: S2CBossVipInfo): void {
        // console.log('+至尊首领列表:', data);
        if (data) {
            ModelMgr.I.BossModel.setVip(data.Infos);
        }
    }
    /** 进战斗 */
    private onS2CVipFight(data: S2CBossVipFight): void {
        // console.log('至尊进战斗:', data);
        if (data && data.Tag === 0) {
            ModelMgr.I.BossModel.uptVip(data.Id, data.LeftTimes);
            // if (data.Ret === 2) {
            //     WinMgr.I.open(ViewConst.BattleVictory, ModelMgr.I.BossModel.award);
            // } else if (data.Ret === 1) {
            //     WinMgr.I.open(ViewConst.BattleFail, 0);
            // }
        }
    }
    /** 扫荡 */
    private onS2CVipSweep(data: S2CBossVipSweep): void {
        // console.log('至尊扫荡:', data);
        if (data && data.Tag === 0) {
            for (let i = 0; i < data.Infos.length; i++) {
                ModelMgr.I.BossModel.uptVip(data.Infos[i].Id, data.Infos[i].LeftTimes);
            }
        }
    }

    /** ********************多人boss******************** */
    public reqMiltBossTip(): void {
        const d = {};
        NetMgr.I.sendMessage(ProtoId.C2SMultiBossGetBossList_ID, d);
    }
    /** get 多人boss */
    public reqGetMultiBossData(Id: number): void {
        const d: C2SGetMultiBossData = {
            Id,
        };
        NetMgr.I.sendMessage(ProtoId.C2SGetMultiBossData_ID, d);
    }

    /** 多人boss获得玩家数据 */
    public reqC2SMultiBossGetPlayerData(): void {
        NetMgr.I.sendMessage(ProtoId.C2SMultiBossGetPlayerData_ID, {});
    }

    /** 多人boss挑战 */
    public reqC2SMultiBossFight(Id: number): void {
        NetMgr.I.sendMessage(ProtoId.C2SMultiBossFight_ID, { Id });
    }

    /** 多人boss鼓舞 */
    public reqC2SMultiBossInspire(): void {
        NetMgr.I.sendMessage(ProtoId.C2SMultiBossInspire_ID, {});
    }

    /** 多人boss购买挑战次数 */
    public reqC2SMultiBossBuyTimes(): void {
        NetMgr.I.sendMessage(ProtoId.C2SMultiBossBuyTimes_ID, {});
    }

    /** 多人boss获得排行榜数据 */
    public reqC2SMultiBossGetRankData(Id: number, Type: number): void {
        NetMgr.I.sendMessage(ProtoId.C2SMultiBossGetRankData_ID, { Id, Type });
    }

    /** 多人boss获得Boss数据 */
    public reqC2SGetMultiBossData(Id: number): void {
        NetMgr.I.sendMessage(ProtoId.C2SGetMultiBossData_ID, { Id });
    }

    /** 多人boss关注 */
    public reqC2SMultiBossFocus(Id: number): void {
        NetMgr.I.sendMessage(ProtoId.C2SMultiBossFocus_ID, { Id });
    }

    /** 多人boss列表 */
    public reqC2SMultiBossGetReliveList(): void {
        NetMgr.I.sendMessage(ProtoId.C2SMultiBossGetReliveList_ID, {});
    }

    public reqC2SMultiBossRelive(Id: number): void {
        NetMgr.I.sendMessage(ProtoId.C2SMultiBossRelive_ID, { Id }); //
    }

    /** 多人boss获得Boss数据 */
    private onS2CGetMultiBossData(d: S2CGetMultiBossData): void {
        if (d) {
            // console.log('多人boss数据', d);
            ModelMgr.I.BossModel.SetMulitBossData(d);
        }
    }

    /** 多人boss战斗 */
    private onS2CMultiBossFight(d: S2CMultiBossFight): void {
        if (d && d.Tag === 0) {
            ModelMgr.I.BossModel.setFightRank(d.Id, d.Ranks);
            // console.log('S2CMultiBossFight', d);
        }
    }

    /** 多人bos鼓舞 */
    private onS2CMultiBossInspire(d: S2CMultiBossInspire): void {
        if (d && d.Tag === 0) {
            ModelMgr.I.BossModel.setInspire(d);
            // console.log('S2CMultiBossInspire', d);
        }
    }

    /** 多人boss购买挑战次数 */
    private onS2CMultiBossBuyTimes(d: S2CMultiBossBuyTimes): void {
        if (d && d.Tag === 0) {
            EventClient.I.emit(E.Boss.MultiBossBuyChage, true);
            // console.log('S2CMultiBossBuyTimes', d);
        }
    }

    /** 多人boss排行榜 */
    private onS2CMultiBossGetRankData(d: S2CMultiBossGetRankData): void {
        if (d && d.Tag === 0) {
            // console.log(d.Items, typeof d.Items);
            EventClient.I.emit(E.Boss.MultiBossRank, d);
        }
    }

    /** 多人boss获得玩家数据 */
    private onS2CMultiBossGetPlayerData(d: S2CMultiBossGetPlayerData): void {
        if (d) {
            ModelMgr.I.BossModel.SetMulitBossPlayData(d);
            // console.log('S2CMultiBossGetPlayerData', d);
        }
    }

    private onS2CMultiBossGetReliveList(d: S2CMultiBossGetReliveList): void {
        if (d) {
            EventClient.I.emit(E.Boss.MultiBossReliveList, d);
            // console.log('S2CMultiBossGetReliveList', d);
        }
    }

    private onS2CBossUpdateState(d: S2CMultiBossUpdateState): void {
        if (d) {
            EventClient.I.emit(E.Boss.BossUpdateState, d);
        }
    }
}

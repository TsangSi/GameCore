/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2023-01-14 18:48:11
 * @FilePath: \SanGuo2.4\assets\script\game\module\escort\EscortController.ts
 * @Description:
 *
 */

import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { FuncId } from '../../const/FuncConst';
import { ViewConst } from '../../const/ViewConst';
import NetMgr from '../../manager/NetMgr';
import ModelMgr from '../../manager/ModelMgr';
import { EventClient } from '../../../app/base/event/EventClient';
import { E } from '../../const/EventName';
import { DailyTabDataArr } from '../daily/DailyConst';

const { ccclass } = cc._decorator;
@ccclass('EscortController')
export default class EscortController extends BaseController {
    /** 网络监听 */
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2COpenEscortUI_ID, this.onS2COpenEscortUI, this);
        EventProto.I.on(ProtoId.S2CEscortRefreshUIData_ID, this.onS2CEscortRefreshUIData, this);
        EventProto.I.on(ProtoId.S2CEscortRefreshCar_ID, this.onS2CEscortRefreshCar, this);
        EventProto.I.on(ProtoId.S2CEscortCarStart_ID, this.onS2CEscortCarStart, this);
        EventProto.I.on(ProtoId.S2CEscortQuickFinish_ID, this.onS2CEscortQuickFinish, this);
        EventProto.I.on(ProtoId.S2CEscortGetFinishReward_ID, this.onS2CEscortGetFinishReward, this);
        EventProto.I.on(ProtoId.S2CEscortGetCarData_ID, this.onS2CEscortGetCarData, this);
        EventProto.I.on(ProtoId.S2CEscortCarRob_ID, this.onS2CEscortCarRob, this);
        EventProto.I.on(ProtoId.S2CEscortOpenRobLog_ID, this.onS2CEscortOpenRobLog, this);
        EventProto.I.on(ProtoId.S2CEscortRevenge_ID, this.onS2CEscortRevenge, this);
        EventProto.I.on(ProtoId.S2CEscortCarRobNotice_ID, this.onS2CEscortCarRobNotice, this);
        EventProto.I.on(ProtoId.S2CEscortFinishRewardNotice_ID, this.onS2CEscortFinishRewardNotice, this);
    }
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2COpenEscortUI_ID, this.onS2COpenEscortUI, this);
        EventProto.I.off(ProtoId.S2CEscortRefreshUIData_ID, this.onS2CEscortRefreshUIData, this);
        EventProto.I.off(ProtoId.S2CEscortRefreshCar_ID, this.onS2CEscortRefreshCar, this);
        EventProto.I.off(ProtoId.S2CEscortCarStart_ID, this.onS2CEscortCarStart, this);
        EventProto.I.off(ProtoId.S2CEscortQuickFinish_ID, this.onS2CEscortQuickFinish, this);
        EventProto.I.off(ProtoId.S2CEscortGetFinishReward_ID, this.onS2CEscortGetFinishReward, this);
        EventProto.I.off(ProtoId.S2CEscortGetCarData_ID, this.onS2CEscortGetCarData, this);
        EventProto.I.off(ProtoId.S2CEscortCarRob_ID, this.onS2CEscortCarRob, this);
        EventProto.I.off(ProtoId.S2CEscortOpenRobLog_ID, this.onS2CEscortOpenRobLog, this);
        EventProto.I.off(ProtoId.S2CEscortRevenge_ID, this.onS2CEscortRevenge, this);
        EventProto.I.off(ProtoId.S2CEscortCarRobNotice_ID, this.onS2CEscortCarRobNotice, this);
        EventProto.I.off(ProtoId.S2CEscortFinishRewardNotice_ID, this.onS2CEscortFinishRewardNotice, this);
    }

    /** 事件监听 */
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
    public linkOpen(tab: number = 0, params: any[] = [0], ...args: any[]): boolean {
        const funcId = FuncId.Escort;
        if (UtilFunOpen.isOpen(funcId, true)) {
            const index = DailyTabDataArr.findIndex((v) => v.funcId === funcId);
            if (index >= 0) {
                tab = index;
            }
            WinMgr.I.open(ViewConst.DailyWin, tab, params ? params[0] : 0);
        }
        return true;
    }

    /** 打开主界面 */
    public reqOpenEscortUI(): void {
        const d: C2SOpenEscortUI = {
        };
        NetMgr.I.sendMessage(ProtoId.C2SOpenEscortUI_ID, d);
    }

    private onS2COpenEscortUI(d: S2COpenEscortUI) {
        // console.log('主界面:', d);
        if (d) {
            ModelMgr.I.EscortModel.setEscort(d);
        }
    }

    /** 定时刷新的镖车 */
    public reqEscortRefreshUIData(): void {
        const UserIds: number[] = [];
        const carDatas = ModelMgr.I.EscortModel.getAllCarData();
        for (const i in carDatas) {
            UserIds.push(carDatas[i].UserId);
        }

        const d: C2SEscortRefreshUIData = {
            UserIds,
        };
        NetMgr.I.sendMessage(ProtoId.C2SEscortRefreshUIData_ID, d);
    }

    private onS2CEscortRefreshUIData(d: S2CEscortRefreshUIData) {
        // console.log('定时刷新的镖车:', d);
        if (d && d.Tag === 0) {
            ModelMgr.I.EscortModel.refreshEscort(d.CarData);
        }
    }

    /** 刷新镖车 刷新类型 1=元宝 2=玉璧 */
    public reqEscortRefreshCar(Refresh: number): void {
        const d: C2SEscortRefreshCar = {
            Refresh,
        };
        NetMgr.I.sendMessage(ProtoId.C2SEscortRefreshCar_ID, d);
    }
    private onS2CEscortRefreshCar(d: S2CEscortRefreshCar) {
        // console.log('刷新镖车:', d);
        if (d && d.Tag === 0) {
            ModelMgr.I.EscortModel.refreshQuality(d.QualityId);
        }
    }

    /**
     * 开始押送
     * @param UseAmulet 是否使用护送令
     * @param AutoBuy 是否自动购买
     */
    public reqEscortCarStart(UseAmulet: number, AutoBuy: number): void {
        const d: C2SEscortCarStart = {
            UseAmulet,
            AutoBuy,
        };
        NetMgr.I.sendMessage(ProtoId.C2SEscortCarStart_ID, d);
    }
    private onS2CEscortCarStart(d: S2CEscortCarStart) {
        // console.log('押送返回:', d);
        if (d && d.Tag === 0) {
            ModelMgr.I.EscortModel.refreshEscortStart(d);
        }
    }

    /** 快速完成 */
    public reqEscortQuickFinish(): void {
        const d: C2SEscortQuickFinish = {
        };
        NetMgr.I.sendMessage(ProtoId.C2SEscortQuickFinish_ID, d);
    }
    private onS2CEscortQuickFinish(d: S2CEscortQuickFinish) {
        // console.log('快速完成返回:', d);
        if (d && d.Tag === 0) {
            ModelMgr.I.EscortModel.refreshQuick(d.CarData);
        }
    }

    /** 领取奖励 */
    public reqEscortGetFinishReward(): void {
        const d: C2SEscortGetFinishReward = {
        };
        NetMgr.I.sendMessage(ProtoId.C2SEscortGetFinishReward_ID, d);
    }
    private onS2CEscortGetFinishReward(d: S2CEscortGetFinishReward) {
        // console.log('领取奖励返回:', d);
        if (d && d.Tag === 0) {
            ModelMgr.I.EscortModel.getFinishReward(d.CarData);
        }
    }

    /** 打开拦截界面 */
    public reqEscortGetCarData(UserIds: number[]): void {
        const d: C2SEscortGetCarData = {
            UserIds,
        };
        NetMgr.I.sendMessage(ProtoId.C2SEscortGetCarData_ID, d);
    }
    private onS2CEscortGetCarData(d: S2CEscortGetCarData) {
        // console.log('拦截界面返回:', d);
        if (d && d.Tag === 0) {
            ModelMgr.I.EscortModel.refreshRobUI(d.CarData);
        }
    }

    /** 拦截 */
    public reqEscortCarRob(UserId: number): void {
        const d: C2SEscortCarRob = {
            UserId,
        };
        NetMgr.I.sendMessage(ProtoId.C2SEscortCarRob_ID, d);
    }
    private onS2CEscortCarRob(d: S2CEscortCarRob) {
        // console.log('拦截返回:', d);
        if (d && d.Tag === 0) {
            ModelMgr.I.EscortModel.refreshRob(d.CarData);
        }
    }

    /** 打开被劫界面 */
    public reqEscortOpenRobLog(): void {
        const d: C2SEscortOpenRobLog = {
        };
        NetMgr.I.sendMessage(ProtoId.C2SEscortOpenRobLog_ID, d);
    }
    private onS2CEscortOpenRobLog(d: S2CEscortOpenRobLog) {
        // console.log('被劫界面返回:', d);
        if (d && d.Tag === 0) {
            ModelMgr.I.EscortModel.refreshRobbedLog(d.RobLog);
        }
    }

    /** 复仇 */
    public reqEscortRevenge(UserId: number, RobTime: number): void {
        const d: C2SEscortRevenge = {
            UserId,
            RobTime,
        };
        NetMgr.I.sendMessage(ProtoId.C2SEscortRevenge_ID, d);
    }
    private onS2CEscortRevenge(d: S2CEscortRevenge) {
        // console.log('复仇返回:', d);
        if (d && d.Tag === 0) {
            ModelMgr.I.EscortModel.refreshRobbedLog(d.RobLog);
        }
    }

    /** 被劫的通知 */
    private onS2CEscortCarRobNotice(d: S2CEscortCarRobNotice) {
        // console.log('被劫的通知:');
        if (d && d.Tag === 0) {
            ModelMgr.I.EscortModel.robbedNotice = true;
            EventClient.I.emit(E.Escort.EasyRobbed);
        }
    }

    /** 有奖励可领的通知 */
    private onS2CEscortFinishRewardNotice(d: S2CEscortFinishRewardNotice) {
        // console.log('有奖励可领的通知:');
        if (d && d.Tag === 0) {
            ModelMgr.I.EscortModel.rewardNotice = true;
            EventClient.I.emit(E.Escort.EasyReward);
        }
    }
}

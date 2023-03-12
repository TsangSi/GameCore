/*
 * @Author: myl
 * @Date: 2023-02-07 15:14:59
 * @Description:
 */

import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { E } from '../../const/EventName';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';
import { ResRecoveryType } from './DailyTaskConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class DailyTaskController extends BaseController {
    public addNetEvent(): void {
        // C2SDailyTaskInfo_ID=1234,
        // S2CDailyTaskInfo_ID=1235,
        // C2SDailyTaskReward_ID=1236,
        // S2CDailyTaskReward_ID=1237,
        // C2SDailyStageReward_ID=1238,
        // S2CDailyStageReward_ID=1239,
        // C2SResRecovered_ID=1240,
        // S2CResRecovered_ID=1241,
        // C2SResRecoveredInfo_ID=1246,
        // S2CResRecoveredInfo_ID=1245,
        // C2SAllResRecovered_ID=1249,
        // S2CAllResRecovered_ID=1250,
        /** 任务详细信息 */
        EventProto.I.on(ProtoId.S2CDailyTaskInfo_ID, this.onS2CDailyTaskInfo, this);
        /** 任务奖励领取 */
        EventProto.I.on(ProtoId.S2CDailyTaskReward_ID, this.onS2CDailyTaskReward, this);
        /** 阶段奖励领取 */
        EventProto.I.on(ProtoId.S2CDailyStageReward_ID, this.onS2CDailyStageReward, this);
        /** 找回领取 */
        EventProto.I.on(ProtoId.S2CResRecovered_ID, this.onS2CResRecovered, this);
        /** 找回列表 */
        EventProto.I.on(ProtoId.S2CResRecoveredInfo_ID, this.onS2CResRecoveredInfo, this);
        /** 一键领取找回奖励 */
        EventProto.I.on(ProtoId.S2CAllResRecovered_ID, this.onS2CAllResRecovered, this);
    }
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CDailyTaskInfo_ID, this.onS2CDailyTaskInfo, this);
        EventProto.I.off(ProtoId.S2CDailyTaskReward_ID, this.onS2CDailyTaskReward, this);
        EventProto.I.off(ProtoId.S2CDailyStageReward_ID, this.onS2CDailyStageReward, this);
        EventProto.I.off(ProtoId.S2CResRecovered_ID, this.onS2CResRecovered, this);
        EventProto.I.off(ProtoId.S2CResRecoveredInfo_ID, this.onS2CResRecoveredInfo, this);
        EventProto.I.off(ProtoId.S2CAllResRecovered_ID, this.onS2CAllResRecovered, this);
    }
    public addClientEvent(): void {
        EventClient.I.on(E.Game.Start, this.updateFuncData, this);
    }

    private updateFuncData() {
        this.getResList(ResRecoveryType.Func);
    }

    public delClientEvent(): void {
        EventClient.I.off(E.Game.Start, this.updateFuncData, this);
    }
    public clearAll(): void {
        //
    }

    /** 一键领取奖励返回 */
    private onS2CAllResRecovered(d: S2CAllResRecovered): void {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (d.Tag === 0) {
            EventClient.I.emit(E.DailyTask.ResReward);
        }
    }

    /** 返回任务信息 包含了阶段信息 */
    private onS2CDailyTaskInfo(d: S2CDailyTaskInfo): void {
        if (d.Tag === 0) {
            ModelMgr.I.DailyTaskModel.updateTaskData(d);
        }
    }

    /** 每日周任务领取返回 */
    private onS2CDailyTaskReward(d: S2CDailyTaskReward): void {
        if (d.Tag === 0) {
            /** 发送事件更新界面信息 */
            EventClient.I.emit(E.DailyTask.Data);
        }
    }

    /** 资源找回列表 */
    private onS2CResRecoveredInfo(d: S2CResRecoveredInfo): void {
        if (d.Tag === 0) {
            ModelMgr.I.DailyTaskModel.setResData(d);
        }
    }

    /** 领取阶段奖励 */
    private onS2CDailyStageReward(d: S2CDailyStageReward): void {
        if (d.Tag === 0) {
            EventClient.I.emit(E.DailyTask.StageReward);
        }
    }

    /** 领取找回奖励返回 */
    private onS2CResRecovered(d: S2CDailyTaskInfo): void {
        if (d.Tag === 0) {
            EventClient.I.emit(E.DailyTask.ResReward);
        }
    }

    /** 请求获取活跃度信息 */
    public getDailyWeeklyTaskInfo(type: number): void {
        const d: C2SDailyTaskInfo = {
            DailyType: type,
        };

        NetMgr.I.sendMessage(ProtoId.C2SDailyTaskInfo_ID, d);
    }

    /** 请求领取任务奖励 */
    public getDailyWeeklyTaskReward(taskId: number): void {
        const d: C2SDailyTaskReward = {
            TaskId: taskId,
        };

        NetMgr.I.sendMessage(ProtoId.C2SDailyTaskReward_ID, d);
    }

    /** 领取阶段奖励 */
    public getStageReward(id: number): void {
        const d: C2SDailyStageReward = {
            Id: id,
        };

        NetMgr.I.sendMessage(ProtoId.C2SDailyStageReward_ID, d);
    }

    /** 请求资源找回列表 */
    public getResList(type: ResRecoveryType): void {
        const d: C2SResRecoveredInfo = {
            RecoveredType: type,
        };

        NetMgr.I.sendMessage(ProtoId.C2SResRecoveredInfo_ID, d);
    }

    /** 领取找回奖励 */
    public getResReward(type: ResRecoveryType, Id: number, Num: number): void {
        const d: C2SResRecovered = {
            RecoveredType: type,
            Id,
            Num,
        };

        NetMgr.I.sendMessage(ProtoId.C2SResRecovered_ID, d);
    }

    /** 一键领取 */
    public gerAllResReward(type: number): void {
        const d: C2SAllResRecovered = {
            RecoveredType: type,
        };
        NetMgr.I.sendMessage(ProtoId.C2SAllResRecovered_ID, d);
    }

    public linkOpen(tab?: number, params?: any[], ...args: any[]): boolean {
        if (params && params[0]) {
            WinMgr.I.open(ViewConst.DailyWin, tab, params[0]);
        } else {
            /** 此处做了特殊处理  配置表修改 */
            WinMgr.I.open(ViewConst.DailyWin, tab || 1);
        }
        return true;
    }
}

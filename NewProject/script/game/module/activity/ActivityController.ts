/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/*
 * @Author: zs
 * @Date: 2022-10-08 17:41:42
 * @FilePath: \SanGuo2.4\assets\script\game\module\activity\ActivityController.ts
 * @Description:
 *
 */

import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { E } from '../../const/EventName';

import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';
import { ActData } from './ActivityConst';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import { i18n, Lang } from '../../../i18n/i18n';

const { ccclass } = cc._decorator;
@ccclass('ActivityController')
export class ActivityController extends BaseController {
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CActListPush_ID, this.onS2CActListPush, this);
        EventProto.I.on(ProtoId.S2CGetActivityConfig_ID, this.onS2CGetActivityConfig, this);
        EventProto.I.on(ProtoId.S2CPlayerActModelData_ID, this.onS2CPlayerActModelData, this);
        EventProto.I.on(ProtoId.S2CActListRedPush_ID, this.onS2CActListRed, this);
    }
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CActListPush_ID, this.onS2CActListPush, this);
        EventProto.I.off(ProtoId.S2CGetActivityConfig_ID, this.onS2CGetActivityConfig, this);
        EventProto.I.off(ProtoId.S2CPlayerActModelData_ID, this.onS2CPlayerActModelData, this);
        EventProto.I.off(ProtoId.S2CActListRedPush_ID, this.onS2CActListRed, this);
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

    /**
     * 打开活动界面
     * @param funcId 活动id
     * @returns
     */
    public linkOpen(funcId: number, params?: any[], args?: any[]): boolean {
        const actData: ActData = ModelMgr.I.ActivityModel.getActivityData(funcId);
        if (actData) {
            let containerId: number = actData.Config.ContainerId;
            if (!containerId) {
                containerId = actData.Config.FuncId;
            }
            WinMgr.I.open(containerId, actData.Config.FuncId);
        } else {
            MsgToastMgr.Show(i18n.tt(Lang.activity_unopen));
        }

        return true;
    }

    /** 活动协议数据 */
    private onS2CActListPush(d: S2CActListPush) {
        // console.log('************** 活动协议：', d);
        if (d.Tag === 0) {
            ModelMgr.I.ActivityModel.setActivityDatas(d.ActivityList);
            if (d.DelActIds && d.DelActIds.length > 0) {
                const del: number[] = [];
                for (let i = 0; i < d.DelActIds.length; i++) {
                    del.push(d.DelActIds[i].K);
                }
                ModelMgr.I.ActivityModel.delActivity(del);
            }
        }
    }

    /** 活动红点 */
    private onS2CActListRed(d: S2CActListRedPush) {
        // console.log('************** 活动红点:', d);
        if (d.Tag === 0) {
            ModelMgr.I.ActivityModel.uptActRed(d.FuncId, d.Red);
        }
    }

    /** 活动的配置数据 */
    private onS2CGetActivityConfig(d: S2CGetActivityConfig) {
        // console.log('************** 具体某个活动的配置数据:', d);
        if (d.Tag === 0 && d.ConfigList.length > 0) {
            ModelMgr.I.ActivityModel.setActCfgs(d.FuncId, d.Ver, d.ConfigList);
        }
        // ModelMgr.I.ActivityModel.setActCfgState(d.FuncId, EActivityCfgState.None);
        EventProto.I.emit(E.Activity.Cfg, d.FuncId);
    }

    /** 请求活动的配置数据 */
    public reqC2SGetActivityConfig(FuncId: number): void {
        const CycNo: number = ModelMgr.I.ActivityModel.getActCycNo(FuncId);
        const Ver: number = ModelMgr.I.ActivityModel.getActVer(FuncId);// 活动版本号

        // console.log('请求活动的配置数据，FuncId=', FuncId, 'CycNo=', CycNo, 'Ver=', Ver);

        const d: C2SGetActivityConfig = { FuncId, CycNo, Ver };
        NetMgr.I.sendMessage(ProtoId.C2SGetActivityConfig_ID, d);
        // ModelMgr.I.ActivityModel.setActCfgState(d.FuncId, EActivityCfgState.Reqing);
    }

    /** 返回活动的model数据 */
    private onS2CPlayerActModelData(d: S2CPlayerActModelData) {
        // console.log('************** 返回活动的model数据:', d);
        if (d.Tag === 0) {
            if (d.OnlineAwardData) {
                ModelMgr.I.OnlineRewardModel.setActData(d);
            } else if (d.StageRewardClientData) {
                ModelMgr.I.StageRewardModel.setStageData(d);
            } else if (d.GeneralPassClientData) {
                ModelMgr.I.GeneralPassModel.setActData(d);
            }
        }
        // ModelMgr.I.ActivityModel.setActCfgState(d.FuncId, EActivityCfgState.None);
    }

    /** 请求具体某个活动的model数据 */
    public reqC2SPlayerActModelData(FuncId: number): void {
        const CycNo: number = ModelMgr.I.ActivityModel.getActCycNo(FuncId);
        const d: C2SPlayerActModelData = { FuncId, CycNo };
        NetMgr.I.sendMessage(ProtoId.C2SPlayerActModelData_ID, d);
        // ModelMgr.I.ActivityModel.setActCfgState(d.FuncId, EActivityCfgState.Reqing);
        // console.log('请求具体某个活动的model数据：', FuncId, CycNo);
    }
}

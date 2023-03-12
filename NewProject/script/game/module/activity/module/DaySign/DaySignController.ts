/*
 * @Author: wangxin
 * @Date: 2022-09-28 15:18:37
 * @FilePath: \SanGuo2.4\assets\script\game\module\DaySign\DaySignController.ts
 */
import { EventProto } from '../../../../../app/base/event/EventProto';
import BaseController from '../../../../../app/core/mvc/controller/BaseController';
import ModelMgr from '../../../../manager/ModelMgr';
import NetMgr from '../../../../manager/NetMgr';

const { ccclass, property } = cc._decorator;

@ccclass('DaySignController')
export class DaySignController extends BaseController {
    public PlayerSignInUIData: S2CPlayerSignInUIData;
    /** 网络监听 */
    public addNetEvent(): void {
        // 每日签到-请求数据 返回
        EventProto.I.on(ProtoId.S2CPlayerSignInUIData_ID, this.onS2CPlayerSignInUIData, this);
        // 每日签到-签到 返回
        EventProto.I.on(ProtoId.S2CPlayerSignIn_ID, this.onS2CPlayerSignIn, this);
        // 再领一次
        EventProto.I.on(ProtoId.S2CPlayerDoubleSignIn_ID, this.onS2CPlayerDoubleSignIn, this);
        // 补签
        EventProto.I.on(ProtoId.S2CPlayerRemedySignIn_ID, this.onS2CPlayerRemedySignIn, this);
        // 累计
        EventProto.I.on(ProtoId.S2CPlayerSignInNumReward_ID, this.onS2CPlayerSignInNumReward, this);
    }

    public delNetEvent(): void {
        //
        EventProto.I.off(ProtoId.S2CPlayerSignInUIData_ID, this.onS2CPlayerSignInUIData, this);
        EventProto.I.off(ProtoId.S2CPlayerSignIn_ID, this.onS2CPlayerSignIn, this);
        EventProto.I.off(ProtoId.S2CPlayerDoubleSignIn_ID, this.onS2CPlayerDoubleSignIn, this);
        EventProto.I.off(ProtoId.S2CPlayerRemedySignIn_ID, this.onS2CPlayerRemedySignIn, this);
        EventProto.I.off(ProtoId.S2CPlayerSignInNumReward_ID, this.onS2CPlayerSignInNumReward, this);
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

    /** 活动数据推送 */
    private onS2CPlayerSignInUIData(data: S2CPlayerSignInUIData): void {
        // console.log('S2CPlayerSignInUIData', data);
        if (data && !data.Tag) {
            ModelMgr.I.DaySignModel.setPlayerSignInUIData(data);
        }
    }

    /** 每日签到-签到 返回 */
    private onS2CPlayerSignIn(data: S2CPlayerSignIn): void {
        // console.log('每日签到-签到 返回', data);
        if (data && !data.Tag) {
            ModelMgr.I.DaySignModel.setS2CPlayerSignIn(data);
        }
    }

    /** 再领一次 */
    private onS2CPlayerDoubleSignIn(data: S2CPlayerDoubleSignIn): void {
        // console.log('再领一次返回', data);
        if (data && !data.Tag) {
            ModelMgr.I.DaySignModel.setS2CPlayerDoubleSignIn(data);
        }
    }

    /** 补签返回 */
    private onS2CPlayerRemedySignIn(data: S2CPlayerRemedySignIn): void {
        // console.log('补签返回', data);
        if (data && !data.Tag) {
            ModelMgr.I.DaySignModel.setS2CPlayerRemedySignIn(data);
        }
    }

    /** 累计奖励返回 */
    private onS2CPlayerSignInNumReward(data: S2CPlayerSignInNumReward): void {
        // console.log('累计奖励返回', data);
        if (data && !data.Tag) {
            ModelMgr.I.DaySignModel.setS2CPlayerSignInNumReward(data);
        }
    }

    // 每日签到-请求数据
    public reqC2SPlayerSignInUIData(FuncId: number): void {
        // console.log('每日签到-请求数据', FuncId);
        const CycNo: number = ModelMgr.I.ActivityModel.getActCycNo(FuncId);
        const d: C2SPlayerSignInUIData = { FuncId, CycNo };
        NetMgr.I.sendMessage(ProtoId.C2SPlayerSignInUIData_ID, d);
    }

    // 每日签到-请求签到
    public reqSC2SPlayerSignIn(FuncId: number, Day: number): void {
        // console.log('每日签到-请求签到', FuncId, Day);
        const CycNo: number = ModelMgr.I.ActivityModel.getActCycNo(FuncId);
        const d: C2SPlayerSignIn = { FuncId, CycNo, Day };
        NetMgr.I.sendMessage(ProtoId.C2SPlayerSignIn_ID, d);
    }

    // 每日签到-再签一次
    public reqC2SPlayerDoubleSignIn(FuncId: number, Day: number): void {
        // console.log('每日签到-再签一次', FuncId, Day);
        const CycNo: number = ModelMgr.I.ActivityModel.getActCycNo(FuncId);
        const d: C2SPlayerDoubleSignIn = { FuncId, CycNo, Day };
        NetMgr.I.sendMessage(ProtoId.C2SPlayerDoubleSignIn_ID, d);
    }

    // 领取累计奖励
    public reqC2SPlayerSignInNumReward(FuncId: number, Day: number): void {
        // console.log('每日签到-领取累计奖励', FuncId, Day);
        const CycNo: number = ModelMgr.I.ActivityModel.getActCycNo(FuncId);
        const d: C2SPlayerSignInNumReward = { FuncId, CycNo, Day };
        NetMgr.I.sendMessage(ProtoId.C2SPlayerSignInNumReward_ID, d);
    }

    // 请求补签
    public reqC2SPlayerRemedySignIn(FuncId: number, Day: number): void {
        // console.log('每日签到-请求补签', FuncId, Day);
        const CycNo: number = ModelMgr.I.ActivityModel.getActCycNo(FuncId);
        const d: C2SPlayerRemedySignIn = { FuncId, CycNo, Day };
        NetMgr.I.sendMessage(ProtoId.C2SPlayerRemedySignIn_ID, d);
    }
}

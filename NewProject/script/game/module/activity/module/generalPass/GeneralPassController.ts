/*
 * @Author: myl
 * @Date: 2022-12-07 10:20:47
 * @Description:
 */

import { EventProto } from '../../../../../app/base/event/EventProto';
import BaseController from '../../../../../app/core/mvc/controller/BaseController';
import ModelMgr from '../../../../manager/ModelMgr';
import NetMgr from '../../../../manager/NetMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GeneralPassController extends BaseController {
    /** 监听网络事件 子类实现 */
    public addNetEvent(): void {
        // C2SGetAllServerReward_ID=1121,
        // S2CGetAllServerReward_ID=1122,
        // C2SGetGeneralPassReward_ID=1123,
        // S2CGetGeneralPassReward_ID=1134,

        /** 领取全民奖励 */
        EventProto.I.on(ProtoId.S2CGetAllServerReward_ID, this.onS2CGetAllServerReward, this);
        /** 领取通行证奖励 */
        EventProto.I.on(ProtoId.S2CGetGeneralPassReward_ID, this.onS2CGetGeneralPassReward, this);
    }

    /** 移除网络事件 子类实现 */
    public delNetEvent(): void {
        /** 领取全民奖励 */
        EventProto.I.off(ProtoId.S2CGetAllServerReward_ID, this.onS2CGetAllServerReward, this);
        /** 领取通行证奖励 */
        EventProto.I.off(ProtoId.S2CGetGeneralPassReward_ID, this.onS2CGetGeneralPassReward, this);
    }

    /** 监听业务事件 子类实现 */
    public addClientEvent(): void {
        //
    }

    /** 移除网络事件 子类实现 */
    public delClientEvent(): void {
        //
    }

    /** 清理数据 */
    public clearAll(): void {
        //
    }

    /** 请求领取全民奖励 */
    public getAllServerReward(funcId: number, CycNo: number, RewardId: number): void {
        const d: C2SGetAllServerReward = {
            FuncId: funcId,
            CycNo,
            RewardId,
        };
        NetMgr.I.sendMessage(ProtoId.C2SGetAllServerReward_ID, d);
    }

    /** 请求领取通行证奖励 */
    public getPassReward(funcId: number, CycNo: number, SectionId: number): void {
        const d: C2SGetGeneralPassReward = {
            FuncId: funcId,
            CycNo,
            SectionId,
        };
        NetMgr.I.sendMessage(ProtoId.C2SGetGeneralPassReward_ID, d);
    }

    /** 领取全民奖励返回 */
    private onS2CGetAllServerReward(_data: S2CGetAllServerReward): void {
        if (_data.Tag === 0) {
            ModelMgr.I.GeneralPassModel.updateWelfare(_data);
        }
    }

    /** 领取通信证奖励返回 */
    private onS2CGetGeneralPassReward(_data: S2CGetGeneralPassReward): void {
        if (_data.Tag === 0) {
            ModelMgr.I.GeneralPassModel.updateUserPassData(_data);
        }
    }
}

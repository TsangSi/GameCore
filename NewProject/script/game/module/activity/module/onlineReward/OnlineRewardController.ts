/*
 * @Author: myl
 * @Date: 2022-12-07 10:20:47
 * @Description:
 */

import { EventClient } from '../../../../../app/base/event/EventClient';
import { EventProto } from '../../../../../app/base/event/EventProto';
import BaseController from '../../../../../app/core/mvc/controller/BaseController';
import { E } from '../../../../const/EventName';
import ModelMgr from '../../../../manager/ModelMgr';
import NetMgr from '../../../../manager/NetMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export default class OnlineRewardController extends BaseController {
    /** 监听网络事件 子类实现 */
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CGetOnlineAward_ID, this.onS2CGetOnlineAward, this);
    }

    /** 移除网络事件 子类实现 */
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CGetOnlineAward_ID, this.onS2CGetOnlineAward, this);
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

    /** 领取奖励 */
    public GetOnlineReward(funcId: number, CycNo: number, AwardId: number): void {
        const d: C2SGetOnlineAward = {
            FuncId: funcId,
            CycNo,
            AwardId,
        };
        NetMgr.I.sendMessage(ProtoId.C2SGetOnlineAward_ID, d);
    }

    private onS2CGetOnlineAward(data: S2CGetOnlineAward): void {
        ModelMgr.I.OnlineRewardModel.updateListData(data);
    }
}

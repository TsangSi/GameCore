/*
 * @Author: zs
 * @Date: 2022-06-06 21:54:12
 * @FilePath: \SanGuo\assets\script\game\module\vip\VipController.ts
 * @Description:
 *
 */
import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import { E } from '../../const/EventName';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';

const { ccclass } = cc._decorator;
@ccclass('VipController')
export class VipController extends BaseController {
    protected registerVoCfg(): void {
        //
    }
    public addNetEvent(): void {
        // vip 礼包领取信息
        EventProto.I.on(ProtoId.S2CVipInfo_ID, this.onS2CVipInfo, this);
        // 聊天列表
        EventProto.I.on(ProtoId.S2CVipLevelReward_ID, this.onS2CVipLevelReward, this);
        // 拉黑
        EventProto.I.on(ProtoId.S2CVipDailyReward_ID, this.onS2CVipDailyReward, this);
    }
    public delNetEvent(): void {
        // vip 礼包领取信息
        EventProto.I.off(ProtoId.S2CVipInfo_ID, this.onS2CVipInfo, this);
        // 聊天列表
        EventProto.I.off(ProtoId.S2CVipLevelReward_ID, this.onS2CVipLevelReward, this);
        // 拉黑
        EventProto.I.off(ProtoId.S2CVipDailyReward_ID, this.onS2CVipDailyReward, this);
    }
    public addClientEvent(): void {
        EventClient.I.on(E.Game.Start, this.rewardCollectStatus, this);
    }
    public delClientEvent(): void {
        EventClient.I.on(E.Game.Start, this.rewardCollectStatus, this);
    }
    public clearAll(): void {
        //
    }

    /** 领取vip等级奖励 */
    public collectReward(vipLv: number): void {
        const d: C2SVipLevelReward = {
            VipLevel: vipLv,
        };
        NetMgr.I.sendMessage(ProtoId.C2SVipLevelReward_ID, d);
    }

    private onS2CVipLevelReward(data: S2CVipLevelReward): void {
        // console.log('-onS2CVipLevelReward-', data);
        if (data.Tag === 9) {
            //
        } else {
            ModelMgr.I.VipModel.updateLevelReward(data.VipLevel);
            EventClient.I.emit(E.Vip.VipLvReward);
        }
    }

    /** 领取vip每日奖励 */
    public collectDayReward(): void {
        const d: C2SVipDailyReward = {
        };
        NetMgr.I.sendMessage(ProtoId.C2SVipDailyReward_ID, d);
    }

    private onS2CVipDailyReward(data: S2CVipDailyReward) {
        // console.log('-onS2CVipDailyReward-', data);
        ModelMgr.I.VipModel.updateDailyRewardState();
    }

    /** 获取vip领取的情况 */
    public rewardCollectStatus(): void {
        const d: C2SVipInfo = {
        };
        NetMgr.I.sendMessage(ProtoId.C2SVipInfo_ID, d);
    }

    private onS2CVipInfo(data: S2CVipInfo) {
        // console.log('-onS2CVipInfo-', data);
        ModelMgr.I.VipModel.rewardCollectStatus(data);
    }
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2023-01-09 09:39:43
 * @FilePath: \SanGuo2.4\assets\script\game\module\activity\module\stageReward\StageRewardController.ts
 * @Description: 阶段奖励（等级、战力、vip等）
 *
 */

import { EventProto } from '../../../../../app/base/event/EventProto';
import BaseController from '../../../../../app/core/mvc/controller/BaseController';
import ModelMgr from '../../../../manager/ModelMgr';
import NetMgr from '../../../../manager/NetMgr';

const { ccclass } = cc._decorator;

@ccclass
export default class StageRewardController extends BaseController {
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CGetStageReward_ID, this.onGetStageReward, this);
    }
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CGetStageReward_ID, this.onGetStageReward, this);
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

    /** 请求领取阶段（等级、战力、vip等）奖励 */
    public reqGetStageReward(funcId: number, CycNo: number, RewardId: number): void {
        const d: C2SGetStageReward = {
            FuncId: funcId,
            CycNo,
            RewardId,
        };
        NetMgr.I.sendMessage(ProtoId.C2SGetStageReward_ID, d);
    }

    /** 返回阶段（等级、战力、vip等）奖励数据 */
    private onGetStageReward(data: S2CGetStageReward): void {
        if (data && data.Tag === 0) {
            ModelMgr.I.StageRewardModel.updateStageData(data);
        }
    }
}

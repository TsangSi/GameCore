/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2023-01-09 09:40:38
 * @FilePath: \SanGuo2.4\assets\script\game\module\activity\module\stageReward\StageRewardModel.ts
 * @Description: 阶段奖励（等级、战力、vip等）Model
 *
 */

import { EventClient } from '../../../../../app/base/event/EventClient';
import BaseModel from '../../../../../app/core/mvc/model/BaseModel';
import { Config } from '../../../../base/config/Config';
import { ConfigConst } from '../../../../base/config/ConfigConst';
import { ConfigStageRewardsIndexer } from '../../../../base/config/indexer/ConfigStageRewardsIndexer';
import { E } from '../../../../const/EventName';
import { RoleMgr } from '../../../role/RoleMgr';
import { ERewardState, EStageType, IStageReward } from './StageRewardConst';

const { ccclass } = cc._decorator;

@ccclass
export default class StageRewardModel extends BaseModel {
    /** 阶段奖励数据 */
    private _stageData: { [funcId: number]: S2CGetStageReward } = cc.js.createMap(true);

    public clearAll(): void {
        //
    }

    /** 获取阶段奖励的model数据 */
    public getStageData(funcId: number): S2CGetStageReward {
        return this._stageData[funcId];
    }

    /** 获取阶段奖励的配置数据、状态等 */
    public getStageRewards(funcId: number, group: string): IStageReward[] {
        const stageRewards: IStageReward[] = [];
        const indexer: ConfigStageRewardsIndexer = Config.Get(ConfigConst.Cfg_Server_StageRewards);
        const cfgs: Cfg_Server_StageRewards[] = indexer.getGroupData(group);
        // model数据
        const stageData: S2CGetStageReward = this._stageData[funcId];
        // 获取人物数据数据：等级、战力。若有新类型，在这里加上
        const lv = RoleMgr.I.d.Level;
        const fv = RoleMgr.I.d.FightValue;

        if (cfgs && cfgs.length > 0) {
            for (let i = 0; i < cfgs.length; i++) {
                let state: ERewardState = ERewardState.unReach;
                if (stageData.Rewards.indexOf(cfgs[i].Id) >= 0) {
                    state = ERewardState.got;
                } else {
                    switch (cfgs[i].ConditionType) {
                        case EStageType.Power:
                            state = fv >= cfgs[i].Value ? ERewardState.canGet : ERewardState.unReach;
                            break;
                        case EStageType.Level:
                            state = lv >= cfgs[i].Value ? ERewardState.canGet : ERewardState.unReach;
                            break;
                        default:
                            break;
                    }
                }
                const stageReward: IStageReward = {
                    funcID: stageData.FuncId,
                    cycNo: stageData.CycNo,
                    group,
                    state,
                    cfg: cfgs[i],
                };
                stageRewards.push(stageReward);
            }
            stageRewards.sort((a, b) => {
                if (a.state !== b.state) {
                    return a.state - b.state;
                }
                return a.cfg.Value - b.cfg.Value;
            });
        }
        return stageRewards;
    }

    /** 刷新阶段奖励数据 */
    public updateStageData(data: S2CGetStageReward): void {
        if (this._stageData[data.FuncId]) {
            this._stageData[data.FuncId].Rewards = data.Rewards;
            // 通知界面刷新
            EventClient.I.emit(E.StageReward.UptStage, data);
        }
    }

    /** 阶段奖励相关的model数据 */
    public setStageData(data: S2CPlayerActModelData): void {
        if (data && data.StageRewardClientData) {
            if (!this._stageData[data.FuncId]) {
                this._stageData[data.FuncId] = cc.js.createMap(true);
            }
            this._stageData[data.FuncId] = {
                Tag: 0,
                FuncId: data.FuncId,
                CycNo: data.CycNo,
                Rewards: data.StageRewardClientData.AwardIds,
            };
            //
            EventClient.I.emit(E.Activity.Data, data);
        }
    }
}

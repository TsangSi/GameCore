/*
 * @Author: myl
 * @Date: 2023-02-07 15:15:15
 * @Description:
 */

import { EventClient } from '../../../app/base/event/EventClient';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { Config } from '../../base/config/Config';
import { ConfigConst } from '../../base/config/ConfigConst';
import { ConfigDropRewardIndexer } from '../../base/config/indexer/ConfigDropRewardIndexer';
import { ConfigLimitConditionIndexer } from '../../base/config/indexer/ConfigLimitConditionIndexer';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import UtilItem from '../../base/utils/UtilItem';
import ItemModel from '../../com/item/ItemModel';
import { E } from '../../const/EventName';
import ModelMgr from '../../manager/ModelMgr';
import { RoleMgr } from '../role/RoleMgr';
import { ETaskStatus } from '../task/TaskConst';
import { TaskMgr } from '../task/TaskMgr';
import {
    DailyTaskType, EDailyTaskStatus, HalfCostId, ResRecoveryType,
} from './DailyTaskConst';
import { IComStageRewardData } from './v/ComStageRewardBox';

const { ccclass, property } = cc._decorator;

@ccclass
export default class DailyTaskModel extends BaseModel {
    public clearAll(): void {
        //
    }

    /** 获取日常/周常任务列表 */
    public getTaskCfgList(type: DailyTaskType): { k: number, v: number } {
        const indexer = Config.Get(Config.Type.Cfg_DailyTasks);
        return indexer.getValueByKey(type);
    }

    /** 获取日常/周常任务单条数据 */
    public getTaskCfg(taskId: number, type: number): Cfg_DailyTasks {
        const indexer = Config.Get(Config.Type.Cfg_DailyTasks);
        return indexer.getValueByKey(type, taskId);
    }

    /** 获取阶段奖励配置数据 */
    public getStageRewardCfgList(type: DailyTaskType): { k: number, v: number } {
        const indexer = Config.Get(Config.Type.Cfg_StageReward);
        return indexer.getValueByKey(type);
    }

    /** 获取阶段奖励配置单条数据 */
    public getStageRewardCfg(stageId: number, type: number): Cfg_StageReward {
        const indexer = Config.Get(Config.Type.Cfg_StageReward);
        return indexer.getValueByKey(type, stageId);
    }

    /** 获取资源找回配置数据 */
    public getResCfgList(type: ResRecoveryType): { k: number, v: number } {
        const indexer = Config.Get(Config.Type.Cfg_Resource);
        return indexer.getValueByKey(type);
    }

    /** 获取资源找回配置单条数据 */
    public getResCfg(resId: number, type: number): Cfg_Resource {
        const indexer = Config.Get(Config.Type.Cfg_Resource);
        return indexer.getValueByKey(type, resId);
    }

    /** 服务端获取的阶段奖励信息 */
    private _stageRewardData: DailyStageReward[] = [];
    /** 获取到阶段奖励 */
    public updateTaskData(d: S2CDailyTaskInfo): void {
        this._stageRewardData = d.DailyTask.DailyStageInfo;
        EventClient.I.emit(E.DailyTask.Data, d.DailyTask);
    }

    /**
     * 获取日常/周常任务的详细信息
     * return tasks: cfg任务中可以完成的任务配置 ， state:任务状态（需要根据这个状态做排序处理）
     *          stage : 阶段奖励 cfg:配置 , data:用户数据
     *          activityNum : 活跃度
     */
    public getTaskListData(type: number): {
        tasks: { cfg: Cfg_DailyTasks, state: EDailyTaskStatus }[],
        stage: { cfg: Cfg_StageReward, data: DailyStageReward }[],
        activityNum: number,
        maxActNum: number
    } {
        const arr = this.getTaskCfgList(type);
        const tasks: { cfg: Cfg_DailyTasks, state: EDailyTaskStatus }[] = [];
        const stage: { cfg: Cfg_StageReward, data: DailyStageReward }[] = [];
        for (const key in arr) {
            const taskId = Number(key);
            const cfg = this.getTaskCfg(taskId, type);
            if (UtilFunOpen.isOpen(cfg.FuncId)) {
                // 功能开发 处理人物状态
                const tskInfo = TaskMgr.I.getTaskModel(cfg.Id);
                if (tskInfo) { // 容错处理
                    const tskState = tskInfo.status;
                    let state = EDailyTaskStatus.Processing;
                    if (tskState === ETaskStatus.Processing) {
                        state = EDailyTaskStatus.Processing;
                    }

                    if (tskState === ETaskStatus.Awarded) {
                        state = EDailyTaskStatus.Awarded;
                    }

                    if (tskState === ETaskStatus.Completed) {
                        state = EDailyTaskStatus.Completed;
                    }
                    tasks.push({ cfg, state });
                }
            }
        }
        tasks.sort((a, b) => a.state - b.state);

        let maxActNum = 0;
        for (let i = 0; i < this._stageRewardData.length; i++) {
            const data = this._stageRewardData[i];
            const cfg = this.getStageRewardCfg(data.Id, type);
            if (cfg.Activity > maxActNum) {
                maxActNum = cfg.Activity;
            }
            stage.push({ cfg, data });
        }
        stage.sort((m, n) => m.cfg.Id - n.cfg.Id);

        const activityNum = type === DailyTaskType.Daily ? RoleMgr.I.d.DailyActVal : RoleMgr.I.d.WeekActVal;
        return {
            tasks, stage, activityNum, maxActNum,
        };
    }

    /** 将数据转化为组件所需的格式 */
    public transformDataToComStageRewardData(
        cfg: Cfg_StageReward,
        data: DailyStageReward,
        cb: (item: ItemModel[],
            state: number) => void,
    ): IComStageRewardData {
        const indexer: ConfigDropRewardIndexer = Config.Get(ConfigConst.Cfg_DropReward);
        const reward = indexer.getValueByDay(cfg.StageReward).ShowItems;
        const arr: ItemModel[] = [];
        const rewardCfgs = reward.split('|');

        for (let i = 0; i < rewardCfgs.length; i++) {
            const rewCfg = rewardCfgs[i].split(':');
            const itemModel = UtilItem.NewItemModel(Number(rewCfg[0]), Number(rewCfg[1]) * (data.IsDouble ? 2 : 1));
            arr.push(itemModel);
        }
        const targetNum = cfg.Activity;
        const curNum = cfg.Type === DailyTaskType.Daily ? RoleMgr.I.d.DailyActVal : RoleMgr.I.d.WeekActVal;
        let state = 0;
        if (curNum < targetNum) {
            state = 3;
        } else if (data.Status === 0) {
            state = 2;
        } else {
            state = 1;
        }
        return {
            Id: cfg.Id,
            state,
            cfgValue: cfg.Activity,
            doubleFlag: data.IsDouble === 1,
            cb,
            reward: arr,
        };
    }

    private _resData: Array<ResRecoveredReward> = [];
    public setResData(d: S2CResRecoveredInfo): void {
        this._resData = d.ResRecovered.ResRecovereds;
        EventClient.I.emit(E.DailyTask.ResData);
    }

    public getResListData(type: ResRecoveryType): { cfg: Cfg_Resource, data: ResRecoveredReward }[] {
        const arr: { cfg: Cfg_Resource, data: ResRecoveredReward }[] = [];
        for (let i = 0; i < this._resData.length; i++) {
            const data = this._resData[i];
            const cfg = this.getResCfg(data.Id, type);
            if (cfg) {
                arr.push({ cfg, data });
            }
        }
        return arr;
    }

    /** 资源找回是否减半 */
    public resCostHalf(): { tip: string, state: boolean } {
        const indexer = Config.Get(ConfigConst.Cfg_Daily_Config);
        const limit: Cfg_Daily_Config = indexer.getValueByKey(HalfCostId);
        const limitId = Number(limit.Value);
        const indexer1: ConfigLimitConditionIndexer = Config.Get(ConfigConst.Cfg_LimitCondition);
        const limitInfo = indexer1.getCondition(limitId);
        const vip = ModelMgr.I.VipModel.vipName(limitInfo.info.Param1);
        return { tip: vip, state: limitInfo.state };
    }

    /** 获取到总计花费 */
    public getTotalCost(d: { cfg: Cfg_Resource, data: ResRecoveredReward }[], isHalf: boolean): string {
        let tPrize = 0;
        let tid = 0;
        for (let i = 0; i < d.length; i++) {
            const a = d[i];
            const num = a.data.Count;
            const prize = a.cfg.CostItemNum * (isHalf ? 0.5 : 1);
            tid = a.cfg.CostItemId;
            tPrize += num * prize;
        }
        return `${tid}:${tPrize}`;
    }

    /** 获取到资源找回列表  仅供外部使用功能内部使用 */
    public getFuncDataList(): { cfg: Cfg_Resource, data: ResRecoveredReward }[] {
        return this.getResListData(ResRecoveryType.Func);
    }
}

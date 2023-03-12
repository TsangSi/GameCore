/*
 * @Author: myl
 * @Date: 2023-02-08 10:15:12
 * @Description:
 */

import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass, property } = cc._decorator;

@ccclass('ConfigDailyTaskIndexer')
export default class ConfigDailyTaskIndexer extends ConfigIndexer {
    private static _i: ConfigDailyTaskIndexer = null;
    public static get I(): ConfigDailyTaskIndexer {
        if (!this._i) {
            this._i = new ConfigDailyTaskIndexer(
                ConfigConst.Cfg_DailyTasks,
                ConfigConst.Cfg_StageReward,
                ConfigConst.Cfg_Resource,
            );
        }
        return this._i;
    }

    protected _taskMap: Map<number, Cfg_DailyTasks[]> = new Map();
    protected _stageRewardMap: Map<number, Cfg_StageReward[]> = new Map();
    protected _resourceMap: Map<number, Cfg_Resource[]> = new Map();

    protected walks(tableName: string, data: unknown, index: number): void {
        if (tableName === ConfigConst.Cfg_DailyTasks.name) {
            const dta = data as Cfg_DailyTasks;
            const arr = this._taskMap.get(dta.TaskType) || [];
            arr.push(dta);
            this._taskMap.set(dta.TaskType, arr);
        } else if (tableName === ConfigConst.Cfg_StageReward.name) {
            const dta = data as Cfg_StageReward;
            const arr = this._stageRewardMap.get(dta.Type) || [];
            arr.push(dta);
            this._stageRewardMap.set(dta.Type, arr);
        } else {
            const dta = data as Cfg_Resource;
            const arr = this._resourceMap.get(dta.Type) || [];
            arr.push(dta);
            this._resourceMap.set(dta.Type, arr);
        }
    }

    public getTaskCfgList(taskType: number): Cfg_DailyTasks[] {
        this._walks();
        return this._taskMap.get(taskType) || [];
    }

    public getStageRewardCfgList(type: number): Cfg_StageReward[] {
        this._walks();
        return this._stageRewardMap.get(type) || [];
    }

    public getResourceCfgList(type: number): Cfg_Resource[] {
        this._walks();
        return this._resourceMap.get(type) || [];
    }

    public getTaskCfgInfo(id: number): Cfg_DailyTasks {
        this._walks();
        return this._getValueByKey(ConfigConst.Cfg_DailyTasks.name, id);
    }

    public getStageRewardCfgInfo(id: number): Cfg_StageReward {
        this._walks();
        return this._getValueByKey(ConfigConst.Cfg_StageReward.name, id);
    }

    public getResCfgInfo(id: number): Cfg_Resource {
        this._walks();
        return this._getValueByKey(ConfigConst.Cfg_Resource.name, id);
    }
}

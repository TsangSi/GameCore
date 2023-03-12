/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/*
 * @Author: kexd
 * @Date: 2023-01-10 11:39:42
 * @FilePath: \SanGuo2.4\assets\script\game\base\config\indexer\ConfigStageRewardsIndexer.ts
 * @Description: 活动表很多都需要根据group刷选出对应的数据列表
 *
 */

import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass, property } = cc._decorator;

@ccclass('ConfigStageRewardsIndexer')
export class ConfigStageRewardsIndexer extends ConfigIndexer {
    private static _i: ConfigStageRewardsIndexer = null;
    public static get I(): ConfigStageRewardsIndexer {
        if (!this._i) {
            this._i = new ConfigStageRewardsIndexer(ConfigConst.Cfg_Server_StageRewards);
        }
        return this._i;
    }

    /** 把一条数据里的 Group 作为key，存该数据的Id作为其值 */
    private _groupData: Map<string, number[]> = cc.js.createMap(true);
    protected walks(tableName: string, data: Cfg_Server_StageRewards, index: number): void {
        if (!this._groupData[data.Group]) {
            this._groupData[data.Group] = [];
        }
        this._groupData[data.Group].push(data.Id);
    }

    /** 获取组数据 */
    public getGroupData(group: string): Cfg_Server_StageRewards[] {
        this._walks();
        const cfgs: Cfg_Server_StageRewards[] = [];
        const ids: number[] = this._groupData[group];
        if (ids && ids.length > 0) {
            for (let i = 0; i < ids.length; i++) {
                const cfg: Cfg_Server_StageRewards = this.getValueByKey(ids[i]);
                cfgs.push(cfg);
            }
        }
        return cfgs;
    }
}

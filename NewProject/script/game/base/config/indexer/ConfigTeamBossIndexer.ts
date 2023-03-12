/*
 * @Author: zs
 * @Date: 2022-11-09 21:11:44
 * @FilePath: \SanGuo2.4-main\assets\script\game\base\config\indexer\ConfigTeamBossIndexer.ts
 * @Description:
 *
 */
import { NumberS } from '../../../const/GameConst';
import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass } = cc._decorator;
@ccclass('ConfigTeamBossIndexer')
export class ConfigTeamBossIndexer extends ConfigIndexer {
    private static _i: ConfigTeamBossIndexer;
    public static get I(): ConfigTeamBossIndexer {
        if (!this._i) {
            this._i = new ConfigTeamBossIndexer(
                ConfigConst.Cfg_TeamBoss,
                ConfigConst.Cfg_TeamBoss_Monster,
                ConfigConst.Cfg_TeamBoss_Level,
            );
        }
        return this._i;
    }

    /** 根据副本类型存储的副本info */
    // private fbInfosByType: { [type: number]: IFBInfo[] } = cc.js.createMap(true);
    /** 副本类型列表 */
    // private fbTypes: number[] = [];
    protected walks(tableName: string, data: any, index: number): void {
        if (tableName === ConfigConst.Cfg_TeamBoss.name) {
            this.walkTeamBoss(data, index);
        } else if (tableName === ConfigConst.Cfg_TeamBoss_Monster.name) {
            this.walkTeamMonster(data, index);
        } else if (tableName === ConfigConst.Cfg_TeamBoss_Level.name) {
            this.walkTeamLevel(data, index);
        }
    }
    private walkTeamBoss(data: Cfg_TeamBoss, index: number) {
        // if (data.FBId) {
        //     const fbInfo: IFBInfo[] = this.fbInfosByType[data.Id] = [];
        //     const fbids = data.FBId.split(':');
        //     const limits = data.LevelLimit.split(':');
        //     const buycosts = data.BuyCost.split('|');
        //     const jumps = data.Jump.split('|');
        //     for (let i = 0, n = fbids.length; i < n; i++) {
        //         const buy = buycosts[i].split(':');
        //         const jump = jumps[i].split(':');
        //         fbInfo.push({
        //             FBId: +fbids[i],
        //             Limit: +limits[i],
        //             BuyCostId: +buy[0],
        //             BuyCostNum: +buy[1],
        //             JumpV: +jump[0],
        //             JumpR: +jump[1],
        //         });
        //     }
        // }
        // if (this.fbTypes.indexOf(data.Id) < 0) {
        //     this.fbTypes.push(data.Id);
        // }
    }

    /** 奖励区间 */
    private prizeLevelsById: { [id: number]: number[] } = cc.js.createMap(true);
    /** 根据副本id存储的最大关卡 */
    // private maxLevelById: { [id: number]: number } = cc.js.createMap(true);
    private walkTeamMonster(data: Cfg_TeamBoss_Monster, index: number) {
        if (data.Prize) {
            this.prizeLevelsById[data.InstanceType] = this.prizeLevelsById[data.InstanceType] = [];
            this.prizeLevelsById[data.InstanceType].push(index);
        }
        // this.maxLevelById[data.InstanceType] = data.Level;
    }

    private fbidsByType: { [type: number]: number[] } = cc.js.createMap(true);
    private walkTeamLevel(data: Cfg_TeamBoss_Level, index: number) {
        this.fbidsByType[data.FBId] = this.fbidsByType[data.FBId] || [];
        this.fbidsByType[data.FBId].push(data.Id);
    }

    // /**
    //  * 根据副本id获取该副本的最大关卡
    //  * @param id 副本id
    //  * @returns
    //  */
    // public getMaxLevelById(id: number): number {
    //     this._walks();
    //     return this.maxLevelById[id] || 1;
    // }

    /** 根据类型获取该类型的所有副本 */
    public getFBIds(type: number): number[] {
        this._walks();
        return this.fbidsByType[type] || [];
    }

    private prizeLevelsByType: { [type: number]: number[] } = cc.js.createMap(true);
    /**
     * 根据类型获取奖励的索引列表
     * @param type 副本类型
     */
    public getPrizeByIdAndLevel(type: number): number[] {
        this._walks();
        return this.prizeLevelsByType[type] || [];
    }

    // /**
    //  * 获取副本类型列表
    //  */
    // public getTypes(): number[] {
    //     this._walks();
    //     return this.fbTypes;
    // }

    // public getValueFromPrize<T>(index: number): T | undefined;
    // public getValueFromPrize<T extends object>(index: number): T | undefined;
    // public getValueFromPrize<T>(index: number, name: string): T | undefined;
    // public getValueFromPrize<T extends object>(index: number, outObject: T): T | undefined;
    public getValueFromPrize<T>(index: number): T {
        return this._getValueByIndex(ConfigConst.Cfg_TeamBoss.name, index);
    }

    /** 从组队等级副本表获取数据 */
    // public getValueByKeyFromLevel<T extends object>(id: number): T;
    // public getValueByKeyFromLevel<T>(id: number, name: string): T;
    // public getValueByKeyFromLevel<T extends object>(id: number, object: T): T;
    public getValueByKeyFromLevel<T>(...args: (string | number)[]): T {
        return this._getValueByKey(ConfigConst.Cfg_TeamBoss_Level.name, ...args);
    }

    /** 从组队怪物表获取数据 */
    public getValueByKeyFromMonster(id: number): number[] {
        return this._getValueByKey(ConfigConst.Cfg_TeamBoss_Monster.name, id);
    }
    // public getValueFromMonster<T>(index: number): T | undefined;
    // public getValueFromMonster<T extends object>(index: number): T | undefined;
    // public getValueFromMonster<T>(index: number, name: string): T | undefined;
    // public getValueFromMonster<T extends object>(index: number, outObject: T): T | undefined;
    public getValueFromMonster<T>(index: number): T {
        return this._getValueByIndex(ConfigConst.Cfg_TeamBoss_Monster.name, index);
    }

    // public getIntervalDataFromMonster<T extends object>(interval: number): T;
    // public getIntervalDataFromMonster<T extends object>(key: NumberS, interval: number): T;
    // public getIntervalDataFromMonster<T extends object>(key1: NumberS, key2: NumberS, interval: number): T;
    // public getIntervalDataFromMonster<T extends object>(...args: any[]): T {
    //     const index: number = this._getIntervalIndex(ConfigConst.Cfg_TeamBoss_Monster, ...args);
    //     if (index < 0) { // 未找到数据
    //         return undefined;
    //     }
    //     const d = this.getValueByIndex(index);
    //     if (!d) { return undefined; }
    //     const info = this.CfgBaseData[this.TableName].cfgInfo;
    //     if (info.ex && info.ex.intervalKey) {
    //         const interValue: number = d[info.ex.intervalKey];
    //         const checkkValue: number = args[args.length - 1];
    //         // 需要检测查找的值 大于 当前找到的配置表的值就属于超出边界
    //         if (checkkValue > interValue) {
    //             return undefined;
    //         }
    //     }
    //     return d as T;
    // }
}

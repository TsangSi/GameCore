/*
 * @Author: zs
 * @Date: 2022-07-20 20:48:40
 * @FilePath: \SanGuo\assets\script\game\base\config\indexer\ConfigDropRewardIndexer.ts
 * @Description:
 *
 */
import { UtilBool } from '../../../../app/base/utils/UtilBool';
import UtilFunOpen from '../../utils/UtilFunOpen';
import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass, property } = cc._decorator;

@ccclass('ConfigDropRewardIndexer')
export class ConfigDropRewardIndexer extends ConfigIndexer {
    private static _i: ConfigDropRewardIndexer = null;
    public static get I(): ConfigDropRewardIndexer {
        if (!this._i) {
            this._i = new ConfigDropRewardIndexer(ConfigConst.Cfg_DropReward);
            this._i._walks();
        }
        return this._i;
    }
    protected walks(tableName: string, data: Cfg_DropReward, index: number): void {
        const items = this._table[data.GroupId] || [];
        items.push(data);
        this._table[data.GroupId] = items;
    }
    private _table: { [key: number]: Cfg_DropReward[] } = {};

    /**
     * 根据奖励组id获取对应奖励
     * @param groupId 奖励组id
     * @param day 可选参数：对应天数，不传就默认使用开服天数
     * @returns
     */
    public getValueByDay(groupId: number, day?: number): Cfg_DropReward {
        let resultItem: Cfg_DropReward = null;
        const items = this._table[groupId];
        if (!items) {
            return resultItem;
        }
        if (UtilBool.isNullOrUndefined(day)) {
            day = UtilFunOpen.serverDays;
        }
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item && item.GroupId === groupId && day <= item.MaxDay) {
                resultItem = item;
                break;
            }
        }
        return resultItem;
    }

    /** 根据等级获取 */
    public getValueByRoleLevel(groupId: number, lev: number): Cfg_DropReward {
        let resultItem: Cfg_DropReward = null;
        const items = this._table[groupId];
        if (!items) {
            return resultItem;
        }
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item && item.GroupId === groupId && lev <= item.MaxRoleLevel) {
                resultItem = item;
                break;
            }
        }
        return resultItem;
    }

    /** 根据世界等级获取 */
    public getValueByWorldLevel(groupId: number, lev: number): Cfg_DropReward {
        let resultItem: Cfg_DropReward = null;
        const items = this._table[groupId];
        if (!items) {
            return resultItem;
        }
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item && item.GroupId === groupId && lev <= item.MaxLevel) {
                resultItem = item;
                break;
            }
        }
        return resultItem;
    }
}

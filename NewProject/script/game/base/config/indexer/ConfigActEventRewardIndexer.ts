/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: myl
 * @Date: 2022-12-07 21:27:37
 * @Description:
 */

import UtilFunOpen from '../../utils/UtilFunOpen';
import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';
import { RoleMgr } from '../../../module/role/RoleMgr';

const { ccclass, property } = cc._decorator;

@ccclass('ConfigActEventRewardIndexer')
export class ConfigActEventRewardIndexer extends ConfigIndexer {
    private static _i: ConfigActEventRewardIndexer = null;
    public static get I(): ConfigActEventRewardIndexer {
        if (!this._i) {
            this._i = new ConfigActEventRewardIndexer(ConfigConst.Cfg_Server_EventReward);
            this._i._walks();
        }
        return this._i;
    }

    private _table: { [key: number]: Cfg_DropReward[] } = {};
    protected walks(tableName: string, data: Cfg_Server_EventReward, index: number): void {
        const items = this._table[data.GroupId] || [];
        items.push(data);
        this._table[data.GroupId] = items;
    }

    /** 根据开服天数获取奖励数据 */
    public getValueByDay(id: number, day?: number): Cfg_Server_EventReward {
        this._walks();
        if (!day) {
            day = UtilFunOpen.serverDays;
        }
        const items = this._table[id];
        if (items.length <= 0) return null;
        if (items.length === 1) return items[0];
        let res: Cfg_Server_EventReward = null;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item && item.GroupId === id && day <= item.MaxDay) {
                res = item;
                break;
            }
        }
        return res;
    }

    /**
     * 获取活动奖励数据
     * @param groupId 组id
     * @param worldLevel 世界等级（不在人物属性上，是需要请求获取的）
     * @returns
     */
    public getValueByGroupId(groupId: number, worldLevel?: number): Cfg_Server_EventReward {
        this._walks();
        const items = this._table[groupId];
        if (!items || items.length === 0) {
            console.log('getValueByGroupId 没有对应数据', groupId, this._table);
            return null;
        }
        const day = UtilFunOpen.serverDays;
        const lv = RoleMgr.I.d.Level;

        let res: Cfg_Server_EventReward = null;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item && item.GroupId === groupId) {
                let flag: boolean = true;
                // 如果填了开服天数就加上刷选
                if (item.MinDay && item.MaxDay) {
                    flag = day >= item.MinDay && day <= item.MaxDay;
                }
                // 如果填了等级就加上刷选
                if (flag && item.MinRoleLevel && item.MaxRoleLevel) {
                    flag = lv >= item.MinRoleLevel && lv <= item.MaxRoleLevel;
                }
                // 世界等级（不在人物属性上，是需要请求获取的）
                if (flag && worldLevel && item.MinLevel && item.MaxLevel) {
                    flag = worldLevel >= item.MinLevel && worldLevel <= item.MaxLevel;
                }

                if (flag) {
                    res = item;
                    break;
                }
            }
        }
        return res;
    }
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: myl
 * @Date: 2022-12-07 10:19:12
 * @Description:
 */

import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilTime } from '../../../../../app/base/utils/UtilTime';
import BaseModel from '../../../../../app/core/mvc/model/BaseModel';
import { Config } from '../../../../base/config/Config';
import { ConfigConst } from '../../../../base/config/ConfigConst';
import { E } from '../../../../const/EventName';

const { ccclass, property } = cc._decorator;
export type OnlineRewardData = { data: number, cfg: Cfg_Server_OnlineRewards, funcID: number, cycNo: number }

@ccclass
export default class OnlineRewardModel extends BaseModel {
    public clearAll(): void {
        //
    }

    private _rewardListData: Cfg_Server_OnlineRewards[] = [];
    private _modelData: OnlineAwardByClient = null;
    private _funcId: number = 0;
    private _cycNo: number = 0;

    public GetOnlineRewardListData(GroupId: string): OnlineRewardData[] {
        const indexer = Config.Get(ConfigConst.Cfg_Server_OnlineRewards);
        const len = indexer.length;
        const res: OnlineRewardData[] = [];
        for (let i = 1; i <= len; i++) {
            let data = -1; // 0 不可领取  -1 ：未领取  >1：已领取
            const item: Cfg_Server_OnlineRewards = indexer.getValueByKey(i, GroupId);
            if (this._modelData.Awards.indexOf(item.Id) > -1) {
                data = item.Id;
            } else {
                const userTime = this.GetUserOnlineTotalTime();
                const cfgTime = item.TimeRequest * 60;
                if (userTime >= cfgTime) {
                    data = -1;
                } else {
                    data = 0;
                }
            }
            res.push({
                data, cfg: item, funcID: this._funcId, cycNo: this._cycNo,
            });
        }
        res.sort((a, b) => a.data - b.data);
        return res;
    }

    /** 更新一个item的数据 */
    public UpdateItem(data: any): void {
        for (let i = 0; i < this._rewardListData.length; i++) {
            const item = this._rewardListData[i];
        }
    }

    public setActData(data: S2CPlayerActModelData): void {
        if (data && data.OnlineAwardData) {
            this._funcId = data.FuncId;
            this._cycNo = data.CycNo;
            this._modelData = data.OnlineAwardData;

            EventClient.I.emit(E.Activity.Data, data);
        }
    }

    public updateListData(data: S2CGetOnlineAward): void {
        if (data && data.FuncId === this._funcId && data.CycNo === this._cycNo) {
            this._modelData.Awards = data.Awards;
            // 通知界面刷新
            EventClient.I.emit(E.OnlineReward.UptData, data);
        }
    }

    public get modelData(): OnlineAwardByClient {
        return this._modelData;
    }

    /** 获取用户的在线时长 */
    public GetUserOnlineTotalTime(): number {
        const date = UtilTime.NowSec();
        const loginTime = this.modelData.LoginTime;
        const timeDiff = date - loginTime;
        // console.log(date, loginTime, timeDiff, '时间校验');

        return timeDiff + this.modelData.OnlineTime;
    }
}

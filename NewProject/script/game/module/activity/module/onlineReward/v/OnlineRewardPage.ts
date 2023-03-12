/*
 * @Author: myl
 * @Date: 2022-12-07 10:20:16
 * @Description:
 */

import { EventClient } from '../../../../../../app/base/event/EventClient';
import { UtilTime } from '../../../../../../app/base/utils/UtilTime';
import ListView from '../../../../../base/components/listview/ListView';
import { WinTabPage } from '../../../../../com/win/WinTabPage';
import { E } from '../../../../../const/EventName';
import ControllerMgr from '../../../../../manager/ControllerMgr';
import ModelMgr from '../../../../../manager/ModelMgr';
import { ActData } from '../../../ActivityConst';
import { OnlineRewardData } from '../OnlieRewardModel';
import ActivityRewardItem from './ActivityRewardItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class OnlineRewardPage extends WinTabPage {
    @property(ListView)
    private list: ListView = null;

    @property(cc.Label)
    private LabTime: cc.Label = null;

    private _actData: ActData = null;
    private _listData: OnlineRewardData[] = [];

    public init(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        super.init(winId, param, tabIdx, tabId);
        EventClient.I.on(E.OnlineReward.UptData, this.uptReward, this);
        EventClient.I.on(E.Activity.Data, this.uptActData, this);

        this._actData = ModelMgr.I.ActivityModel.getActivityData(tabId);
        ControllerMgr.I.ActivityController.reqC2SGetActivityConfig(this._actData.FuncId);
        ControllerMgr.I.ActivityController.reqC2SPlayerActModelData(this._actData.FuncId);
    }

    public refreshPage(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        super.refreshPage(winId, param, tabIdx, tabId);
        ControllerMgr.I.ActivityController.reqC2SPlayerActModelData(this._actData.FuncId);
    }

    private scrollEvent(nd: cc.Node, index: number): void {
        const item = nd.getComponent(ActivityRewardItem);
        item.setData(this._listData[index]);
    }

    private uptReward(data: S2CGetOnlineAward) {
        if (data.FuncId === this._actData.FuncId && data.CycNo === this._actData.CycNo) {
            this.updateList();
        }
    }

    private uptActData(data: S2CPlayerActModelData) {
        if (data.FuncId === this._actData.FuncId && data.CycNo === this._actData.CycNo) {
            this.updateList();
        }
    }

    private updateList(): void {
        const model = ModelMgr.I.OnlineRewardModel;
        this._listData = model.GetOnlineRewardListData(this._actData.Config.ArgsGroup);
        this.list.setNumItems(this._listData.length);
        const time = model.GetUserOnlineTotalTime();
        this.LabTime.string = UtilTime.FormatTime(time, '%HH时%mm分%ss秒', false, false);
        this.schedule(() => {
            const time = model.GetUserOnlineTotalTime();
            this.LabTime.string = UtilTime.FormatTime(time, '%HH时%mm分%ss秒', false, false);
        }, 1, cc.macro.REPEAT_FOREVER);
    }

    protected onDestroy(): void {
        super.onDestroy();

        EventClient.I.off(E.OnlineReward.UptData, this.uptReward, this);
        EventClient.I.off(E.Activity.Data, this.uptActData, this);
    }
}

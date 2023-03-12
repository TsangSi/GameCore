/*
 * @Author: myl
 * @Date: 2023-02-07 15:18:32
 * @Description:
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import ListView from '../../../base/components/listview/ListView';
import ItemModel from '../../../com/item/ItemModel';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { EDailyPageType } from '../../daily/DailyConst';
import { DailyTaskType, EDailyTaskStatus } from '../DailyTaskConst';
import { IComStageRewardData } from './ComStageRewardBox';
import ComStageRewardProgress from './ComStageRewardProgress';
import DailyTaskItem from './DailyTaskItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class DailyWeeklyTaskPage extends WinTabPage {
    @property(ListView)
    private list: ListView = null;
    @property(cc.RichText)
    private RichHalfTip: cc.RichText = null;

    @property(ComStageRewardProgress)
    private stageReward: ComStageRewardProgress = null;

    private _listData: { cfg: Cfg_DailyTasks, state: EDailyTaskStatus }[] = [];
    public init(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        super.init(winId, param, tabIdx, tabId);
        EventClient.I.on(E.DailyTask.Data, this.updateUIData, this);

        EventClient.I.on(E.DailyTask.StageReward, this.reqData, this);
        EventClient.I.on(E.Task.UpdateTask, this.taskUpdate, this);
        this.reqData();
    }

    public refreshPage(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        super.refreshPage(winId, param, tabIdx, tabId);
        this.reqData();
    }

    private reqData() {
        if (this.tabId === EDailyPageType.Daily) {
            this.unschedule(this.updateTime);
            this.RichHalfTip.string = UtilString.FormatArray(i18n.tt(Lang.daily_update_tip), [UtilColor.GreenD]);
        } else {
            this.unschedule(this.updateTime);
            this.schedule(this.updateTime, 1, cc.macro.REPEAT_FOREVER, 0.1);
        }
        ControllerMgr.I.DailyTaskController.getDailyWeeklyTaskInfo(this.tabId);
    }

    private updateTime() {
        const week1Time = UtilTime.GetTimeZone(1, true); // 下周1的0点的时间
        const timeInstance = week1Time - UtilTime.NowSec();
        let formatter = '';
        if (timeInstance >= 3600 * 24) {
            formatter = i18n.tt(Lang.com_time_fmt_dh);
        } else {
            formatter = i18n.tt(Lang.com_time_fmt_hms);
        }
        const timeStr = UtilTime.FormatTime(timeInstance, formatter);
        this.RichHalfTip.string = UtilString.FormatArray(i18n.tt(Lang.weekly_update_tip), [UtilColor.GreenD, timeStr]);
    }

    private taskUpdate(ids: number[]) {
        let needRef = false;
        for (let i = 0; i < this._listData.length; i++) {
            const itm = this._listData[i];
            if (ids.indexOf(itm.cfg.Id)) {
                needRef = true;
                break;
            }
        }
        if (needRef) {
            this.updateUIData(1);
        }
    }

    private updateUIData(type: number): void {
        const {
            tasks, stage, activityNum, maxActNum,
        } = ModelMgr.I.DailyTaskModel.getTaskListData(this.tabId);
        this._listData = tasks;
        this.list.setNumItems(this._listData.length);
        this.updateActivityPart(stage, activityNum, maxActNum);
    }

    /** 更新活跃度部分的UI */
    private updateActivityPart(
        stage: { cfg: Cfg_StageReward, data: DailyStageReward }[],
        activityNum: number,
        maxActNum: number,
    ) {
        const arr: IComStageRewardData[] = [];
        for (let i = 0; i < stage.length; i++) {
            const { cfg, data } = stage[i];
            const result = ModelMgr.I.DailyTaskModel.transformDataToComStageRewardData(cfg, data, (reward: ItemModel[], state: number) => {
                console.log(reward, state);
                if (state === 2) {
                    ControllerMgr.I.DailyTaskController.getStageReward(cfg.Id);
                } else {
                    const titleStr = UtilString.FormatArray(i18n.tt(Lang.daily_activity_get_tip), [UtilColor.GreenV, cfg.Activity]);
                    WinMgr.I.open(ViewConst.ComItemsScanWin, reward, titleStr);
                }
            });
            arr.push(result);
        }
        this.stageReward.setData(activityNum, maxActNum, arr, this.tabId);
    }

    private scrollEvent(nd: cc.Node, index: number): void {
        const ndComp = nd.getComponent(DailyTaskItem);
        ndComp.setData(this._listData[index]);
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.DailyTask.Data, this.updateUIData, this);
        EventClient.I.off(E.DailyTask.StageReward, this.reqData, this);
        EventClient.I.off(E.Task.UpdateTask, this.taskUpdate, this);
    }
}

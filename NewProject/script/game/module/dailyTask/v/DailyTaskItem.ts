/*
 * @Author: myl
 * @Date: 2023-02-08 14:56:22
 * @Description:
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import Progress from '../../../base/components/Progress';
import { Config } from '../../../base/config/Config';
import { ConfigConst } from '../../../base/config/ConfigConst';
import { ConfigDropRewardIndexer } from '../../../base/config/indexer/ConfigDropRewardIndexer';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import UtilItemList from '../../../base/utils/UtilItemList';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { EItemLeftCustomLogoName } from '../../../com/item/ItemConst';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ItemModel from '../../../com/item/ItemModel';
import { E } from '../../../const/EventName';
import ControllerMgr from '../../../manager/ControllerMgr';
import { Link } from '../../link/Link';
import { ETaskStatus, ETaskType } from '../../task/TaskConst';
import { TaskMgr } from '../../task/TaskMgr';
import { TaskModel } from '../../task/TaskModel';
import { EDailyTaskStatus } from '../DailyTaskConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class DailyTaskItem extends cc.Component {
    @property(cc.Label)
    private LabTaskName: cc.Label = null;
    @property(Progress)
    private progBar: Progress = null;

    @property(cc.Node)
    private NdReward: cc.Node = null;

    @property(cc.Node)
    private BtnGo: cc.Node = null;
    @property(cc.Node)
    private BtnGet: cc.Node = null;
    @property(cc.Node)
    private NdGated: cc.Node = null;

    private _data: { cfg: Cfg_DailyTasks, state: EDailyTaskStatus } = null;
    /**
     * @param d 配置表数据
     */
    public setData(d: { cfg: Cfg_DailyTasks, state: EDailyTaskStatus }): void {
        this._data = d;
        // this.NdReward.destroyAllChildren();
        // this.NdReward.removeAllChildren();
        const taskData = TaskMgr.I.getTaskModel(d.cfg.Id);
        this.LabTaskName.string = TaskModel.GetTaskDesc(d.cfg);
        this.BtnGo.active = d.state === EDailyTaskStatus.Processing;
        this.BtnGet.active = d.state === EDailyTaskStatus.Completed;
        this.NdGated.active = d.state === EDailyTaskStatus.Awarded;

        UtilRedDot.UpdateRed(this.BtnGet, d.state === EDailyTaskStatus.Completed, cc.v2(50, 18));

        this.progBar.updateProg(taskData.count, Number(d.cfg.TargetCount));

        const indexer: ConfigDropRewardIndexer = Config.Get(ConfigConst.Cfg_DropReward);
        const reward1 = indexer.getValueByDay(d.cfg.Prize).ShowItems;
        const reward1s = reward1.split('|');

        const isWeekly = UtilTime.isWeekEnd();
        let reward2 = '';
        if (isWeekly) {
            reward2 = indexer.getValueByDay(d.cfg.WeekReward)?.ShowItems;
        }
        const reward2s = reward2 === '' || reward2 === undefined || reward2 === null ? [] : reward2.split('|');
        const rewardsLen = reward1s.length + reward2s.length;
        const rewards: ItemModel[] = [];
        for (let i = 0; i < rewardsLen; i++) {
            const itm = reward1s[i] || reward2s[i - reward1s.length];
            const itemCfg = itm.split(':');
            const itemModel = UtilItem.NewItemModel(Number(itemCfg[0]), Number(itemCfg[1]));
            rewards.push(itemModel);
        }
        UtilItemList.ShowItemArr(this.NdReward, rewards, { option: { needNum: true } }, (nd: cc.Node, i: number) => {
            if (i >= reward1s.length) {
                const itemIcon = nd.getComponent(ItemIcon);
                itemIcon.refreshLeftCustomLogo(EItemLeftCustomLogoName.Weekly);
            }
        });
    }

    protected start(): void {
        UtilGame.Click(this.BtnGo, () => {
            Link.To(this._data.cfg.FuncId);
        }, this);
        UtilGame.Click(this.BtnGet, () => {
            ControllerMgr.I.DailyTaskController.getDailyWeeklyTaskReward(this._data.cfg.Id);
        }, this);

        // EventClient.I.on(E.Task.UpdateTask, this.taskUpdate, this);
    }

    private taskUpdate(ids: number[]) {
        if (ids.indexOf(this._data.cfg.Id) > -1) {
            const tskState = TaskMgr.I.getTaskModel(this._data.cfg.Id)?.status;
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
            this._data.state = state;
            this.setData(this._data);
        }
    }
    protected onDestroy(): void {
        // EventClient.I.off(E.Task.UpdateTask, this.taskUpdate, this);
    }
}

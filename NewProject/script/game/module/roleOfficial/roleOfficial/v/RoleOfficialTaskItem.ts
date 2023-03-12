/*
 * @Author: myl
 * @Date: 2022-10-12 11:19:22
 * @Description:
 */

import { EventClient } from '../../../../../app/base/event/EventClient';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import Progress from '../../../../base/components/Progress';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItem from '../../../../base/utils/UtilItem';
import UtilRedDot from '../../../../base/utils/UtilRedDot';
import { E } from '../../../../const/EventName';
import { RES_ENUM } from '../../../../const/ResPath';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { Link } from '../../../link/Link';
import { ETaskStatus } from '../../../task/TaskConst';
import { TaskMgr } from '../../../task/TaskMgr';
import { TaskModel } from '../../../task/TaskModel';
import { OfficialExpId } from '../../RoleOfficialConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class RoleOfficialTaskItem extends cc.Component {
    @property(cc.Node)
    private iconNode: cc.Node = null;
    @property(cc.Label)
    private taskNameLab: cc.Label = null;

    @property(Progress)
    private progress: Progress = null;
    /** 领取完 */
    @property(cc.Node)
    private NdFinisTask: cc.Node = null;

    /** 领取人物奖励 */
    @property(cc.Node)
    private BtnGift: cc.Node = null;
    /** 前往 */
    @property(cc.Node)
    private BtnGo: cc.Node = null;

    @property(cc.Label)
    private rewardExpLab: cc.Label = null;

    private _data: { conf: Cfg_OfficialTask, data: TaskModel } = null;

    @property(cc.Label)
    private LabCount1: cc.Label = null;
    @property(DynamicImage)
    private iconSpr: DynamicImage = null;

    @property(DynamicImage)
    private SprExp: DynamicImage = null;

    /** 推荐角标 */
    @property(cc.Node)
    private NdTag: cc.Node = null;

    protected start(): void {
        UtilGame.Click(this.BtnGift, () => {
            ControllerMgr.I.RoleOfficialController.getOfficialTaskReward(this._data.conf.Id);
        }, this);

        UtilGame.Click(this.BtnGo, () => {
            Link.To(this._data.conf.FuncId);
        }, this);
        EventClient.I.on(E.Task.UpdateTask, this.taskUpdate, this);
    }

    private taskUpdate(ids: number[]) {
        if (ids.indexOf(this._data.data.Id) > -1) {
            this._data.data = TaskMgr.I.getTaskModel(this._data.data.Id);
            this.setData(this._data);
        }
    }

    public setData(data: { conf: Cfg_OfficialTask, data: TaskModel }): void {
        this._data = data;
        this.taskNameLab.string = TaskModel.GetTaskDesc(this._data.conf);
        this.NdFinisTask.active = this._data.data.status === ETaskStatus.Awarded;
        this.BtnGift.active = this._data.data.status === ETaskStatus.Completed;
        UtilRedDot.UpdateRed(this.node, this._data.data.status === ETaskStatus.Completed, cc.v2(280, 20));
        this.BtnGo.active = this._data.data.status === ETaskStatus.Processing;
        this.progress.updateProgress(data.data.count, data.conf.TargetCount, false);
        const prize = this._data.conf.Prize.split('|');
        this.rewardExpLab.string = prize[0].split(':')[1];

        const prize1 = prize[1].split(':');
        this.LabCount1.string = prize1[1];
        this.iconSpr.loadImage(`${RES_ENUM.Item}${prize1[0]}`, 1, true);
        this.NdTag.active = data.conf.TaskTag === 2;

        const iconPath = UtilItem.GetItemIconPathByItemId(OfficialExpId);
        this.SprExp.loadImage(iconPath, 1, true);
    }

    protected onDestroy(): void {
        EventClient.I.off(E.Task.UpdateTask, this.taskUpdate, this);
    }
}

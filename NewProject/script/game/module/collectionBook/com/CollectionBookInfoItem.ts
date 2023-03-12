/*
 * @Author: zs
 * @Date: 2022-12-01 18:07:40
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\collectionBook\com\CollectionBookInfoItem.ts
 * @Description:
 *
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import Progress from '../../../base/components/Progress';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { ETaskStatus } from '../../task/TaskConst';
import { TaskMgr } from '../../task/TaskMgr';
import { TaskModel } from '../../task/TaskModel';
import { ECollectionBookCfg } from '../CollectionBookConst';

const { ccclass, property } = cc._decorator;

enum ERewardStatus {
    /** 未解锁 */
    UnLock,
    /** 能领取 */
    CanGet,
    /** 已领取 */
    Ylq,
}
@ccclass
export default class CollectionBookInfoItem extends BaseCmp {
    @property(cc.Label)
    private LabelNum: cc.Label = null;
    @property(cc.Label)
    private LabelDesc: cc.Label = null;
    @property(Progress)
    private Progress: Progress = null;
    @property(cc.Node)
    private NodeYlq: cc.Node = null;
    @property(cc.Node)
    private BtnReward: cc.Node = null;
    @property(cc.Node)
    private NodeLock: cc.Node = null;

    private taskId: number = null;
    private cfgCBTask: Cfg_CollectionBookTask = null;
    public setData(taskId: number): void {
        this.taskId = taskId;
        // this.LabelNum.string = `${taskId}`;
        // this.LabelDesc.string = `${taskId}`;

        this.cfgCBTask = ModelMgr.I.CollectionBookModel.getCfg(ECollectionBookCfg.Task).getValueByKey(taskId);

        this.LabelNum.string = `${this.cfgCBTask.AddPoint}`;
        this.LabelDesc.string = TaskModel.GetTaskDesc(this.cfgCBTask);

        this.updateRewardStatus();
        const task = TaskMgr.I.getTaskModel(taskId);
        if (task) {
            this.Progress.updateProgress(task.count, this.cfgCBTask.TargetCount, false);
        }
    }

    protected start(): void {
        super.start();
        UtilGame.Click(this.BtnReward, this.onBtnReward, this);
        EventClient.I.on(E.Task.UpdateTask, this.onUpdateTask, this);
    }

    private onUpdateTask(ids: number[]) {
        if (ids.indexOf(this.taskId) >= 0) {
            const task = TaskMgr.I.getTaskModel(this.taskId);
            if (task) {
                this.updateRewardStatus();
                this.Progress.updateProgress(task.count, this.cfgCBTask.TargetCount, false);
            }
        }
    }

    public updateProgress(cur: number, max?: number, isShowAction?: boolean): void {
        this.Progress.updateProgress(cur, max, isShowAction);
    }

    private action: cc.Tween<cc.Node> = null;
    /**
     * 更新奖励按钮状态
     * @param status 状态
     */
    public updateRewardStatus(): void {
        const status = TaskMgr.I.getTaskModel(this.taskId)?.status || ETaskStatus.Processing;
        this.NodeYlq.active = status === ETaskStatus.Awarded;
        this.NodeLock.active = status === ETaskStatus.Processing;
        this.BtnReward.active = status !== ETaskStatus.Awarded;
        if (this.BtnReward) {
            UtilColor.setGray(this.BtnReward, status !== ETaskStatus.Completed);
        }
        UtilRedDot.UpdateRed(this.BtnReward, status === ETaskStatus.Completed, cc.v2(18, 27));
        if (status === ETaskStatus.Completed) {
            if (this.action) {
                this.action.stop();
                this.action = null;
            }
            this.action = cc.tween(this.BtnReward).repeatForever(cc.tween().to(0.5, { angle: 10 }).to(0.5, { angle: -10 })).start();
        } else {
            if (this.action) {
                this.action.stop();
                this.action = null;
            }
            this.BtnReward.angle = 0;
        }
    }

    private onBtnReward() {
        const status = TaskMgr.I.getTaskModel(this.taskId)?.status;
        if (status === ETaskStatus.Completed) {
            ControllerMgr.I.CollectionBookController.C2SCollectionBookTask(this.taskId);
        } else if (status === ETaskStatus.Awarded) {
            MsgToastMgr.Show(i18n.tt(Lang.com_received));
        } else if (status === ETaskStatus.Processing) {
            WinMgr.I.open(ViewConst.CollectionBookRw, this.cfgCBTask.Prize, false);
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Task.UpdateTask, this.onUpdateTask, this);
    }
}

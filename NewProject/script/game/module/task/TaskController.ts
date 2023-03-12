/*
 * @Author: zs
 * @Date: 2022-07-25 15:12:01
 * @FilePath: \SanGuo\assets\script\game\module\task\TaskController.ts
 * @Description:
 */
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import NetMgr from '../../manager/NetMgr';
import { TaskMgr } from './TaskMgr';

const { ccclass } = cc._decorator;
@ccclass('TaskController')
export class TaskController extends BaseController {
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CTaskDataPush_ID, this.onS2CTaskDataPush, this);
        EventProto.I.on(ProtoId.S2CMainTaskInfo_ID, this.onS2CMainTaskInfo, this);
        EventProto.I.on(ProtoId.S2CMainTaskReward_ID, this.onS2CMainTaskReward, this);
    }
    public delNetEvent(): void {
        // throw new Error('Method not implemented.');
        EventProto.I.off(ProtoId.S2CTaskDataPush_ID, this.onS2CTaskDataPush, this);
        EventProto.I.off(ProtoId.S2CMainTaskInfo_ID, this.onS2CMainTaskInfo, this);
        EventProto.I.off(ProtoId.S2CMainTaskReward_ID, this.onS2CMainTaskReward, this);
    }
    public addClientEvent(): void {
        // throw new Error('Method not implemented.');
    }
    public delClientEvent(): void {
        // throw new Error('Method not implemented.');
    }
    public clearAll(): void {
        // throw new Error('Method not implemented.');
    }

    /** 请求主线任务id */
    public C2SMainTaskInfo(): void {
        NetMgr.I.sendMessage(ProtoId.C2SMainTaskInfo_ID);
    }

    private onS2CMainTaskInfo(d: S2CMainTaskInfo) {
        if (d.Tag === 0) {
            TaskMgr.I.setMainTaskInfo(d);
        }
    }

    /** 请求领取主线任务奖励 */
    public C2SMainTaskReward(): void {
        NetMgr.I.sendMessage(ProtoId.C2SMainTaskReward_ID);
    }

    private onS2CMainTaskReward(d: S2CMainTaskReward): void {
        if (d.Tag === 0) {
            //
        }
    }

    private onS2CTaskDataPush(d: S2CTaskDataPush) {
        if (d.Tag === 0) {
            TaskMgr.I.setTasks(d.Tasks);
        }
    }
}

/*
 * @Author: zs
 * @Date: 2022-07-25 15:12:12
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\task\TaskMgr.ts
 * @Description:
 */
import { EventClient } from '../../../app/base/event/EventClient';
import { UtilString } from '../../../app/base/utils/UtilString';
import { i18n, Lang } from '../../../i18n/i18n';
import { Config } from '../../base/config/Config';
import { GuideMgr } from '../../com/guide/GuideMgr';
import { E } from '../../const/EventName';
import { FuncId } from '../../const/FuncConst';
import ModelMgr from '../../manager/ModelMgr';
import MapCfg from '../../map/MapCfg';
import { ECountType, ETaskStatus } from './TaskConst';
import { TaskModel } from './TaskModel';

const { ccclass } = cc._decorator;
@ccclass('TaskMgr')
export class TaskMgr {
    private static _Instance: TaskMgr;
    public static get I(): TaskMgr {
        if (!this._Instance) {
            this._Instance = new TaskMgr();
        }
        return this._Instance;
    }
    private initTask: boolean = false;
    private taskModelById: { [Id: number]: TaskModel } = cc.js.createMap(true);

    /** 主线任务id */
    private mainTaskId: number = 0;

    /** 设置所有任务 */
    public setTasks(tasks: Task[]): void {
        let ids: number[] = [];
        const completedIds: number[] = [];
        tasks.forEach((t) => {
            const tModel: TaskModel = this.taskModelById[t.Id];
            if (tModel) {
                tModel.updateByTask(t);
                if (this.curMainTaskCfg.Id === t.Id) {
                    this._curMainTaskCfg.Count = tModel.count;
                }
            } else {
                this.taskModelById[t.Id] = new TaskModel(t);
            }
            if (t.S === ETaskStatus.Completed) {
                completedIds.push(t.Id);
            } else {
                ids.push(t.Id);
            }
        });
        ids = ids.concat(completedIds);
        if (this.initTask === false) {
            this.initTask = true;
            if (ids.length > 0) {
                EventClient.I.emit(E.Task.InitTask, ids);
            }
        } else {
            if (ids.length > 0) {
                EventClient.I.emit(E.Task.UpdateTask, ids);
            }
            if (completedIds.length > 0) {
                EventClient.I.emit(E.Task.CompletedTask, completedIds);
            }
        }
    }

    /** 根据任务id获取任务信息 */
    public getTaskModel(id: number): TaskModel | undefined {
        return this.taskModelById[id];
    }

    /** 获取主线任务信息 */
    public get mainTaskModel(): TaskModel | undefined {
        return this.getTaskModel(this.mainTaskId);
    }

    /**
     * 是否完成当前的主线任务
     */
    public isCompletedMainTask(id?: number): boolean {
        id = id || this.mainTaskId;
        if (id) {
            return this.isCompleted(id);
        } else {
            return this.curMainTaskCfg.Count >= this.curMainTaskCfg.TargetCount;
        }
    }

    /** 某个任务是否已完成 */
    public isCompleted(id: number): boolean {
        if (this.taskModelById[id]) {
            return this.taskModelById[id].status === ETaskStatus.Completed;
        }
        return false;
    }
    /** 某个任务是否已领奖 */
    public isAwarded(id: number): boolean {
        if (this.taskModelById[id]) {
            return this.taskModelById[id].status === ETaskStatus.Awarded;
        }
        return false;
    }

    /** 某个任务是否进行中 */
    public isProcessing(id: number): boolean {
        if (this.taskModelById[id]) {
            return this.taskModelById[id].status === ETaskStatus.Processing;
        }
        return false;
    }

    /** 获取任务的名字 带进度 */
    public getFinallyName(str: string, before: string, after: string): string {
        // if (/[A-Z]/.test(before[0])) {
        //     after = after[0].toUpperCase() + after.slice(1); // toLowerCase()
        // }
        return str.replace(before, after);
    }

    private _lastTaskId: number = 0;
    /** 最后一个主线任务id */
    public get lastTaskId(): number {
        return this._lastTaskId || 0;
    }

    /** 设置主线任务信息 */
    public setMainTaskInfo(info: S2CMainTaskInfo): void {
        this.mainTaskId = info.CurTaskId;
        this._lastTaskId = info.LastTaskId;
        if (info.CurTaskId) {
            this._curMainTaskCfg = Config.Get(Config.Type.Cfg_LinkTask).getValueByKey(this.mainTaskId);
            this._curMainTaskCfg.Count = this.mainTaskModel?.count || 0;
            GuideMgr.I.isDoing = true;
        } else if (info.StageTarget) {
            const stageInfo = ModelMgr.I.GameLevelModel.getChapterMsg(info.StageTarget);

            this._curMainTaskCfg = {
                Id: info.CurTaskId,
                Count: info.CurStage,
                CounterType: ECountType.GameLevel,
                Finger: 0,
                TargetCount: info.StageTarget,
                Name: UtilString.FormatArgs(i18n.tt(Lang.maintask_name), stageInfo.chapter, stageInfo.level),
                FuncId: FuncId.GuanKa,
                Prize: Config.Get(Config.Type.Cfg_MapTask).getValueByKey(MapCfg.I.mapIdYW, 'Prize'),
            };
            GuideMgr.I.isDoing = false;
        } else {
            GuideMgr.I.isDoing = false;
            this._curMainTaskCfg = cc.js.createMap(true);
        }
        EventClient.I.emit(E.Task.ChangeMainTaskId, info.CurTaskId);
    }

    private _curMainTaskCfg: IMainTaskCfg;
    public get curMainTaskCfg(): IMainTaskCfg {
        return this._curMainTaskCfg || cc.js.createMap(true) as IMainTaskCfg;
    }

    /**
     * 是否完成所有任务
     */
    public isCompletedAll(): boolean {
        if (this.mainTaskId > 0 && this.mainTaskId === this._lastTaskId) {
            return true;
        }
        return false;
    }
    /** 获取主线任务id,有可能为0 */
    public getMainTaskId(): number | 0 {
        return this.mainTaskId;
    }
}

/** 有任务id的话就是从配置表拿的数据，没有主线任务id的话就是自己组装的 */
interface IMainTaskCfg {
    Id: number,
    /** 主线任务名 */
    Name: string,
    /** 跳转id */
    FuncId: number,
    /** 奖励 */
    Prize: string,
    /** 当前数量 */
    Count?: number,
    /** 目标数量 */
    TargetCount: number,
    /** 引导按钮id */
    TaskGuid?: string,
    /** 是否显示引导手势 */
    Finger: number,
    /** 任务计数类型 */
    CounterType: number,
}

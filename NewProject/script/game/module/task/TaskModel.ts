/*
 * @Author: zs
 * @Date: 2022-07-25 17:04:02
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\task\TaskModel.ts
 * @Description:
 */
import { UtilString } from '../../../app/base/utils/UtilString';
import { i18n, Lang } from '../../../i18n/i18n';
import { Config } from '../../base/config/Config';
import { ConfigCollectionBookIndexer } from '../../base/config/indexer/ConfigCollectionBookIndexer';
import { UtilEquip } from '../../base/utils/UtilEquip';
import UtilItem from '../../base/utils/UtilItem';
import ModelMgr from '../../manager/ModelMgr';
import { ECollectionBookTabId } from '../collectionBook/CollectionBookConst';
import { Link } from '../link/Link';
import {
    ECountType, ETaskStatus, ETaskType,
} from './TaskConst';

interface ITaskCfg {
    /** 任务id */
    Id: number,
    /** 任务类型 */
    Type: number,
    /** 任务名 */
    Name?: string,
    /** 任务计数类型 */
    CountType: number,
    /** 计数器子类型 */
    SubType: number,
    /** 扩展参数 */
    Param: string,
    /** 任务完成条件 */
    TargetCount,
    /** 是否独立计数 */
    Independent: number;
    /** 完成任务奖励方案id数组 */
    Prize?: string;
    /** 跳转页面 */
    FuncId: number;
}

export class TaskModel {
    public constructor(task: Task);
    public constructor(id: number);
    public constructor(idORtask: number | Task) {
        if (typeof idORtask === 'number') {
            this._id = idORtask;
        } else {
            this._id = idORtask.Id;
            this.updateByTask(idORtask);
        }
    }
    private _id: number = 0;
    public get Id(): number {
        return this._id;
    }

    private _count: number = 0;
    /** 当前计数 */
    public get count(): number {
        return this._count;
    }
    public set count(c: number) {
        this._count = c;
    }

    /** 描述 */
    public getDesc(type: ETaskType = ETaskType.Main, targetCount: string | number = undefined, exParam: any = null): string {
        return TaskModel.GetTaskDesc(this.getCfgTask(type, exParam), targetCount, exParam);
    }

    private _status: ETaskStatus = ETaskStatus.Processing;
    /** 状态 */
    public get status(): ETaskStatus {
        return this._status;
    }
    public set status(s: ETaskStatus) {
        this._status = s;
    }

    /** 从任务协议结构体更新任务 */
    public updateByTask(task: Task): void {
        if (this._id !== task.Id) {
            return;
        }
        this._count = task.C - task.IC;
        this._status = task.S;
    }

    private _cfgTask;

    /** 跳转 */
    public linkTo(): void {
        const t = this.getCfgTask();
        Link.To(t?.FuncId);
    }

    /**
     * 根据任务类型获取任务配置
     * @param type 任务类型
     * @returns
     */
    public getCfgTask<T extends ITaskCfg>(type: ETaskType = ETaskType.Main, exParam: any = null): T {
        if (!this._cfgTask) {
            this._cfgTask = TaskModel.GetCfgTask(this.Id, type, exParam);
        }
        return this._cfgTask as T;
    }

    /**
     * 根据任务id和任务类型，获取该任务的配置表
     * @param id 任务id
     * @param type 任务类型
     * @returns
     */
    public static GetCfgTask<T extends ITaskCfg>(id: number, type: ETaskType = ETaskType.Main, exParam: any = null): T {
        switch (type) {
            case ETaskType.Army:
                return Config.Get(Config.Type.Cfg_ArmyTask).getValueByKey(id);
            case ETaskType.Official:
                return Config.Get(Config.Type.Cfg_OfficialTask).getValueByKey(id);
            case ETaskType.CollectionBook:
                return Config.Get(Config.Type.Cfg_CollectionBookTask).getValueByKey(id);
            case ETaskType.DailyTask:
                return Config.Get(Config.Type.Cfg_DailyTasks).getValueByKey(exParam, id);
            default:
                return Config.Get(Config.Type.Cfg_LinkTask).getValueByKey(id);
        }
    }

    /**
     *
     * @param cfg 任务配置
     * @param targetCount 目标值，默认不需要传
     * @returns
     */
    public static GetTaskDesc(cfg: ITaskCfg, targetCount?: number | string, exParam: any = null): string {
        targetCount = targetCount || cfg.TargetCount;
        let params: any[] = [targetCount];
        let cfgParams: string[];
        if (cfg.Param) {
            cfgParams = cfg.Param.split('|');
        }
        const cfgTaskType: Cfg_TaskType = Config.Get(Config.Type.Cfg_TaskType).getValueByKey(cfg.CountType);
        switch (cfg.CountType) {
            case ECountType.GameLevel: // 2
                if (typeof targetCount === 'number') {
                    const c = ModelMgr.I.GameLevelModel.getChapterMsg(cfg.TargetCount);
                    if (c) {
                        params = [`${c.chapter}-${c.level}`];
                    }
                }
                break;
            case ECountType.EquipWearNum: // 3
            case ECountType.BuildEquipShort: // 10019
                params = params.concat(this.GetEquipQualityRebornStar(cfgParams, cfg.SubType, exParam));
                break;
            case ECountType.FightMateriaCount: // 10004
                if (cfg.SubType) {
                    const cfgFBM: Cfg_FB_Material = Config.Get(Config.Type.Cfg_FB_Material).getValueByKey(cfg.SubType);
                    if (cfgFBM) {
                        params.push(cfgFBM.Name);
                    }
                }
                break;
            case ECountType.GradeUp: // 4
            case ECountType.GradeCount: // 10011
            case ECountType.GradeUpStarCount: // 10020
                if (cfg.SubType) {
                    const cfgCF: Cfg_Client_Func = Config.Get(Config.Type.Cfg_Client_Func).getValueByKey(cfg.SubType);
                    if (cfgCF) {
                        params.push(cfgCF.Desc);
                    }
                }
                break;
            case ECountType.RoleArmyLevel: // 10
                if (cfgParams) {
                    params = [ModelMgr.I.ArmyLevelModel.getArmyName(+cfgParams[0], +cfgParams[1])];
                } else {
                    params = [ModelMgr.I.ArmyLevelModel.getArmyName(1)];
                }
                break;
            case ECountType.CollectionBookCount: // 18
            case ECountType.CollectionBookStarCount: // 19
            case ECountType.CollectionBookScore: // 20
                if (cfg?.SubType) {
                    const name = Config.Get<ConfigCollectionBookIndexer>(Config.Type.Cfg_CollectionBook).getSubTypeName(cfg?.SubType);
                    params.push(name);
                }
                params = params.concat(this.GetCollectionParams(cfgParams, cfg?.CountType));
                break;
            case ECountType.CollectionBookCountClass: // 22
            case ECountType.CollectionBookStarCountClass: // 23
            case ECountType.CollectionBookScoreClass: // 24
                if (cfg?.SubType) {
                    const name = Config.Get<ConfigCollectionBookIndexer>(Config.Type.Cfg_CollectionBook).getClassName(cfg?.SubType);
                    params.push(name);
                }
                params = params.concat(this.GetCollectionParams(cfgParams, cfg?.CountType));
                break;
            case ECountType.FightMateriaTotalCount:
                // params.push(cfg.Name || '');
                break;
            default:
                break;
        }
        return UtilString.FormatArray(cfgTaskType?.Desc || '', params);
    }

    /**
     * 装备-根据参数 获取 值列表：[xx品质, xx阶, xx星]
     * @param cfgParams 配置参数
     * @param subType 子类型
     * @param isRich 是否富文本
     * @returns
     */
    private static GetEquipQualityRebornStar(cfgParams: string[], subType: number, isRich: boolean = null) {
        const params: unknown[] = [];
        if (cfgParams) {
            cfgParams.forEach((v, index) => {
                const value = +v;
                if (value) {
                    if (index === 0) {
                        if (isRich) {
                            const qualityColor = UtilItem.GetItemQualityColor(value);
                            params.push(`<color=${qualityColor}>${UtilEquip.GetEquipQualityShortName(value)}</c>`);
                        } else {
                            params.push(UtilEquip.GetEquipQualityShortName(value));
                        }
                    } else if (index === 1) {
                        params.push(`${value}${i18n.tt(Lang.com_reborn)}`);
                    } else if (index === 2) {
                        params.push(`${value}${i18n.tt(Lang.com_star)}`);
                    }
                } else {
                    params.push('');
                }
            });
        } else if (subType) {
            if (isRich) {
                const qualityColor = UtilItem.GetItemQualityColor(subType);
                params.push(`<color=${qualityColor}>${UtilEquip.GetEquipQualityShortName(subType)}</c>`);
            } else {
                params.push(UtilEquip.GetEquipQualityShortName(subType));
            }
        }
        return params;
    }

    /**
     * 博物志-根据参数 获取 值列表：[模块名, 品质或者星级]
     */
    private static GetCollectionParams(cfgParams: string[], countType: number) {
        const params: unknown[] = [];
        if (cfgParams) {
            switch (countType) {
                case ECountType.CollectionBookCount:
                case ECountType.CollectionBookCountClass:
                    params.push(i18n.tt(Lang[`general_quality_se${cfgParams[0]}`]));
                    break;
                case ECountType.CollectionBookStarCount:
                case ECountType.CollectionBookStarCountClass:
                    params.push(cfgParams[0]);
                    break;
                default:
                    break;
            }
        }
        return params;
    }
}

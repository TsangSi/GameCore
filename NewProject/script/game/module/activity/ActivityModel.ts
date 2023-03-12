/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: zs
 * @Date: 2022-10-08 17:46:29
 * @FilePath: \SanGuo2.4\assets\script\game\module\activity\ActivityModel.ts
 * @Description:
 *
 */

import { EventClient } from '../../../app/base/event/EventClient';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { E } from '../../const/EventName';
import { ActData, EActivityCfgState } from './ActivityConst';
import { ConfigMgr } from '../../base/config/ConfigMgr';
import { ConfigInfo } from '../../base/config/ConfigConst';
import ModelMgr from '../../manager/ModelMgr';
import ControllerMgr from '../../manager/ControllerMgr';
import { EventProto } from '../../../app/base/event/EventProto';
import { ExecutorList } from '../../../app/base/executor/ExecutorList';
import { Config } from '../../base/config/Config';
import { RedDotMgr } from '../reddot/RedDotMgr';
import { EActivityRedId } from '../reddot/RedDotConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import { i18n, Lang } from '../../../i18n/i18n';

/** 新增活动结果 */
const enum EAddActivityResult {
    /** 数据为空，未处理 */
    Empty,
    /** 新增 */
    Add,
    /** 更新 */
    Update
}

const { ccclass } = cc._decorator;
@ccclass('ActivityModel')
export class ActivityModel extends BaseModel {
    public init(): void {
        EventProto.I.on(E.Activity.Cfg, this.onRefreshCfg, this);
    }

    public clearAll(): void {
        // throw new Error('Method not implemented.');
    }

    /** 所有活动数据 */
    private _actData: { [FuncId: number]: ActData } = cc.js.createMap(true);

    /** 根据容器存储的活动id列表(需要排序) */
    private _actIds: { [containerId: number]: number[] } = cc.js.createMap(true);

    /** 容器id数组（左上角）（需要排序） */
    private _topContainerIds: number[] = [];
    /** 容器id数组（左边）（需要排序） */
    private _leftContainerIds: number[] = [];

    /** 活动配置表数据 */
    private _actCfgs: { [group: string]: { Ver: number, cfgName: string[] } } = cc.js.createMap(true);
    /** 活动数据状态 */
    private _actCfgState: { [FuncId: number]: EActivityCfgState } = cc.js.createMap(true);

    private _debug: boolean = false;

    /** 左上角容器id列表 */
    public getTopContainerIds(): number[] {
        return this._topContainerIds;
    }

    /** 左边容器id列表 */
    public getLeftContainerIds(): number[] {
        return this._leftContainerIds;
    }

    /** 活动模板下的所有活动id数组 */
    public getActsByContainerId(containerId: number): number[] {
        return this._actIds[containerId];
    }
    /**
     * 获取活动数据
     * @param FuncId 活动id
     * @returns
     */
    public getActivityData(FuncId: number): ActData {
        return this._actData[FuncId];
    }

    /**
     * 保存活动数据
     * @param datas 协议下发的活动数据列表
     */
    public setActivityDatas(datas: PlayerActData[]): void {
        const addActIds: number[] = [];
        const updateActIds: number[] = [];
        let result: EAddActivityResult = EAddActivityResult.Empty;
        datas.forEach((data) => {
            const cfg: Cfg_Server_Activity = JSON.parse(data.Config) as Cfg_Server_Activity;

            result = this.addActivity(data);

            // 是容器类的活动id，才执行。减少不必要的开销
            if (!cfg.ContainerId) {
                if (result === EAddActivityResult.Add) {
                    addActIds.push(data.FuncId);
                } else {
                    updateActIds.push(data.FuncId);
                }
            }

            this.addActtivityToContaniner(data, cfg);
        });

        // 这里只排序容器数组, _actIds的排序在打开界面的时候才排序
        this._topContainerIds.sort((a, b) => {
            const actA: ActData = this._actData[a];
            const actB: ActData = this._actData[b];
            if (actA && actB) {
                if (actA.Config.Order !== actB.Config.Order) {
                    return actA.Config.Order - actB.Config.Order;
                }
                return actA.Config.FuncId - actB.Config.FuncId;
            }
            return -1;
        });

        this._leftContainerIds.sort((a, b) => {
            const actA: ActData = this._actData[a];
            const actB: ActData = this._actData[b];
            if (actA && actB) {
                if (actA.Config.Order !== actB.Config.Order) {
                    return actA.Config.Order - actB.Config.Order;
                }
                return actA.Config.FuncId - actB.Config.FuncId;
            }
            return -1;
        });

        if (addActIds.length > 0) {
            this.log('新增活动=', addActIds);
            EventClient.I.emit(E.Activity.Add, addActIds);
        } else if (updateActIds.length > 0) {
            this.log('更新活动=', updateActIds);
            EventClient.I.emit(E.Activity.Update, updateActIds);
        }
    }

    /**
     * 删除活动
     * @param actIds 活动id列表
     */
    public delActivity(actIds: number[]): void {
        const delLiveActIds: number[] = [];

        for (let i = 0; i < actIds.length; i++) {
            const actId = actIds[i];
            if (this._actData[actId]) {
                delete this._actData[actId];
                delLiveActIds.push(actId);
            }
        }

        // 更新 _actIds
        if (this._actIds) {
            for (let i = 0; i < actIds.length; i++) {
                for (const k in this._actIds) {
                    const index = this._actIds[k].indexOf(actIds[i]);
                    if (index >= 0) {
                        this._actIds[k].splice(index, 1);
                        break;
                    }
                }
            }
        }
        this.log(this._actIds);
        this.log(this._actData);

        if (delLiveActIds.length > 0) {
            this.log('删除活动=', delLiveActIds);
            EventClient.I.emit(E.Activity.Del, delLiveActIds);
        }
    }

    /** 添加一个活动 */
    private addActivity(data: PlayerActData): EAddActivityResult {
        if (!data) { return EAddActivityResult.Empty; }
        const has = !!this._actData[data.FuncId];
        this._actData[data.FuncId] = new ActData(data);
        return has ? EAddActivityResult.Update : EAddActivityResult.Add;
    }

    /** 添加活动到容器数组 */
    private addActtivityToContaniner(data: PlayerActData, cfg: Cfg_Server_Activity): void {
        let ContainerId = cfg.ContainerId;
        if (!cfg.ContainerId) {
            ContainerId = cfg.FuncId;
        }
        if (!this._actIds[ContainerId]) {
            this._actIds[ContainerId] = [];
        }
        //
        if (cfg.ContainerId) {
            if (this._actIds[ContainerId].indexOf(data.FuncId) < 0) {
                this._actIds[ContainerId].push(data.FuncId);
            }
        } else {
            // 区域容器id数组
            const actData = this._actData[data.FuncId];
            if (actData && actData.Config.Pos === 2) {
                if (this._topContainerIds.indexOf(data.FuncId) < 0) {
                    this._topContainerIds.push(data.FuncId);
                }
            } else if (actData && actData.Config.Pos === 3) {
                if (this._leftContainerIds.indexOf(data.FuncId) < 0) {
                    this._leftContainerIds.push(data.FuncId);
                }
            }
        }
    }

    /** 更新活动红点 */
    private _actRed: { [FuncId: number]: number } = cc.js.createMap(true);
    public uptActRed(FuncId: number, Red: number): void {
        this._actRed[FuncId] = Red;

        const actData = this._actData[FuncId];
        if (actData) {
            actData.Red = Red;
        }

        RedDotMgr.I.updateRedDot(EActivityRedId + FuncId, !!Red);

        EventClient.I.emit(E.Activity.Red, FuncId, Red);
    }

    public setActCfgState(FuncId: number, actCfgState: EActivityCfgState): void {
        this._actCfgState[FuncId] = actCfgState;
    }

    public getActCfgState(FuncId: number): EActivityCfgState {
        return this._actCfgState[FuncId];
    }

    private _callbacks: { [name: string]: ExecutorList; } = {};

    public getConfig(FuncId: number, info: ConfigInfo, callback: () => void = null, target: unknown = null): void {
        const cacheData = ConfigMgr.I.getActivityDatas(info.name);
        // const actCfgState: number = ModelMgr.I.ActivityModel.getActCfgState(FuncId);
        /** 没有数据并且不是在请求中就去请求数据 */
        if (!cacheData) { // && actCfgState === EActivityCfgState.None
            ControllerMgr.I.ActivityController.reqC2SGetActivityConfig(FuncId);
            this.addCallback(info.name, callback, target);
        } else {
            callback.call(target, cacheData);
        }
    }

    private addCallback(name: string, callback: (...arg: any) => void, target?: unknown) {
        if (!callback) { return; }
        let callbacks = this._callbacks[name];
        if (callbacks) {
            callbacks.pushUnique(callback, target);
        } else {
            callbacks = this._callbacks[name] = new ExecutorList();
            callbacks.push(callback, target);
        }
    }

    private doCallback(name: string) {
        let callbacks = this._callbacks[name];
        if (!callbacks) { return; }
        callbacks.invokeWithArgs();
        callbacks.clear();
        callbacks = undefined;
    }

    private onRefreshCfg(FuncId: number) {
        // 数据已存在，不需更新
        if (FuncId === 0) {
            console.log('数据已存在，不需更新');
            // todo
        } else {
            const names = this.getActCfgs(FuncId).cfgName;
            for (let i = 0; i < names.length; i++) {
                this.doCallback(names[i]);
            }
        }
    }

    /** 活动的配置数据 */
    public setActCfgs(FuncId: number, Ver: number, actCfg: ActivityConfig[]): void {
        if (!FuncId || !actCfg || actCfg.length === 0) return;

        let group: string = '';
        if (this._actData[FuncId]) {
            group = this._actData[FuncId].Config.ArgsGroup;
        }

        const cfgName: string[] = [];
        for (let i = 0; i < actCfg.length; i++) {
            cfgName.push(actCfg[i].TableName);
        }

        this._actCfgs[group] = {
            Ver,
            cfgName,
        };

        for (let i = 0; i < actCfg.length; i++) {
            const item = actCfg[i];
            const tableName = Config.Type[item.TableName];
            if (tableName) {
                Config.Get(tableName).setActivityDatas(tableName.name, item.Data);
            }
        }
    }

    /** 获取活动的配置数据的版本号和数据表名 */
    public getActCfgs(FuncId: number): { Ver: number, cfgName: string[] } {
        let group: string = '';
        if (this._actData[FuncId]) {
            group = this._actData[FuncId].Config.ArgsGroup;
        }
        return this._actCfgs[group];
    }

    /** 活动配置的版本号 */
    public getActVer(FuncId: number): number {
        let group: string = '';
        if (this._actData[FuncId]) {
            group = this._actData[FuncId].Config.ArgsGroup;
        }
        const d = this._actCfgs[group];
        if (d) {
            return d.Ver;
        }
        return 0;
    }

    /**
     * 获取活动期号
     * @param FuncId 活动功能id
     */
    public getActCycNo(FuncId: number): number {
        const data = this.getActivityData(FuncId);
        if (!data) return 0;
        return data.CycNo;
    }

    /** 活动子表 需要用group做过滤 */
    public getGroup(FuncId: number): string {
        let group: string = '';
        if (this._actData[FuncId]) {
            group = this._actData[FuncId].Config.ArgsGroup;
        }
        return group;
    }

    /** 提供打开活动的接口 */
    public openActivity(funcId: number): void {
        const actData: ActData = ModelMgr.I.ActivityModel.getActivityData(funcId);
        if (actData) {
            let containerId: number = actData.Config.ContainerId;
            if (!containerId) {
                containerId = actData.Config.FuncId;
            }
            WinMgr.I.open(containerId, actData.Config.FuncId);
        } else {
            console.log('没有该活动数据：', funcId);
        }
    }

    /** 活动是否开启 */
    public isOpen(funcId: number, showTips: boolean = false): boolean {
        const isHave: boolean = !!ModelMgr.I.ActivityModel.getActivityData(funcId);
        if (!isHave && showTips) {
            MsgToastMgr.Show(i18n.tt(Lang.activity_unopen));
        }
        return isHave;
    }

    /** 打印 */
    private log(message?: any, ...optionalParams: any[]) {
        if (this._debug) {
            console.log.apply(console, arguments);
        }
    }
}

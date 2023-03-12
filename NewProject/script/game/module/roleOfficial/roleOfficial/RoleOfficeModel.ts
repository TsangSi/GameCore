/*
 * @Author: myl
 * @Date: 2022-10-11 21:55:24
 * @Description:
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import BaseModel from '../../../../app/core/mvc/model/BaseModel';
import { Config } from '../../../base/config/Config';
import { ConfigConst } from '../../../base/config/ConfigConst';
import { ConfigIndexer } from '../../../base/config/indexer/ConfigIndexer';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import { E } from '../../../const/EventName';
import { FuncId } from '../../../const/FuncConst';
import { ViewConst } from '../../../const/ViewConst';
import { RedDotCheckMgr } from '../../reddot/RedDotCheckMgr';
import { IListenInfo, RID, REDDOT_ADD_LISTEN_INFO } from '../../reddot/RedDotConst';
import { RedDotMgr } from '../../reddot/RedDotMgr';
import { RoleAN } from '../../role/RoleAN';
import { RoleMgr } from '../../role/RoleMgr';
import { TaskMgr } from '../../task/TaskMgr';
import { TaskModel } from '../../task/TaskModel';
import { OfficiaName, OfficiaTitle } from '../RoleOfficialConst';

const { ccclass, property } = cc._decorator;

@ccclass('RoleOfficeModel')
export class RoleOfficeModel extends BaseModel {
    private OfficialNameConf: Map<number, string> = new Map();
    private OfficialName1Conf: Map<number, string> = new Map();
    /** 常量是否已经配置 */
    private _constInit: boolean = false;
    /** 任务 */
    private _tasks: number[] = [];
    /** 等级奖励 */
    private _rewards: OfficeTargetReward[] = [];
    /** 每日奖励领取状态 */
    private _DailyReward: number = 0;
    private _dailyLv: number = 0;

    public set DailyLv(v: number) {
        this._dailyLv = v;
    }

    public get DailyLv(): number {
        return this._dailyLv;
    }

    public get officialLevel(): number {
        return RoleMgr.I.d.OfficeLevel;
    }

    public set tasks(v: number[]) {
        this._tasks = v;
        this.updateRed();
    }

    public get tasks(): number[] {
        return this._tasks;
    }

    public set rewards(v: OfficeTargetReward[]) {
        v.sort((a, b) => a.Level - b.Level);
        v.sort((m, n) => m.State - n.State);
        this._rewards = v;
        // 更新红点
        this.updateRed1();
    }

    public get rewards(): OfficeTargetReward[] {
        return this._rewards;
    }

    public updateRewards(lv: number): void {
        this._rewards.forEach((item) => {
            if (item.Level === lv) {
                item.State = 1; // 改为已领取
            }
        });
        this._rewards.sort((m, n) => m.State - n.State);
        // 发送事件修改界面
        EventClient.I.emit(E.RoleOfficial.OfficialRankReward, lv);
    }

    public set DailyReward(v: number) {
        this._DailyReward = v;
        // 发送事件修改界面
        EventClient.I.emit(E.RoleOfficial.OfficialDayReward);
        // 更新红点
        this.updateRed1();
    }

    public get DailyReward(): number {
        // 0是未领取，1是已领取
        return this._DailyReward;
    }

    public clearAll(): void {
        this.OfficialName1Conf.clear();
        this.OfficialNameConf.clear();
        this._tasks = [];
    }

    /** 根据id获取task详情 */
    public GetTaskInfo(id: number = 100001): Cfg_OfficialTask {
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_OfficialTask);
        return indexer.getValueByKey(id);
    }

    /** 获取官职配置信息 */
    public GetOfficialConfig(id: number = 0): Cfg_Official {
        if (id <= 0) {
            id = this.officialLevel;
        }
        /** 容错处理 */
        if (id <= 0) {
            id = 1;
        }
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_Official);
        return indexer.getValueByKey(id);
    }

    /** 根据官职获取官职的详细信息 */
    public getOfficialInfo(id: number = 0): {
        name1: string,
        name2: string,
        conf: Cfg_Official
    } {
        if (id <= 0) {
            id = this.officialLevel;
        }
        /** 容错处理 */
        if (id <= 0) {
            id = 1;
        }
        const conf = this.GetOfficialConfig(id);
        if (!conf) { // 满级处理
            return null;
        }
        const name1 = this.getConstNameConfig(conf.OfficialLevel);
        const name2 = this.getConstName1Config(conf.OfficialStar);
        return { name1, name2, conf };
    }

    /** 常量表中二级官职配置信息 */
    public getConstName1Config(id: number): string {
        if (!this._constInit) {
            this.getConstConfig();
        }
        return this.OfficialName1Conf.get(id);
    }

    /** 常量表中一级官职配置信息 */
    public getConstNameConfig(id: number): string {
        if (!this._constInit) {
            this.getConstConfig();
        }
        return this.OfficialNameConf.get(id);
    }

    /** 官职常量表 */
    private getConstConfig(): void {
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_OfficialConstant);
        const conf: Cfg_OfficialConstant = indexer.getValueByKey(OfficiaTitle);
        const nStrs = conf.CfgValue.split('|');
        for (let i = 0; i < nStrs.length; i++) {
            const it = nStrs[i].split(':');
            this.OfficialNameConf.set(parseInt(it[0]), it[1]);
        }

        const conf1: Cfg_OfficialConstant = indexer.getValueByKey(OfficiaName);
        const n1Strs = conf1.CfgValue.split('|');
        for (let j = 0; j < n1Strs.length; j++) {
            const it = n1Strs[j].split(':');
            this.OfficialName1Conf.set(parseInt(it[0]), it[1]);
        }

        this._constInit = true;
    }

    public currentTasks: Map<number, { conf: Cfg_OfficialTask, data: TaskModel }> = new Map();
    /** 获取当前进行的任务 */
    public getCurrentTasks(): { conf: Cfg_OfficialTask, data: TaskModel }[] {
        this.currentTasks.clear();
        const tasksData: { conf: Cfg_OfficialTask, data: TaskModel }[] = [];
        for (let i = 0; i < this.tasks.length; i++) {
            const itemId = this.tasks[i];
            const conf = this.GetTaskInfo(itemId);
            const data = TaskMgr.I.getTaskModel(itemId);
            this.currentTasks.set(itemId, { conf, data });
            if (conf) {
                tasksData.push({ conf, data });
            }
        }
        // 此处需要排序处理
        tasksData.sort((a, b) => a.conf.SortIdx - b.conf.SortIdx);
        tasksData.sort((m, n) => n.data.status - m.data.status);
        return tasksData;
    }

    /** 替换一个任务 */
    public replaceTask(oId: number, newId: number): void {
        // 替换原始数据
        const idx = this.tasks.indexOf(oId);
        this.tasks[idx] = newId;

        const oTsk = this.currentTasks.get(oId);
        if (oTsk) {
            delete this.currentTasks[oId];
        }
        const conf = this.GetTaskInfo(newId);
        const data = TaskMgr.I.getTaskModel(newId);
        this.currentTasks.set(newId, { conf, data });
        // 发送事件到item中  只更新单个item
        EventClient.I.emit(E.RoleOfficial.OfficialTask, oId, newId);
    }

    /** 获得每日奖励内容 */
    public getDayReward(): { reward: string, state: boolean } {
        const reward = this.getOfficialInfo(this.DailyLv).conf.Salary;
        const state = this.DailyReward > 0;
        return { reward, state };
    }

    /** 红点注册 */
    public registerRedDotListen(): void {
        const info1: IListenInfo = {
            ProtoId: [ProtoId.S2COfficeTargetReward_ID, ProtoId.S2COfficeUp_ID],
            ProxyRid: [RID.Role.Id, RID.Role.RoleOfficial.Id],
            CheckVid: [ViewConst.RoleOfficialRewardWin, ViewConst.RoleWin],
        };
        const info2: IListenInfo = {
            ProtoId: [ProtoId.S2COfficeDailyReward_ID, ProtoId.S2COfficeUp_ID],
            ProxyRid: [RID.Role.Id, RID.Role.RoleOfficial.Id],
            CheckVid: [ViewConst.RoleOfficialRewardWin, ViewConst.RoleWin],
        };
        const info3: IListenInfo = {
            ProtoId: [ProtoId.S2COfficeInfo_ID, ProtoId.S2COfficeUp_ID],
            ProxyRid: [RID.Role.Id, RID.Role.RoleOfficial.Id],
            RoleAttr: [RoleAN.N.OfficeExp, RoleAN.N.OfficeLevel],
            CheckVid: [ViewConst.RoleWin],
        };
        const info4: IListenInfo = {
            ProtoId: [ProtoId.S2COfficeTaskReward_ID, ProtoId.S2CTaskDataPush_ID],
            ProxyRid: [RID.Role.Id, RID.Role.RoleOfficial.Id],
            CheckVid: [ViewConst.RoleWin],
        };
        RedDotMgr.I.emit(
            REDDOT_ADD_LISTEN_INFO,
            { rid: RID.Role.RoleOfficial.Official.Task, info: info4 },
            { rid: RID.Role.RoleOfficial.Official.Up, info: info3 },
            { rid: RID.Role.RoleOfficial.Official.Reward.Day, info: info2 },
            { rid: RID.Role.RoleOfficial.Official.Reward.Rank, info: info1 },
        );
    }

    public onRedDotEventListen(): void {
        RedDotCheckMgr.I.on(RID.Role.RoleOfficial.Official.Id, this.updateRed, this);
        RedDotCheckMgr.I.on(RID.Role.RoleOfficial.Official.Task, this.red1, this);
        RedDotCheckMgr.I.on(RID.Role.RoleOfficial.Official.Reward.Day, this.red4, this);
        RedDotCheckMgr.I.on(RID.Role.RoleOfficial.Official.Reward.Rank, this.red3, this);
        RedDotCheckMgr.I.on(RID.Role.RoleOfficial.Official.Up, this.red2, this);
        RedDotCheckMgr.I.on(RID.Role.RoleOfficial.Official.Reward.Id, this.updateRed1, this);
    }

    public offRedDotEventListen(): void {
        RedDotCheckMgr.I.off(RID.Role.RoleOfficial.Official.Id, this.updateRed, this);
        RedDotCheckMgr.I.off(RID.Role.RoleOfficial.Official.Task, this.red1, this);
        RedDotCheckMgr.I.off(RID.Role.RoleOfficial.Official.Reward.Day, this.red4, this);
        RedDotCheckMgr.I.off(RID.Role.RoleOfficial.Official.Reward.Rank, this.red3, this);
        RedDotCheckMgr.I.off(RID.Role.RoleOfficial.Official.Up, this.red2, this);
        RedDotCheckMgr.I.off(RID.Role.RoleOfficial.Official.Reward.Id, this.updateRed1, this);
    }
    public updateRed(): boolean {
        return this.red1() || this.red2() || this.red3() || this.red4();
    }

    public updateRed1(): boolean {
        return this.red3() || this.red4();
    }

    /** 任务红点 */
    public red1(): boolean {
        if (!UtilFunOpen.isOpen(FuncId.RoleArmyOfficial, false)) {
            return RedDotMgr.I.updateRedDot(RID.Role.RoleOfficial.Official.Task, false);
        }
        for (let i = 0; i < this.tasks.length; i++) {
            const tskId = this.tasks[i];
            const tskInfo = TaskMgr.I.getTaskModel(tskId);
            if (!tskInfo) {
                console.log(tskId, '任务不存在');
                break;
            }
            if (tskInfo.status === 1) {
                return RedDotMgr.I.updateRedDot(RID.Role.RoleOfficial.Official.Task, true);
            }
        }
        return RedDotMgr.I.updateRedDot(RID.Role.RoleOfficial.Official.Task, false);
    }

    /** 升职红点 */
    public red2(): boolean {
        if (!UtilFunOpen.isOpen(FuncId.RoleArmyOfficial, false)) {
            return RedDotMgr.I.updateRedDot(RID.Role.RoleOfficial.Official.Up, false);
        }
        // 判断是否可以升职 当前用户官职经验大于 所需经验
        const nextLev = this.GetOfficialConfig(this.officialLevel + 1);
        if (!nextLev) {
            return RedDotMgr.I.updateRedDot(RID.Role.RoleOfficial.Official.Up, false);
        }
        const red = nextLev.Exp <= RoleMgr.I.d.OfficeExp;
        return RedDotMgr.I.updateRedDot(RID.Role.RoleOfficial.Official.Up, red);
    }

    /** 等级奖励红点 */
    public red3(): boolean {
        if (!UtilFunOpen.isOpen(FuncId.RoleArmyOfficial, false)) {
            return RedDotMgr.I.updateRedDot(RID.Role.RoleOfficial.Official.Reward.Rank, false);
        }
        for (let i = 0; i < this.rewards.length; i++) {
            const itm = this.rewards[i];
            if (itm.State === 0 && itm.Level <= this.officialLevel) {
                return RedDotMgr.I.updateRedDot(RID.Role.RoleOfficial.Official.Reward.Rank, true);
            }
        }
        return RedDotMgr.I.updateRedDot(RID.Role.RoleOfficial.Official.Reward.Rank, false);
    }

    /** 每日红点 */
    public red4(): boolean {
        if (!UtilFunOpen.isOpen(FuncId.RoleArmyOfficial, false)) {
            return RedDotMgr.I.updateRedDot(RID.Role.RoleOfficial.Official.Reward.Day, false);
        }
        return RedDotMgr.I.updateRedDot(RID.Role.RoleOfficial.Official.Reward.Day, this.DailyReward < 1);
    }
}

import { EventClient } from '../../../../app/base/event/EventClient';
import BaseModel from '../../../../app/core/mvc/model/BaseModel';
import { i18n, Lang } from '../../../../i18n/i18n';
import { IAttrBase } from '../../../base/attribute/AttrConst';
import { AttrModel } from '../../../base/attribute/AttrModel';
import { Config } from '../../../base/config/Config';
import { ConfigConst } from '../../../base/config/ConfigConst';
import { UtilAttr } from '../../../base/utils/UtilAttr';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import { E } from '../../../const/EventName';
import { FuncId } from '../../../const/FuncConst';
import { RES_ENUM } from '../../../const/ResPath';
import { ViewConst } from '../../../const/ViewConst';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';
import { RedDotCheckMgr } from '../../reddot/RedDotCheckMgr';
import { IListenInfo, REDDOT_ADD_LISTEN_INFO, RID } from '../../reddot/RedDotConst';
import { RedDotMgr } from '../../reddot/RedDotMgr';
import { RoleMgr } from '../../role/RoleMgr';
import { ETaskStatus, ETaskType } from '../../task/TaskConst';
import { TaskMgr } from '../../task/TaskMgr';
import { TaskModel } from '../../task/TaskModel';

const { ccclass } = cc._decorator;
@ccclass('ArmyLevelModel')
export class ArmyLevelModel extends BaseModel {
    public clearAll(): void {
        //
    }
    public clear(): void {
        //
    }

    public setData(data: S2CArmyInfo): void {
        this.isUseItem = data.IsUseItem;
        this.setSkillIds(data.SkillIds);
    }

    /** 是否已经一键晋升 */
    private _isUserItem = 0;

    public set isUseItem(val: number) {
        this._isUserItem = val;
    }

    public get isUseItem(): number {
        return this._isUserItem;
    }

    /** 已解锁的技能列表 */
    private _SkillIds: number[];
    public setSkillIds(val: number[]): void {
        this._SkillIds = val;
    }

    public addSkill(skillId: number): void {
        if (this._SkillIds && this._SkillIds.length) {
            console.log(`插入成功：${skillId}`);
            this._SkillIds.push(skillId);
        } else {
            console.log(`1插入成功：${skillId}`);
            this._SkillIds = [];
            this._SkillIds.push(skillId);
        }
        EventClient.I.emit(E.ArmyLevel.ArmySkillActive, skillId);
    }

    public getSkillIds(): number[] {
        return this._SkillIds;
    }

    /** 判断某个技能是否解锁 */
    public isSkillActive(skillId: number): boolean {
        if (!this._SkillIds || !this._SkillIds.length) { return false; }
        for (const item of this._SkillIds) {
            if (Number(item) === skillId) {
                return true;
            }
        }
        return false;
    }

    /** 根据军衔等级 军衔星级 获取战力 */
    public getFightValByArmyLv(armyLevel: number, armyStar: number): number {
        const indexer = Config.Get(ConfigConst.Cfg_ArmyGrade);
        const cfg: Cfg_ArmyGrade = indexer.getValueByKey(armyLevel, armyStar);
        const baseAttrInfo = AttrModel.MakeAttrInfo(cfg.Attr);
        return baseAttrInfo.fightValue;
    }

    /** 获取中间图标的路径 */
    public getNameIconByArmyLv(armyLevel: number): string {
        return `${RES_ENUM.Com_Font_Com_Font_Junxian}${armyLevel + 1}@ML`;
    }

    /** 获取中间图标的路径 */
    public getIconByArmyLv(armyLevel: number): string {
        return `${RES_ENUM.Role_RoleArmy_Icon_Junxian}${armyLevel}`;
    }

    /** 是否达到最大级 */
    public isArmyLvMax(armyLevel: number, armyStar: number): boolean {
        if (armyStar < 5) { // 小于5颗星 就是可以晋升
            return false;
        }
        const indexer = Config.Get(ConfigConst.Cfg_ArmyGrade);
        const cfg: Cfg_ArmyGrade = indexer.getValueByKey(armyLevel + 1, armyStar);
        // 没数据 就是达到最大等级
        return !cfg;
    }

    /** 获取军衔配置 有可能为空，自己做判断 */
    public getArmyLevelCfg(armyLevel: number, armyStar: number): Cfg_ArmyGrade {
        const indexer = Config.Get(ConfigConst.Cfg_ArmyGrade);
        const cfg: Cfg_ArmyGrade = indexer.getValueByKey(armyLevel, armyStar);
        return cfg;
    }

    /** 总的条数 */
    public getAllCfgArmyGradeLenth(): number {
        const indexer = Config.Get(ConfigConst.Cfg_ArmyGrade);
        return indexer.length;
    }

    /** 获取军衔等级列表 */
    private _arrCfg: Cfg_ArmyGrade[];
    public getAllCfgArmyGrade(): Cfg_ArmyGrade[] {
        if (this._arrCfg && this._arrCfg.length) {
            return this._arrCfg;
        }

        this._arrCfg = [];
        const indexer = Config.Get(ConfigConst.Cfg_ArmyGrade);
        for (let i = 0, n = indexer.length; i < n; i++) {
            const cfg: Cfg_ArmyGrade = indexer.getValueByIndex(i);
            if (cfg.ArmyLevel !== 0) {
                this._arrCfg.push(cfg);
            }
        }
        return this._arrCfg;
    }

    /** 获取属性信息 */
    public getAttrInfo(armyLevel: number, armyStar: number): IAttrBase[] {
        const indexer = Config.Get(ConfigConst.Cfg_ArmyGrade);
        const cfg: Cfg_ArmyGrade = indexer.getValueByKey(armyLevel, armyStar);
        if (!cfg) {
            return null;// 如果超出了最大等级
        }
        const attr: IAttrBase[] = UtilAttr.GetAttrBaseListById(cfg.Attr);
        return attr;
    }

    /** 获取四个任务ID */
    public getTaskIds(armyLevel: number, armyStar: number): number[] {
        const armyGradeCfg: Cfg_ArmyGrade = this.getArmyLevelCfg(armyLevel, armyStar);
        if (!armyGradeCfg) {
            return [];
        }
        const taskIds: string[] = armyGradeCfg.TaskId.split('|');

        const arr: number[] = [];
        for (const idstr of taskIds) {
            arr.push(Number(idstr));
        }
        return arr;
    }

    public getTaskCfgByTaskId(taskId: number): Cfg_ArmyTask {
        return TaskModel.GetCfgTask(taskId, ETaskType.Army);
    }

    /** 获取任务状态 */
    public getTaskStatusByTaskId(taskId: number): ETaskStatus {
        const taskModel: TaskModel = TaskMgr.I.getTaskModel(Number(taskId));
        if (taskModel) {
            return taskModel.status;
        }
        return ETaskStatus.Processing;
    }

    /** 是否全部任务已领取 */
    public isAllTaskDone(armyLevel: number, armyStar: number): boolean {
        const taskIds: number[] = this.getTaskIds(armyLevel, armyStar);
        for (const id of taskIds) {
            const status = this.getTaskStatusByTaskId(id);
            if (status === ETaskStatus.Processing || status === ETaskStatus.Completed) {
                return false;// 有一个进行中就是未完成
            }
        }
        return true;
    }

    /** 是否全部任务完成 */
    public isAllTaskComplete(armyLevel: number, armyStar: number): boolean {
        const taskIds: number[] = this.getTaskIds(armyLevel, armyStar);
        for (const id of taskIds) {
            const status = this.getTaskStatusByTaskId(id);
            if (status === ETaskStatus.Processing) {
                return false;// 有一个进行中就是未完成
            }
        }
        return true;
    }

    // 根据军衔等级获取技能ID

    public getSkillCfgByArmyLevel(armyLevel: number): Cfg_ArmySkill {
        const skillCfgs: Cfg_ArmySkill[] = ModelMgr.I.RoleSkillModel.getArmySkillCfg();
        if (armyLevel === 0) {
            return skillCfgs[0];
        }

        for (const cfg of skillCfgs) {
            if (Number(cfg.Army.split('|')[0]) === armyLevel) {
                return cfg;
            }
        }
        return null;
    }

    /** 根据字符串配置 获得军衔相关信息 */
    public getArmyuInfoByString(str: string): { army: number, star: number } {
        const num = parseInt(str);
        return { army: Math.floor(num / 100), star: num % 100 };
    }

    /** redDot---begin------------- */
    // 红点
    public registerRedDotListen(): void {
        const funcObj = RID.Role.RoleOfficial.ArmyLevel;// 军衔功能
        const multipleRed = funcObj.Id;
        const win = ViewConst.RoleWin;
        // 一键晋升红点
        const autoRed = funcObj.AutoLvUp;
        const autoLvUpListen: IListenInfo = {
            // 协议1 :军衔基础信息    2:任务基础信息 3:一键晋升成功 4:背包变化
            ProtoId: [ProtoId.S2CArmyInfo_ID, ProtoId.S2CTaskDataPush_ID, ProtoId.S2CArmyUseItem_ID, ProtoId.S2CBagChange_ID],
            CheckVid: [win], // 此处写Win界面。也就是监听的外层UI 填写Win界面即可。
            ProxyRid: [multipleRed], // 代理ID的作用是：当页面未打开的时候，只会走这个监听。否则会走上面两个协议监听
        };
        // 点击晋升
        const lvUpRed = funcObj.LvUp;
        const lvUpListen: IListenInfo = {
            // 协议1 :军衔基础信息    2:任务基础信息 3:一键晋升成功 4:背包变化
            ProtoId: [ProtoId.S2CArmyInfo_ID, ProtoId.S2CTaskDataPush_ID, ProtoId.S2CArmyUseItem_ID, ProtoId.S2CArmyReward_ID, ProtoId.S2CArmyUp_ID],
            CheckVid: [win], // 此处写Win界面。也就是监听的外层UI 填写Win界面即可。
            ProxyRid: [multipleRed], // 代理ID的作用是：当页面未打开的时候，只会走这个监听。否则会走上面两个协议监听
        };

        // 技能激活红点
        const skillActive = funcObj.SkillActive;
        const skillActiveListen: IListenInfo = {
            // 协议1 :军衔基础信息    2:技能激活 3 点击晋升
            ProtoId: [ProtoId.S2CArmyInfo_ID, ProtoId.S2CArmySkillActive_ID, ProtoId.S2CArmyUp_ID],
            CheckVid: [win],
            ProxyRid: [multipleRed],
        };
        // 任务
        const taskInfo = funcObj.TaskInfo;
        const taskInfoListen: IListenInfo = {
            // 1任务基础信息 2 领取奖励 3 一键晋升 4 点击晋升
            ProtoId: [ProtoId.S2CTaskDataPush_ID, ProtoId.S2CArmyReward_ID, ProtoId.S2CArmyUseItem_ID],
            CheckVid: [win],
            ProxyRid: [multipleRed],
        };

        RedDotMgr.I.emit(
            REDDOT_ADD_LISTEN_INFO,
            { rid: autoRed, info: autoLvUpListen },
            { rid: lvUpRed, info: lvUpListen },
            { rid: skillActive, info: skillActiveListen },
            { rid: taskInfo, info: taskInfoListen },
        );
    }

    public onRedDotEventListen(): void {
        const funcObj = RID.Role.RoleOfficial.ArmyLevel;// 军衔功能
        // ui未打开检测所有内部的红点
        RedDotCheckMgr.I.on(funcObj.Id, this._redCheckAll, this);
        // UI打开的时候，走如下的几个监听
        RedDotCheckMgr.I.on(funcObj.TaskInfo, this.redTaskInfo, this);
        RedDotCheckMgr.I.on(funcObj.AutoLvUp, this.redAutoLvUp, this);
        RedDotCheckMgr.I.on(funcObj.LvUp, this.redLvUp, this);
        RedDotCheckMgr.I.on(funcObj.SkillActive, this.redSkillActive, this);
    }

    public offRedDotEventListen(): void {
        const funcObj = RID.Role.RoleOfficial.ArmyLevel;// 军衔功能
        // ui未打开检测所有内部的红点
        RedDotCheckMgr.I.off(funcObj.Id, this._redCheckAll, this);
        // UI打开的时候，走如下的几个监听
        RedDotCheckMgr.I.off(funcObj.TaskInfo, this.redTaskInfo, this);
        RedDotCheckMgr.I.off(funcObj.AutoLvUp, this.redAutoLvUp, this);
        RedDotCheckMgr.I.off(funcObj.LvUp, this.redLvUp, this);
        RedDotCheckMgr.I.off(funcObj.SkillActive, this.redSkillActive, this);
    }

    /** 检测总的红点 */
    private _redCheckAll(): boolean {
        const isShow: boolean = this.redTaskInfo() || this.redAutoLvUp() || this.redLvUp() || this.redSkillActive();
        return isShow;
    }

    /** 检测4个任务是否有红点 */
    public redTaskInfo(): boolean {
        if (!UtilFunOpen.isOpen(FuncId.RoleArmyLevel, false)) {
            return RedDotMgr.I.updateRedDot(RID.Role.RoleOfficial.ArmyLevel.TaskInfo, false);
        }
        const armyLevel = RoleMgr.I.getArmyLevel();
        const armyStar = RoleMgr.I.getArmyStar();
        const isMax: boolean = this.isArmyLvMax(armyLevel, armyStar);
        if (isMax) {
            RedDotMgr.I.updateRedDot(RID.Role.RoleOfficial.ArmyLevel.TaskInfo, false);
            return false;
        }
        // 四个任务 有一个红点就true
        let isShow = false;
        const taskIds: number[] = this.getTaskIds(armyLevel, armyStar);
        for (const id of taskIds) {
            const status = this.getTaskStatusByTaskId(id);
            if (status === ETaskStatus.Completed) {
                isShow = true;// 有一个进行中就是未领取
                break;
            }
        }
        RedDotMgr.I.updateRedDot(RID.Role.RoleOfficial.ArmyLevel.TaskInfo, isShow);
        return isShow;
    }

    /** 检测一键晋升 */
    public redAutoLvUp(): boolean {
        if (!UtilFunOpen.isOpen(FuncId.RoleArmyLevel, false)) {
            return RedDotMgr.I.updateRedDot(RID.Role.RoleOfficial.ArmyLevel.AutoLvUp, false);
        }
        const armyLevel = RoleMgr.I.getArmyLevel();
        const armyStar = RoleMgr.I.getArmyStar();
        const isMax: boolean = this.isArmyLvMax(armyLevel, armyStar);
        if (isMax) {
            RedDotMgr.I.updateRedDot(RID.Role.RoleOfficial.ArmyLevel.AutoLvUp, false);
            return false;
        }

        let isShow: boolean = false;
        if (this.isUseItem === 0) {
            /** 晋升所需物品足够 */
            const armyGradeCfg: Cfg_ArmyGrade = this.getArmyLevelCfg(armyLevel, armyStar);
            if (armyGradeCfg) {
                const tempArr = armyGradeCfg.NeedItem.split(':');
                const itemId: string = tempArr[0];
                const itemNum: number = Number(tempArr[1]);
                const bagNum: number = BagMgr.I.getItemNum(Number(itemId));
                isShow = bagNum >= itemNum;
            }
        }

        RedDotMgr.I.updateRedDot(RID.Role.RoleOfficial.ArmyLevel.AutoLvUp, isShow);
        return isShow;
    }

    /** 点击晋升 */
    public redLvUp(): boolean {
        if (!UtilFunOpen.isOpen(FuncId.RoleArmyLevel, false)) {
            return RedDotMgr.I.updateRedDot(RID.Role.RoleOfficial.ArmyLevel.LvUp, false);
        }
        const armyLevel = RoleMgr.I.getArmyLevel();
        const armyStar = RoleMgr.I.getArmyStar();
        const isMax: boolean = this.isArmyLvMax(armyLevel, armyStar);
        if (isMax) {
            RedDotMgr.I.updateRedDot(RID.Role.RoleOfficial.ArmyLevel.LvUp, false);
            return false;
        }

        let isShow: boolean = false;
        /** 没有点过一键晋升 */
        const statu: boolean = this.isAllTaskDone(armyLevel, armyStar);
        if (!statu) {
            isShow = false;
        } else {
            isShow = true;
        }

        RedDotMgr.I.updateRedDot(RID.Role.RoleOfficial.ArmyLevel.LvUp, isShow);
        return isShow;
    }

    /** 检测技能激活 */
    public redSkillActive(): boolean {
        if (!UtilFunOpen.isOpen(FuncId.RoleArmyLevel, false)) {
            return RedDotMgr.I.updateRedDot(RID.Role.RoleOfficial.ArmyLevel.SkillActive, false);
        }
        // 判断是否已经开启
        const curUserArmyLv = RoleMgr.I.getArmyLevel();// 军衔
        /** 0级直接完成 */
        if (curUserArmyLv === 0) {
            RedDotMgr.I.updateRedDot(RID.Role.RoleOfficial.ArmyLevel.SkillActive, false);
            return false;
        }
        const curArmyStar = RoleMgr.I.getArmyStar();// 军衔星级
        const cfg: Cfg_ArmySkill = this.getSkillCfgByArmyLevel(curUserArmyLv);
        let isShow = false;
        if (cfg) {
            // 开启条件

            const armyLv = Number(cfg.Army.split('|')[0]);// 需要的军衔等级
            const armyStar = Number(cfg.Army.split('|')[1]);// 需要的星级

            const isActive = this.isSkillActive(cfg.SkillId);
            if (!isActive) {
                if (curUserArmyLv > armyLv) { // 未解锁 // 判断能否解锁
                    isShow = true;
                } else if (curUserArmyLv === armyLv && curArmyStar >= armyStar) {
                    isShow = true;
                }
            }
            RedDotMgr.I.updateRedDot(RID.Role.RoleOfficial.ArmyLevel.SkillActive, isShow);
        } else {
            isShow = false;
            RedDotMgr.I.updateRedDot(RID.Role.RoleOfficial.ArmyLevel.SkillActive, isShow);
        }
        return isShow;
    }

    public getArmyName(armyLv: number, armyStar: number = 1): string {
        // 开启条件
        const armyCfg: Cfg_ArmyName = Config.Get(Config.Type.Cfg_ArmyName).getValueByKey(armyLv);
        if (armyCfg) {
            return `${i18n.tt(Lang.com_brack_l)}${armyCfg.ArmyName}${i18n.tt(Lang.com_brack_r)}${armyStar}${i18n.lv}`;
        }
        return '';
    }
}

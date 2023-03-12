/* eslint-disable no-lonely-if */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2022-06-13 10:48:45
 * @FilePath: \SanGuo2.4\assets\script\game\module\roleSkills\RoleSkillModel.ts
 * @Description:
 *
 */

import { EventClient } from '../../../app/base/event/EventClient';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { Config } from '../../base/config/Config';
import { E } from '../../const/EventName';
import { RoleMgr } from '../role/RoleMgr';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { ItemCurrencyId } from '../../com/item/ItemConst';
import { ViewConst } from '../../const/ViewConst';
import { RoleAN } from '../role/RoleAN';
import { RedDotMgr } from '../reddot/RedDotMgr';
import { IListenInfo, REDDOT_ADD_LISTEN_INFO, RID } from '../reddot/RedDotConst';
import { RedDotCheckMgr } from '../reddot/RedDotCheckMgr';
import { ConfigConst } from '../../base/config/ConfigConst';
import ModelMgr from '../../manager/ModelMgr';
import { i18n, Lang } from '../../../i18n/i18n';
import { ConfigIndexer } from '../../base/config/indexer/ConfigIndexer';
import { AttrInfo } from '../../base/attribute/AttrInfo';
import { UtilAttr } from '../../base/utils/UtilAttr';
import { AttrModel } from '../../base/attribute/AttrModel';
import { B } from '../../battle/test/BattleTestData';

const { ccclass } = cc._decorator;
@ccclass('RoleSkillModel')
export class RoleSkillModel extends BaseModel {
    private _isRed: boolean = false;
    private _roleSkill: { [id: number]: SkillInfo } = cc.js.createMap(true);
    private _roleMartialList: S2CRoleMartialList = null;
    public clearAll(): void {
        //
    }

    public onRedDotEventListen(): void {
        // 红点检测
        RedDotCheckMgr.I.on(RID.Role.RoleSkill.Skill, this.checkRed, this);
        // 技能绝学
        RedDotCheckMgr.I.on(RID.Role.RoleSkill.UniqueSkill, this.redUniqueSkill, this);
    }

    public offRedDotEventListen(): void {
        // 红点检测
        RedDotCheckMgr.I.off(RID.Role.RoleSkill.Skill, this.checkRed, this);
        // 技能绝学
        RedDotCheckMgr.I.off(RID.Role.RoleSkill.UniqueSkill, this.redUniqueSkill, this);
    }

    public registerRedDotListen(): void {
        // 技能-技能
        const listenSkill: IListenInfo = {
            // 协议
            ProtoId: [ProtoId.S2CRoleSkillList_ID, ProtoId.S2CRoleSkillUp_ID],
            // 属性
            RoleAttr: [RoleAN.N.SkillExp, RoleAN.N.Level],
        };
        // RedDotMgr.I.emit(
        //     REDDOT_ADD_LISTEN_INFO,
        //     { rid: RID.Role.RoleSkill.Skill, info: listenInfo },
        // );
        // 技能-绝学
        const win = ViewConst.RoleWin;
        const listenUniqueSkill: IListenInfo = {
            // 协议1 :军衔基础信息 2:军衔晋升 3:技能激活成功
            ProtoId: [ProtoId.S2CArmyInfo_ID, ProtoId.S2CArmyUp_ID, ProtoId.S2CArmySkillActive_ID],
            CheckVid: [win], // 此处写Win界面。也就是监听的外层UI 填写Win界面即可。
            // ProxyRid: [multipleRed], // 代理ID的作用是：当页面未打开的时候，只会走这个监听。否则会走上面两个协议监听
            RoleAttr: [RoleAN.N.ArmyLevel, RoleAN.N.ArmyStar],
        };

        RedDotMgr.I.emit(
            REDDOT_ADD_LISTEN_INFO,
            { rid: RID.Role.RoleSkill.Skill, info: listenSkill },
            { rid: RID.Role.RoleSkill.UniqueSkill, info: listenUniqueSkill },
        );
    }

    public get isRed(): boolean {
        return this._isRed;
    }

    /** 技能红点 */
    public checkRed(): boolean {
        this._isRed = this.canOneKeyUp();
        RedDotMgr.I.updateRedDot(RID.Role.RoleSkill.Skill, this._isRed);
        return this._isRed;
    }

    public canOneKeyUp(showMsg: boolean = false, showResource: boolean = false): boolean {
        let canUp: boolean = false;
        for (const i in this._roleSkill) {
            if (this.canUp(this._roleSkill[i].SkillId, false, showResource)) {
                canUp = true;
                break;
            }
        }
        if (!canUp && showMsg) {
            for (const i in this._roleSkill) {
                const curLv: number = this.getRoleSkillLv(this._roleSkill[i].SkillId);
                if (curLv >= RoleMgr.I.getLevel()) {
                    MsgToastMgr.Show(i18n.tt(Lang.roleSkill_tips));
                    break;
                }
            }
        }
        return canUp;
    }

    /** 技能绝学红点 */
    public redUniqueSkill(): boolean {
        let isShow = false;
        const skillCfgs: Cfg_ArmySkill[] = this.getArmySkillCfg();
        for (let i = 0, len = skillCfgs.length; i < len; i++) {
            // 判断有一个可以激活，则显示红点
            const cfg: Cfg_ArmySkill = skillCfgs[i];
            // 开启技能的阶、级、
            const openLvs = cfg.Army.split('|');
            const armyLv = Number(openLvs[0]);
            const armyStar = Number(openLvs[1]);
            // 不在已开启列表里
            const isActive = ModelMgr.I.ArmyLevelModel.isSkillActive(cfg.SkillId);
            if (!isActive) { // 判断能否解锁
                const curUserArmyLv = RoleMgr.I.getArmyLevel();// 军衔
                const curArmyStar = RoleMgr.I.getArmyStar();// 军衔星级
                if (curUserArmyLv > armyLv) {
                    isShow = true;
                    break;
                } else if (curUserArmyLv === armyLv) {
                    if (curArmyStar >= armyStar) {
                        isShow = true;
                        break;
                    }
                }
            }
        }
        // 描述在技能表
        RedDotMgr.I.updateRedDot(RID.Role.RoleSkill.UniqueSkill, isShow);
        return isShow;
    }

    /** 技能绝学- 获取整张技能表配置 */
    private _arrCfg: Cfg_ArmySkill[];
    public getArmySkillCfg(): Cfg_ArmySkill[] {
        if (this._arrCfg && this._arrCfg.length) {
            return this._arrCfg;
        }

        this._arrCfg = [];
        const indexer = Config.Get(ConfigConst.Cfg_ArmySkill);
        for (let i = 0, n = indexer.length; i < n; i++) {
            const cfg: Cfg_ArmySkill = indexer.getValueByIndex(i);

            this._arrCfg.push(cfg);
        }
        return this._arrCfg;
    }

    /**
     * 该技能是否能升级
     * @param skillId 技能id
     * @param showMsg 是否弹提示
     * @param showResource 是否弹获取方式
     * @returns
     */
    public canUp(skillId: number, showMsg: boolean = false, showResource: boolean = false): boolean {
        // 先判断技能等级是否已达到人物等级
        const curLv: number = this.getRoleSkillLv(skillId);
        if (curLv >= RoleMgr.I.getLevel()) {
            if (showMsg) {
                MsgToastMgr.Show(i18n.tt(Lang.roleSkill_tips));
            }
            return false;
        }

        // 再判断货币数量
        const have = RoleMgr.I.getCurrencyById(ItemCurrencyId.SKILL_EXP);
        if (curLv > 0) {
            const cfgRS: Cfg_RoleSkill = Config.Get(Config.Type.Cfg_RoleSkill).getValueByKey(skillId);
            const preLv: number = curLv - 1;
            const cost: number = Math.ceil((curLv * preLv / 2) * cfgRS.SkillUpCoeff2 + cfgRS.SkillUpBase + preLv * cfgRS.SkillUpCoeff1);
            const canUp = have >= cost;
            if (!canUp && showResource) {
                WinMgr.I.open(ViewConst.ItemSourceWin, ItemCurrencyId.SKILL_EXP);
            }
            return canUp;
        }
        return false;
    }

    public get roleSkill(): { [id: number]: SkillInfo } {
        return this._roleSkill;
    }

    public getRoleSkillLv(skillId: number): number {
        if (this._roleSkill && this._roleSkill[skillId]) {
            return this._roleSkill[skillId].SkillLv;
        }
        return 0;
    }

    public setRoleSkill(skills: SkillInfo[]): void {
        this._roleSkill = {};
        for (let i = 0; i < skills.length; i++) {
            this._roleSkill[skills[i].SkillId] = skills[i];
        }
        // this.checkRed();
        EventClient.I.emit(E.RoleSkill.UptSkill);
    }

    public uptRoleSkill(skills: SkillInfo[]): void {
        const upList: number[] = [];
        for (let i = 0; i < skills.length; i++) {
            const id = skills[i].SkillId;
            if (this._roleSkill[id] && this._roleSkill[id].SkillLv !== skills[i].SkillLv) {
                upList.push(id);
            }
            this._roleSkill[id] = skills[i];
        }
        // this.checkRed();
        // console.log(skills, '升级', upList);
        EventClient.I.emit(E.RoleSkill.UptSkill, upList);
    }

    /* 设置远程武艺列表数据 */
    public setMartialList(list: S2CRoleMartialList): void {
        this._roleMartialList = list;
    }

    /* 更新单条武艺列表数据 */
    public upMartial(mtl: RoleMartialInfo): void {
        if (this._roleMartialList && this._roleMartialList.MartialList) {
            for (let i = 0; i < this._roleMartialList.MartialList.length; ++i) {
                const m = this._roleMartialList.MartialList[i];
                if (m.Id === mtl.Id) {
                    this._roleMartialList.MartialList[i] = mtl;
                    // console.log('数据更新');
                    return;
                }
            }
            if (!this._roleMartialList.MartialList) this._roleMartialList.MartialList = [];
            this._roleMartialList.MartialList.push(mtl);
        }
    }

    /* 获取远程武艺列表数据 */
    public getMartialById(Id: number): RoleMartialInfo {
        if (this._roleMartialList && this._roleMartialList.MartialList) {
            for (let i = 0; i < this._roleMartialList.MartialList.length; ++i) {
                const m = this._roleMartialList.MartialList[i];
                if (m.Id === Id) {
                    return m;
                }
            }
        }
        return null;
    }

    /** 获取角色武艺配置表数量 */
    public CfgRoleMartialCount(): number {
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_RoleMartial);
        return indexer.keysLength;
    }

    /** 获取角色武艺配置表内容 */
    public CfgRoleMartialGetValue(idx: number): Cfg_RoleMartial {
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_RoleMartial);
        const value: Cfg_RoleMartial = indexer.getValueByIndex(idx);
        return value;
    }

    /** 通过 key 获取角色武艺配置表内容 */
    public CfgRoleMartialGetValueByKey(key: number): Cfg_RoleMartial {
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_RoleMartial);
        const value: Cfg_RoleMartial = indexer.getValueByKey(key);
        return value;
    }

    /**
     * 获取所有武艺的属性（已激活的属性)
     */
    public getAllMartialAttrInfo(): AttrInfo {
        const allAttrInfo = new AttrInfo();
        if (this._roleMartialList && this._roleMartialList.MartialList) {
            for (let i = 0; i < this._roleMartialList.MartialList.length; ++i) {
                const m = this._roleMartialList.MartialList[i];
                const oneAttrInfo = this.getMartialAttrInfo(m.Id, m.Level, m.Point);
                allAttrInfo.add(oneAttrInfo);
            }
        }
        return allAttrInfo;
    }

    /**
     * 获取某个武艺某个阶段的属性
     * @param martialId 武艺id
     * @param level 等级，可选参数，不传就拿自身武艺等级
     * @param point 点位，可选参数，不传就拿自身武艺点位
     * @returns
     */
    public getMartialAttrInfo(martialId: number, level: number = 0, point: number = 0): AttrInfo | undefined {
        const cfgRM: Cfg_RoleMartial = Config.Get(Config.Type.Cfg_RoleMartial).getValueByKey(martialId);
        if (!level && !point) { // 没有传等级和点位就取玩家自身的
            const martial = this.getMartialById(martialId);
            level = martial?.Level;
            point = martial?.Point;
        }
        if (level) {
            // 已激活
            const attrInfo = UtilAttr.GetAttrInfoByStr(cfgRM.AttrBase);
            /** 是否有升级 */
            const hasUpLevel = level > 1;
            if (hasUpLevel || point > 0) {
                // 有升级，或者有升点位
                const indexs: number[] = Config.Get(Config.Type.Cfg_RoleMartialPoint).getValueByKey(martialId);
                // 点位的字符串属性
                let pointStrAttr: string;
                // 等级的字符串属性
                let levelStrAttr: string;
                for (let i = 0, n = indexs.length; i < n; i++) {
                    const cfgRMPoint: Cfg_RoleMartialPoint = Config.Get(Config.Type.Cfg_RoleMartialPoint).getValueByIndex(indexs[i]);
                    if (cfgRMPoint?.Point <= point) { // 拼接点位的字符串属性，循环之外再转换成属性
                        pointStrAttr = pointStrAttr ? `${pointStrAttr}|${cfgRMPoint.AttrLevel}` : cfgRMPoint.AttrLevel;
                    }
                    if (hasUpLevel) { // 拼接等级的字符串属性，循环之外再转换成属性
                        levelStrAttr = levelStrAttr ? `${levelStrAttr}|${cfgRMPoint.AttrLevel}` : cfgRMPoint.AttrLevel;
                    }
                }
                // 等级属性
                const levelAttrInfo = this.getMartialAttrInfoByStr(levelStrAttr, martialId, level - 1);
                if (levelAttrInfo) {
                    attrInfo.add(levelAttrInfo);
                }
                // 点位属性
                const pointAttrInfo = this.getMartialAttrInfoByStrFromPoint(pointStrAttr, martialId, level);
                if (pointAttrInfo) {
                    attrInfo.add(pointAttrInfo);
                }
            }
            return attrInfo;
        }
        return undefined;
    }

    /**
     * 获取字符串对应的倍率属性-等级增加的
     * @param strAttr 字符串属性
     * @param martialId 武艺id
     * @param level 等级
     * @param exAddMul 额外增加的倍率 1 10     11 20
     * @returns
     */
    private getMartialAttrInfoByStr(strAttr: string, martialId: number, level: number): AttrInfo | undefined {
        if (strAttr) {
            const indexs: number[] = Config.Get(Config.Type.Cfg_RoleMartialLevel).getValueByKey(martialId);
            let ratio: number = 0;
            for (let i = indexs.length - 1; i >= 0; i--) {
                const cfgRMLevel: Cfg_RoleMartialLevel = Config.Get(Config.Type.Cfg_RoleMartialLevel).getValueByIndex(indexs[i]);
                if (level >= cfgRMLevel.Max) {
                    ratio += (cfgRMLevel.Max - cfgRMLevel.Min + 1) * cfgRMLevel.AttrGrowth;
                } else if (cfgRMLevel.Min <= level && cfgRMLevel.Max >= level) {
                    ratio += (level - cfgRMLevel.Min + 1) * cfgRMLevel.AttrGrowth;
                }
            }
            const attrInfo = UtilAttr.GetAttrInfoByStr(strAttr);
            attrInfo.mul(ratio);
            return attrInfo;
        }
        return undefined;
    }

    /**
     * 获取字符串对应的倍率属性-点位
     * @param strAttr 字符串属性
     * @param martialId 武艺id
     * @param level 等级
     * @param exAddMul 额外增加的倍率 1 10     11 20
     * @returns
     */
    private getMartialAttrInfoByStrFromPoint(strAttr: string, martialId: number, level: number): AttrInfo | undefined {
        if (strAttr) {
            const cfgRMLevel: Cfg_RoleMartialLevel = Config.Get(Config.Type.Cfg_RoleMartialLevel).getIntervalData(martialId, level);
            const attrInfo = UtilAttr.GetAttrInfoByStr(strAttr);
            attrInfo.mul(cfgRMLevel.AttrGrowth);
            return attrInfo;
        }
        return undefined;
    }
    /**
     * 获取某个武艺某个点位的增加的属性
     * @param martialId 武艺id
     * @param point 点位
     * @param level 等级
     * @returns
     */
    public getMartialPointAddAttr(martialId: number, point: number, level: number = 0): AttrInfo {
        let pointStrAttr: string;
        const indexs: number[] = Config.Get(Config.Type.Cfg_RoleMartialPoint).getValueByKey(martialId);
        for (let i = 0, n = indexs.length; i < n; i++) {
            const cfgRMPoint: Cfg_RoleMartialPoint = Config.Get(Config.Type.Cfg_RoleMartialPoint).getValueByIndex(indexs[i]);
            if (cfgRMPoint?.Point === point) { // 拼接点位的字符串属性，循环之外再转换成属性
                pointStrAttr = cfgRMPoint.AttrLevel;
                break;
            }
        }
        level = level || this.getMartialById(martialId)?.Level || 1;
        const attrInfo = this.getMartialAttrInfoByStrFromPoint(pointStrAttr, martialId, level);
        return attrInfo;
    }
}

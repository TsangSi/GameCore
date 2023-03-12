/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/*
 * @Author: kexd
 * @Date: 2022-06-13 10:49:04
 * @FilePath: \SanGuo\assets\script\game\module\roleSkills\RoleSkillController.ts
 * @Description:
 *
 */

import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { E } from '../../const/EventName';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';

const { ccclass } = cc._decorator;
@ccclass('RoleSkillController')
export default class RoleSkillController extends BaseController {
    /** 网络监听 */
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CRoleSkillList_ID, this.onS2CRoleSkillList, this);
        EventProto.I.on(ProtoId.S2CRoleSkillUp_ID, this.onS2CRoleSkillUp, this);

        EventProto.I.on(ProtoId.S2CRoleMartialList_ID, this.onS2CMartialList, this);
        EventProto.I.on(ProtoId.S2CRoleMartialLevelUp_ID, this.onS2CMartiaLvelvUp, this);
    }
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CRoleSkillList_ID, this.onS2CRoleSkillList, this);
        EventProto.I.off(ProtoId.S2CRoleSkillUp_ID, this.onS2CRoleSkillUp, this);
        // EventProto.I.targetOff(this);
    }

    /** 事件监听 */
    public addClientEvent(): void {
        // ModelMgr.I.RoleSkinModel.do();
        EventClient.I.on(E.Game.Start, this.onLoginReq, this);
    }
    private onLoginReq(): void {
        NetMgr.I.sendMessage(ProtoId.C2SRoleMartialList_ID);
    }
    public delClientEvent(): void {
        // throw new Error('Method not implemented.');
        EventClient.I.off(E.Game.Start, this.onLoginReq, this);
    }
    public clearAll(): void {
        //
    }

    /**
     * 打开界面
     * @param tab 页签id
     * @param params 配置表的参数列表
     * @param args 可变参，手动传入的参数
     * @returns
     */
    public linkOpen(tab: number = 0, params: any[] = [0], ...args: any[]): boolean {
        WinMgr.I.open(ViewConst.RoleWin, tab, params ? params[0] : 0);
        return true;
    }

    /** 请求角色技能升级 */
    public reqRoleSkillUp(skillId: number): void {
        const d = new C2SRoleSkillUp();
        d.SkillId = skillId;
        NetMgr.I.sendMessage(ProtoId.C2SRoleSkillUp_ID, d);
        // console.log('请求升级技能:', skillId);
    }

    /** 角色技能列表 */
    private onS2CRoleSkillList(data: S2CRoleSkillList) {
        // console.log('--------角色技能列表:', data);
        ModelMgr.I.RoleSkillModel.setRoleSkill(data.Skills);
    }

    /** 角色技能升级 */
    private onS2CRoleSkillUp(data: S2CRoleSkillUp) {
        // console.log('--------角色技能列表:', data);
        if (data && data.Tag === 0) {
            ModelMgr.I.RoleSkillModel.uptRoleSkill(data.Skills);
        }
    }

    /* 角色武艺列表 */
    private onS2CMartialList(list: S2CRoleMartialList) {
        ModelMgr.I.RoleSkillModel.setMartialList(list);
        console.log('----------角色武艺列表 onS2CMartialList-----------', list);
    }

    /* 角色武艺升级 */
    public reqRoleMartialLevelUp(Id: number): void {
        NetMgr.I.sendMessage(ProtoId.C2SRoleMartialLevelUp_ID, {
            Id,
        });
    }

    /* 角色武艺升级 */
    private onS2CMartiaLvelvUp(up: S2CRoleMartialLevelUp) {
        if (up.Martial) {
            ModelMgr.I.RoleSkillModel.upMartial(up.Martial);
            EventClient.I.emit(E.RoleSkill.UptMartial, up.Martial);
        }
    }
}

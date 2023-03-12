import { EventClient } from '../../../../app/base/event/EventClient';
import { EventProto } from '../../../../app/base/event/EventProto';
import BaseController from '../../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import ModelMgr from '../../../manager/ModelMgr';
import NetMgr from '../../../manager/NetMgr';

const { ccclass } = cc._decorator;
@ccclass('ArmyLevelController')
export default class ArmyLevelController extends BaseController {
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CArmyInfo_ID, this._onS2CArmyInfo, this);
        EventProto.I.on(ProtoId.S2CArmyUseItem_ID, this._onS2CArmyUseItem, this);
        EventProto.I.on(ProtoId.S2CArmyUp_ID, this._onS2CArmyUp, this);
        EventProto.I.on(ProtoId.S2CArmyReward_ID, this._onS2CArmyReward, this);
        EventProto.I.on(ProtoId.S2CArmySkillActive_ID, this._onS2CArmySkillActive, this);
    }

    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CArmyInfo_ID, this._onS2CArmyInfo, this);
        EventProto.I.off(ProtoId.S2CArmyUseItem_ID, this._onS2CArmyUseItem, this);
        EventProto.I.off(ProtoId.S2CArmyUp_ID, this._onS2CArmyUp, this);
        EventProto.I.off(ProtoId.S2CArmyReward_ID, this._onS2CArmyReward, this);
        EventProto.I.off(ProtoId.S2CArmySkillActive_ID, this._onS2CArmySkillActive, this);
    }
    public addClientEvent(): void {
        EventClient.I.on(E.Game.Start, this.onGameStart, this);
    }
    public delClientEvent(): void {
        EventClient.I.off(E.Game.Start, this.onGameStart, this);
    }
    public clearAll(): void {
        //
    }

    public onGameStart(): void {
        this.reqC2SRoleArmyInfo();
    }

    /** 基础信息 */
    public reqC2SRoleArmyInfo(): void {
        const req = new C2SArmyInfo();
        NetMgr.I.sendMessage(ProtoId.C2SArmyInfo_ID, req);
    }

    private _onS2CArmyInfo(data: S2CArmyInfo): void {
        if (!data.Tag) {
            ModelMgr.I.ArmyLevelModel.setData(data);
        } else {
            MsgToastMgr.Show(`${i18n.tt(Lang.army_init_fail)}:${data.Tag}`);// 军衔初始化失败
        }
    }

    /** 一键晋升 */
    public reqAutoLvUp(): void {
        const req = new C2SArmyUseItem();
        NetMgr.I.sendMessage(ProtoId.C2SArmyUseItem_ID, req);
    }
    private _onS2CArmyUseItem(data: S2CArmyUseItem): void {
        if (!data.Tag) {
            MsgToastMgr.Show(i18n.tt(Lang.army_lvup_success));
            ModelMgr.I.ArmyLevelModel.isUseItem = 1;// 状态改为已经一键晋升
            // 更新UI播放动画
            EventClient.I.emit(E.ArmyLevel.AutoLvUp);
            /** 任务的领取状态 - 更新 */
        } else {
            MsgToastMgr.Show(i18n.tt(Lang.army_lvup_fail));// 一键晋升失败
        }
    }

    /** 晋升 */
    public reqC2SRoleArmyUp(): void {
        const req = new C2SArmyUp();
        NetMgr.I.sendMessage(ProtoId.C2SArmyUp_ID, req);
    }

    private _onS2CArmyUp(data: S2CArmyUp) {
        if (!data.Tag) {
            ModelMgr.I.ArmyLevelModel.isUseItem = 0;// 晋升成功之后 重置 一键晋升
            EventClient.I.emit(E.ArmyLevel.ArmyUp);
        } else {
            MsgToastMgr.Show(`${i18n.tt(Lang.army_lvup_fail)}：${data.Tag}`);// 晋升失败
        }
    }

    /** 领取奖励 */
    public reqC2SArmyReward(Id: number): void {
        const req = new C2SArmyReward();
        req.Id = Id;
        NetMgr.I.sendMessage(ProtoId.C2SArmyReward_ID, req);
    }
    private _onS2CArmyReward(data: S2CArmyReward) {
        //
        if (!data.Tag) {
            const taskId: number = data.Id;
            EventClient.I.emit(E.ArmyLevel.ArmyReward, taskId);
        }
    }
    /** 激活技能 */
    public reqActiveSkill(skillId: number): void {
        const req = new C2SArmySkillActive();
        req.SkillId = skillId;
        NetMgr.I.sendMessage(ProtoId.C2SArmySkillActive_ID, req);
    }
    private _onS2CArmySkillActive(data: S2CArmySkillActive): void {
        if (!data.Tag) {
            ModelMgr.I.ArmyLevelModel.addSkill(data.SkillId);
        } else {
            MsgToastMgr.Show(`${i18n.tt(Lang.army_skillactive_fail)}${data.Tag}`);// 技能激活失败
        }
    }

    public linkOpen(tab?: number, params?: any[], itemId?: number): boolean {
        WinMgr.I.open(ViewConst.RoleArmyLevelPage, tab, params);
        return true;
    }
}

import { EventClient } from '../../../../app/base/event/EventClient';
import { EventProto } from '../../../../app/base/event/EventProto';
import BaseController from '../../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import NetMgr from '../../../manager/NetMgr';
import { RolePageType } from '../../role/RoleConst';

const { ccclass } = cc._decorator;
@ccclass('RoleOfficialController')
export default class RoleOfficialController extends BaseController {
    public addNetEvent(): void {
        /** 获取用户官职信息 */
        EventProto.I.on(ProtoId.S2COfficeInfo_ID, this._onS2COfficeInfo, this);
        /** 官职每日奖励 */
        EventProto.I.on(ProtoId.S2COfficeDailyReward_ID, this._onS2COfficeDailyReward, this);
        /** 官职任务奖励 */
        EventProto.I.on(ProtoId.S2COfficeTaskReward_ID, this.onS2COfficeTaskReward, this);
        /** 官职升级 */
        EventProto.I.on(ProtoId.S2COfficeUp_ID, this.onS2COfficeUp, this);
        /** 官职目标奖励领取 */
        EventProto.I.on(ProtoId.S2COfficeTargetReward_ID, this.onS2COfficeTargetReward, this);
    }

    public delNetEvent(): void {
        /** 获取用户官职信息 */
        EventProto.I.off(ProtoId.S2COfficeInfo_ID, this._onS2COfficeInfo, this);
        /** 官职目标奖励领取 */
        EventProto.I.off(ProtoId.S2COfficeTargetReward_ID, this.onS2COfficeTargetReward, this);
        /** 官职每日奖励 */
        EventProto.I.off(ProtoId.S2COfficeDailyReward_ID, this._onS2COfficeDailyReward, this);
        /** 官职升级 */
        EventProto.I.off(ProtoId.S2COfficeUp_ID, this.onS2COfficeUp, this);
        /** 官职任务奖励 */
        EventProto.I.off(ProtoId.S2COfficeTaskReward_ID, this.onS2COfficeTaskReward, this);
    }
    public addClientEvent(): void {
        EventClient.I.on(E.Game.Start, this.GetRoleOfficialInfo, this);
    }
    public delClientEvent(): void {
        EventClient.I.off(E.Game.Start, this.GetRoleOfficialInfo, this);
    }
    public clearAll(): void {
        //
    }

    /** 主动请求获取用户官职信息 */
    public GetRoleOfficialInfo(): void {
        // if (UtilFunOpen.isOpen(FuncId.RoleArmyOfficial)) {
        const d = {};
        NetMgr.I.sendMessage(ProtoId.C2SOfficeInfo_ID, d);
        // } else {
        //     // 更新红点为未开启
        //     ModelMgr.I.RoleOfficeModel.updateRed();
        // }
    }

    /** 请求获取官职系信息返回 */
    public _onS2COfficeInfo(data: S2COfficeInfo): void {
        if (data.Tag === 0) {
            const model = ModelMgr.I.RoleOfficeModel;
            model.DailyReward = data.DailyReward;
            model.tasks = data.TaskIds;
            model.rewards = data.TargetRewardList;
            model.DailyLv = data.DailyOfficeLevel;
            // 赋值官印虎符内容
            ModelMgr.I.SealAmuletModel.setSealAmulet(data.SignList);
        } else {
            console.log('获取用户官职信息失败');
        }
    }

    /** 点击升级官职 */
    public upOfficial(): void {
        const d = {};
        NetMgr.I.sendMessage(ProtoId.C2SOfficeUp_ID, d);
    }

    /** 升职成功回调 */
    private onS2COfficeUp(d: S2COfficeUp): void {
        // ModelMgr.I.RoleOfficeModel.officialLevel = d.Level;
        WinMgr.I.open(ViewConst.SealAmuletUpWin);
    }

    /** 领取官职等级奖励 */
    public getOfficialRankReward(id: number): void {
        const d = {
            Level: id,
        };
        NetMgr.I.sendMessage(ProtoId.C2SOfficeTargetReward_ID, d);
    }
    /** 官职等级奖励领取返回 */
    private onS2COfficeTargetReward(data: S2COfficeTargetReward): void {
        ModelMgr.I.RoleOfficeModel.updateRewards(data.Level);
    }

    /** 获取官职每日奖励 */
    public getDayReward(): void {
        const d = {};
        NetMgr.I.sendMessage(ProtoId.C2SOfficeDailyReward_ID, d);
    }

    /** 每日奖励领取返回 */
    private _onS2COfficeDailyReward(data: S2COfficeDailyReward): void {
        ModelMgr.I.RoleOfficeModel.DailyReward = data.State;
    }

    /** 领取官职任务奖励 */
    public getOfficialTaskReward(id: number): void {
        const d: C2SOfficeTaskReward = {
            TaskId: id,
        };
        NetMgr.I.sendMessage(ProtoId.C2SOfficeTaskReward_ID, d);
    }
    /** 领取任务奖励返回 */
    public onS2COfficeTaskReward(data: S2COfficeTaskReward): void {
        if (data.Tag === 0) {
            ModelMgr.I.RoleOfficeModel.replaceTask(data.TaskId, data.NewTaskId);
        }
    }

    /**
     * 打开界面
     * @param tab 页签id
     * @param params 配置表的参数列表
     * @param args 可变参，手动传入的参数
     * @returns
     */
    public linkOpen(tab?: number, params?: any[], ...args: any[]): boolean {
        // ControllerMgr.I.RoleController.linkOpen(ViewConst.RoleArmyOfficialPage);
        WinMgr.I.open(ViewConst.RoleWin, RolePageType.RoleOfficial, tab);
        return true;
    }
}

/*
 * @Author: zs
 * @Date: 2022-05-10 16:29:04
 * @FilePath: \SanGuo2.4\assets\script\game\module\role\RoleController.ts
 * @Description:
 *
 */
import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { E } from '../../const/EventName';
import { FuncId } from '../../const/FuncConst';
import { ViewConst } from '../../const/ViewConst';
import ControllerMgr from '../../manager/ControllerMgr';
import NetMgr from '../../manager/NetMgr';
import { RoleMgr } from './RoleMgr';

const { ccclass } = cc._decorator;
@ccclass('RoleController')
export class RoleController extends BaseController {
    public clearAll(): void {
        // throw new Error('Method not implemented.');
    }
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CRoleInfo_ID, this.onS2CRoleInfo, this);
        EventProto.I.on(ProtoId.S2CTips_ID, this.onS2CTips, this);
        EventProto.I.on(ProtoId.S2CWearOrRemoveEquip_ID, this._onS2CWearOrRemoveEquip, this);
        EventProto.I.on(ProtoId.S2CAutoWearEquip_ID, this._onS2CAutoWearEquip, this);
        // RedDotMgr.I.register(RID.Role);
    }
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CRoleInfo_ID, this.onS2CRoleInfo, this);
        EventProto.I.off(ProtoId.S2CTips_ID, this.onS2CTips, this);
        EventProto.I.off(ProtoId.S2CWearOrRemoveEquip_ID, this._onS2CWearOrRemoveEquip, this);
        EventProto.I.off(ProtoId.S2CAutoWearEquip_ID, this._onS2CAutoWearEquip, this);
    }
    public addClientEvent(): void {
        // throw new Error('Method not implemented.');
    }
    public delClientEvent(): void {
        // throw new Error('Method not implemented.');
    }

    /**
     * 打开界面
     * @param tab 页签id
     * @param params 配置表的参数列表
     * @param args 可变参，手动传入的参数
     * @returns
     */
    public linkOpen(tab: number = 0, params: any[] = [0], ...args: any[]): boolean {
        if (UtilFunOpen.isOpen(FuncId.Role, true)) {
            WinMgr.I.open(ViewConst.RoleWin, tab, params ? params[0] : 0);
            return true;
        }
        return false;
    }

    private onS2CRoleInfo(d: S2CRoleInfo) {
        // console.log('主玩家属性变化', d);
        RoleMgr.I.updateUserInfo(d);
    }

    private onS2CTips(d: S2CTips) {
        RoleMgr.I.showTips(d.TipsId);
    }

    public reqC2SWearEquip(onLyId: string[]): void {
        const req = new C2SWearOrRemoveEquip();
        req.OnlyIds = onLyId;
        NetMgr.I.sendMessage(ProtoId.C2SWearOrRemoveEquip_ID, req);
    }

    private _onS2CWearOrRemoveEquip(data: S2CWearOrRemoveEquip): void {
        if (!data.Tag) {
            MsgToastMgr.Show('穿戴成功');
            EventClient.I.emit(E.Role.WearEquipSuccess, data.OnlyIds);
        }
    }

    /** 一键穿戴 具有多种类型 */
    public reqC2SAutoWearEquip(Type: number): void {
        const req = new C2SAutoWearEquip();
        req.Type = Type;
        NetMgr.I.sendMessage(ProtoId.C2SAutoWearEquip_ID, req);
    }

    public _onS2CAutoWearEquip(data: S2CAutoWearEquip): void {
        if (!data.Tag) {
            MsgToastMgr.Show('穿戴成功');
            EventClient.I.emit(E.Role.WearEquipSuccess);
        } else {
            MsgToastMgr.Show(`穿戴失败错误码：${data.Tag}`);
        }
    }
}

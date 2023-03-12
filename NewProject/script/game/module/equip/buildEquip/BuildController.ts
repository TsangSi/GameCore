/*
 * @Author: kexd
 * @Date: 2022-07-07 14:52:48
 * @FilePath: \SanGuo\assets\script\game\module\equip\buildEquip\BuildController.ts
 * @Description:
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { EventProto } from '../../../../app/base/event/EventProto';
import BaseController from '../../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import { E } from '../../../const/EventName';
import { FuncId } from '../../../const/FuncConst';
import { ViewConst } from '../../../const/ViewConst';
import NetMgr from '../../../manager/NetMgr';
import { equipTabDataArr, ItemPopType } from '../EquipConst';

const { ccclass } = cc._decorator;
@ccclass('BuildController')
export default class BuildController extends BaseController {
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CItemPop_ID, this._onS2CBuildEquip, this);
    }

    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CItemPop_ID, this._onS2CBuildEquip, this);
    }
    public addClientEvent(): void {
        //
    }
    public delClientEvent(): void {
        //
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
    public linkOpen(tab?: number, params?: any[], ...args: any[]): boolean {
        let funcId: number = FuncId.EquipBuild;
        if (tab) {
            const index = equipTabDataArr.findIndex((v) => v.TabId === tab);
            if (index >= 0) {
                funcId = equipTabDataArr[index].funcId;
            }
        }
        if (UtilFunOpen.isOpen(funcId, true)) {
            WinMgr.I.open(ViewConst.EquipWin, tab, params ? params[0] : 0);
        }

        return true;
    }

    public reqBuildEquip(equipPart: number, isUsetianhuo: number): void {
        const req = new C2SBuildEquip();
        req.EquipPart = equipPart;
        req.UseStone = isUsetianhuo;
        NetMgr.I.sendMessage(ProtoId.C2SBuildEquip_ID, req);
    }

    public _onS2CBuildEquip(data: S2CItemPop): void {
        if (data.Type === ItemPopType.build) {
            if (!data.Tag) {
                EventClient.I.emit(E.Build.BuildEquip, data);
            } else {
                MsgToastMgr.Show(`${i18n.tt(Lang.build_fail)}:${data.Tag}`);// 打造失败
            }
        }
    }
}

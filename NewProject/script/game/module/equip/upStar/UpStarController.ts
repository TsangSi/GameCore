/*
 * @Author: zs
 * @Date: 2022-07-08 19:48:44
 * @FilePath: \SanGuo\assets\script\game\module\equip\upStar\UpStarController.ts
 * @Description:
 *
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { EventProto } from '../../../../app/base/event/EventProto';
import BaseController from '../../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import ItemModel from '../../../com/item/ItemModel';
import { E } from '../../../const/EventName';
import { FuncId } from '../../../const/FuncConst';
import { ViewConst } from '../../../const/ViewConst';
import NetMgr from '../../../manager/NetMgr';
import { equipTabDataArr, ItemPopType } from '../EquipConst';

const { ccclass } = cc._decorator;
@ccclass
export class UpStarController extends BaseController {
    /** 监听网络事件 子类实现 */
    public addNetEvent(): void {
        //
        EventProto.I.on(ProtoId.S2CItemPop_ID, this.onS2CRiseStarEquip, this);

        // RedDotMgr.I.register(RID.Equip);
    }

    /** 移除网络事件 子类实现 */
    public delNetEvent(): void {
        //
        EventProto.I.off(ProtoId.S2CItemPop_ID, this.onS2CRiseStarEquip, this);
    }

    /** 监听业务事件 子类实现 */
    public addClientEvent(): void {
        //
    }

    /** 移除网络事件 子类实现 */
    public delClientEvent(): void {
        //
    }

    /** 清理数据 */
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
        let funcId: number = FuncId.EquipUpStar;
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

    public upEquipStar(part: number, mats: ItemModel[]): void {
        const oid1 = mats[0].data.OnlyId;
        const oid2 = mats[1].data.OnlyId;
        const oid3 = mats[2].data.OnlyId;
        const d: C2SRiseStarEquip = {
            EquipPart: part,
            CostOId1: oid1,
            CostOId2: oid2,
            CostOId3: oid3,
        };
        NetMgr.I.sendMessage(ProtoId.C2SRiseStarEquip_ID, d);
    }

    private onS2CRiseStarEquip(data: S2CItemPop): void {
        if (data.Type === ItemPopType.upStar) {
            if (!data.Tag) {
                EventClient.I.emit(E.UpStar.UpStarSuccess, data);
            }
        }
    }
}

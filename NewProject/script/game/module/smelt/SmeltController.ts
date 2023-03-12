/*
 * @Author: ylj
 * @Date: 2022-06-15 16:13:00
 * @Description: 熔炼控制器
 */
import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import UtilItem from '../../base/utils/UtilItem';
import { ItemBagType } from '../../com/item/ItemConst';
import ItemModel from '../../com/item/ItemModel';
import { E } from '../../const/EventName';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';
import { BagMgr } from '../bag/BagMgr';
import { SmeltViewId } from './SmeltConst';

const { ccclass } = cc._decorator;
@ccclass('SmeltController')
export default class SmeltController extends BaseController {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CMeltEquip_ID, this.onS2CMeltEquip, this);
    }

    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CMeltEquip_ID, this.onS2CMeltEquip, this);
    }

    public addClientEvent(): void {
        EventClient.I.on(E.Bag.ItemChange, this._onBagEquipChange, this);
        //
    }
    public delClientEvent(): void {
        EventClient.I.off(E.Bag.ItemChange, this._onBagEquipChange, this);
        //
    }
    public clearAll(): void {
        //
    }

    public onS2CMeltEquip(data: S2CMeltEquip): void {
        if (data.Tag) {
            return;
        }

        const arr: ItemModel[] = [];
        for (let i = 0, len = data.NewData.length; i < len; i++) {
            const item = data.NewData[i];
            const itemModel: ItemModel = UtilItem.NewItemModel(item.ItemId, item.ItemNum);
            arr.push(itemModel);
        }

        EventClient.I.emit(E.res.GetReward, arr);
    }

    /**
     * 熔炼
     * @param bagType
     * @param count
     */
    public reqC2SMeltEquip(itemIds: string[]): void {
        const req = new C2SMeltEquip();
        req.Items = itemIds;
        NetMgr.I.sendMessage(ProtoId.C2SMeltEquip_ID, req);
    }

    /** 背包变化,熔炼装备 */
    private _onBagEquipChange(): void {
        // 是否需要自动熔炼普通装备
        if (!ModelMgr.I.SmeltModel.autoSmelt) { return; }

        const ownSize: number = BagMgr.I.getItemOwnSize(ItemBagType.EQUIP_ROLE);
        const totalSize = BagMgr.I.getGridSize(ItemBagType.EQUIP_ROLE);
        if (ownSize / totalSize < 0.8) {
            return;
        }

        const itemOnlyIds: string[] = ModelMgr.I.SmeltModel.getAutoSmeltData();
        if (itemOnlyIds.length) {
            this.reqC2SMeltEquip(itemOnlyIds);
        }
    }

    /**
     * 打开界面
     * @param tab 页签id
     * @param params 配置表的参数列表
     * @param args 可变参，手动传入的参数
     * @returns
     */
    public linkOpen(tab: SmeltViewId = SmeltViewId.SIMPLE_MELT, params: any[] = [0], ...args: any[]): boolean { // 此处需要做跳转类型判断 5,6,7为自定义参数
        WinMgr.I.open(ViewConst.SmeltWin, tab, params ? params[0] : 0);
        return true;
    }
}

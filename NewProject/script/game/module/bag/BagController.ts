/*
 * @Author: hwx
 * @Date: 2022-05-20 11:39:13
 * @FilePath: \SanGuo2.4\assets\script\game\module\bag\BagController.ts
 * @Description: 背包控制器
 */
import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { Config } from '../../base/config/Config';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import UtilItem from '../../base/utils/UtilItem';
import { ItemBagType } from '../../com/item/ItemConst';
import ItemModel from '../../com/item/ItemModel';
import { E } from '../../const/EventName';
import { ViewConst } from '../../const/ViewConst';
import NetMgr from '../../manager/NetMgr';
import { BagItemChangeInfo, BagItemChangeType, BagWinTabType } from './BagConst';
import { Link } from '../link/Link';
import { BagMgr } from './BagMgr';
import { RedDotCheckMgr } from '../reddot/RedDotCheckMgr';

const { ccclass } = cc._decorator;
@ccclass('BagController')
export default class BagController extends BaseController {
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CBagInfo_ID, this.onS2CBagInfo, this);/** 背包基础信息 */
        EventProto.I.on(ProtoId.S2CBagChange_ID, this.onS2CBagChange, this);/** 背包物品变化 */
        EventProto.I.on(ProtoId.S2CItemFly_ID, this.onS2CItemFly, this);
        EventProto.I.on(ProtoId.S2CExtendEquipBag_ID, this.onS2CExtendEquipBag, this);/** 背包扩容成功 */
        EventProto.I.on(ProtoId.S2CExchange_ID, this.onS2CExchange, this);/** 使用道具 */
        EventProto.I.on(ProtoId.S2CBatchExchange_ID, this.onS2CBatchExchange, this);/** 批量使用物品 */
        EventProto.I.on(ProtoId.S2CNotice_ID, this.onS2CNotice, this);
    }
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CBagInfo_ID, this.onS2CBagInfo, this);
        EventProto.I.off(ProtoId.S2CBagChange_ID, this.onS2CBagChange, this);
        EventProto.I.off(ProtoId.S2CItemFly_ID, this.onS2CItemFly, this);
        EventProto.I.off(ProtoId.S2CExtendEquipBag_ID, this.onS2CExtendEquipBag, this);
        EventProto.I.off(ProtoId.S2CExchange_ID, this.onS2CExchange, this);
        EventProto.I.off(ProtoId.S2CBatchExchange_ID, this.onS2CBatchExchange, this);
        EventProto.I.off(ProtoId.S2CNotice_ID, this.onS2CNotice, this);
    }
    public addClientEvent(): void { /** */ }
    public delClientEvent(): void { /** */ }
    public clearAll(): void { /** */ }

    /** 背包基础信息 货币类型道具不在背包列表中，在角色属性中存取 */
    private onS2CBagInfo(data: S2CBagInfo): void {
        // TODO: 分段获取道具
        BagMgr.I.init(data.Items);
        BagMgr.I.setExtendGridSize(ItemBagType.EQUIP_ROLE, data.EquipBagEnlargeSize);
    }

    // 侦听道具ID的变化道具
    private onlyIdsOfIdMap: Map<number, string[]> = new Map();
    // 侦听道具Type的变化道具
    private onlyIdsOfTypeMap: Map<number, string[]> = new Map();
    /** 道具变化特定事件定时器Id */
    private timeoutId: any;

    /** 背包变化，货币类型道具变化不走该协议，在角色属性中更新 */
    private onS2CBagChange(data: S2CBagChange): void {
        // 状态：-1：删除，0：增加，1：更新
        const changes: BagItemChangeInfo[] = [];
        for (let i = 0, len = data.Change.length; i < len; i++) {
            const itemData = data.Change[i];
            const count = itemData.ItemNum;
            /** 对背包缓存做增、删、更新(类型 数量) */
            let itemModel: ItemModel;
            let status = BagItemChangeType.Add;
            const oldItemData = BagMgr.I.getItemModel(itemData.OnlyId);

            if (!oldItemData && count > 0) {
                status = BagItemChangeType.New; /** 缓存里没有 并且当前数量大于0--->新增 */
                itemModel = BagMgr.I.addItemModel(itemData, true);
            } else if (oldItemData && count <= 0) { /** 有旧的数据 当前数量小于0 --->删除物品 */
                status = BagItemChangeType.Del;
                itemModel = BagMgr.I.deleteItemModel(itemData.OnlyId);
            } else if (oldItemData && count > 0) { /** 缓存里有 并且当前数量大于0--->更新物品 */
                if (itemData.ItemNum >= BagMgr.I.getItemNum(itemData.ItemId)) {
                    status = BagItemChangeType.Add;
                } else {
                    status = BagItemChangeType.Reduce;
                }
                itemModel = BagMgr.I.updateItemModel(itemData);
            } else {
                cc.warn('无效的道具数据');
            }

            // 增加背包道具更新特定事件逻辑
            if (itemModel) {
                changes.push({ itemModel, status });
                this._collectItemOnlyId(itemModel);
            }
        }

        /** 集合 某个时间范围内的物品变化，统一派发事件 */
        this._collectItemDispathChange();

        if (changes.length > 0) { BagMgr.I.checkQuickUse(changes); }// 检查快捷使用道具
        EventClient.I.emit(E.Bag.ItemChange, changes); // 背包物品变化通知
        RedDotCheckMgr.I.onItem(changes);
    }

    /** 将一段时间内的onlyId合并 */
    private _collectItemOnlyId(itemModel: ItemModel) {
        const idKey = `${E.Bag.ItemChangeOfId}${itemModel.cfg.Id}`;
        const onItemIdCount = EventClient.I.getEventListenerCount(idKey);
        if (onItemIdCount > 0) {
            let onlyIds = this.onlyIdsOfIdMap.get(itemModel.cfg.Id);
            if (!onlyIds) {
                onlyIds = [];
                this.onlyIdsOfIdMap.set(itemModel.cfg.Id, onlyIds);
            }
            if (onlyIds.length === 0 || onlyIds.indexOf(itemModel.data.OnlyId) === -1) {
                onlyIds.push(itemModel.data.OnlyId);
            }
        }
        const typeKey = `${E.Bag.ItemChangeOfType}${itemModel.cfg.SubType}`;
        const onItemTypeCount = EventClient.I.getEventListenerCount(typeKey);
        if (onItemTypeCount > 0) {
            let onlyIds = this.onlyIdsOfTypeMap.get(itemModel.cfg.SubType);
            if (!onlyIds) {
                onlyIds = [];
                this.onlyIdsOfTypeMap.set(itemModel.cfg.SubType, onlyIds);
            }
            if (onlyIds.length === 0 || onlyIds.indexOf(itemModel.data.OnlyId) === -1) {
                onlyIds.push(itemModel.data.OnlyId);
            }
        }
    }
    /** 合并一段时间的道具变化，统一发送特定的事件 */
    private _collectItemDispathChange() {
        if (!this.timeoutId && (this.onlyIdsOfIdMap.size > 0 || this.onlyIdsOfTypeMap.size > 0)) {
            this.timeoutId = setTimeout(() => {
                if (this.onlyIdsOfIdMap.size > 0) {
                    this.onlyIdsOfIdMap.forEach((onlyIds, itemId) => {
                        EventClient.I.emit(`${E.Bag.ItemChangeOfId}${itemId}`, onlyIds);
                    });
                }

                if (this.onlyIdsOfTypeMap.size > 0) {
                    this.onlyIdsOfTypeMap.forEach((onlyIds, itemType) => {
                        EventClient.I.emit(`${E.Bag.ItemChangeOfType}${itemType}`, onlyIds);
                    });
                }
                clearTimeout(this.timeoutId);
                this.timeoutId = null;
                this.onlyIdsOfIdMap.clear();
                this.onlyIdsOfTypeMap.clear();
            }, 1000);
        }
    }

    // 飘获得xxx物品消息
    private onS2CItemFly(data: S2CItemFly): void {
        for (let i = 0, len = data.Items.length; i < len; i++) {
            const item = data.Items[i];
            const cfg = UtilItem.GetCfgByItemId(item.ItemId);
            if (cfg && cfg.Name) {
                const hex = UtilItem.GetItemQualityColor(cfg.Quality, true);
                MsgToastMgr.Show(`获得 <color=${hex}>${cfg.Name}x${item.ItemNum}</c>`);// 获得
            }
        }
    }

    /** 请求 扩展玩家装备背包格子数量 */
    public reqC2SExtendEquipBag(bagType: number, count: number): void {
        const req = new C2SExtendEquipBag();
        req.BagType = bagType;
        req.Count = count;
        NetMgr.I.sendMessage(ProtoId.C2SExtendEquipBag_ID, req);
    }
    /** 扩展玩家装备背包格子数量 成功 */
    private onS2CExtendEquipBag(data: S2CExtendEquipBag): void {
        if (!data.Tag) {
            BagMgr.I.setExtendGridSize(data.BagType, data.EnlargeSize);
            EventClient.I.emit(E.Bag.GridExtendSize, data.BagType);
        }
    }

    /** 道具使用总入口  此处功能待完善 @hwx */
    public itemUseHandler(itemModel: ItemModel, useNum?: number): number {
        const useId = itemModel.cfg.UseFunc;
        if (useId) {
            const useCfg: Cfg_UseFunc = Config.Get(Config.Type.Cfg_UseFunc).getValueByKey(useId);
            if (!useCfg) {
                cc.log('道具使用失败'); return;
            }
            useNum = useNum || itemModel.data.ItemNum;
            const onlyId = itemModel.data.OnlyId;
            switch (useCfg.Type) {
                case 1: // 获取道具，Param1：道具ID，Param2：道具数量
                case 5:
                case 7:
                    this.reqC2SExchange(onlyId, useNum);
                    break;

                case 2: // 打开某个界面，Param1：界面功能ID
                    Link.To(useCfg.Param1, useCfg.Param2);
                    break;
                case 3: // 选择一个道具获得
                    // TODO
                    WinMgr.I.open(ViewConst.ItemTipsPickChestWin, itemModel);
                    break;
                case 4: // 根据方案开启宝箱，Param1：掉落表里面的宝箱方案ID
                    // TODO
                    break;
                default:
                    // 默认都走reqC2SExchange吧，不是的话自己加枚举
                    this.reqC2SExchange(onlyId, useNum);
                    break;
            }
        }
    }

    /** 使用道具 */
    public reqC2SExchange(onlyId: string, count: number, param?: number): void {
        const req = new C2SExchange();
        req.OnlyId = onlyId; // 道具唯一Id
        req.Count = count; // 道具使用数量
        req.Param = param; // 道具使用参数(自选宝箱-选择的道具Id)
        NetMgr.I.sendMessage(ProtoId.C2SExchange_ID, req);
    }
    /** 使用道具成功 */
    private onS2CExchange(data: S2CExchange): void {
        if (!data.Tag) { /** */ }
    }

    /** 批量使用物品 */
    public reqC2SBatchExchange(list: C2SExchange[]): void {
        const req = new C2SBatchExchange();
        req.Exchange = list;
        NetMgr.I.sendMessage(ProtoId.C2SBatchExchange_ID, req);
    }
    /** 批量使用物品成功 */
    private onS2CBatchExchange(data: S2CBatchExchange): void {
        if (!data.Tag) { /** */ }
    }

    /** 飘字通用协议 */
    private onS2CNotice(d: S2CNotice) {
        if (d.Tag === 0) {
            if (d.Id === 11014) {
                d.Items1.forEach((item1, index) => {
                    const item2 = d.Items2[index];
                    const cfg1 = UtilItem.GetCfgByItemId(item1.ItemId);
                    const cfg2 = UtilItem.GetCfgByItemId(item2.ItemId);
                    let param1 = '';
                    let param2 = '';
                    if (cfg1 && cfg1.Name) {
                        const hex1 = UtilItem.GetItemQualityColor(cfg1.Quality, true);
                        param1 = `<color=${hex1}>${cfg1.Name}x${item1.ItemNum}</c>`;
                    }
                    if (cfg2 && cfg2.Name) {
                        const hex2 = UtilItem.GetItemQualityColor(cfg2.Quality, true);
                        param2 = `<color=${hex2}>${cfg2.Name}x${item2.ItemNum}</c>`;
                    }
                    MsgToastMgr.ShowErrTips(d.Id, param1, param2);
                });
            } else {
                MsgToastMgr.ShowErrTips(d.Id);
            }
        }
    }

    /**
     * 打开界面
     * @param tab 页签id
     * @param params 配置表的参数列表
     * @param args 可变参，手动传入的参数
     * @returns
     */
    public linkOpen(tab: BagWinTabType = BagWinTabType.BAG, params: any[] = [0], ...args: any[]): boolean { // 此处需要做跳转类型判断 5,6,7为自定义参数
        WinMgr.I.open(ViewConst.BagWin, tab, params ? params[0] : 0);
        return true;
    }
}

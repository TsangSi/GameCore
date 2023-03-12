import { WinTabPage } from '../../../com/win/WinTabPage';
import { UtilGame } from '../../../base/utils/UtilGame';
import {
    BagPageEquipTabs, BagPageItemType, BagPageItemTabs, BagPageEquipType,
} from '../BagConst';
import { TabItem } from '../../../com/tab/TabItem';
import { TabContainer } from '../../../com/tab/TabContainer';
import { BagMgr } from '../BagMgr';
import ItemModel from '../../../com/item/ItemModel';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilArray } from '../../../../app/base/utils/UtilArray';
import WinMgr from '../../../../app/core/mvc/WinMgr';

import { ItemBagType } from '../../../com/item/ItemConst';
import { EventClient } from '../../../../app/base/event/EventClient';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import { BagItemGrid } from './BagItemGrid';
import { i18n, Lang } from '../../../../i18n/i18n';
import ListView from '../../../base/components/listview/ListView';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { SmeltViewId } from '../../smelt/SmeltConst';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import { FuncId } from '../../../const/FuncConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export default class BagPage extends WinTabPage {
    @property(TabContainer)
    private TabsItemType: TabContainer = null;

    @property(TabContainer)
    private TabsEquipType: TabContainer = null;

    @property(cc.Node)
    private NdItemOperate: cc.Node = null;

    @property(cc.EditBox)
    private EditSearch: cc.EditBox = null;

    @property(cc.Node)
    private NdSearchExitButton: cc.Node = null;

    @property(cc.Node)
    private NdSearchButton: cc.Node = null;

    @property(cc.Node)
    private NdAllUseButton: cc.Node = null;

    @property(cc.Node)
    private NdEquipOperate: cc.Node = null;

    @property(cc.Node)
    private NdCapacity: cc.Node = null;

    @property(cc.Label)
    private LabCapacity: cc.Label = null;

    @property(cc.Sprite)
    private SprCapacityAddButton: cc.Sprite = null;

    @property(cc.Node)
    private NdMeltButton: cc.Node = null;

    @property(ListView)
    private ListGrid: ListView = null;

    private listMinGridCount: number = 30;

    private listMaxGridCount: number = 200;

    /** 当前显示列表 */
    private _currentItems: ItemModel[] = [];
    /** 道具页签ID */
    private _itemTabId: number = 0;
    /** 装备页签ID */
    private _equipTabId: number = 0;
    private _searchSource: ItemModel[] = [];
    private _bagType: number;

    private _preSearchStr: string = '';
    protected start(): void {
        super.start();
        EventClient.I.on(E.Bag.ItemChange, this.onItemChange, this);
        EventClient.I.on(E.Bag.GridExtendSize, this.onGridExtendSize, this);
        EventClient.I.on(E.res.GetReward, this._onSmeltSuccess, this);// 熔炼成功

        UtilGame.Click(this.NdSearchExitButton, () => {
            this.EditSearch.string = '';
            this.NdSearchExitButton.active = false;
            // 恢复源列表
            // const list = UtilArray.Copy(this._searchSource);
            // this.initList(list);
            this.showGeneralItemList();
            this._searchSource = [];
        }, this);

        /** 点击搜索 */
        UtilGame.Click(this.NdSearchButton, () => {
            if (!this.EditSearch.string) {
                MsgToastMgr.Show(i18n.tt(Lang.bag_page_msg_input_search));
            } else {
                if (this._preSearchStr === this.EditSearch.string) {
                    return;
                }

                if (this._searchSource.length === 0) {
                    /** 当前显示列表 当物品变化的时候，这个值没变 会有异常 */
                    /** 当物品变化时，需要更新这个  this._searchSource */
                    this._searchSource = UtilArray.Copy(this._currentItems);
                }
                const list: ItemModel[] = [];
                for (let i = 0, len = this._searchSource.length; i < len; i++) {
                    const itemData = this._searchSource[i];
                    if (itemData.cfg.Name.includes(this.EditSearch.string)) {
                        list.push(itemData);
                    }
                }
                if (list.length > 0) {
                    this.NdSearchExitButton.active = true;
                    this.initList(list); // 显示搜索结果
                    this._preSearchStr = this.EditSearch.string;
                } else {
                    MsgToastMgr.Show(i18n.tt(Lang.bag_page_msg_no_search));
                }
            }
        }, this);

        UtilGame.Click(this.NdAllUseButton, () => {
            const list = BagMgr.I.getOneKeyUseItems();
            if (list?.length) {
                WinMgr.I.open(ViewConst.BagOneKeyUseWin, list);
            } else {
                MsgToastMgr.Show(i18n.tt(Lang.bag_all_use_tips));
            }
        }, this);

        UtilGame.Click(this.SprCapacityAddButton.node, () => {
            const remainSize = BagMgr.I.getCanExtendGridSize(this._bagType);
            if (remainSize > 0) {
                WinMgr.I.open(ViewConst.BagExpansionWin, this._bagType, remainSize);
            } else {
                MsgToastMgr.Show(i18n.tt(Lang.bag_expansion_win_full_toast));
            }
        }, this);

        UtilGame.Click(this.NdMeltButton, () => {
            if (UtilFunOpen.isOpen(FuncId.Smelt, true)) {
                ControllerMgr.I.SmeltController.linkOpen(SmeltViewId.SIMPLE_MELT);
            }
        }, this);
    }

    private _onSmeltSuccess() { // 刷新数量
        this._updateBagSize();
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Bag.ItemChange, this.onItemChange, this);
        EventClient.I.off(E.Bag.GridExtendSize, this.onGridExtendSize, this);
        /** 熔炼成功 */
        EventClient.I.off(E.res.GetReward, this._onSmeltSuccess, this);
    }

    public init(winId: number, param: unknown[], tabIdx: number = 0): void {
        super.init(winId, param, 0);
        this._preSearchStr = '';
        // 解析参数
        let itemTabId: number;
        let equipTabId: number;
        if (param) {
            itemTabId = param[1] as number;
            equipTabId = param[2] as number;
        }

        // 检查道具TabId是否合法
        if (itemTabId === undefined) {
            itemTabId = this._itemTabId || BagPageItemTabs[0].id;
        } else {
            let has = false;
            for (let i = 0, len = BagPageItemTabs.length; i < len; i++) {
                const v = BagPageItemTabs[i];
                if (itemTabId === v.id) {
                    has = true;
                }
            }
            if (!has) {
                itemTabId = BagPageItemTabs[0].id;
            }
        }

        // 检查装备TabId是否合法
        if (equipTabId === undefined) {
            equipTabId = this._equipTabId || BagPageEquipTabs[0].id;
        } else {
            let has = false;
            for (let i = 0, len = BagPageEquipTabs.length; i < len; i++) {
                const v = BagPageEquipTabs[i];
                if (equipTabId === v.id) {
                    has = true;
                }
            }
            if (!has) {
                equipTabId = BagPageEquipTabs[0].id;
            }
        }
        this._equipTabId = equipTabId;

        // 初始化页签
        this.TabsItemType.setData(BagPageItemTabs, itemTabId);
    }

    public refreshPage(winId: number, param: unknown, tabIdx: number): void {
        super.refreshPage(winId, param, tabIdx);
    }

    public initList(list: ItemModel[]): void {
        this._currentItems = list;
        console.log('当前Items,长度');

        console.log(this._currentItems.length);

        this._preSearchStr = '';
        const propCount = this._currentItems.length;
        let gridCount = Math.min(Math.max(propCount, this.listMinGridCount), this.listMaxGridCount);
        if (gridCount % 5 !== 0) {
            gridCount += 5 - gridCount % 5;
        }
        this.ListGrid.setNumItems(gridCount, 0);
        this.ListGrid.scrollTo(0, 0.1);
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const prop = this._currentItems[idx];
        const grid = node.getComponent(BagItemGrid);
        if (prop && grid) {
            grid.loadIcon(prop);
        } else {
            grid.clearIcon();
        }
    }

    private onItemTypeTabSelected(tabItem: TabItem) {
        const tabData = tabItem.getData();
        this.showItemList(tabData.id);
    }

    private showItemList(itemTabId: number): void {
        this._itemTabId = itemTabId;
        this._preSearchStr = '';
        switch (itemTabId) {
            case BagPageItemType.EQUIP:
                this.showEquipItemList();
                break;
            case BagPageItemType.GENERAL:
                this.showGeneralItemList();
                break;
            case BagPageItemType.GEM:
                this.showGemItemList();
                break;
            default:
                cc.warn(`未知类型${itemTabId}，请增加实现！`);
                this._itemTabId = BagPageItemType.EQUIP;
                this.showEquipItemList();
                break;
        }
    }

    // private _listGridTrans: UITransform;
    private resetListHeight(height: number, _h?: number): void {
        // if (!this._listGridTrans) {
        //     this._listGridTrans = this.ListGrid.getComponent(UITransform);
        // }
        // this._listGridTrans.height = height;
        this.ListGrid.content.height = height;
        this.ListGrid.node.height = _h || 658;
    }

    /**
     * 显示装备道具列表
     */
    private showEquipItemList(): void {
        this.NdItemOperate.active = false;
        this.TabsEquipType.node.parent.active = true;
        if (!this.TabsEquipType.node.children[0]) {
            // 初始化装备页签
            this.TabsEquipType.setData(BagPageEquipTabs, this._equipTabId);
        } else {
            // 聚焦页签，重新分发选中事件
            this.TabsEquipType.focus();
        }
    }

    /**
     * 显示普通道具列表
     */
    private showGeneralItemList(): void {
        this.NdEquipOperate.active = false;
        this.TabsEquipType.node.parent.active = false;
        this.NdItemOperate.active = true;
        // 道具页格子列表高度870
        this.resetListHeight(870, 778);
        this.listMinGridCount = 35;

        this._bagType = ItemBagType.GENERAL;
        const list = BagMgr.I.getItemListByBagType(this._bagType);
        this.listMaxGridCount = Math.max(list.length, this.listMinGridCount);
        this.initList(list);
    }

    private showGemItemList(): void {
        this.NdEquipOperate.active = true;
        this.NdMeltButton.active = false;
        this.NdItemOperate.active = false;
        this.TabsEquipType.node.parent.active = false;
        // 其他页格子列表高度960
        this.resetListHeight(870, 870);
        this.listMinGridCount = 35;

        this._bagType = ItemBagType.GEM;
        const list = BagMgr.I.getItemListByBagType(this._bagType);
        this.listMaxGridCount = Math.max(list.length, this.listMinGridCount);
        this.initList(list);
        this.showEquipCapacity(this._bagType, list.length);
    }

    private onEquipTypeTabSelected(tabItem: TabItem) {
        const tabData = tabItem.getData();
        this.showEquipList(tabData.id);
    }

    private showEquipList(equipTabId: number): void {
        this._preSearchStr = '';
        this._equipTabId = equipTabId;
        switch (equipTabId) {
            case BagPageEquipType.ROLE:// 角色装备
                this.showRoleEquipList();
                break;
            case BagPageEquipType.BEAST:// 凶兽装备
                this.showBeastEquipList();
                break;
            case BagPageEquipType.FAIRY:// 合体装备
                this.showFairyEquipList();
                break;
            case BagPageEquipType.GHOST:// 幻灵装备
                this.showGhostEquipList();
                break;
            case BagPageEquipType.KING:// 王者套装
                this.showKingTypeList();
                break;
            default:
                cc.warn(`未知类型${equipTabId}，请增加实现！`);
                this._equipTabId = BagPageEquipType.ROLE;
                this.showRoleEquipList();
                break;
        }
    }

    /**
     * 显示装备容量
     * @param ownSize
     */
    private showEquipCapacity(bagType: number, ownSize: number): void {
        this.NdCapacity.active = true;
        const totalSize = bagType === ItemBagType.GEM ? ModelMgr.I.GemModel.getBagMaxNum() : BagMgr.I.getGridSize(bagType);
        this.LabCapacity.string = `${ownSize}/${totalSize}`;

        if (totalSize - ownSize <= 10) {
            this.LabCapacity.node.color = cc.Color.RED;
        } else {
            this.LabCapacity.node.color = UtilColor.Hex2Rgba(UtilColor.NorV);
        }
        // 设置装备背包最大格子数量
        if (bagType === ItemBagType.EQUIP_ROLE) {
            this.listMinGridCount = totalSize;
        }
        this.listMaxGridCount = totalSize;

        // 是否显示扩展按钮
        const maxSize = BagMgr.I.getEquipBagMaxSize();
        this.SprCapacityAddButton.node.active = totalSize < maxSize && bagType !== ItemBagType.GEM;
    }

    private onGridExtendSize(bagType: number): void {
        if (bagType === this._bagType && this.NdCapacity.active) {
            this.showEquipCapacity(bagType, this._currentItems.length);
        }
    }

    /** 显示角色装备列表 */
    private showRoleEquipList(): void {
        this.NdEquipOperate.active = true;
        this.NdMeltButton.active = true;
        // 装备页格子列表高度714
        this.resetListHeight(714);
        this.listMinGridCount = 30;

        this._bagType = ItemBagType.EQUIP_ROLE;
        const list = BagMgr.I.getItemListByBagType(this._bagType);
        this.showEquipCapacity(this._bagType, list.length);
        this.initList(list);
    }

    /** 显示凶兽装备列表 */
    private showBeastEquipList(): void {
        this.NdEquipOperate.active = false;
        // 装备页格子列表高度809
        this.resetListHeight(809);
        this.listMinGridCount = 35;

        this._bagType = ItemBagType.EQUIP_BEAST;
        const list = BagMgr.I.getItemListByBagType(this._bagType);
        this.initList(list);
    }

    /** 显示天仙装备列表 */
    private showFairyEquipList(): void {
        this.NdEquipOperate.active = false;
        // 装备页格子列表高度809
        this.resetListHeight(809);
        this.listMinGridCount = 35;

        this._bagType = ItemBagType.EQUIP_FAIRY;
        const list = BagMgr.I.getItemListByBagType(this._bagType);
        this.initList(list);
    }

    /** 显示幻灵装备列表 */
    private showGhostEquipList(): void {
        this.NdEquipOperate.active = false;
        // 装备页格子列表高度809
        this.resetListHeight(809);
        this.listMinGridCount = 35;

        this._bagType = ItemBagType.EQUIP_GHOST;
        const list = BagMgr.I.getItemListByBagType(this._bagType);
        this.initList(list);
    }

    /** 显示王者装备列表 */
    private showKingTypeList(): void {
        this.NdEquipOperate.active = false;
        // 装备页格子列表高度809
        this.resetListHeight(809);
        this.listMinGridCount = 35;

        this._bagType = ItemBagType.EQUIP_KING;
        const list = BagMgr.I.getItemListByBagType(this._bagType);
        this.initList(list);
    }

    /**
     * 道具更新，刷新背包
     * @param changes
     */
    private onItemChange(changes: { itemModel: ItemModel, status: number }[]): void {
        this._preSearchStr = '';
        let needRefresh = false;
        for (let i = 0, len = changes.length; i < len; i++) {
            const info = changes[i];
            const bagType = info.itemModel.cfg.BagType;
            if (bagType === this._bagType) {
                needRefresh = true;
            }
        }

        if (needRefresh) {
            const list = BagMgr.I.getItemListByBagType(this._bagType);
            this.initList(list);

            // 更新背包容量变化
            this._updateBagSize();
        }

        // 物品变化后
        if (changes.length && needRefresh) {
            // this._bagType = ItemBagType.GENERAL;
            const list = BagMgr.I.getItemListByBagType(this._bagType);
            this._searchSource = [];
            this._searchSource = UtilArray.Copy(list);
        }
    }

    private _updateBagSize() {
        if (this._bagType === ItemBagType.EQUIP_ROLE || this._bagType === ItemBagType.GEM) {
            const ownSize = BagMgr.I.getItemOwnSize(this._bagType);
            this.showEquipCapacity(this._bagType, ownSize);
        }
    }
}

import { js } from "cc";
import { Executor } from "../../../../scripts/common/Executor";
import { ItemTypeView } from "../../../../scripts/global/GConst";
import Utils from "../../../../scripts/utils/Utils";
import { ItemDataEx } from "./ItemDataEx";
import { ItemViewBase } from "./view/ItemViewBase";

export class ItemManagerBase {
    protected CItemInfos: { [id: string]: ItemDataEx; } = js.createMap(true);
    private Comparator: Executor = new Executor(this.itemKeyGetter, this);
    private views: ItemViewBase[] = [];
    private view_types: ItemTypeView[] = [];
    protected SortedItems = []; // index列表

    protected addItem(cItemInfo: ItemDataEx) {
        // this.Items[itemData.Id] = itemData;
        // this._onItemAdd()
        let id = cItemInfo.getId();
        let old_item = this.getItem(id);
        let item_order_key = cItemInfo.getOrderKey();
        let sorted_items = this.SortedItems;
        let iremoved;
        if (old_item) {
            let old_order_key = old_item.getOrderKey();
            if (item_order_key !== old_order_key) {
                // 位置不同，需要刷新UI
                iremoved = ItemManagerBase.RemoveFromSortedArray(this, sorted_items, old_item.getId(), old_order_key);
            }
        }
        this.CItemInfos[id] = cItemInfo;
        let iadd = ItemManagerBase.InsertSortedArray(this, sorted_items, id);
        if (iremoved === iadd && iremoved >= 0) {
            this.onSlotItemChanged();
        } else {
            if (iremoved !== undefined && iremoved >= 0) {
                // if (iadd !== undefined && iadd >= 0) {
                this.itemRemoveToView(iremoved, old_item.getId(), iadd, id);
                // } else {
                //     this._onItemRemove(iremoved, old_item.getId());
                // }
            } else if (iadd !== undefined && iadd >= 0) {
                // if (iremoved !== undefined && iremoved >= 0) {
                this.itemAddToView(iadd, id, iremoved, old_item ? old_item.getId() : undefined);
                // } else {
                // this._onItemAdd(iadd, id);
                // }
            }
        }
    }

    private onSlotItemChanged() {

    }

    static InsertSortedArray<T>(itemManager: ItemManagerBase, array: string[], id: string) {
        return Utils.insertToAscUniqueArray(array, id, false, itemManager.getComparator());
        // return array.push(id);
    }

    static RemoveFromSortedArray(itemManager: ItemManagerBase, array: string[], id: string, key: string) {
        return Utils.RemoveFromSortedArray(array, id);;
    }

    /**
    * 按唯一ID获取物品
    */
    getItem(Id: string) {
        return this.CItemInfos[Id];
    }

    /**
     * 当某物品删除后调用
     * @param  index -删除的物品排序位置索引
     * @param  id -删除了的物品唯一id
     * @param  add_index -删除的同时添加了物品时该字段有效
     * @param  add_id -删除的同时添加了物品时该字段有效
     */
    private itemRemoveToView(index: number, id: string, add_index?: number, add_id?: string) {
        this.views.forEach((view) => {
            view.onItemRemove(index, id, add_index, add_id);
            this.onItemRemove(index, id, add_index, add_id);
        });
    }

    /**
     * 子类可重写
     * 由子类实现事件通知
     */
    protected onItemRemove(index: number, id: string, remove_index?: number, remove_id?: string) {

    }

    /**
     * 当某物品添加后调用
     * @param index -添加了的物品排序位置索引
     * @param id -添加了的物品唯一id
     * @param remove_index -添加物品的同时如果删除了物品，该字段有效
     * @param remove_id -添加物品的同时如果删除了物品，该字段有效
     */
    private itemAddToView(index: number, id: string, remove_index?: number, remove_id?: string) {
        this.views.forEach((view) => {
            view.onItemAdd(index, id, remove_index, remove_id);
            this.onItemAdd(index, id);
        });
    }


    /**
     * 子类可重写
     * 由子类实现事件通知
     *  */
    protected onItemAdd(index: number, id: string, add_index?: number, remove_id?: string) {

    }

    protected removeItem(id: string) {
        let item = this.CItemInfos[id];
        if (!item) { return; }
        delete this.CItemInfos[id];
    }

    protected installView(type: ItemTypeView, view: ItemViewBase) {
        let pos = this.view_types.indexOf(type);
        if (pos >= 0) {
            return this.views[pos];
        }
        this.view_types.push(type);
        this.views.push(view);
        return view;
    }

    getView<T extends ItemViewBase>(type: ItemTypeView): T {
        let pos = this.view_types.indexOf(type);
        return <T>this.views[pos];
    }

    protected removeView(type: ItemTypeView) {
        let pos = this.view_types.indexOf(type);
        if (pos >= 0) {
            this.views.splice(pos, 1);
            this.view_types.splice(pos, 1);
        }
    }

    private itemKeyGetter(id: string) {
        if (this.CItemInfos[id]) {
            return this.CItemInfos[id].getOrderKey();
        } else {
            return id;
        }
    }

    private getComparator() {
        return this.Comparator;
    }
}

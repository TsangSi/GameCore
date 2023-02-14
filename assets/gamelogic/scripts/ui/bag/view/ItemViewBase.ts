import { UtilsCommon } from "../../../../../scripts/utils/UtilsCommon";
import { ItemDataEx } from "../ItemDataEx";
import { ItemManagerBase } from "../ItemManagerBase";

export class ItemViewBase {

    private Id: number = 0;
    protected ItemManager: ItemManagerBase;
    constructor(manager?: ItemManagerBase) {
        this.Id = UtilsCommon.generateUniqueId();
        this.ItemManager = manager;
    }

    private init() {
        let items = this.getInitItems();
        items.forEach((id, index) => {
            if (this.eligible(index, id)) {
                this.addItem(index, id);
            }
        });
    }

    /**
     * 当某物品删除后调用
     * @param index 物品位置索引
     * @param id 物品唯一id
     */
    onItemRemove(index: number, id: string, add_index?: number, add_id?: string) {
        this.removeItem(index, id);
        if (add_index !== undefined && add_id !== undefined && this.eligible(add_index, add_id)) {
            this.addItem(add_index, add_id);
        }
    }

    /**
     * 当某物品添加后调用
     * @param index 添加的物品索引
     * @param id 物品唯一id
     */
    onItemAdd(index: number, id: string, remove_index?: number, remove_id?: string) {
        if (this.eligible(index, id)) {
            this.addItem(index, id);
        }
        if (remove_index !== undefined && remove_id !== undefined) {
            this.removeItem(remove_index, remove_id);
        }
    }


    protected removeItem(index: number, id: string, old_itemdata_ex?: ItemDataEx) {
        if (this.eligible(index, id)) {
            this.addItem(index, id);
        }
    }

    /**
     * 子类可重写
     * @param index 索引
     * @param id 唯一id
     */
    protected addItem(index: number, id: string) {

    }

    addItemToArray(array: string[], index: number, id: string) {
        return ItemManagerBase.InsertSortedArray(this.ItemManager, array, id);
    }

    removeItemToArray(array: string[], index: number, id: string, old_item_data_ex?: ItemDataEx) {
        return ItemManagerBase.RemoveFromSortedArray(this.ItemManager, array, id, old_item_data_ex.getId());
    }

    /**
     * 返回是否符合条件
     * @param index 索引
     * @param id 唯一id
     * @returns
     */
    protected eligible(index: number, id: string) {
        return !!(index !== undefined && id);
    }

    getId() {
        return this.Id;
    }

    private getInitItems() {
        return [];
    }
}

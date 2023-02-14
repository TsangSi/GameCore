import { js } from "cc";
import { ItemType } from "../../../../../scripts/global/GConst";
import { ItemDataEx } from "../ItemDataEx";
import { ItemViewBase } from "./ItemViewBase";

export class ItemViewType extends ItemViewBase {
    private items_by_type: { [type: number]: string[]; } = js.createMap(true);

    clear() {
        for (let t in this.items_by_type) {
            this.items_by_type[t].length = 0;
        }
        this.items_by_type = js.createMap(true);
    }

    getItemsByType(type: ItemType) {
        return this.items_by_type[type];
    }

    protected addItem(index: number, id: string) {
        let item = this.ItemManager.getItem(id);
        let type = item.getType();
        let items = this.items_by_type[type] = this.items_by_type[type] || [];
        this.addItemToArray(items, index, id);
        // console.log('iid, id = ', item.getIId(), item.getId());
        // console.log('this.items_by_type=', this.items_by_type);
    }

    protected removeItem(index: number, id: string, old_itemdata_ex?: ItemDataEx) {
        old_itemdata_ex = old_itemdata_ex || this.ItemManager.getItem(id);
        if (!old_itemdata_ex) { return; }
        let type = old_itemdata_ex.getType();
        let items = this.items_by_type[type];
        if (this.removeItemToArray(items, index, id, old_itemdata_ex)) {
            if (!items.length) {
                delete this.items_by_type[type];
            }
        }
    }
}

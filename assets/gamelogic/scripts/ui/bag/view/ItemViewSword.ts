import { js } from "cc";
import { ItemType } from "../../../../../scripts/global/GConst";
import Utils from "../../../../../scripts/utils/Utils";
import { ItemDataEx } from "../ItemDataEx";
import { ItemViewBase } from "./ItemViewBase";

export class ItemViewSword extends ItemViewBase {
    private items: string[] = [];
    private equipped_items: string[] = [];
    clear() {
        this.items.length = 0;
        this.equipped_items.length = 0;
    }

    protected addItem(index: number, id: string): void {
        let item = this.ItemManager.getItem(id);
        if (item) {
            if (item.isEquipped()) {
                this.addItemToArray(this.equipped_items, index, id);
            } else {
                this.addItemToArray(this.items, index, id);
            }
        }
    }

    protected removeItem(index: number, id: string, old_itemdata_ex?: ItemDataEx): void {
        old_itemdata_ex = old_itemdata_ex || this.ItemManager.getItem(id);
        if (!old_itemdata_ex) { return; }
        this.removeItemToArray;
    }

    protected eligible(index: number, id: string): boolean {
        let item = this.ItemManager.getItem(id);
        if (item) {
            return ItemType.Sword === item.getCfgParamByName('Type');
        }
        return false;
    }
}

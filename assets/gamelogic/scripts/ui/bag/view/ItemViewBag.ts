
import { js } from "cc";
import { EquipType, ItemType } from "../../../../../scripts/global/GConst";
import Utils from "../../../../../scripts/utils/Utils";
import { ItemDataEx } from "../ItemDataEx";
import { ItemViewBase } from "./ItemViewBase";

enum BagType {
    Normall,
    RoleEquip,
    XiongShouEquip,
    HeTiEquip,
    HuanLingEquip,
    KingSuit,
    Gem,
    Grade
}

export class ItemViewBag extends ItemViewBase {
    private items_by_bagtype: { [bagtype: number]: string[]; } = js.createMap(true);

    clear() {
        for (let t in this.items_by_bagtype) {
            this.items_by_bagtype[t].length = 0;
        }
        this.items_by_bagtype = js.createMap(true);
    }

    getItemsByBagType(bagtype: BagType) {
        return this.items_by_bagtype[bagtype] || [];
    }

    private getBagType(id: string) {
        let item = this.ItemManager.getItem(id);
        if (!item) { return; }
        let type = item.getType();
        // if (item.getCfgParamByName('Quality') >= 5) { return;}
        switch (type) {
            case ItemType.Equip:
                return this.getBagTypeByEquip(item.getCfgParamByName('EquipType'));
            case ItemType.Gem:
                return BagType.Gem;
            case ItemType.Rune:
            case ItemType.Sword:
            case ItemType.Dragon:
                return;
            default:
                return BagType.Normall;
        }
    }

    private getBagTypeByEquip(equip_type: EquipType) {
        switch (equip_type) {
            case EquipType.Normall:
            case EquipType.Suit:
                return BagType.RoleEquip;
            case EquipType.XiongShou:
                return BagType.XiongShouEquip;
            case EquipType.Fariy:
                return BagType.HeTiEquip;
            case EquipType.HuanLing:
                return BagType.HuanLingEquip;
            case EquipType.King:
                return BagType.KingSuit;
            case EquipType.Grade:
                return BagType.Grade;
        }
    }

    protected eligible(index: number, id: string) {
        return !Utils.isNullOrUndefined(this.getBagType(id));
    }

    protected addItem(index: number, id: string) {
        let bag_type = this.getBagType(id);
        if (!Utils.isNullOrUndefined(bag_type)) {
            let items = this.items_by_bagtype[bag_type] = this.items_by_bagtype[bag_type] || [];
            this.addItemToArray(items, index, id);
        }
    }

    protected removeItem(index: number, id: string, old_itemdata_ex?: ItemDataEx) {
        old_itemdata_ex = old_itemdata_ex || this.ItemManager.getItem(id);
        if (!old_itemdata_ex) { return; }
        let bag_type = this.getBagType(id);
        if (bag_type) {
            let items = this.items_by_bagtype[bag_type];
            if (this.removeItemToArray(items, index, id, old_itemdata_ex)) {
                if (!items.length) {
                    delete this.items_by_bagtype[bag_type];
                }
            }
        }
    }

    static BagType: typeof BagType = BagType;
}

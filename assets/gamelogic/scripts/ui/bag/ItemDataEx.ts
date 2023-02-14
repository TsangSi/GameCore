import { js } from "cc";
import { Config } from "../../../../scripts/config/Config";
import { EquipType, EquipWearStatus, FuncType, ItemType, ShowSrc } from "../../../../scripts/global/GConst";
import UtilsString from "../../../../scripts/utils/UtilsString";


export class ItemDataEx {
    private OrderKey: string = '';
    public readonly ItemData: ItemData = js.createMap(true);
    private Type: ItemType;
    private equip_type: EquipType;
    private readonly CfgItem: Cfg_Item = js.createMap(true);
    constructor(data?: ItemData) {
        this.ItemData = data;
    }

    getItemData() {
        return this.ItemData;
    }

    getId() {
        return this.ItemData.Id;
    }

    getIId() {
        return this.ItemData.IId;
    }

    getIsNew() {
        return !!this.ItemData.IsNew;
    }

    /** 是否已装备/已穿戴 */
    isEquipped() {
        return this.ItemData!.Pos === EquipWearStatus.Yes;
    }

    isMapEmpty(obj: Object) {
        for (let k in obj) {
            return false;
        }
        return true;
    }

    getCfgParamByName<T>(name: string): T {
        if (this.isMapEmpty(this.CfgItem)) {
            this.CfgItem = Config.getI(Config.T.Cfg_Item).getDataByKey(this.getIId().toString());
        }
        return this.CfgItem[name];
    }

    getType(): number {
        return this.getCfgParamByName('Type');
    }

    getQuality(): number {
        return this.getCfgParamByName('Type');
    }

    getObjType(): number {
        return this.getCfgParamByName('ObjType') || 0;
    }

    getEquipPart(): number {
        return this.getCfgParamByName('EquipPart') || 0;
    }

    getEquipType(): EquipType {
        return this.getCfgParamByName('EquipType') || 0;
    }

    getStar() {
        let equip_type = this.getEquipType();
        if (equip_type === EquipType.XiongShou || equip_type === EquipType.HuanLing) {
            return this.ItemData.Star;
        } else {
            let star: number = this.getCfgParamByName('Star');
            return star;
        }

    }

    getOrderKey(forceUpdate: boolean = false) {
        let str_iid = this.getIId().toString();
        if (!this.OrderKey || forceUpdate) {
            let s = '';
            s = s + (this.getIsNew() ? '1' : '0');
            s = s + UtilsString.padStart(this.getType(), 2, '0');
            // s = s + this.Id;
            s = s + UtilsString.padStart(this.getQuality(), 2, '0');
            s = s + (UtilsString.padStart(str_iid, 9, '0'));
            this.OrderKey = s;
        }
        return this.OrderKey;
    }

    /** 是否是金装 */
    isQualityJin(show_src: ShowSrc, equipDuJins?: { [part: number]: EquipDuJin; }) {
        let str_iid = this.getIId().toString();
        let obj_type = this.getObjType();
        let equip_part = this.getEquipPart();
        if (this.ItemData && this.isEquipped() && obj_type === FuncType.RoleEquip) {
            if (!equipDuJins) {
                // equipDuJins = RoleM.I.EquipDuJins;
            }
            if (equipDuJins) {
                let part_info = equipDuJins[equip_part];
                if (show_src === ShowSrc.DuJin || (part_info && part_info.DuJinLevel > 0)) {
                    return true;
                }
            }
        }
        return false;
    }


    /** 一个装备与身上的对比,返回0为战力相等, 负数(战力差值)为比身上的战力小, 正数(战力差值)为比身上的战力大 */
    compareFightValue2Equiped() {
        return 0;
    }
}

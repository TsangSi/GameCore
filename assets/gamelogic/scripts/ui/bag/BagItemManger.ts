
import { js } from 'cc';
import { Config } from '../../../../scripts/config/Config';
import { ItemTypeView } from '../../../../scripts/global/GConst';
import { ItemDataEx } from './ItemDataEx';
import { ItemManagerBase } from './ItemManagerBase';
import { ItemViewBag } from './view/ItemViewBag';
import { ItemViewBase } from './view/ItemViewBase';
import { ItemViewType } from './view/ItemViewType';


/** 物品id枚举 */
enum ItemId {
    /** 缘戒1 */
    ID_2001 = 2001,
    /** 缘戒4 */
    ID_2004 = 2004,
}

export class BagItemManager extends ItemManagerBase {
    private static instance: BagItemManager = null;
    static get I(): BagItemManager {
        if (this.instance == null) {
            this.instance = new BagItemManager();
            this.instance.init();
        }
        return this.instance;
    }
    private Size = 0;
    private Auto = 0;
    private ItemIds: number[] = [];
    private CountByIndex: number[] = [];
    private BagDataInitEnd = false;
    private TempBagChangeDatas: BagChange[] = [];
    private ItemViews: { [type: number]: ItemViewBase; } = {};
    private init() {
        this.installView(ItemTypeView.TypeView, new ItemViewType(this));
        this.installView(ItemTypeView.Bag, new ItemViewBag(this));
    }



    setItems(data: RoleBag, init: number = 0, end: number = 0) {
        this.Size = data.Size || 0;
        this.Auto = data.Auto || 0;
        if (init) {
            this.CItemInfos = js.createMap(true);
            this.SortedItems.length = 0;
        }
        console.time('setItems=');
        data.Items.forEach((item) => {
            this.addItemFromProto(item);
        });
        console.timeEnd('setItems=');
        this.BagDataInitEnd = end == 1;
        if (this.BagDataInitEnd && this.TempBagChangeDatas.length > 0) {
            this.setBagChange(this.TempBagChangeDatas);
            this.TempBagChangeDatas.length = 0;
        }
    }

    setBagChange(data: BagChange[]) {
        if (!this.BagDataInitEnd) {
            this.TempBagChangeDatas.concat(data);
            return;
        }
    }

    private addItemFromProto(itemData: ItemData) {
        let item_id = itemData.IId;
        if (item_id === 0) {
            this.removeItem(itemData.Id);
            return;
        }
        let this_item = this.CItemInfos[itemData.Id];
        if (!this_item || this_item.getIId() !== item_id || this_item.getId() !== itemData.Id) {
            let item = new ItemDataEx(itemData);
            return this.addItem(item);
        } else {

        }
    }

    /** 获取星级 */
    getStar(iid: number, star: number) {
        let itemCfg: Cfg_Item = Config.getI(Config.T.Cfg_Item).getDataByKey(iid.toString());
        if (itemCfg.EquipType == 4 || itemCfg.EquipType == 6) {  //凶兽|幻灵
            return star;
        } else {
            return itemCfg.Star;
        }
    }

    /** 一个装备与身上的对比,返回0为战力相等, 负数(战力差值)为比身上的战力小, 正数(战力差值)为比身上的战力大 */
    compareFightValue2Equiped(id: string) {
        let item = this.getItem(id);
        return item.compareFightValue2Equiped();
    }

    static ItemId: typeof ItemId = ItemId;
}
